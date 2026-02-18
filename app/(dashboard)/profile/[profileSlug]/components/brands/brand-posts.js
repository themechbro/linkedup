// "use client";
// import { Box } from "@mui/joy";
// import { useState, useEffect } from "react";
// import PostCard from "@/app/(dashboard)/components/post/postCard";
// import { EMPTY_POST } from "./utils/helpers";
// import BrandPostCard from "./brandPostCardprofile";

// export default function BrandPostPage({ profile }) {
//   console.log(profile);

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const profileId = profile?.userId;

//   useEffect(() => {
//     if (!profileId) return;

//     const fetchPosts = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-posts-brands?profileId=${profileId}&limit=2&offset=0`,
//           {
//             method: "GET",
//             credentials: "include",
//           },
//         );

//         const data = await response.json();
//         setPosts(data.posts || []);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [profileId]);

//   return (
//     <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", p: 4 }}>
//       {posts.map((p) => (

//         <BrandPostCard post={p} brand={profile} />
//       ))}
//     </Box>
//   );
// }

"use client";

import { Box, CircularProgress } from "@mui/joy";
import { useState, useEffect, useRef, useCallback } from "react";
import BrandPostCard from "./brandPostCardprofile";

export default function BrandPostPage({ profile }) {
  const profileId = profile?.userId;

  const LIMIT = 5;

  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  const loadingRef = useRef(false);

  const hasMoreRef = useRef(true);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Fetch posts
  const fetchPosts = async (newOffset = 0, replace = false) => {
    if (loadingRef.current) return;

    if (!hasMoreRef.current && !replace) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-posts-brands?profileId=${profileId}&limit=${LIMIT}&offset=${newOffset}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      const newPosts = data.enrichedPost || [];

      setPosts((prev) => (replace ? newPosts : [...prev, ...newPosts]));

      setHasMore(data.hasMore);

      setOffset(newOffset + LIMIT);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load when profile changes
  useEffect(() => {
    if (!profileId) return;

    setPosts([]);
    setOffset(0);
    setHasMore(true);

    fetchPosts(0, true);
  }, [profileId]);

  // Intersection observer callback
  const lastPostRef = useCallback(
    (node) => {
      if (loadingRef.current) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          fetchPosts(offset);
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [offset, profileId],
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        p: 4,
      }}
    >
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          return (
            <Box ref={lastPostRef} key={post.id}>
              <BrandPostCard post={post} />
            </Box>
          );
        }

        return <BrandPostCard key={post.id} post={post} />;
      })}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          <CircularProgress size="sm" />
        </Box>
      )}
    </Box>
  );
}
