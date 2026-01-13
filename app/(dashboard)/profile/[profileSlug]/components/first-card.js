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
import profileFallback from "@/public/assets/fallback/images.png";
import coverFallback from "@/public/assets/fallback/images-cover.png";
import { Check, X } from "lucide-react";
import AddProfileSectionModal from "./add-profile-section/add-profile-section-modal";
import TabforProfileBrands from "./brands/tablist";

export default function ProfileFirst({ profile, requestedBy, isLoading }) {
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

  const [connectStatus, setConnectStatus] = useState("loading");
  const [connectLoading, setConnectLoading] = useState(false);
  const [fetchConnectCount, setFetchConnectCount] = useState({});
  const [connectionCountLoading, setConnectionCountLoading] = useState(true);
  const [openAddSection, setOpenAddSection] = useState(false);

  const coverImageUrl = profile.coverPic
    ? `${process.env.NEXT_PUBLIC_HOST_IP}${profile.coverPic}`
    : coverFallback;

  useEffect(() => {
    setIsOwner(requestedBy?.meta?.user_id === profile.userId);
  }, [requestedBy, profile]);

  //  Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      if (!profile.userId || isOwner) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/check_connection?profileId=${profile.userId}`,
          { credentials: "include" }
        );

        const data = await res.json();

        setConnectStatus(data.status);
        // "connected", "pending", "incoming_request", "not_connected"
      } catch (err) {
        console.error("Error checking connection:", err);
        setConnectStatus("not_connected");
      }
    };

    checkConnection();
  }, [profile.userId, isOwner]);

  // Connection Count
  useEffect(() => {
    const fetchConnectionCount = async () => {
      console.log("🔍 Fetching connection count for:", profile.userId); // 👈 ADD THIS

      if (!profile.userId) {
        console.log("⚠️ No userId found"); // 👈 ADD THIS
        return;
      }

      setConnectionCountLoading(true);

      try {
        const url = `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/connection_length_user?user_id=${profile.userId}`;
        console.log("📡 Calling URL:", url); // 👈 ADD THIS

        const connectionCountRes = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        console.log("📥 Response status:", connectionCountRes.status); // 👈 ADD THIS

        if (!connectionCountRes.ok) {
          console.error("❌ Failed to fetch connection count");
          return;
        }

        const data1 = await connectionCountRes.json();
        console.log("📦 Received data:", data1); // 👈 ADD THIS

        if (data1.success) {
          setFetchConnectCount(data1);
          console.log("✅ State updated:", data1); // 👈 ADD THIS
        }
      } catch (err) {
        console.error("💥 Error fetching connection count:", err);
      } finally {
        setConnectionCountLoading(false);
      }
    };

    fetchConnectionCount();
  }, [profile.userId]);

  //  Handle connect button
  const handleConnect = async () => {
    if (connectLoading) return;
    setConnectLoading(true);
    setConnectStatus("pending"); // Optimistic update

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ receiver_id: profile.userId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setConnectStatus("pending");
      } else {
        setConnectStatus("not_connected");
        console.error("Connect failed:", data.message);
      }
    } catch (err) {
      console.error("Connect error:", err);
      setConnectStatus("not_connected");
    } finally {
      setConnectLoading(false);
    }
  };

  //  Handle accept connection
  const handleAccept = async () => {
    if (connectLoading) return;
    setConnectLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sender_id: profile.userId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setConnectStatus("connected");
      } else {
        console.error("Accept failed:", data.message);
      }
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  //  Handle reject connection
  const handleReject = async () => {
    if (connectLoading) return;
    setConnectLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sender_id: profile.userId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setConnectStatus("not_connected");
      } else {
        console.error("Reject failed:", data.message);
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  //  Render connection button based on status
  const renderConnectionButton = () => {
    if (connectStatus === "loading") {
      return (
        <Button disabled sx={{ borderRadius: 20 }}>
          Loading...
        </Button>
      );
    }

    if (connectStatus === "connected") {
      return (
        <Button variant="soft" disabled sx={{ borderRadius: 20 }}>
          <Check size={16} style={{ marginRight: 4 }} />
          Connected
        </Button>
      );
    }

    if (connectStatus === "pending") {
      return (
        <Button variant="soft" disabled sx={{ borderRadius: 20 }}>
          Pending...
        </Button>
      );
    }

    if (connectStatus === "incoming_request") {
      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Accept Request">
            <Button
              variant="solid"
              color="primary"
              onClick={handleAccept}
              disabled={connectLoading}
              sx={{ borderRadius: 20 }}
            >
              <Check size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Reject Request">
            <Button
              variant="outlined"
              color="danger"
              onClick={handleReject}
              disabled={connectLoading}
              sx={{ borderRadius: 20 }}
            >
              <X size={16} />
            </Button>
          </Tooltip>
        </Box>
      );
    }

    // not_connected
    return (
      <Button
        variant="solid"
        color="primary"
        onClick={handleConnect}
        disabled={connectLoading}
        sx={{ borderRadius: 20 }}
      >
        Connect
      </Button>
    );
  };

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
              {connectionCountLoading
                ? "Loading..."
                : `${fetchConnectCount?.totalConnections || 0} connections`}
            </Typography>
          </Box>

          {/* Right Section – Connection Buttons */}
          {isOwner ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
              <Button variant="solid" color="primary" sx={{ borderRadius: 20 }}>
                Open
              </Button>
              <Button
                variant="soft"
                sx={{ borderRadius: 20 }}
                onClick={() => setOpenAddSection(true)}
              >
                Add Profile Section
              </Button>
              <Button variant="plain">More</Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2 }}>
              {renderConnectionButton()}
              <Button
                variant="soft"
                sx={{ borderRadius: 20 }}
                onClick={() => router.push(`/messages?user=${profile.userId}`)}
              >
                Message
              </Button>
              <Button variant="plain">More</Button>
            </Box>
          )}
        </Box>

        {profile.isBrand ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mt: 5.5,
              bottom: 0,
            }}
          >
            <TabforProfileBrands />
          </Box>
        ) : null}
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

      {/* Modal for Adding Sections */}
      <AddProfileSectionModal
        open={openAddSection}
        close={() => {
          setOpenAddSection(false);
        }}
        type={profile.isBrand ? "brand" : "normal"}
        requestedBy={requestedBy}
      />
    </Card>
  );
}
