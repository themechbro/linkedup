"use client";
import { Avatar, Box, Card, Typography, Button } from "@mui/joy";
import Image from "next/image";
import ProfilePictureModal from "./prof_picture-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileFirst({ profile }) {
  console.log(profile);
  const router = useRouter();

  const [picModal, setPicModal] = useState({
    open: false,
    type: "",
    imgUrl: "",
  });
  const coverPic = "/default-avatar.png";
  const profilePic = "https://i.pravatar.cc/150?img=68";

  const coverImageUrl = profile.coverPic
    ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.coverPic}`
    : coverPic;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 900,
        borderRadius: 20,
        overflow: "hidden",
        mx: "auto",
        p: 0,
      }}
    >
      {/* Cover Photo */}
      <Box sx={{ position: "relative", width: "100%", height: 280 }}>
        <img
          src={coverImageUrl}
          alt="cover photo"
          style={{
            objectFit: "cover",
            cursor: "pointer",
            height: "300px",
            width: "100%",
          }}
          onClick={() => {
            setPicModal({
              open: true,
              type: "cover",
              imgUrl: profile.coverPic
                ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.coverPic}`
                : coverPic,
            });
          }}
        />
      </Box>

      {/* Profile Section */}
      <Box sx={{ px: 3, pb: 3, mt: -8 }}>
        {/* Profile pic floating on cover */}
        <Avatar
          src={
            profile.profilePicture
              ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.profilePicture}`
              : profilePic
          }
          sx={{
            width: 150,
            height: 150,
            border: "4px solid white",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => {
            setPicModal({
              open: true,
              type: "profile",
              imgUrl: profile.profilePicture
                ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.profilePicture}`
                : profilePic,
            });
          }}
        />

        {/* User Details + Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mt: 1.5,
          }}
        >
          {/* Left Section */}
          <Box sx={{ mt: 2 }}>
            <Typography level="h2" sx={{ fontWeight: 700 }}>
              {profile.fullName}
            </Typography>

            <Typography level="body-md" sx={{ mt: 0.5 }}>
              {profile.headline}
            </Typography>

            <Typography level="body-sm" sx={{ color: "neutral.500", mt: 0.5 }}>
              Delhi, India • Contact info
            </Typography>

            <Typography
              level="body-sm"
              sx={{ color: "primary.600", mt: 0.5, cursor: "pointer" }}
            >
              500+ connections
            </Typography>
          </Box>

          {/* Right Section – Styled like LinkedIn */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
            <Button variant="solid" color="primary" sx={{ borderRadius: 20 }}>
              Open
            </Button>
            <Button variant="soft" sx={{ borderRadius: 20 }}>
              Add Profile Section
            </Button>
            <Button variant="plain">More</Button>
          </Box>
        </Box>
      </Box>
      <ProfilePictureModal
        open={picModal.open}
        close={() =>
          setPicModal({
            open: false,
            type: "",
            imgUrl: "",
          })
        }
        type={picModal.type}
        imgUrl={picModal.imgUrl}
        onUploadComplete={() => router.refresh()}
      />
    </Card>
  );
}
