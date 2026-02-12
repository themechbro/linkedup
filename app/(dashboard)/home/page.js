"use client";
import { Box, Divider } from "@mui/joy";

import { lazy, Suspense } from "react";
const ProfileHomeCard = lazy(() => import("../components/profile/profilecard"));
// import ProfileHomeCard from "../components/profile/profilecard";
import PostFeed from "../components/post/postFeed";
import PostComposer from "../components/composers/postComposer";
import LinkedupNewsCard from "../components/linkeup_news_card";
import { useEffect, useState, useCallback } from "react";

export default function HomePage() {
  const [fetchedData, setFetchedData] = useState({});
  const [uploadedPost, setUploadedPost] = useState(null);
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]); // Now fetchUser is stable

  const handlePostSuccess = (newPost) => {
    setUploadedPost(newPost);
  };
  return (
    <Box
      sx={{
        flex: 1,
        pt: { xs: "56px", md: "64px" }, // account for navbar height
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(250px, 1fr) 3fr minmax(300px, 1.5fr)",
        },
        gap: 4,
        px: { xs: 2, md: 4 },
        overflow: "hidden",
        maxWidth: "1600px",
        mx: "auto",
        backgroundColor: "#f3f2ef",
        minHeight: "100vh",
      }}
    >
      {/* Left Sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 80,
          alignSelf: "start",
        }}
      >
        <Suspense fallback="Loading....">
          <ProfileHomeCard />
        </Suspense>
      </Box>

      {/* Main Feed */}
      <Box
        component="main"
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pb: 4,
        }}
      >
        <PostComposer
          currentUser={{
            full_name: fetchedData?.userData?.full_name,
            profile_picture: fetchedData?.userData?.profile_picture,
            user_id: fetchedData?.userData?.user_id,
          }}
          otherUserData={fetchedData}
          onSucess={handlePostSuccess}
        />
        <Divider></Divider>
        <PostFeed uploadedPost={uploadedPost} />
      </Box>

      {/* Right Sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 80,
          alignSelf: "start",
        }}
      >
        {/* News, Widgets, Ads */}
        <LinkedupNewsCard />
      </Box>
    </Box>

    // <Box
    //   sx={{
    //     display: "grid",
    //     gridTemplateColumns: {
    //       xs: "1fr",
    //       md: "minmax(250px, 1fr) 3fr minmax(300px, 1.5fr)",
    //     },
    //     gap: 3,
    //     pt: { xs: "56px", md: "64px" }, // navbar offset
    //     px: { xs: 2, md: 4 },
    //     backgroundColor: "#f3f2ef",
    //     height: "100vh",
    //     overflow: "hidden", // prevent full-page scroll
    //   }}
    // >
    //   {/* LEFT SIDEBAR */}
    //   <Box
    //     component="aside"
    //     sx={{
    //       display: { xs: "none", md: "block" },
    //       position: "sticky",
    //       top: 80,
    //       alignSelf: "start",
    //       height: "calc(100vh - 80px)",
    //       overflowY: "auto",
    //       pr: 1,
    //     }}
    //   >
    //     <ProfileHomeCard />
    //   </Box>

    //   {/* MAIN FEED */}
    //   <Box
    //     component="main"
    //     sx={{
    //       overflowY: "auto",
    //       height: "calc(100vh - 80px)",
    //       pb: 4,
    //       display: "flex",
    //       flexDirection: "column",
    //       gap: 2,
    //       scrollbarWidth: "none", // Firefox
    //       msOverflowStyle: "none", // IE and Edge
    //       "&::-webkit-scrollbar": {
    //         display: "none", // Chrome, Safari
    //       },
    //     }}
    //   >
    //     <Typography
    //       level="h3"
    //       sx={{
    //         fontFamily: "Roboto Condensed",
    //         fontWeight: 700,
    //         mb: 1,
    //       }}
    //     >
    //       Welcome
    //     </Typography>

    //     <Button
    //       variant="soft"
    //       color="danger"
    //       sx={{ alignSelf: "flex-end", mb: 2 }}
    //       onClick={handleLogout}
    //     >
    //       Logout
    //     </Button>

    //     <PostComposer currentUser={{ full_name: "John Doe" }} />
    //     <Divider></Divider>
    //     <PostFeed />
    //   </Box>

    //   {/* RIGHT SIDEBAR */}
    //   <Box
    //     component="aside"
    //     sx={{
    //       display: { xs: "none", md: "block" },
    //       position: "sticky",
    //       top: 80,
    //       alignSelf: "start",
    //       height: "calc(100vh - 80px)",
    //       overflowY: "auto",
    //       pl: 1,
    //     }}
    //   >
    //     {/* You can replace this with widgets, news, or suggestions */}
    //     <LinkedupNewsCard />
    //   </Box>
    // </Box>
  );
}
