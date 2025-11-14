"use client";
import { Avatar, Box, Card, Typography, Button } from "@mui/joy";
import Image from "next/image";
import ProfilePictureModal from "./prof_picture-modal";
import { useState } from "react";

export default function ProfileFirst() {
  const [picModal, setPicModal] = useState({
    open: false,
    type: "",
    imgUrl: "",
  });
  const coverPic =
    "https://images.unsplash.com/photo-1503264116251-35a269479413";
  const profilePic = "https://i.pravatar.cc/150?img=68";

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
        <Image
          src={coverPic}
          alt="cover photo"
          fill
          style={{ objectFit: "cover", cursor: "pointer" }}
          onClick={() => {
            setPicModal({
              open: true,
              type: "cover",
              imgUrl: coverPic,
            });
          }}
        />
      </Box>

      {/* Profile Section */}
      <Box sx={{ px: 3, pb: 3, mt: -8 }}>
        {/* Profile pic floating on cover */}
        <Avatar
          src={profilePic}
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
              imgUrl: profilePic,
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
              Adrin Paul
            </Typography>

            <Typography level="body-md" sx={{ mt: 0.5 }}>
              Full Stack Developer (MERN & Next.js) | SOC Analyst L1 | Open to
              Work | Immediate Joiner
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
        close={() => {
          setPicModal({ open: false });
        }}
        type={picModal.type}
        imgUrl={picModal.imgUrl}
      />
    </Card>
  );
}
