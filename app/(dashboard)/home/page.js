"use client";
import { Box, Typography, Button } from "@mui/joy";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileHomeCard from "../components/profilecard";
import PostForm from "../components/postForm";
import PostFeed from "../components/postFeed";

export default function HomePage() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout Error", error);
    }
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
        <ProfileHomeCard />
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
        <Typography>Welcome</Typography>
        <Button onClick={handleLogout}>Logout</Button>

        <>
          <PostForm currentUser={{ name: "John Doe" }} />
          <PostFeed />
        </>
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
        <ProfileHomeCard />
      </Box>
    </Box>
  );
}
