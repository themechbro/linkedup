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

export default function BrandPostCard({ post, brand }) {
  const formatTime = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const renderMedia = (mediaArray) => {
    if (!mediaArray?.length) return null;

    const media = mediaArray[0];

    if (media.type === "videos") {
      return (
        <Box sx={{ mt: 1 }}>
          <VideoPlayer src={`${process.env.NEXT_PUBLIC_HOST_IP}${media.url}`} />
        </Box>
      );
    }

    if (media.type === "images") {
      return (
        <Box
          component="img"
          src={`${process.env.NEXT_PUBLIC_HOST_IP}${media.url}`}
          sx={{
            width: "100%",
            borderRadius: "12px",
            mt: 1,
            objectFit: "cover",
          }}
        />
      );
    }

    return null;
  };

  const isRepost = !!post.reposted_post;

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
            src={`${process.env.NEXT_PUBLIC_HOST_IP}${brand.profilePicture}`}
          />

          <Box>
            <Typography fontWeight="lg">{brand.fullName}</Typography>

            <Typography level="body-xs">
              {formatTime(post.created_at)}
              {isRepost && " • Reposted"}
            </Typography>
          </Box>
        </Box>

        <IconButton variant="plain">
          <MoreHorizontal size={18} />
        </IconButton>
      </Box>

      {/* Brand repost caption (optional) */}
      {post.content && (
        <Typography level="body-md" sx={{ mt: 1 }}>
          {post.content}
        </Typography>
      )}

      {/* If repost, render original post inside */}
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
          {/* Original post header */}
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar size="sm" />

            <Box>
              <Typography fontWeight="md" level="body-sm">
                {post.reposted_post.owner_name || "User"}
              </Typography>

              <Typography level="body-xs">
                {formatTime(post.reposted_post.created_at)}
              </Typography>
            </Box>
          </Box>

          {/* Original content */}
          <Typography level="body-sm" sx={{ mt: 1 }}>
            {post.reposted_post.content}
          </Typography>

          {/* Original media */}
          {renderMedia(post.reposted_post.media_url)}
        </Card>
      ) : (
        renderMedia(post.media_url)
      )}

      {/* Stats */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography level="body-xs">👍 {post.likes}</Typography>

        <Typography level="body-xs">
          {post.comment_count || 0} comments • {post.repost_count} reposts
        </Typography>
      </Stack>

      <Divider sx={{ my: 1 }} />

      {/* Actions */}
      <Stack direction="row" justifyContent="space-around">
        <Button variant="plain" startDecorator={<ThumbsUp size={18} />}>
          Like
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
