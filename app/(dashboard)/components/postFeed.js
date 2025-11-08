"use client";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/joy";
import PostCard from "./postCard";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts`,
          {
            credentials: "include",
            cache: "no-store", // ensures fresh data every time
          }
        );
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 Loading state
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  // 🔹 Error state
  if (error)
    return (
      <Typography color="danger" sx={{ textAlign: "center", mt: 3 }}>
        ⚠️ {error}
      </Typography>
    );

  // 🔹 Empty state
  if (posts.length === 0)
    return (
      <Typography level="body-lg" sx={{ textAlign: "center", mt: 3 }}>
        No posts yet. Be the first to post something!
      </Typography>
    );

  // 🔹 Render feed
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}
