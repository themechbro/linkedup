"use client";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/joy";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";

export default function PostCard({ post }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "sm",
        backgroundColor: "#fff",
        fontFamily: "Roboto Condensed",
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar src={post.user.avatar} alt={post.user.name} />
          <Box>
            <Typography level="title-md" sx={{ fontWeight: 600 }}>
              {post.user.name}
            </Typography>
            <Typography level="body-xs" sx={{ color: "text.secondary" }}>
              {post.user.title} • {post.time}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Typography level="body-md" sx={{ mb: 1 }}>
          {post.content}
        </Typography>

        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt="Post"
            sx={{
              width: "100%",
              borderRadius: "10px",
              objectFit: "cover",
              mb: 2,
            }}
          />
        )}

        <Divider sx={{ mb: 1 }} />

        {/* Footer actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            color: "text.secondary",
          }}
        >
          <IconButton variant="plain" size="sm">
            <Heart size={18} />
            <Typography level="body-sm" sx={{ ml: 0.5 }}>
              {post.likes}
            </Typography>
          </IconButton>

          <IconButton variant="plain" size="sm">
            <MessageCircle size={18} />
            <Typography level="body-sm" sx={{ ml: 0.5 }}>
              {post.comments}
            </Typography>
          </IconButton>

          <IconButton variant="plain" size="sm">
            <Share2 size={18} />
          </IconButton>

          <IconButton variant="plain" size="sm">
            <Send size={18} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
