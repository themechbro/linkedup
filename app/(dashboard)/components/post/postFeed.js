// // 4th Version
// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import {
//   Box,
//   CircularProgress,
//   Divider,
//   Typography,
//   IconButton,
//   Tooltip,
// } from "@mui/joy";
// import { RefreshCw } from "lucide-react";
// import { lazy, Suspense } from "react";
// const PostCard = lazy(() => import("./postCard.js"));

// // import PostCard from "./postCard";

// export default function PostFeed() {
//   const FEED_MODE = "micro";
//   const LIMIT = 10;
//   const REFRESH_INTERVAL = 30000; // 30 seconds

//   const [posts, setPosts] = useState([]);
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [newPostsAvailable, setNewPostsAvailable] = useState(false);

//   const isFetchingRef = useRef(false);
//   const observerRef = useRef(null);
//   const sentinelRef = useRef(null);
//   const refreshIntervalRef = useRef(null);

//   // -------------------------------------------------------
//   // Fetch posts
//   // -------------------------------------------------------
//   // const fetchPosts = async (offset) => {
//   //   if (isFetchingRef.current) return;
//   //   isFetchingRef.current = true;

//   //   if (offset === 0) setLoadingInitial(true);
//   //   else setLoadingMore(true);

//   //   try {
//   //     let url;

//   //     if (FEED_MODE === "global") {
//   //       //  Old global feed (unchanged)
//   //       url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts?limit=${LIMIT}&offset=${offset}`;
//   //     } else {
//   //       //  Microservice feed
//   //       url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/getconnectionsPost?limit=${LIMIT}&offset=${offset}`;
//   //     }

//   //     const res = await fetch(url, {
//   //       credentials: "include",
//   //       cache: "no-store",
//   //     });

//   //     if (!res.ok) throw new Error("Feed fetch failed");

//   //     const data = await res.json();

//   //     // 🔄 Normalize response shape
//   //     const incomingPosts =
//   //       FEED_MODE === "global" ? data : normalizeMicroserviceFeed(data.feed);

//   //     setPosts((prev) => {
//   //       if (offset === 0) return incomingPosts;

//   //       const existingIds = new Set(prev.map((p) => p.id));
//   //       const uniqueNew = incomingPosts.filter((p) => !existingIds.has(p.id));

//   //       if (uniqueNew.length === 0) return prev;
//   //       return [...prev, ...uniqueNew];
//   //     });

//   //     if (incomingPosts.length < LIMIT) {
//   //       setHasMore(false);
//   //     }
//   //   } catch (err) {
//   //     console.error("Error fetching feed:", err);
//   //     setHasMore(false);
//   //   } finally {
//   //     isFetchingRef.current = false;
//   //     if (offset === 0) setLoadingInitial(false);
//   //     else setLoadingMore(false);
//   //   }
//   // };

//   const fetchPosts = async (offset, isRefresh = false) => {
//     if (isFetchingRef.current) return;
//     isFetchingRef.current = true;

//     if (offset === 0) setLoadingInitial(true);
//     else setLoadingMore(true);

//     try {
//       let url;

//       if (FEED_MODE === "global") {
//         url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts?limit=${LIMIT}&offset=${offset}`;
//       } else {
//         url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/getconnectionsPost?limit=${LIMIT}&offset=${offset}`;
//       }

//       const res = await fetch(url, {
//         credentials: "include",
//         cache: "no-store",
//       });

//       if (!res.ok) throw new Error("Feed fetch failed");

//       const data = await res.json();

//       // 📄 Normalize response shape
//       const incomingPosts =
//         FEED_MODE === "global" ? data : normalizeMicroserviceFeed(data.feed);

//       setPosts((prev) => {
//         if (offset === 0) return incomingPosts;

//         const existingIds = new Set(prev.map((p) => p.id));
//         const uniqueNew = incomingPosts.filter((p) => !existingIds.has(p.id));

//         if (uniqueNew.length === 0) return prev;
//         return [...prev, ...uniqueNew];
//       });

//       // ✅ FIX: Properly handle hasMore state
//       if (incomingPosts.length < LIMIT) {
//         setHasMore(false);
//       } else if (isRefresh) {
//         // When refreshing, assume there might be more posts
//         setHasMore(true);
//       }
//     } catch (err) {
//       console.error("Error fetching feed:", err);
//       setHasMore(false);
//     } finally {
//       isFetchingRef.current = false;
//       if (offset === 0) setLoadingInitial(false);
//       else setLoadingMore(false);
//     }
//   };

//   // normaliser
//   const normalizeMicroserviceFeed = (feed) => {
//     return feed.map((post) => {
//       const basePost = {
//         id: post.postId,
//         owner: post.owner,
//         content: post.content,
//         media_url: post.mediaUrl ? JSON.parse(post.mediaUrl) : [],
//         created_at: post.createdAt,
//         likes: post.likes || 0,
//         liked_by: post.likedBy || [],
//         repost_count: post.repostCount || 0,
//         comment_count: 0,
//         profile_picture: post.profile_picture,
//         repost_of: post.repostOf || null,
//         original_post: null,
//         full_name: post.full_name,
//         username: post.username,
//         liked_by_me: post.liked_by_me,
//         connection_status: post.connection_status,
//       };

//       // If this is a repost, attach original post cleanly
//       if (post.repostOf && post.repostedPost) {
//         basePost.original_post = {
//           id: post.repostedPost.post_id,
//           owner: post.repostedPost.owner,
//           content: post.repostedPost.content,
//           media_url: post.repostedPost.mediaUrl
//             ? JSON.parse(post.repostedPost.mediaUrl)
//             : [],
//           created_at: post.repostedPost.createdAt,
//           likes: post.repostedPost.liKes || 0,
//           liked_by: post.repostedPost.likedBy || [],
//           repost_count: post.repostedPost.repostCount || 0,
//           full_name: post.repostedPost.full_name,
//           username: post.repostedPost.username,
//           profile_picture: post.repostedPost.profile_picture,
//         };
//       }

//       return basePost;
//     });
//   };

//   // -------------------------------------------------------
//   // Check for new posts (without replacing current feed)
//   // -------------------------------------------------------
//   const checkForNewPosts = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/checkLatestConnectionPost`,
//         {
//           credentials: "include",
//           cache: "no-store",
//         },
//       );

//       if (!res.ok) return;

//       const data = await res.json();

//       // ✅ FIX: Correct property access - the endpoint returns { latestPostId }
//       // Also handle the case where we're comparing post IDs properly
//       if (posts.length > 0 && data.latestPostId) {
//         // Check if the latest post ID is different from our current first post
//         if (data.latestPostId !== posts[0].id) {
//           console.log(
//             "🆕 New posts detected:",
//             data.latestPostId,
//             "vs current:",
//             posts[0].id,
//           );
//           setNewPostsAvailable(true);
//         }
//       }
//     } catch (err) {
//       console.error("Error checking for new posts:", err);
//     }
//   };

//   // -------------------------------------------------------
//   // Manual refresh
//   // -------------------------------------------------------
//   // const handleRefresh = async () => {
//   //   setIsRefreshing(true);
//   //   setNewPostsAvailable(false);
//   //   await fetchPosts(0);
//   //   setIsRefreshing(false);

//   //   // Scroll to top smoothly
//   //   window.scrollTo({ top: 0, behavior: "smooth" });
//   // };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     setNewPostsAvailable(false);

//     // ✅ FIX: Reset hasMore to true before refresh to allow loading more posts
//     setHasMore(true);

//     // Pass isRefresh flag to indicate this is a refresh operation
//     await fetchPosts(0, true);

//     setIsRefreshing(false);

//     // Scroll to top smoothly
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // -------------------------------------------------------
//   // Auto-refresh setup
//   // -------------------------------------------------------
//   // useEffect(() => {
//   //   // Start checking for new posts every REFRESH_INTERVAL
//   //   refreshIntervalRef.current = setInterval(() => {
//   //     checkForNewPosts();
//   //   }, REFRESH_INTERVAL);

//   //   // Cleanup on unmount
//   //   return () => {
//   //     if (refreshIntervalRef.current) {
//   //       clearInterval(refreshIntervalRef.current);
//   //     }
//   //   };
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [posts]);

//   useEffect(() => {
//     // Only start checking if we have posts
//     if (posts.length === 0) return;

//     // Start checking for new posts every REFRESH_INTERVAL
//     refreshIntervalRef.current = setInterval(() => {
//       checkForNewPosts();
//     }, REFRESH_INTERVAL);

//     // Cleanup on unmount
//     return () => {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [posts.length]);

//   // Load first page
//   useEffect(() => {
//     fetchPosts(0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         checkForNewPosts();
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [posts]);
//   // -------------------------------------------------------
//   // Intersection Observer
//   // -------------------------------------------------------
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
//           posts.length > 0
//         ) {
//           fetchPosts(posts.length);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0,
//       },
//     );

//     if (sentinelRef.current) {
//       observerRef.current.observe(sentinelRef.current);
//     }
//   }, [posts.length, hasMore, loadingInitial, loadingMore]);

//   useEffect(() => {
//     initiateObserver();
//   }, [initiateObserver]);

//   // -------------------------------------------------------
//   // UI
//   // -------------------------------------------------------
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
//       {/* New Posts Banner */}
//       {newPostsAvailable && (
//         <Box
//           sx={{
//             position: "sticky",
//             top: 70,
//             zIndex: 10,
//             display: "flex",
//             justifyContent: "center",
//             mb: 2,
//           }}
//         >
//           <Box
//             onClick={handleRefresh}
//             sx={{
//               backgroundColor: "primary.500",
//               color: "white",
//               px: 3,
//               py: 1,
//               borderRadius: "20px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//               "&:hover": {
//                 backgroundColor: "primary.600",
//                 transform: "translateY(-2px)",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//               },
//               transition: "all 0.2s ease",
//             }}
//           >
//             <RefreshCw size={16} />
//             <Typography level="body-sm" sx={{ fontWeight: 600 }}>
//               New posts available
//             </Typography>
//           </Box>
//         </Box>
//       )}

//       {/* Manual Refresh Button */}
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: -2 }}>
//         <Tooltip title="Refresh feed">
//           <IconButton
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//             variant="plain"
//             color="neutral"
//             sx={{
//               "&:hover": { backgroundColor: "neutral.100" },
//             }}
//           >
//             <RefreshCw size={20} className={isRefreshing ? "rotating" : ""} />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       {posts.map((post) => (
//         <PostCard
//           key={post.id}
//           post={post}
//           loadingIni={loadingInitial}
//           onPostDeleted={(id) => {
//             setPosts((prev) => prev.filter((p) => p.id !== id));
//           }}
//           onConnectionStatusChanged={(userId, newStatus) => {
//             setPosts((prev) =>
//               prev.map((p) =>
//                 p.owner === userId ? { ...p, connection_status: newStatus } : p,
//               ),
//             );
//           }}
//         />
//       ))}

//       <div ref={sentinelRef} style={{ height: "1px" }} />

//       {loadingMore && (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
//           <CircularProgress size="sm" />
//         </Box>
//       )}

//       {!hasMore && (
//         <Divider>
//           <Typography sx={{ fontFamily: "Roboto Condensed" }}>
//             You're all caught up 🎉
//           </Typography>
//         </Divider>
//       )}

//       {/* Add rotating animation for refresh icon */}
//       <style jsx global>{`
//         @keyframes rotate {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         .rotating {
//           animation: rotate 1s linear infinite;
//         }
//       `}</style>
//     </Box>
//   );
// }

// 4th Version - FIXED with Last Seen Tracking
// Frontend with Backend Last-Seen Tracking
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
import { lazy, Suspense } from "react";
const PostCard = lazy(() => import("./postCard.js"));

export default function PostFeed({ uploadedPost }) {
  const FEED_MODE = "micro";
  const LIMIT = 10;
  const REFRESH_INTERVAL = 3660000; // 6minutes

  const [posts, setPosts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [reqUser, setReqUser] = useState("");
  const isFetchingRef = useRef(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  const markPostAsSeen = async (postId) => {
    try {
      console.log("📌 Marking post as seen:", postId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/markPostAsSeen`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ postId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark post as seen");
      }

      const data = await response.json();
      console.log("✅ Post marked as seen successfully:", data);
      return true;
    } catch (err) {
      console.error("❌ Error marking post as seen:", err);
      return false;
    }
  };
  // -------------------------------------------------------
  // Fetch posts
  // -------------------------------------------------------
  const fetchPosts = async (offset, isRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (offset === 0) setLoadingInitial(true);
    else setLoadingMore(true);

    try {
      let url;

      if (FEED_MODE === "global") {
        url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts?limit=${LIMIT}&offset=${offset}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/getconnectionsPost?limit=${LIMIT}&offset=${offset}`;
      }

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Feed fetch failed");

      const data = await res.json();

      setReqUser(data.currentUser);
      const incomingPosts =
        FEED_MODE === "global" ? data : normalizeMicroserviceFeed(data.feed);

      setPosts((prev) => {
        if (offset === 0) {
          // ✅ Mark first post as seen when refreshing
          if (incomingPosts.length > 0 && isRefresh) {
            markPostAsSeen(incomingPosts[0].id);
          }
          // return incomingPosts;
          const existingIds = new Set(incomingPosts.map((p) => p.postId));

          const localOnly = prev.filter((p) => !existingIds.has(p.postId));

          return [...localOnly, ...incomingPosts];
        }

        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = incomingPosts.filter((p) => !existingIds.has(p.id));

        if (uniqueNew.length === 0) return prev;
        return [...prev, ...uniqueNew];
      });

      if (incomingPosts.length < LIMIT) {
        setHasMore(false);
      } else if (isRefresh) {
        setHasMore(true);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
      if (offset === 0) setLoadingInitial(false);
      else setLoadingMore(false);
    }
  };

  // normaliser
  const normalizeMicroserviceFeed = (feed) => {
    return feed.map((post) => {
      const basePost = {
        id: post.postId,
        owner: post.owner,
        content: post.content,
        media_url: post.mediaUrl ? JSON.parse(post.mediaUrl) : [],
        created_at: post.createdAt,
        likes: post.likes || 0,
        liked_by: post.likedBy || [],
        repost_count: post.repostCount || 0,
        comment_count: 0,
        profile_picture: post.profile_picture,
        repost_of: post.repostOf || null,
        original_post: null,
        full_name: post.full_name,
        username: post.username,
        liked_by_me: post.liked_by_me,
        connection_status: post.connection_status,
        commentCount: post.commentCount,
      };

      if (post.repostOf && post.repostedPost) {
        basePost.original_post = {
          id: post.repostedPost.post_id,
          owner: post.repostedPost.owner,
          content: post.repostedPost.content,
          media_url: post.repostedPost.mediaUrl
            ? JSON.parse(post.repostedPost.mediaUrl)
            : [],
          created_at: post.repostedPost.createdAt,
          likes: post.repostedPost.likes || 0,
          liked_by: post.repostedPost.likedBy || [],
          repost_count: post.repostedPost.repostCount || 0,
          full_name: post.repostedPost.full_name,
          username: post.repostedPost.username,
          profile_picture: post.repostedPost.profile_picture,
        };
      }

      return basePost;
    });
  };

  // ✅ NEW: Mark post as seen on backend
  // const markPostAsSeen = async (postId) => {
  //   try {
  //     await fetch(
  //       `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/markPostAsSeen`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body: JSON.stringify({ postId }),
  //       },
  //     );
  //   } catch (err) {
  //     console.error("Error marking post as seen:", err);
  //   }
  // };

  // -------------------------------------------------------
  // ✅ UPDATED: Check uses backend hasNewPosts flag
  // -------------------------------------------------------

  const checkForNewPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/checkLatestConnectionPost`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data.hasNewPosts) {
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
    setHasMore(true);

    await fetchPosts(0, true);

    setIsRefreshing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------------------
  // Auto-refresh setup
  // -------------------------------------------------------
  useEffect(() => {
    if (posts.length === 0) return;

    refreshIntervalRef.current = setInterval(() => {
      checkForNewPosts();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length]);

  // Load first page
  useEffect(() => {
    fetchPosts(0, true); // Mark as seen on initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && posts.length > 0) {
        checkForNewPosts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length]);

  // Plug in uploadedPost to feed
  useEffect(() => {
    if (!uploadedPost) return;

    setPosts((prev) => {
      const exists = prev.some((p) => p.postId === uploadedPost.postId);

      if (exists) return prev;

      return [uploadedPost, ...prev];
    });
  }, [uploadedPost]);

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
      },
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

      {posts.map((post, index) => (
        <PostCard
          key={index}
          post={post}
          loadingIni={loadingInitial}
          onPostDeleted={(id) => {
            setPosts((prev) => prev.filter((p) => p.id !== id));
          }}
          onConnectionStatusChanged={(userId, newStatus) => {
            setPosts((prev) =>
              prev.map((p) =>
                p.owner === userId ? { ...p, connection_status: newStatus } : p,
              ),
            );
          }}
          requestedBy={reqUser}
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
