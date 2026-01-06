"use client";
import { Box, Typography } from "@mui/joy";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { fetchPost } from "./lib/helper";
import ViewPostCard from "./components/viewPostCard";
import ProfileHomeCard from "../../components/profile/profilecard";
import LinkedupNewsCard from "../../components/linkeup_news_card";

export default function ViewPostPageSlug({ post }) {
  const path = usePathname();
  const post_id = path.split("/")[2]?.trim();
  const [data, setData] = useState({});

  useEffect(() => {
    if (!post_id) return;

    const loadPost = async () => {
      const result = await fetchPost(post_id);
      setData(result);
    };

    loadPost();
  }, [post_id]);

  return (
    // <Box sx={{ display: "flex", gap: 2, px: 3, py: 3 }}>
    //   <Box sx={{ width: 300 }}>
    //     <ProfileHomeCard />
    //   </Box>
    //   <Box sx={{ width: "auto" }}>
    //     <ViewPostCard post={data.data} />
    //   </Box>
    //   <Box sx={{ width: 300 }}>
    //     <LinkedupNewsCard />
    //   </Box>
    // </Box>

    <Box
      sx={{
        display: "flex",
        gap: 2,
        px: { xs: 1, sm: 2, md: 3 },
        py: 3,
        justifyContent: "center",
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
        <ViewPostCard post={data.data} />
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box
        sx={{
          width: 300,
          display: { xs: "none", sm: "block" },
          position: "sticky",
          top: 80,
          height: "fit-content",
        }}
      >
        <LinkedupNewsCard />
      </Box>
    </Box>
  );
}
