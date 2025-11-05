"use client";
import { Box, Typography, Button } from "@mui/joy";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

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
        width: "100%",
        height: "100%",
      }}
    >
      <Typography level="h1">Welcome Home</Typography>
      <Button startDecorator={<Power />} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
