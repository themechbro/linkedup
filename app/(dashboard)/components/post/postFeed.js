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

//   const isFetchingRef = useRef(false);
//   const observerRef = useRef(null);
//   const sentinelRef = useRef(null); // ← The stable scroll trigger

//   const fetchPosts = async (offset) => {
//     console.log(
//       "🔍 Fetch triggered - Offset:",
//       offset,
//       "Current posts:",
//       posts.length
//     ); // 👈 ADD THIS
//     if (isFetchingRef.current) {
//       console.log("⚠️ Already fetching, skipping...");
//       return;
//     }
//     isFetchingRef.current = true;

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

//       setPosts((prev) => {
//         if (offset === 0) {
//           return data; // Fresh load, replace everything
//         }

//         // 👇 IMPROVED DEDUPLICATION
//         const existingIds = new Set(prev.map((p) => p.id));
//         const uniqueNew = data.filter((p) => !existingIds.has(p.id));

//         // 👇 ALSO CHECK: if NO new unique posts, don't add anything
//         if (uniqueNew.length === 0) {
//           return prev;
//         }

//         return [...prev, ...uniqueNew];
//       });

//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       setHasMore(false);
//     } finally {
//       isFetchingRef.current = false;
//       if (offset === 0) setLoadingInitial(false);
//       else setLoadingMore(false);
//     }
//   };

//   // Load first page
//   useEffect(() => {
//     fetchPosts(0);
//   }, []);

//   const initiateObserver = useCallback(() => {
//     if (observerRef.current) observerRef.current.disconnect();

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const first = entries[0];
//         if (
//           first.isIntersecting &&
//           !isFetchingRef.current &&
//           hasMore &&
//           !loadingMore &&
//           !loadingInitial &&
//           posts.length > 0 // 👈 ADD THIS CHECK
//         ) {
//           fetchPosts(posts.length);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0,
//       }
//     );

//     if (sentinelRef.current) {
//       observerRef.current.observe(sentinelRef.current);
//     }
//   }, [posts.length, hasMore, loadingInitial, loadingMore]);

//   // Recreate observer when post count changes
//   useEffect(() => {
//     initiateObserver();
//   }, [initiateObserver]);

//   // -----------------------------------------------
//   // UI
//   // -----------------------------------------------
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
//       {posts.map((post) => (
//         <PostCard
//           key={post.id}
//           post={post}
//           loadingIni={loadingInitial}
//           onPostDeleted={(id) => {
//             setPosts((prev) => prev.filter((p) => p.id !== id));
//           }}
//           onConnectionStatusChanged={(userId, newStatus) => {
//             // 👇 Update ALL posts from this user
//             setPosts((prev) =>
//               prev.map((p) =>
//                 p.owner === userId ? { ...p, connection_status: newStatus } : p
//               )
//             );
//             fetchPosts();
//           }}
//         />
//       ))}

//       {/* 👇 The stable scroll sentinel */}
//       <div ref={sentinelRef} style={{ height: "1px" }} />

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

// 4th Version
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/joy";
import { RefreshCw } from "lucide-react";
import PostCard from "./postCard";

export default function PostFeed() {
  const LIMIT = 10;
  const REFRESH_INTERVAL = 30000; // 30 seconds

  const [posts, setPosts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  const isFetchingRef = useRef(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // -------------------------------------------------------
  // Fetch posts
  // -------------------------------------------------------
  const fetchPosts = async (offset) => {
    console.log(
      "🔍 Fetch triggered - Offset:",
      offset,
      "Current posts:",
      posts.length
    );

    if (isFetchingRef.current) {
      console.log("⚠️ Already fetching, skipping...");
      return;
    }
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

      setPosts((prev) => {
        if (offset === 0) {
          return data;
        }

        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = data.filter((p) => !existingIds.has(p.id));

        if (uniqueNew.length === 0) {
          return prev;
        }

        return [...prev, ...uniqueNew];
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

  // -------------------------------------------------------
  // Check for new posts (without replacing current feed)
  // -------------------------------------------------------
  const checkForNewPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts?limit=1&offset=0`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      // Check if the latest post is different from our current first post
      if (data.length > 0 && posts.length > 0 && data[0].id !== posts[0].id) {
        setNewPostsAvailable(true);
      }
    } catch (err) {
      console.error("Error checking for new posts:", err);
    }
  };

  // -------------------------------------------------------
  // Manual refresh
  // -------------------------------------------------------
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setNewPostsAvailable(false);
    await fetchPosts(0);
    setIsRefreshing(false);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------------------
  // Auto-refresh setup
  // -------------------------------------------------------
  useEffect(() => {
    // Start checking for new posts every REFRESH_INTERVAL
    refreshIntervalRef.current = setInterval(() => {
      checkForNewPosts();
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]); // Re-run when posts change

  // Load first page
  useEffect(() => {
    fetchPosts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNewPosts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);
  // -------------------------------------------------------
  // Intersection Observer
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
          !loadingInitial &&
          posts.length > 0
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

  useEffect(() => {
    initiateObserver();
  }, [initiateObserver]);

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
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
      {/* New Posts Banner */}
      {newPostsAvailable && (
        <Box
          sx={{
            position: "sticky",
            top: 70,
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            onClick={handleRefresh}
            sx={{
              backgroundColor: "primary.500",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "primary.600",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <RefreshCw size={16} />
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>
              New posts available
            </Typography>
          </Box>
        </Box>
      )}

      {/* Manual Refresh Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: -2 }}>
        <Tooltip title="Refresh feed">
          <IconButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="plain"
            color="neutral"
            sx={{
              "&:hover": { backgroundColor: "neutral.100" },
            }}
          >
            <RefreshCw size={20} className={isRefreshing ? "rotating" : ""} />
          </IconButton>
        </Tooltip>
      </Box>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          loadingIni={loadingInitial}
          onPostDeleted={(id) => {
            setPosts((prev) => prev.filter((p) => p.id !== id));
          }}
          onConnectionStatusChanged={(userId, newStatus) => {
            setPosts((prev) =>
              prev.map((p) =>
                p.owner === userId ? { ...p, connection_status: newStatus } : p
              )
            );
          }}
        />
      ))}

      <div ref={sentinelRef} style={{ height: "1px" }} />

      {loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size="sm" />
        </Box>
      )}

      {!hasMore && (
        <Divider>
          <Typography sx={{ fontFamily: "Roboto Condensed" }}>
            You're all caught up 🎉
          </Typography>
        </Divider>
      )}

      {/* Add rotating animation for refresh icon */}
      <style jsx global>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .rotating {
          animation: rotate 1s linear infinite;
        }
      `}</style>
    </Box>
  );
}

{
  /* <PostCard
          key={post.id}
          post={post}
          loadingIni={loadingInitial}
          onPostDeleted={(id) => {
            setPosts((prev) => prev.filter((p) => p.id !== id));
          }}
        /> */
}
