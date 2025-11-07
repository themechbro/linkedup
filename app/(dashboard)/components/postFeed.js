"use client";
import { Box } from "@mui/joy";
import PostCard from "./PostCard";

export default function PostFeed() {
  // temporary static posts
  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Wilson",
        avatar: "https://i.pravatar.cc/150?img=32",
        title: "Frontend Developer @Techify",
      },
      time: "2h",
      content:
        "Excited to share my latest project built with Next.js and Joy UI! 🚀",
      image: "https://source.unsplash.com/random/600x400?tech",
      likes: 42,
      comments: 5,
    },
    {
      id: 2,
      user: {
        name: "Daniel Kim",
        avatar: "https://i.pravatar.cc/150?img=11",
        title: "UI/UX Designer | Minimalism Enthusiast",
      },
      time: "5h",
      content:
        "Design isn’t just what it looks like — it’s how it works. Inspired by Apple’s clarity today 🍏",
      image: null,
      likes: 31,
      comments: 8,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}
