import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/joy";
import { Heart, Reply } from "lucide-react";
import CommentComposer from "./comment-composer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export default function CommentCard({
  comment,
  post_id,
  replyingTo,
  setReplyingTo,
  onReplyAdded,
  level = 0, // indentation level
  isLiked,
  likeCount,
  handleLike,
  handleUnlike,
  likeComment,
  unlikeComment,
}) {
  const isReplying = replyingTo === comment.comment_id;
  console.log(comment);

  return (
    <Card
      variant="plain"
      sx={{
        mb: 1.5,
        borderRadius: "lg",
        backgroundColor: level === 0 ? "#fafafa" : "#f5f5f5",
        boxShadow: level === 0 ? "0 0 4px rgba(0,0,0,0.05)" : "none",
        ml: level * 5, // indent nested replies
        transition: "all 0.2s ease-in-out",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Avatar + User Info */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              size="sm"
              src={
                `${process.env.NEXT_PUBLIC_HOST_IP}${comment.profile_picture}` ||
                "/default-avatar.png"
              }
              alt={comment.full_name}
            />
            <Box>
              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                {comment.full_name || "User"}
              </Typography>
              <Typography level="body-xs" textColor="neutral.500">
                {dayjs(comment.created_at).fromNow()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Comment Text */}
        <Typography
          level="body-sm"
          sx={{ mt: 1, whiteSpace: "pre-wrap", color: "neutral.800" }}
        >
          {comment.content}
        </Typography>

        {/* Optional Image */}
        {comment.media_url && (
          <Box sx={{ mt: 1 }}>
            <img
              src={comment.media_url}
              alt="comment media"
              style={{
                width: "100%",
                maxHeight: 200,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        {/* Like + Reply Actions */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            pl: 5 * level, // subtle shift for nested replies
          }}
        >
          {/* <Tooltip title="Like comment">
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{ p: 0.5 }}
            >
              <Heart size={16} />
            </IconButton>
          </Tooltip>
          <Typography level="body-xs" color="neutral">
            {comment.likes || 0}
          </Typography> */}

          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton
              size="sm"
              variant="plain"
              color={isLiked ? "danger" : "neutral"}
              sx={{ p: 0.5 }}
              onClick={isLiked ? handleUnlike : handleLike}
            >
              <Heart size={16} fill={isLiked ? "red" : "none"} />
            </IconButton>
          </Tooltip>

          <Typography level="body-xs" color="neutral">
            {likeCount}
          </Typography>

          {level == 1 ? null : (
            <Tooltip title="Reply">
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{ p: 0.5 }}
                onClick={() =>
                  setReplyingTo((prev) =>
                    prev === comment.comment_id ? null : comment.comment_id
                  )
                }
              >
                <Reply size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Reply Composer */}
        {isReplying && (
          <Box sx={{ mt: 1, ml: 6 }}>
            <CommentComposer
              post_id={post_id}
              parent_comment_id={comment.comment_id}
              onCommentAdded={(reply) => {
                onReplyAdded(reply, comment.comment_id);
                setReplyingTo(null);
              }}
            />
          </Box>
        )}

        {/* Nested Replies */}
        {comment.replies?.length > 0 && (
          <Box sx={{ mt: 1, ml: 6 }}>
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.comment_id}
                comment={reply}
                post_id={post_id}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onReplyAdded={onReplyAdded}
                level={level + 1}
                iconShow={false}
                isLiked={reply.isLiked || false}
                likeCount={reply.likes || 0}
                handleLike={() => likeComment(reply.comment_id)}
                handleUnlike={() => unlikeComment(reply.comment_id)}
                likeComment={likeComment}
                unlikeComment={unlikeComment}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
