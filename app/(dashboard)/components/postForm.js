"use client";
import {
  Card,
  CardContent,
  Avatar,
  Input,
  Textarea,
  IconButton,
  Button,
  Divider,
  Typography,
  Box,
} from "@mui/joy";
import { Image, FileText, Smile, Send } from "lucide-react";
import { useState } from "react";

export default function PostForm({ currentUser }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // later: send to API
    console.log("New post:", { content, media });
    setContent("");
    setMedia(null);
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: "16px",
        boxShadow: "sm",
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={currentUser?.avatar || "https://i.pravatar.cc/150?img=5"}
            alt={currentUser?.name || "User"}
          />
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{
              flex: 1,
              justifyContent: "flex-start",
              borderRadius: "20px",
              color: "text.secondary",
              textTransform: "none",
            }}
            onClick={() => document.getElementById("postTextarea")?.focus()}
          >
            Start a post...
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit}>
          <Textarea
            id="postTextarea"
            minRows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            sx={{
              borderRadius: "10px",
              fontFamily: "Roboto Condensed",
              mb: 2,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <IconButton component="label" size="sm" variant="plain">
                <Image size={20} alt="img" />
                <input
                  type="file"
                  hidden
                  onChange={(e) => setMedia(e.target.files[0])}
                />
              </IconButton>
              <IconButton size="sm" variant="plain">
                <FileText size={20} />
              </IconButton>
              <IconButton size="sm" variant="plain">
                <Smile size={20} />
              </IconButton>
            </Box>

            <Button
              type="submit"
              size="sm"
              disabled={!content.trim()}
              endDecorator={<Send size={16} />}
              sx={{
                borderRadius: "20px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Post
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
