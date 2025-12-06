"use client";
import { Avatar, Box, Sheet, Typography, Button, Tooltip } from "@mui/joy";
import { ShieldCheck, Check, X } from "lucide-react";
import coverPhotoFallback from "@/public/assets/fallback/images-cover.png";
import profilePicfallback from "@/public/assets/fallback/images.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sendConnectionRequest } from "../../components/post/lib/helpers";
import { useState } from "react";

export default function ProfileCardNetwork({ profile, onConnect, onSuccess }) {
  const [localStatus, setLocalStatus] = useState(
    profile.connection_status || "not_connected"
  );
  const [connLoading, setConnLoading] = useState(false);

  const router = useRouter();

  const handleConnect = async () => {
    if (connLoading) return;
    setConnLoading(true);

    setLocalStatus("pending");
    onSuccess();

    try {
      const res = await sendConnectionRequest(profile.user_id);

      // 👇 Change this check
      if (res.ok) {
        // Instead of: res.ok && res.success
        setLocalStatus("pending");
      } else {
        setLocalStatus(post.connection_status || "not_connected");
        console.error("Connect failed:", res.message);
      }
    } catch (err) {
      console.error("Connect error:", err);
      setLocalStatus(post.connection_status || "not_connected");
    } finally {
      setConnLoading(false);
    }
  };
  // accept a request (the other user was sender)
  const handleAccept = async (senderId) => {
    if (connLoading) return;
    setConnLoading(true);

    try {
      const res = await acceptConnection(senderId);
      if (res.ok && res.success) {
        setLocalStatus("connected");

        // 👇 Update ALL posts from this user in the parent feed
        if (onConnectionStatusChanged) {
          onConnectionStatusChanged(post.owner, "connected");
        }
      } else {
        console.error("Accept failed:", res.message);
      }
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setConnLoading(false);
    }
  };

  // reject a request
  const handleReject = async (senderId) => {
    if (connLoading) return;
    setConnLoading(true);

    try {
      const res = await rejectConnection(senderId);
      if (res.ok && res.success) {
        setLocalStatus("not_connected");
        // 👇 DON'T trigger any parent updates that might cause scroll
      } else {
        console.error("Reject failed:", res.message);
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setConnLoading(false);
    }
  };

  return (
    <Sheet
      sx={{
        width: "250px",
        borderRadius: "xl",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        overflow: "hidden",
        cursor: "pointer",
        transition: "0.2s ease",
        "&:hover": {
          boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Cover */}
      <Box sx={{ width: "100%", height: 70 }}>
        <Image
          src={profilePicfallback}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Avatar + Info */}
      <Box
        sx={{ position: "relative", textAlign: "center", px: 2, pt: 0, pb: 2 }}
      >
        <Box
          onClick={() => {
            router.push(`/profile/${profile.user_id}`);
          }}
        >
          <Avatar
            src={`${process.env.NEXT_PUBLIC_HOST_IP}${profile.profile_picture}`}
            sx={{
              width: 72,
              height: 72,
              border: "3px solid white",
              borderRadius: "50%",
              position: "absolute",
              top: -36,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Gap for avatar */}
          <Box sx={{ height: 32 }} />

          <Typography level="body-lg" sx={{ fontWeight: "bold", mt: 0.5 }}>
            {profile.full_name.length > 12
              ? profile.full_name.slice(0, 12) + "..."
              : profile.full_name}
          </Typography>
        </Box>

        {profile.isverified && (
          <Tooltip title="Verified Profile">
            <ShieldCheck size={16} color="#0A66C2" />
          </Tooltip>
        )}

        <Typography
          level="body-sm"
          sx={{
            mt: 0.3,
            lineHeight: 1.2,
            opacity: 0.75,
            fontSize: "13px",
            minHeight: "30px",
          }}
        >
          {profile.headline}
        </Typography>

        {profile.mutualConnectionsCount > 0 && (
          <Typography level="body-xs" sx={{ opacity: 0.8, mt: 1 }}>
            {profile.mutualConnectionsCount} mutual connection
            {profile.mutualConnectionsCount > 1 ? "s" : ""}
          </Typography>
        )}

        {/* <Button
          variant="soft"
          fullWidth
          size="sm"
          sx={{
            mt: 1.5,
            borderRadius: "lg",
            fontWeight: 600,
            textTransform: "none",
          }}
          onClick={handleConnect}
        >
          Connect
        </Button> */}

        <>
          {localStatus === "not_connected" && (
            <Button onClick={handleConnect}>Connect</Button>
          )}

          {localStatus === "pending" && <Button disabled>Pending...</Button>}

          {localStatus === "incoming_request" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Accept Request">
                <Button
                  onClick={() => acceptConnection(post.owner)}
                  startDecorator={<Check />}
                />
              </Tooltip>

              <Tooltip title="Reject Request">
                <Button
                  onClick={() => rejectConnection(post.owner)}
                  startDecorator={<X />}
                />
              </Tooltip>
            </Box>
          )}

          {localStatus === "connected" && (
            <Button disabled variant="plain">
              Connected
            </Button>
          )}
        </>
      </Box>
    </Sheet>
  );
}
