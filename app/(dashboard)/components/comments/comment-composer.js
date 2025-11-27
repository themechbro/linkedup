"use client";
import { useState } from "react";
import { Box, Input, IconButton, Tooltip, CircularProgress } from "@mui/joy";
import { Send, Image } from "lucide-react";

export default function CommentComposer({
  post_id,
  parent_comment_id,
  onCommentAdded,
}) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !file) return; // prevent empty comments

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", content);
      if (file) formData.append("image", file);
      if (parent_comment_id)
        formData.append("parent_comment_id", parent_comment_id);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/${post_id}/comments`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok && data.comment) {
        // Clear form
        setContent("");
        setFile(null);
        onCommentAdded?.(data.comment); // notify parent
      } else {
        console.error("Failed to post comment:", data.message);
      }
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
      {/* Hidden image input */}
      <input
        type="file"
        accept="image/*"
        id={`comment-image-upload-${post_id}`}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Input
        className="comment-box"
        placeholder="Add a comment..."
        multiline
        minRows={1}
        maxRows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{
          flex: 1,
          borderRadius: 20,
          bgcolor: "#f3f2ef",
          fontFamily: "Roboto Condensed",
        }}
        endDecorator={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Add image">
              <label htmlFor={`comment-image-upload-${post_id}`}>
                <IconButton component="span">
                  <Image size={20} />
                </IconButton>
              </label>
            </Tooltip>

            {loading ? (
              <CircularProgress size="sm" />
            ) : (
              <IconButton onClick={handleSubmit}>
                <Send size={20} />
              </IconButton>
            )}
          </Box>
        }
      />
    </Box>
  );
}
