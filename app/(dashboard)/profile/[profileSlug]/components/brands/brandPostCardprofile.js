import {
  Card,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Stack,
  Divider,
} from "@mui/joy";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
} from "lucide-react";
import VideoPlayer from "@/app/(dashboard)/components/post/player/videoPlayer";
import Image from "next/image";
export default function BrandPostCard({ post }) {
  const formatTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  // const renderMedia = (mediaArray) => {
  //   if (!mediaArray?.length) return null;
  //   const media = mediaArray[0];

  //   if (media.type === "videos") {
  //     return (
  //       <Box sx={{ mt: 1 }}>
  //         <VideoPlayer src={`${process.env.NEXT_PUBLIC_HOST_IP}${media.url}`} />
  //       </Box>
  //     );
  //   }

  //   if (media.type === "images") {

  //     return (
  //       <Box
  //         component="img"
  //         src={`${process.env.NEXT_PUBLIC_HOST_IP}${media.url}`}
  //         sx={{
  //           width: "100%",
  //           borderRadius: "12px",
  //           mt: 1,
  //           objectFit: "cover",
  //         }}
  //       />
  //     );
  //   }

  //   return null;
  // };

  const isRepost = !!post.repostedPost;
  let media = [];
  try {
    media =
      typeof post.media_url === "string"
        ? JSON.parse(post.media_url)
        : post.media_url || [];
  } catch {
    media = [];
  }

  let mediaR = [];

  try {
    mediaR =
      typeof post.repostedPost?.media_url === "string"
        ? JSON.parse(post.repostedPost.media_url)
        : post.repostedPost?.media_url || [];
  } catch {
    mediaR = [];
  }

  const renderMediaGrid = (mediaArray) => {
    if (!mediaArray?.length) return null;

    return (
      <Box
        sx={{
          display: "grid",
          gap: 0.5,
          mt: 2,
          borderRadius: "lg",
          overflow: "hidden",
          gridTemplateColumns:
            mediaArray.length === 1
              ? "1fr"
              : mediaArray.length === 2
                ? "1fr 1fr"
                : mediaArray.length === 3
                  ? "repeat(2, 1fr)"
                  : mediaArray.length === 4
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
        }}
      >
        {mediaArray.slice(0, 5).map((m, i) => {
          const isVideo = m.type === "videos";

          const isLastItem = i === 4 && mediaArray.length > 5;

          const remainingCount = mediaArray.length - 5;

          return (
            <Box
              key={i}
              sx={{
                position: "relative",
                width: "100%",
                height:
                  mediaArray.length === 1
                    ? "400px"
                    : mediaArray.length === 2
                      ? "300px"
                      : "200px",
                overflow: "hidden",
                bgcolor: "black",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
                ...(mediaArray.length === 3 &&
                  i === 0 && {
                    gridColumn: "span 2",
                    height: "300px",
                  }),
              }}
            >
              {isLastItem ? (
                <>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
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
                    }}
                  >
                    +{remainingCount}
                  </Box>
                </>
              ) : isVideo ? (
                <VideoPlayer
                  src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
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
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "12px",
        mb: 2,
        p: 2,
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={
              post.profile_picture
                ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`
                : ""
            }
          />

          <Box>
            <Typography fontWeight="lg">
              {post.full_name || post.username}
            </Typography>

            <Typography level="body-xs">
              {formatTime(post.createdAt)}

              {isRepost && " • Reposted"}
            </Typography>
          </Box>
        </Box>

        <IconButton variant="plain">
          <MoreHorizontal size={18} />
        </IconButton>
      </Box>

      {/* Caption */}
      {post.content && (
        <Typography level="body-md" sx={{ mt: 1 }}>
          {post.content}
        </Typography>
      )}

      {/* Repost */}
      {isRepost ? (
        <Card
          variant="outlined"
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: "10px",
            backgroundColor: "background.level1",
          }}
        >
          {/* Original Header */}
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              size="sm"
              src={
                post.repostedPost.profile_picture
                  ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.repostedPost.profile_picture}`
                  : ""
              }
            />

            <Box>
              <Typography fontWeight="md" level="body-sm">
                {post.repostedPost.full_name || post.repostedPost.username}
              </Typography>

              <Typography level="body-xs">
                {formatTime(post.repostedPost.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Original Content */}
          {post.repostedPost.content && (
            <Typography level="body-sm" sx={{ mt: 1 }}>
              {post.repostedPost.content}
            </Typography>
          )}

          {/* Original Media */}
          {/* {renderMedia(post.repostedPost.media_url)} */}
          {renderMediaGrid(mediaR)}
        </Card>
      ) : (
        // renderMedia(post.media_url)

        renderMediaGrid(media)
      )}

      {/* Stats */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography level="body-xs">
          👍{" "}
          {post.liked_by_me
            ? `You and ${post.likes - 1} others liked this post`
            : post.likes || 0}
        </Typography>

        <Typography level="body-xs">
          {post.commentCount || 0} comments • {post.repostCount || 0} reposts
        </Typography>
      </Stack>

      <Divider sx={{ my: 1 }} />

      {/* Actions */}
      <Stack direction="row" justifyContent="space-around">
        <Button
          variant="plain"
          startDecorator={<ThumbsUp size={18} />}
          color={post.liked_by_me ? "primary" : "neutral"}
        >
          {post.liked_by_me ? "Liked" : "Like"}
        </Button>

        <Button variant="plain" startDecorator={<MessageCircle size={18} />}>
          Comment
        </Button>

        <Button variant="plain" startDecorator={<Repeat2 size={18} />}>
          Repost
        </Button>

        <Button variant="plain" startDecorator={<Send size={18} />}>
          Send
        </Button>
      </Stack>
    </Card>
  );
}
