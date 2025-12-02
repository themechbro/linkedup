// "use client";
// import { useEffect, useState } from "react";
// import { Box, CircularProgress, Divider, Typography } from "@mui/joy";
// import PostCard from "./postCard";

// export default function PostFeed() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 🔹 Fetch posts from backend
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts`,
//           {
//             credentials: "include",
//             cache: "no-store", // ensures fresh data every time
//           }
//         );
//         if (!res.ok) throw new Error("Failed to fetch posts");

//         const data = await res.json();
//         setPosts(data);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   // 🔹 Loading state
//   if (loading)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );

//   // 🔹 Error state
//   if (error)
//     return (
//       <Typography color="danger" sx={{ textAlign: "center", mt: 3 }}>
//         ⚠️ {error}
//       </Typography>
//     );

//   // 🔹 Empty state
//   if (posts.length === 0)
//     return (
//       <Typography level="body-lg" sx={{ textAlign: "center", mt: 3 }}>
//         No posts yet. Be the first to post something!
//       </Typography>
//     );

//   // 🔹 Render feed
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//       {posts.map((post) => (
//         <PostCard key={post.id} post={post} />
//       ))}

//       <Divider>
//         <Typography
//           sx={{
//             fontFamily: "Roboto Condensed",
//           }}
//         >
//           You have caught everything for now
//         </Typography>
//       </Divider>
//     </Box>
//   );
// }

// 2nd version

// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { Box, CircularProgress, Divider, Typography } from "@mui/joy";
// import PostCard from "./postCard";

// export default function PostFeed() {
//   const LIMIT = 10;

//   const [posts, setPosts] = useState([]);
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const isFetchingRef = useRef(false); // prevents duplicate fetches
//   const observerRef = useRef(null);

//   // fetch with explicit offset (derived from posts.length)
//   const fetchPosts = async (offset) => {
//     if (isFetchingRef.current) return;
//     isFetchingRef.current = true;

//     // toggle appropriate loading flag
//     if (offset === 0) setLoadingInitial(true);
//     else setLoadingMore(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts?limit=${LIMIT}&offset=${offset}`,
//         {
//           credentials: "include",
//           cache: "no-store",
//         }
//       );

//       if (!res.ok) throw new Error("Failed to fetch posts");

//       const data = await res.json();

//       // append or replace depending on offset
//       setPosts((prev) => (offset === 0 ? data : [...prev, ...data]));

//       // if fewer than limit returned -> no more pages
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       // Optionally set an error state here
//       setHasMore(false);
//     } finally {
//       isFetchingRef.current = false;
//       if (offset === 0) setLoadingInitial(false);
//       else setLoadingMore(false);
//     }
//   };

//   // load initial page
//   useEffect(() => {
//     fetchPosts(0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // IntersectionObserver callback — compute offset from posts.length
//   const lastElementRef = useCallback(
//     (node) => {
//       if (loadingMore || loadingInitial) return;
//       if (!hasMore) return;

//       // disconnect previous observer
//       if (observerRef.current) observerRef.current.disconnect();

//       observerRef.current = new IntersectionObserver(
//         (entries) => {
//           if (entries[0].isIntersecting && !isFetchingRef.current && hasMore) {
//             // compute offset from current posts length -> avoids stale state
//             const offset = posts.length;
//             fetchPosts(offset);
//           }
//         },
//         {
//           root: null,
//           rootMargin: "200px", // start loading a bit before bottom
//           threshold: 0.1,
//         }
//       );

//       if (node) observerRef.current.observe(node);
//     },
//     // include posts.length because we derive offset from it
//     [loadingMore, loadingInitial, hasMore, posts.length]
//   );

//   // Loading initial
//   if (loadingInitial)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (posts.length === 0)
//     return (
//       <Typography level="body-lg" sx={{ textAlign: "center", mt: 3 }}>
//         No posts yet. Be the first to post something!
//       </Typography>
//     );

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//       {posts.map((post, index) => {
//         const isLast = index === posts.length - 1;
//         if (isLast) {
//           // attach observer to a wrapper so the List item itself doesn't re-render the ref too often
//           return (
//             <div key={post.id} ref={lastElementRef}>
//               <PostCard post={post} />
//             </div>
//           );
//         }
//         return (
//           <PostCard
//             key={post.id}
//             post={post}
//             loadingIni={loadingInitial}
//             onPostDeleted={(id) => {
//               setPosts((prev) => prev.filter((p) => p.id !== id));
//             }}
//           />
//         );
//       })}

//       {loadingMore && (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
//           <CircularProgress size="sm" />
//         </Box>
//       )}

//       {!hasMore && (
//         <Divider>
//           <Typography sx={{ fontFamily: "Roboto Condensed" }}>
//             You’re all caught up 🎉
//           </Typography>
//         </Divider>
//       )}
//     </Box>
//   );
// }

// 3rd version
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/joy";
import PostCard from "./postCard";

export default function PostFeed() {
  const LIMIT = 10;

  const [posts, setPosts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null); // ← The stable scroll trigger

  // -------------------------------------------------------
  // Fetch posts
  // -------------------------------------------------------
  const fetchPosts = async (offset) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (offset === 0) setLoadingInitial(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts?limit=${LIMIT}&offset=${offset}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();

      // 🔥 Deduplicate (safety net)
      setPosts((prev) => {
        const idSet = new Set(prev.map((p) => p.id));
        const uniqueNew = data.filter((p) => !idSet.has(p.id));

        return offset === 0 ? data : [...prev, ...uniqueNew];
      });

      if (data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
      if (offset === 0) setLoadingInitial(false);
      else setLoadingMore(false);
    }
  };

  // Load first page
  useEffect(() => {
    fetchPosts(0);
  }, []);

  // -------------------------------------------------------
  // Intersection Observer — attached to a FIXED sentinel div
  // -------------------------------------------------------
  const initiateObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isFetchingRef.current &&
          hasMore &&
          !loadingMore &&
          !loadingInitial
        ) {
          fetchPosts(posts.length);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [posts.length, hasMore, loadingInitial, loadingMore]);

  // Recreate observer when post count changes
  useEffect(() => {
    initiateObserver();
  }, [initiateObserver]);

  // -----------------------------------------------
  // UI
  // -----------------------------------------------
  if (loadingInitial)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (posts.length === 0)
    return (
      <Typography level="body-lg" sx={{ textAlign: "center", mt: 3 }}>
        No posts yet. Be the first to post something!
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          loadingIni={loadingInitial}
          onPostDeleted={(id) => {
            setPosts((prev) => prev.filter((p) => p.id !== id));
          }}
        />
      ))}

      {/* 👇 The stable scroll sentinel */}
      <div ref={sentinelRef} style={{ height: "1px" }} />

      {loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size="sm" />
        </Box>
      )}

      {!hasMore && (
        <Divider>
          <Typography sx={{ fontFamily: "Roboto Condensed" }}>
            You’re all caught up 🎉
          </Typography>
        </Divider>
      )}
    </Box>
  );
}
