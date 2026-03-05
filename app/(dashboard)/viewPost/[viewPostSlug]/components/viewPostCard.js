// 2n version

"use client";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
} from "@mui/joy";
import { Heart, MessageCircle, Repeat2, Send, ThumbsUp } from "lucide-react";
import { renderContentWithHashtagsAndLinks } from "@/app/(dashboard)/components/post/lib/helpers";
import ImagegridModal from "@/app/(dashboard)/components/post/ImageGrid/imageModal";
import { useState, useEffect } from "react";
import PostLikedList from "@/app/(dashboard)/components/post/liked-list/postliked_list";
import Image from "next/image";
import { repostPost } from "@/app/(dashboard)/components/post/lib/helpers";
import RepostSnackbar from "./repostSnackbar";
import VideoPlayer from "@/app/(dashboard)/components/post/player/videoPlayer";
import { useRouter } from "next/navigation";
export default function ViewPostCard({ post, requested_by }) {
  const [mediaViewer, setMediaViewer] = useState({
    open: false,
    currentIndex: 0,
    media: [],
  });
  const router = useRouter();
  const [openLiked, setOpenLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [repostSnack, setRepostSnack] = useState({
    open: false,
    type: "",
  });

  useEffect(() => {
    if (post?.liked_by && requested_by) {
      setLiked(Boolean(post.liked_by.includes(requested_by)));
    }
  }, [post?.liked_by, requested_by]);

  useEffect(() => {
    if (post?.likes !== undefined) {
      setLikes(post.likes);
    }
  }, [post?.likes]);

  const privateMediaHosts = (
    process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS || "blr1.kos.olakrutrimsvc.com"
  )
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const resolveAssetUrl = (url) => {
    if (!url) return "";

    if (/^(https?:)?\/\//i.test(url)) {
      try {
        const parsed = new URL(url);
        if (privateMediaHosts.includes(parsed.hostname.toLowerCase())) {
          return `/api/private-media?url=${encodeURIComponent(url)}`;
        }
      } catch {
        return url;
      }
      return url;
    }

    const base = process.env.NEXT_PUBLIC_HOST_IP || "";
    if (!base) return url;

    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${normalizedBase}${normalizedPath}`;
  };

  // Conditional return AFTER all hooks
  if (!post) return null;

  const isRepost = Boolean(post.repost_of && post.original_post);
  let media = [];
  try {
    media =
      typeof post.media_url === "string"
        ? JSON.parse(post.media_url)
        : post.media_url || [];
  } catch {
    media = [];
  }
  const normalizedMedia = media.map((m) => ({
    ...m,
    url: resolveAssetUrl(m?.url),
    sprite_url: resolveAssetUrl(m?.sprite_url),
  }));

  // Media
  const openMediaViewer = (mediaList, index) => {
    if (!Array.isArray(mediaList) || mediaList.length === 0) return;
    setMediaViewer({
      open: true,
      currentIndex: index,
      media: mediaList,
    });
  };

  const closeMediaViewer = () => {
    setMediaViewer({ open: false, currentIndex: 0, media: [] });
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/likes/${post.id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setLiked(data.liked);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  async function handleRepost() {
    const result = await repostPost(post.id, post.current_user);

    if (result.success) {
      setRepostSnack({
        open: true,
        type: "success",
      });
    } else {
      setRepostSnack({
        open: true,
        type: "fail",
      });
    }
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "14px",
          mb: 2,
          backgroundColor: "background.body",
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* 🔹 Repost Header */}
          {isRepost && (
            <Typography level="body-xs" sx={{ color: "neutral.500", mb: 1 }}>
              <Repeat2 size={14} style={{ marginRight: 4 }} />
              {post.full_name} reposted this
            </Typography>
          )}

          {/* 🔹 Post Header */}
          <Box
            sx={{ display: "flex", gap: 1.5, cursor: "pointer" }}
            onClick={() => router.push(`/profile/${post.owner}`)}
          >
            <Avatar src={resolveAssetUrl(post.profile_picture)} size="md" />

            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{post.full_name}</Typography>
              <Typography level="body-xs" sx={{ color: "neutral.500" }}>
                @{post.username}
              </Typography>
              <Typography level="body-xs" sx={{ color: "neutral.400" }}>
                {new Date(post.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* 🔹 Post Content */}
          {post.content && (
            <Typography level="body-md" sx={{ mt: 1.5 }}>
              {renderContentWithHashtagsAndLinks(post.content)}
            </Typography>
          )}

          {/* 🔹 Original Post (if repost) */}
          {isRepost && (
            <Box
              sx={{
                mt: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                p: 1.5,
              }}
            >
              <OriginalPost
                post={post.original_post}
                onMediaClick={(media, i) => openMediaViewer(media, i)}
                resolveAssetUrl={resolveAssetUrl}
              />
            </Box>
          )}

          {!isRepost && normalizedMedia.length > 0 && (
            <MediaGrid
              media={normalizedMedia}
              onMediaClick={(i) => openMediaViewer(normalizedMedia, i)}
            />
          )}

          {/* 🔹 Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1.5,
            }}
          >
            <Typography
              level="body-xs"
              sx={{
                color: "neutral.500",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setOpenLiked(true)}
            >
              {likes} likes
            </Typography>
            <Typography level="body-xs" sx={{ color: "neutral.500" }}>
              {post.comment_count} comments · {post.repost_count} reposts
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        {/* 🔹 Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            py: 0.5,
          }}
        >
          <Button
            size="sm"
            variant="plain"
            color={liked ? "primary" : "neutral"}
            startDecorator={<ThumbsUp size={16} />}
            onClick={handleLike}
          >
            {liked ? "Liked" : "Like"}
          </Button>
          <Button
            startDecorator={<Repeat2 />}
            variant="plain"
            color="neutral"
            onClick={handleRepost}
          >
            Repost
          </Button>
          <Button startDecorator={<Send />} variant="plain" color="neutral">
            Share
          </Button>
        </Box>
      </Card>

      {/* Image Grid Modal */}
      <ImagegridModal
        mediaViewer={mediaViewer}
        closeMediaViewer={closeMediaViewer}
        setMediaViewer={setMediaViewer}
        media={mediaViewer.media}
      />

      {/* Post Liked List */}
      <PostLikedList
        open={openLiked}
        close={() => setOpenLiked(false)}
        post_id={post.id}
      />

      {/* Repost Snack */}
      <RepostSnackbar
        open={repostSnack.open}
        close={() => {
          setRepostSnack({ open: false, type: "" });
        }}
        type={repostSnack.type}
      />
    </>
  );
}

/* ----------------------------- */
/* 🔹 Original Post Component    */
/* ----------------------------- */
function OriginalPost({ post, onMediaClick, resolveAssetUrl }) {
  let originalMedia = [];
  try {
    originalMedia =
      typeof post.media_url === "string"
        ? JSON.parse(post.media_url)
        : post.media_url || [];
  } catch {
    originalMedia = [];
  }
  const normalizedOriginalMedia = originalMedia.map((m) => ({
    ...m,
    url: resolveAssetUrl(m?.url),
    sprite_url: resolveAssetUrl(m?.sprite_url),
  }));

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Avatar src={resolveAssetUrl(post.profile_picture)} size="sm" />
        <Box>
          <Typography level="title-sm">{post.full_name}</Typography>
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>
            @{post.username}
          </Typography>
        </Box>
      </Box>

      <Typography level="body-sm" sx={{ mt: 1 }}>
        {renderContentWithHashtagsAndLinks(post.content)}
      </Typography>

      {normalizedOriginalMedia.length > 0 && (
        <MediaGrid
          media={normalizedOriginalMedia}
          onMediaClick={(i) => onMediaClick(normalizedOriginalMedia, i)}
        />
      )}
    </>
  );
}

/* ----------------------------- */
/* 🔹 Media Grid                 */
/* ----------------------------- */
function MediaGrid({ media, onMediaClick }) {
  return (
    <Box>
      {media.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gap: 0.5,
            mt: 2,
            borderRadius: "lg",
            overflow: "hidden",
            gridTemplateColumns:
              media.length === 1
                ? "1fr"
                : media.length === 2
                  ? "1fr 1fr"
                  : media.length === 3
                    ? "repeat(2, 1fr)"
                    : media.length === 4
                      ? "repeat(2, 1fr)"
                      : "repeat(3, 1fr)",
          }}
        >
          {media.slice(0, 5).map((m, i) => {
            const isVideo = m.type === "videos";
            const isLastItem = i === 4 && media.length > 5;
            const remainingCount = media.length - 5;

            return (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  width: "100%",
                  height:
                    media.length === 1
                      ? "400px"
                      : media.length === 2
                        ? "300px"
                        : "200px",
                  overflow: "hidden",
                  bgcolor: "black",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  ...(media.length === 3 &&
                    i === 0 && {
                      gridColumn: "span 2",
                      height: "300px",
                    }),
                }}
                onClick={() => {
                  if (!isVideo) onMediaClick(i);
                }}
              >
                {isLastItem ? (
                  <>
                    <Image
                      src={m.url}
                      alt="post media"
                      fill
                      style={{
                        objectFit: "cover",
                        filter: "brightness(0.4)",
                      }}
                      unoptimized
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        zIndex: 1,
                      }}
                    >
                      +{remainingCount}
                    </Box>
                  </>
                ) : isVideo ? (
                  <VideoPlayer src={m.url} spriteSrc={m.sprite_url} />
                ) : (
                  <Image
                    src={m.url}
                    alt="post media"
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

/* ----------------------------- */
/* 🔹 Action Button              */
/* ----------------------------- */
function Action({ icon, label }) {
  return (
    <IconButton
      variant="plain"
      sx={{
        gap: 0.5,
        borderRadius: "8px",
        color: "neutral.600",
        "&:hover": {
          backgroundColor: "neutral.100",
        },
      }}
    >
      {icon}
      <Typography level="body-sm">{label}</Typography>
    </IconButton>
  );
}
