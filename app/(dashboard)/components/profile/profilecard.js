"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Avatar,
  Skeleton,
} from "@mui/joy";
import { useEffect, useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function ProfileHomeCard() {
  const [userDetail, setUserDetail] = useState(null);
  const privateMediaHosts = (
    process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS ||
    "blr1.kos.olakrutrimsvc.com"
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUserDetail)
      .catch(console.error);
  }, []);

  const coverSrc =
    resolveAssetUrl(userDetail?.userData?.cover_pic) || "/cover-placeholder.jpg";

  const profileSrc =
    resolveAssetUrl(userDetail?.userData?.profile_picture) ||
    "/default-avatar.png";

  return (
    <Card sx={{ borderRadius: 16, overflow: "hidden" }}>
      {/* Cover (LCP optimized) */}
      <Box sx={{ position: "relative", height: 80 }}>
        {!userDetail && <Skeleton variant="rectangular" height={80} />}
        {userDetail && (
          <Image
            src={coverSrc}
            alt="Cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        )}
      </Box>

      {/* Profile */}
      <CardContent sx={{ textAlign: "center", mt: -5 }}>
        {userDetail ? (
          <Avatar
            src={profileSrc}
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              border: "3px solid white",
            }}
          />
        ) : (
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            sx={{ mx: "auto" }}
          />
        )}

        <Typography level="h4" sx={{ mt: 1 }}>
          {userDetail?.userData?.full_name || <Skeleton width={120} />}
        </Typography>

        <Typography level="body-sm">
          {userDetail?.userData?.headline || <Skeleton width={180} />}
        </Typography>
      </CardContent>

      <Divider />

      <CardContent sx={{ textAlign: "center" }}>
        <Button
          size="sm"
          onClick={() => redirect(`/profile/${userDetail?.meta?.user_id}`)}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
