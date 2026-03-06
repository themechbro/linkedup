"use client";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Sheet,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/joy";
import { ShieldCheck, Check, X, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profilePicfallback from "@/public/assets/fallback/images.png"; // Update path

const privateMediaHosts = (
  process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS ||
  "blr1.kos.olakrutrimsvc.com"
)
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

const resolveAssetUrl = (url) => {
  if (!url) return "";
  if (/^\/api\/private-media\?url=/i.test(url)) return url;

  if (/^(https?:)?\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (privateMediaHosts.includes(parsed.hostname.toLowerCase())) {
        return `/api/private-media?url=${encodeURIComponent(url)}`;
      }
    } catch {
      return url;
    }
    return url;
  }

  const base = process.env.NEXT_PUBLIC_HOST_IP || "";
  if (!base) return url;

  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function ProfileSuggestionCard({
  profile,
  onConnect,
  onAccept,
  onReject,
}) {
  const router = useRouter();
  const fallbackProfilePic = profilePicfallback?.src || profilePicfallback;
  const coverImageUrl =
    resolveAssetUrl(profile.cover_picture) || fallbackProfilePic;
  const profileImageUrl =
    resolveAssetUrl(profile.profile_picture) || fallbackProfilePic;
  const [localStatus, setLocalStatus] = useState(
    profile.connection_status || "not_connected",
  );
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (loading) return;
    setLoading(true);
    setLocalStatus("pending");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ receiver_id: profile.user_id }),
        },
      );

      if (res.ok) {
        setLocalStatus("pending");
        if (onConnect) onConnect(profile.user_id);
      } else {
        setLocalStatus("not_connected");
      }
    } catch (err) {
      console.error("Connect error:", err);
      setLocalStatus("not_connected");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sender_id: profile.user_id }),
        },
      );

      if (res.ok) {
        setLocalStatus("connected");
        if (onAccept) onAccept(profile.user_id);
      }
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sender_id: profile.user_id }),
        },
      );

      if (res.ok) {
        setLocalStatus("not_connected");
        if (onReject) onReject(profile.user_id);
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    // Handle dismiss/hide this suggestion
    console.log("Dismiss suggestion:", profile.user_id);
  };

  return (
    <Sheet
      sx={{
        width: "100%",
        maxWidth: "280px",
        borderRadius: "lg",
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Cover Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "72px",
          backgroundColor: "#ddd",
          cursor: "pointer",
        }}
        onClick={() => router.push(`/profile/${profile.user_id}`)}
      >
        <Image
          src={coverImageUrl}
          fill
          style={{
            objectFit: "cover",
          }}
          alt="Cover"
        />
      </Box>

      {/* Profile Content */}
      <Box sx={{ position: "relative", px: 2, pb: 2 }}>
        {/* Avatar - Overlapping cover */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: -4.5,
            mb: 1,
            cursor: "pointer",
          }}
          onClick={() => router.push(`/profile/${profile.user_id}`)}
        >
          <Avatar
            src={profileImageUrl}
            sx={{
              width: 72,
              height: 72,
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </Box>

        {/* Dismiss Button */}
        <IconButton
          size="sm"
          variant="plain"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: "24px",
            minHeight: "24px",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
          }}
          onClick={handleDismiss}
        >
          <X size={16} />
        </IconButton>

        {/* Name + Verified Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            mb: 0.5,
          }}
        >
          <Typography
            level="title-md"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { color: "primary.600" },
            }}
            onClick={() => router.push(`/profile/${profile.user_id}`)}
          >
            {profile.full_name.length > 20
              ? profile.full_name.slice(0, 20) + "..."
              : profile.full_name}
          </Typography>
          {profile.isverified && (
            <Tooltip title="Verified Profile" variant="solid">
              <ShieldCheck size={16} color="#0A66C2" />
            </Tooltip>
          )}
        </Box>

        {/* Headline */}
        <Typography
          level="body-sm"
          sx={{
            textAlign: "center",
            color: "neutral.600",
            lineHeight: 1.3,
            minHeight: "32px",
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.813rem",
          }}
        >
          {profile.headline || "No headline"}
        </Typography>

        {/* Mutual Connections */}
        {profile.mutual_connections > 0 && (
          <Typography
            level="body-xs"
            sx={{
              textAlign: "center",
              color: "neutral.500",
              mb: 1.5,
              fontSize: "0.75rem",
            }}
          >
            {profile.mutual_connections} mutual connection
            {profile.mutual_connections > 1 ? "s" : ""}
          </Typography>
        )}

        {/* Connection Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {localStatus === "not_connected" && (
            <>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                disabled={loading}
                onClick={handleConnect}
                sx={{
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                    backgroundColor: "primary.50",
                  },
                }}
              >
                <Users size={16} style={{ marginRight: 6 }} />
                Connect
              </Button>
              <Button
                fullWidth
                variant="plain"
                color="neutral"
                onClick={handleDismiss}
                sx={{
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "neutral.600",
                  "&:hover": {
                    backgroundColor: "neutral.100",
                  },
                }}
              >
                Dismiss
              </Button>
            </>
          )}

          {localStatus === "pending" && (
            <Button
              fullWidth
              variant="soft"
              disabled
              sx={{
                borderRadius: "20px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Pending...
            </Button>
          )}

          {localStatus === "incoming_request" && (
            <>
              <Button
                fullWidth
                variant="solid"
                color="primary"
                disabled={loading}
                onClick={handleAccept}
                startDecorator={<Check size={16} />}
                sx={{
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Accept
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="neutral"
                disabled={loading}
                onClick={handleReject}
                startDecorator={<X size={16} />}
                sx={{
                  borderRadius: "20px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Ignore
              </Button>
            </>
          )}

          {localStatus === "connected" && (
            <Button
              fullWidth
              variant="soft"
              disabled
              startDecorator={<Check size={16} />}
              sx={{
                borderRadius: "20px",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Connected
            </Button>
          )}
        </Box>
      </Box>
    </Sheet>
  );
}
