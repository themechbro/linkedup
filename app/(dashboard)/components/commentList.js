"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/joy";
import { Heart } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function CommentList({ post_id, newComment }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch comments when post_id changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/${post_id}/comments`,
          { credentials: "include", cache: "no-store" }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (post_id) fetchComments();
  }, [post_id]);

  // ✅ Add newly posted comment at top (realtime update)
  useEffect(() => {
    if (newComment && newComment.post_id === post_id) {
      setComments((prev) => [newComment, ...prev]);
    }
  }, [newComment, post_id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size="sm" />
      </Box>
    );
  }

  if (!comments.length) {
    return (
      <Typography
        level="body-sm"
        sx={{ textAlign: "center", mt: 1, color: "neutral.500" }}
      >
        No comments yet — be the first to comment!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {comments.map((comment) => (
        <Card
          key={comment.comment_id}
          variant="outlined"
          sx={{
            mb: 1.5,
            borderRadius: "lg",
            backgroundColor: "#fafafa",
            boxShadow: "0 0 4px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent>
            {/* Avatar */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Avatar
                  size="sm"
                  src={comment.profile_pic || "/default-avatar.png"}
                  alt={comment.full_name}
                />
                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                  {comment.full_name || "User"}
                </Typography>
              </Box>

              {/* Comment content */}
              <Box>
                <Typography level="body-xs" textColor="neutral.500">
                  {dayjs(comment.created_at).fromNow()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ padding: 1 }}>
              <Typography
                level="body-sm"
                sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
              >
                {comment.content}
              </Typography>

              {/* Optional media (images) */}
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

              {/* Like button */}
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Tooltip title="Like comment">
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
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
