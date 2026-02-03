"use client";
import { Box, Card, Typography } from "@mui/joy";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { fetchPost } from "./lib/helper";
import ViewPostCard from "./components/viewPostCard";
import ProfileHomeCard from "../../components/profile/profilecard";
import LinkedupNewsCard from "../../components/linkeup_news_card";
import CommentComposer from "@/app/(dashboard)/components/comments/comment-composer";
import CommentList from "@/app/(dashboard)/components/comments/commentList";

export default function ViewPostPageSlug({ post }) {
  const path = usePathname();
  const post_id = path.split("/")[2]?.trim();
  const [data, setData] = useState({});
  const [newComment, setNewComment] = useState(null);

  const handleCommentAdded = (comment) => {
    setNewComment(comment);
  };
  useEffect(() => {
    if (!post_id) return;

    const loadPost = async () => {
      const result = await fetchPost(post_id);
      setData(result);
    };

    loadPost();
  }, [post_id]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        px: { xs: 1, sm: 2, md: 3 },
        py: 3,
        // justifyContent: "center",
      }}
    >
      {/* LEFT SIDEBAR */}
      <Box
        sx={{
          width: 300,
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 80,
          height: "fit-content",
        }}
      >
        <ProfileHomeCard />
      </Box>
      {/* CENTER FEED */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 600,
          width: "100%",
        }}
      >
        <ViewPostCard post={data?.data} requested_by={data?.requested_by} />
      </Box>
      <Box
        sx={{
          width: 500,
          display: { xs: "none", sm: "block" },
          position: "sticky",
          top: 80,
          height: "fit-content",
        }}
      >
        <Card sx={{ height: 500 }}>
          <Box>
            <Typography
              level="h3"
              sx={{
                fontFamily: "Roboto Condensed",
              }}
            >
              Comments
            </Typography>
          </Box>
          <Box sx={{ overflow: "auto" }}>
            <CommentList
              post_id={data?.data?.id}
              onCommentAdded={handleCommentAdded}
            />
          </Box>
        </Card>

        <CommentComposer post_id={data?.data?.id} newComment={newComment} />

        {/* <LinkedupNewsCard /> */}
      </Box>
    </Box>
  );
}
