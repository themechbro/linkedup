"use client";
import {
  Avatar,
  Box,
  Card,
  Typography,
  Button,
  Tooltip,
  Skeleton,
} from "@mui/joy";
import Image from "next/image";
import ProfilePictureModal from "./prof_picture-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import ProfilePictureViewer from "./prof_picture-viewer";
import { profileFallback } from "@/public/assets/fallback/images.png";
import { coverFallback } from "@/public/assets/fallback/images-cover.png";

export default function ProfileFirst({ profile, requestedBy, isLoading }) {
  console.log(profile);
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [picModal, setPicModal] = useState({
    open: false,
    type: "",
    imgUrl: "",
  });
  const [viewer, setViewer] = useState({
    open: false,
    type: "",
    imgUrl: "",
  });

  const coverImageUrl = profile.coverPic
    ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.coverPic}`
    : coverFallback;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOwner(requestedBy?.meta?.user_id === profile.userId);
  }, [requestedBy, profile]);

  if (isLoading) {
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
        {/* Cover Photo Skeleton */}
        <Box sx={{ width: "100%", height: 280 }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: "100%", height: "100%" }}
          />
        </Box>

        {/* Profile Section */}
        <Box sx={{ px: 3, pb: 3, mt: -8 }}>
          {/* Avatar Skeleton */}
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "4px solid white",
            }}
          />

          {/* Details + Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mt: 2,
              gap: 2,
            }}
          >
            {/* Left Section: Name + Headline */}
            <Box sx={{ mt: 2, flexGrow: 1 }}>
              <Skeleton variant="text" level="h2" width={200} />

              <Skeleton
                variant="text"
                level="body-md"
                width={300}
                sx={{ mt: 1 }}
              />

              <Skeleton
                variant="text"
                level="body-sm"
                width={150}
                sx={{ mt: 1.5 }}
              />

              <Skeleton
                variant="text"
                level="body-sm"
                width={120}
                sx={{ mt: 1.5 }}
              />
            </Box>

            {/* Buttons Section */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
              <Skeleton
                variant="rectangular"
                width={90}
                height={35}
                sx={{ borderRadius: 20 }}
              />
              <Skeleton
                variant="rectangular"
                width={150}
                height={35}
                sx={{ borderRadius: 20 }}
              />
              <Skeleton
                variant="rectangular"
                width={70}
                height={35}
                sx={{ borderRadius: 20 }}
              />
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

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
          onClick={
            isOwner
              ? () => {
                  setPicModal({
                    open: true,
                    type: "cover",
                    imgUrl: profile.coverPic
                      ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.coverPic}`
                      : coverFallback,
                  });
                }
              : () => {
                  setViewer({
                    open: true,
                    type: "cover",
                    imgUrl: profile.coverPic
                      ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.coverPic}`
                      : coverFallback,
                  });
                }
          }
        />
      </Box>

      {/* Profile Section */}
      <Box sx={{ px: 3, pb: 3, mt: -8 }}>
        {/* Profile pic floating on cover */}
        <Avatar
          src={
            profile.profilePicture
              ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.profilePicture}`
              : profileFallback
          }
          sx={{
            width: 150,
            height: 150,
            border: "4px solid white",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={
            isOwner
              ? () => {
                  setPicModal({
                    open: true,
                    type: "profile",
                    imgUrl: profile.profilePicture
                      ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.profilePicture}`
                      : profileFallback,
                  });
                }
              : () => {
                  setViewer({
                    open: true,
                    type: "profile",
                    imgUrl: profile.profilePicture
                      ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.profilePicture}`
                      : profileFallback,
                  });
                }
          }
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
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <Typography level="h2" sx={{ fontWeight: 700 }}>
                {profile.fullName}
              </Typography>
              {profile.isVerified ? (
                <Tooltip title="Verified Profile">
                  <ShieldCheck />
                </Tooltip>
              ) : null}
            </div>

            <Typography level="body-md" sx={{ mt: 0.5, textWrap: "pretty" }}>
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

          {isOwner ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
              <Button variant="solid" color="primary" sx={{ borderRadius: 20 }}>
                Open
              </Button>
              <Button variant="soft" sx={{ borderRadius: 20 }}>
                Add Profile Section
              </Button>
              <Button variant="plain">More</Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
              <Button variant="solid" color="primary" sx={{ borderRadius: 20 }}>
                Follow
              </Button>
              <Button variant="soft" sx={{ borderRadius: 20 }}>
                Visit Website
              </Button>
              <Button variant="plain">More</Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal for uploading */}
      {isOwner ? (
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
      ) : (
        <ProfilePictureViewer
          openviewer={viewer.open}
          closeviewer={() => {
            setViewer({
              open: false,
              type: "",
              imgUrl: "",
            });
          }}
          imgurl={viewer.imgUrl}
        />
      )}

      {/*  */}
    </Card>
  );
}
