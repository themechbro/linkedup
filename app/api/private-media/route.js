import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bucket = process.env.KRUTRIM_S3_BUCKET || process.env.KRUTRIM_BUCKET;
const endpoint = process.env.KRUTRIM_S3_ENDPOINT || process.env.KRUTRIM_ENDPOINT;
const region =
  process.env.KRUTRIM_S3_REGION || process.env.KRUTRIM_REGION || "us-east-1";
const accessKeyId =
  process.env.KRUTRIM_S3_ACCESS_KEY_ID || process.env.KRUTRIM_PUBLIC_KEY;
const secretAccessKey =
  process.env.KRUTRIM_S3_SECRET_ACCESS_KEY || process.env.KRUTRIM_SECRET_KEY;
const allowedHostsEnv = process.env.KRUTRIM_S3_ALLOWED_HOSTS || "";

const allowedHosts = allowedHostsEnv
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

const s3Client =
  bucket && endpoint && accessKeyId && secretAccessKey
    ? new S3Client({
        region,
        endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null;

const toWebStream = (body) => {
  if (!body) return null;

  if (typeof body.transformToWebStream === "function") {
    return body.transformToWebStream();
  }

  if (typeof ReadableStream !== "undefined" && body[Symbol.asyncIterator]) {
    const iterator = body[Symbol.asyncIterator]();
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
      },
      async cancel() {
        if (typeof iterator.return === "function") {
          await iterator.return();
        }
      },
    });
  }

  return body;
};

const createProxyUrl = (targetUrl) =>
  `/api/private-media?url=${encodeURIComponent(targetUrl)}`;

const parseRemoteUrl = (rawUrl) => {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.toLowerCase();

  if (allowedHosts.length > 0 && !allowedHosts.includes(host)) {
    return { key: null, parsed };
  }

  let key = decodeURIComponent(parsed.pathname || "").replace(/^\/+/, "");

  if (bucket && key.toLowerCase().startsWith(`${bucket.toLowerCase()}/`)) {
    key = key.slice(bucket.length + 1);
  }

  return { key: key || null, parsed };
};

const rewritePlaylist = (playlistText, playlistUrl) => {
  if (!playlistUrl) return playlistText;

  const base = new URL(playlistUrl);
  const rewriteUri = (uri) => {
    if (!uri || uri.startsWith("data:")) return uri;
    try {
      const absolute = new URL(uri, base).toString();
      return createProxyUrl(absolute);
    } catch {
      return uri;
    }
  };

  return playlistText
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      if (trimmed.startsWith("#")) {
        return line.replace(
          /URI="([^"]+)"/g,
          (_, uri) => `URI="${rewriteUri(uri)}"`,
        );
      }

      return rewriteUri(trimmed);
    })
    .join("\n");
};

export async function GET(request) {
  if (!s3Client) {
    return Response.json(
      { error: "Private media route is not configured." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");
  const rawKey = searchParams.get("key");
  const rangeHeader = request.headers.get("range");

  let key = null;
  let sourceUrl = null;

  if (rawKey) {
    key = decodeURIComponent(rawKey).replace(/^\/+/, "");
  } else if (rawUrl) {
    try {
      const parsed = parseRemoteUrl(rawUrl);
      key = parsed.key;
      sourceUrl = parsed.parsed?.toString() || null;
    } catch {
      return Response.json({ error: "Invalid media URL." }, { status: 400 });
    }
  } else {
    return Response.json(
      { error: "Missing 'url' or 'key' query param." },
      { status: 400 },
    );
  }

  if (!key) {
    return Response.json(
      { error: "Media host is not allowed or key is invalid." },
      { status: 400 },
    );
  }

  try {
    const keyLower = key.toLowerCase();
    const looksLikePlaylist = keyLower.endsWith(".m3u8");
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ...(rangeHeader && !looksLikePlaylist ? { Range: rangeHeader } : {}),
    });

    let object = await s3Client.send(command);
    let contentType = object.ContentType || "";
    let isM3u8 = looksLikePlaylist || /mpegurl/i.test(contentType);

    if (rangeHeader && isM3u8 && !looksLikePlaylist) {
      // Playlists must be fetched fully so URIs can be rewritten safely.
      object = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      contentType = object.ContentType || contentType;
      isM3u8 = true;
    }

    if (isM3u8) {
      let playlistText = "";

      if (typeof object.Body?.transformToString === "function") {
        playlistText = await object.Body.transformToString();
      } else {
        playlistText = await new Response(toWebStream(object.Body)).text();
      }

      const rewritten = rewritePlaylist(playlistText, sourceUrl);
      const headers = new Headers();
      headers.set("Content-Type", "application/vnd.apple.mpegurl");
      headers.set("Cache-Control", "private, max-age=60");
      headers.set("Accept-Ranges", "bytes");

      return new Response(rewritten, { status: 200, headers });
    }

    const body = toWebStream(object.Body);

    if (!body) {
      return Response.json({ error: "Media body is empty." }, { status: 404 });
    }

    const headers = new Headers();

    if (object.ContentType) {
      headers.set("Content-Type", object.ContentType);
    }
    if (object.ContentLength != null) {
      headers.set("Content-Length", String(object.ContentLength));
    }
    if (object.ContentRange) {
      headers.set("Content-Range", object.ContentRange);
    }
    if (object.ETag) {
      headers.set("ETag", object.ETag);
    }
    if (object.LastModified) {
      headers.set("Last-Modified", object.LastModified.toUTCString());
    }

    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "private, max-age=300");

    return new Response(body, {
      status: object.ContentRange ? 206 : 200,
      headers,
    });
  } catch (error) {
    const statusCode = Number(error?.$metadata?.httpStatusCode) || 500;

    if (statusCode === 404 || statusCode === 403) {
      return Response.json(
        { error: "Private media not found or access denied." },
        { status: statusCode },
      );
    }

    return Response.json(
      { error: "Failed to fetch private media." },
      { status: 500 },
    );
  }
}
