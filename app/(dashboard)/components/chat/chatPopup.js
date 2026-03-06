"use client";

import { Box, Typography, IconButton, Avatar } from "@mui/joy";
import { X, Minus, Maximize2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ChatWindow from "../../messages/components/ChatWindow";

export default function ChatPopup({ conversation, index, onClose }) {
  const [minimized, setMinimized] = useState(false);
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

  const otherUserId = conversation.other_user_id;
  const otherUserAvatar =
    resolveAssetUrl(conversation.other_user_picture) || "/default.img";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 360 + index * 340,

        width: 340,
        height: minimized ? 48 : 520,

        /* CRITICAL FIXES */
        backgroundColor: "#ffffff",
        bgcolor: "#ffffff",

        border: "1px solid rgba(0,0,0,0.15)",
        borderBottom: "none",

        borderRadius: "8px 8px 0 0",

        boxShadow:
          "0px 0px 0px 1px rgba(0,0,0,0.05), 0px 4px 12px rgba(0,0,0,0.25)",

        zIndex: 999999, // FIX transparency overlap
        isolation: "isolate", // FIX blending issue

        display: "flex",
        flexDirection: "column",

        overflow: "hidden",

        transition: "height 0.2s ease",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: 48,
          px: 1.5,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          backgroundColor: "#f3f2ef", // LinkedIn exact header color

          borderBottom: minimized ? "none" : "1px solid rgba(0,0,0,0.12)",

          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar size="sm" src={otherUserAvatar} />

          <Typography fontWeight="600">
            {conversation.other_user_name}
          </Typography>
        </Box>

        <Box>
          <IconButton size="sm" onClick={() => setMinimized(true)}>
            <Minus size={16} />
          </IconButton>

          <IconButton
            size="sm"
            component="a"
            href={`/messages/${conversation.conversation_id}`}
            target="_blank"
          >
            <Maximize2 size={16} />
          </IconButton>

          <IconButton
            size="sm"
            onClick={() => onClose(conversation.conversation_id)}
          >
            <X size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* BODY */}
      {!minimized && (
        <Box
          sx={{
            flex: 1,

            backgroundColor: "#ffffff", // CRITICAL FIX
            bgcolor: "#ffffff",

            position: "relative",
            zIndex: 1,

            overflow: "hidden",
          }}
        >
          <ChatWindow
            userId={otherUserId}
            onBack={() => setMinimized(true)}
            onNewMessage={() => {}}
          />
        </Box>
      )}
    </Box>
  );
}
