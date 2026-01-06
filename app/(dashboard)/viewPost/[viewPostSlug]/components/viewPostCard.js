"use client";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  AspectRatio,
} from "@mui/joy";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { renderContentWithHashtagsAndLinks } from "@/app/(dashboard)/components/post/lib/helpers";
import ImagegridModal from "@/app/(dashboard)/components/post/ImageGrid/imageModal";
import { useState } from "react";

export default function ViewPostCard({ post }) {
  const [mediaViewer, setMediaViewer] = useState({
    open: false,
    currentIndex: 0,
    media: [],
  });
  if (!post) return null;

  const isRepost = Boolean(post.repost_of && post.original_post);
  const media =
    typeof post.media_url === "string"
      ? JSON.parse(post.media_url)
      : post.media_url || [];
  // Media
  const openMediaViewer = (mediaList, index) => {
    setMediaViewer({
      open: true,
      currentIndex: index,
      media: mediaList,
    });
  };

  const closeMediaViewer = () => {
    setMediaViewer({ open: false, currentIndex: 0 });
  };

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
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Avatar
              src={`${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`}
              size="md"
            />

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
              />
            </Box>
          )}

          {/* 🔹 Media (non-repost) */}
          {!isRepost && post.media_url?.length > 0 && (
            <MediaGrid media={post.media_url} onMediaClick={openMediaViewer} />
          )}

          {/* 🔹 Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1.5,
            }}
          >
            <Typography level="body-xs" sx={{ color: "neutral.500" }}>
              {post.likes} likes
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
          <Action icon={<Heart size={18} />} label="Like" />
          <Action icon={<MessageCircle size={18} />} label="Comment" />
          <Action icon={<Repeat2 size={18} />} label="Repost" />
          <Action icon={<Send size={18} />} label="Send" />
        </Box>
      </Card>

      {/* Image Grid Modal */}
      <ImagegridModal
        mediaViewer={mediaViewer}
        closeMediaViewer={closeMediaViewer}
        setMediaViewer={setMediaViewer}
        media={mediaViewer.media}
      />
    </>
  );
}

/* ----------------------------- */
/* 🔹 Original Post Component    */
/* ----------------------------- */
function OriginalPost({ post, onMediaClick }) {
  const originalMedia =
    typeof post.media_url === "string"
      ? JSON.parse(post.media_url)
      : post.media_url || [];

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Avatar
          src={`${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`}
          size="sm"
        />
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

      {originalMedia.length > 0 && (
        <MediaGrid
          media={originalMedia}
          onMediaClick={(i) => onMediaClick(originalMedia, i)}
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: media.length > 1 ? "repeat(2, 1fr)" : "1fr",
        gap: 0.5,
        mt: 1.5,
      }}
    >
      {media.map((m, i) => (
        <AspectRatio key={i} ratio="1">
          <img
            src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
            alt=""
            loading="lazy"
            style={{
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => onMediaClick(i)}
          />
        </AspectRatio>
      ))}
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
