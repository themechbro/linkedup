"use client";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import PostCard from "@/app/(dashboard)/components/post/postCard";
import { EMPTY_POST } from "./utils/helpers";

export default function BrandPostPage({ profile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const profileId = profile?.userId;

  useEffect(() => {
    if (!profileId) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-posts-brands?profileId=${profileId}&limit=2&offset=0`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [profileId]);

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", p: 4 }}>
      {posts.map((p) => (
        <PostCard key={p.id} post={p || EMPTY_POST} />
      ))}
    </Box>
  );
}
