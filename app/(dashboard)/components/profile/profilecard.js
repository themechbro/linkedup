"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Avatar,
} from "@mui/joy";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfileHomeCard() {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setUserDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleProfileViewClick = () => {
    redirect(`/profile/${userDetail.meta.user_id}`);
  };

  const fullProfilePic = userDetail?.userData?.profile_picture
    ? `${process.env.NEXT_PUBLIC_HOST_IP}${userDetail.userData.profile_picture}`
    : null;
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "sm",
        backgroundColor: "#fff",
        position: "relative",
        p: 0,
        fontFamily: "Roboto Condensed",
      }}
    >
      {/* Cover Photo */}
      <Box
        sx={{
          height: 80,
          background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
        }}
      >
        <img
          src={
            userDetail?.userData?.cover_pic
              ? `${process.env.NEXT_PUBLIC_HOST_IP}${userDetail.userData.cover_pic}`
              : "/default-avatar.png"
          }
          style={{ objectFit: "fit", height: 80, width: "100%" }}
        />
      </Box>

      {/* Profile Section */}
      <CardContent sx={{ textAlign: "center", mt: -5 }}>
        <Avatar
          src={
            userDetail?.userData?.profile_picture
              ? `${process.env.NEXT_PUBLIC_HOST_IP}${userDetail.userData.profile_picture}`
              : "/default-avatar.png"
          }
          alt={userDetail?.userData?.full_name || "User"}
          sx={{
            width: 80,
            height: 80,
            border: "3px solid white",
            mx: "auto",
            boxShadow: "md",
          }}
        />

        <Typography
          level="h4"
          sx={{
            mt: 1,
            fontWeight: 700,
            fontFamily: "Roboto Condensed",
          }}
        >
          {loading
            ? "Loading..."
            : userDetail?.userData?.full_name ?? "John Doe"}
        </Typography>
        <Typography
          level="body-sm"
          sx={{
            color: "text.secondary",
            px: 2,
          }}
        >
          {userDetail?.userData?.headline ??
            "Full Stack Developer | SOC Analyst L1 | Open to opportunities"}
        </Typography>
      </CardContent>

      {/* Divider */}
      <Divider />

      {/* Stats Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            Profile views
          </Typography>
          <Typography
            level="body-sm"
            sx={{ fontWeight: 700, color: "#0a66c2" }}
          >
            174
          </Typography>
        </Box>

        <Box>
          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            Post impressions
          </Typography>
          <Typography
            level="body-sm"
            sx={{ fontWeight: 700, color: "#0a66c2" }}
          >
            1,203
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Action Section */}
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Button
          variant="outlined"
          size="sm"
          sx={{
            borderRadius: "20px",
            borderColor: "#0a66c2",
            color: "#0a66c2",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#e8f3ff",
              borderColor: "#004182",
            },
          }}
          onClick={handleProfileViewClick}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
