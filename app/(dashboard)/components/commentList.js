// "use client";
// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   CircularProgress,
//   Card,
//   CardContent,
//   IconButton,
//   Tooltip,
// } from "@mui/joy";
// import { Heart, Reply } from "lucide-react";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import CommentComposer from "./comment-composer";
// dayjs.extend(relativeTime);

// export default function CommentList({ post_id, newComment }) {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to

//   // ✅ Fetch comments when post_id changes
//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/${post_id}/comments`,
//           { credentials: "include", cache: "no-store" }
//         );
//         const data = await res.json();
//         if (res.ok) {
//           setComments(data.comments || []);
//         }
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (post_id) fetchComments();
//   }, [post_id]);

//   // ✅ Add newly posted comment at top (realtime update)
//   useEffect(() => {
//     if (newComment && newComment.post_id === post_id) {
//       setComments((prev) => [newComment, ...prev]);
//     }
//   }, [newComment, post_id]);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//         <CircularProgress size="sm" />
//       </Box>
//     );
//   }

//   if (!comments.length) {
//     return (
//       <Typography
//         level="body-sm"
//         sx={{ textAlign: "center", mt: 1, color: "neutral.500" }}
//       >
//         No comments yet — be the first to comment!
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ mt: 1 }}>
//       {comments.map((comment) => (
//         <Card
//           key={comment.comment_id}
//           variant="plain"
//           sx={{
//             mb: 1.5,
//             borderRadius: "lg",
//             backgroundColor: "#fafafa",
//             boxShadow: "0 0 4px rgba(0,0,0,0.05)",
//           }}
//         >
//           <CardContent>
//             {/* Avatar */}
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 2,
//                   alignItems: "center",
//                 }}
//               >
//                 <Avatar
//                   size="sm"
//                   src={comment.profile_pic || "/default-avatar.png"}
//                   alt={comment.full_name}
//                 />
//                 <Typography level="body-sm" sx={{ fontWeight: 600 }}>
//                   {comment.full_name || "User"}
//                 </Typography>
//               </Box>

//               {/* Comment content */}
//               <Box>
//                 <Typography level="body-xs" textColor="neutral.500">
//                   {dayjs(comment.created_at).fromNow()}
//                 </Typography>
//               </Box>
//             </Box>

//             <Box>
//               <Typography
//                 level="body-sm"
//                 sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
//               >
//                 {comment.content}
//               </Typography>

//               {/* Optional media (images) */}
//               {comment.media_url && (
//                 <Box sx={{ mt: 1 }}>
//                   <img
//                     src={comment.media_url}
//                     alt="comment media"
//                     style={{
//                       width: "100%",
//                       maxHeight: 200,
//                       borderRadius: 8,
//                       objectFit: "cover",
//                     }}
//                   />
//                 </Box>
//               )}

//               {/* Like button */}
//               <Box
//                 sx={{
//                   mt: 1,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                 }}
//               >
//                 <Tooltip title="Like comment">
//                   <IconButton
//                     size="sm"
//                     variant="plain"
//                     color="neutral"
//                     sx={{ p: 0.5 }}
//                   >
//                     <Heart size={16} />
//                   </IconButton>
//                 </Tooltip>
//                 <Typography level="body-xs" color="neutral">
//                   {comment.likes || 0}
//                 </Typography>
//                 <Tooltip title="Reply">
//                   <IconButton
//                     size="sm"
//                     variant="plain"
//                     color="neutral"
//                     sx={{ p: 0.5 }}
//                     onClick={() =>
//                       setReplyingTo((prev) =>
//                         prev === comment.comment_id ? null : comment.comment_id
//                       )
//                     }
//                   >
//                     <Reply size={16} />
//                   </IconButton>
//                 </Tooltip>

//                 {replyingTo === comment.comment_id ? (
//                   <CommentComposer
//                     post_id={post_id}
//                     parent_comment_id={comment.id}
//                   />
//                 ) : null}
//               </Box>

//               {/* Replies */}
//               {comment.replies?.length > 0 && (
//                 <Box sx={{ ml: 5, mt: 1 }}>
//                   {comment.replies.map((reply) => (
//                     <Typography
//                       key={reply.comment_id}
//                       level="body-sm"
//                       sx={{ display: "block", mb: 0.5 }}
//                     >
//                       <strong>{reply.full_name}</strong> — {reply.content}
//                     </Typography>
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/joy";
import { Heart, Reply } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentComposer from "./comment-composer";

dayjs.extend(relativeTime);

export default function CommentList({ post_id, newComment }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  // ✅ Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/${post_id}/comments`,
          { credentials: "include", cache: "no-store" }
        );
        const data = await res.json();
        if (res.ok) setComments(data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };
    if (post_id) fetchComments();
  }, [post_id]);

  // ✅ Add new top-level comment instantly
  useEffect(() => {
    if (newComment && newComment.post_id === post_id) {
      setComments((prev) => [newComment, ...prev]);
    }
  }, [newComment, post_id]);

  // ✅ Add reply instantly when child composer submits successfully
  const handleReplyAdded = (reply, parentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.comment_id === parentId
          ? { ...comment, replies: [reply, ...(comment.replies || [])] }
          : comment
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size="sm" />
      </Box>
    );
  }

  if (!comments.length) {
    return (
      <Typography
        level="body-sm"
        sx={{ textAlign: "center", mt: 1, color: "neutral.500" }}
      >
        No comments yet — be the first to comment!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {comments.map((comment) => (
        <CommentCard
          key={comment.comment_id}
          comment={comment}
          post_id={post_id}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onReplyAdded={handleReplyAdded}
        />
      ))}
    </Box>
  );
}

// 🧩 Reusable CommentCard (for clean nested replies)
function CommentCard({
  comment,
  post_id,
  replyingTo,
  setReplyingTo,
  onReplyAdded,
  level = 0, // indentation level
}) {
  const isReplying = replyingTo === comment.comment_id;

  return (
    <Card
      variant="plain"
      sx={{
        mb: 1.5,
        borderRadius: "lg",
        backgroundColor: level === 0 ? "#fafafa" : "#f5f5f5",
        boxShadow: level === 0 ? "0 0 4px rgba(0,0,0,0.05)" : "none",
        ml: level * 5, // indent nested replies
        transition: "all 0.2s ease-in-out",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Avatar + User Info */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              size="sm"
              src={comment.profile_pic || "/default-avatar.png"}
              alt={comment.full_name}
            />
            <Box>
              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                {comment.full_name || "User"}
              </Typography>
              <Typography level="body-xs" textColor="neutral.500">
                {dayjs(comment.created_at).fromNow()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Comment Text */}
        <Typography
          level="body-sm"
          sx={{ mt: 1, whiteSpace: "pre-wrap", color: "neutral.800" }}
        >
          {comment.content}
        </Typography>

        {/* Optional Image */}
        {comment.media_url && (
          <Box sx={{ mt: 1 }}>
            <img
              src={comment.media_url}
              alt="comment media"
              style={{
                width: "100%",
                maxHeight: 200,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        {/* Like + Reply Actions */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            pl: 5 * level, // subtle shift for nested replies
          }}
        >
          <Tooltip title="Like comment">
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{ p: 0.5 }}
            >
              <Heart size={16} />
            </IconButton>
          </Tooltip>
          <Typography level="body-xs" color="neutral">
            {comment.likes || 0}
          </Typography>

          {level == 1 ? null : (
            <Tooltip title="Reply">
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{ p: 0.5 }}
                onClick={() =>
                  setReplyingTo((prev) =>
                    prev === comment.comment_id ? null : comment.comment_id
                  )
                }
              >
                <Reply size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Reply Composer */}
        {isReplying && (
          <Box sx={{ mt: 1, ml: 6 }}>
            <CommentComposer
              post_id={post_id}
              parent_comment_id={comment.comment_id}
              onCommentAdded={(reply) => {
                onReplyAdded(reply, comment.comment_id);
                setReplyingTo(null);
              }}
            />
          </Box>
        )}

        {/* Nested Replies */}
        {comment.replies?.length > 0 && (
          <Box sx={{ mt: 1, ml: 6 }}>
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.comment_id}
                comment={reply}
                post_id={post_id}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onReplyAdded={onReplyAdded}
                level={level + 1}
                iconShow={false}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
