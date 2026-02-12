"use client";

import {
  Box,
  Typography,
  Avatar,
  Input,
  List,
  Badge,
  Skeleton,
} from "@mui/joy";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit3,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ChatList({ currentUser, onUserClick }) {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clickOnBadge, setClickOnBadge] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleChat = () => {
    setOpen((prev) => !prev);
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/all-conversation`,
        { credentials: "include" },
      );
      const data = await res.json();

      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChatClick = (item) => {
    onUserClick(item);
    setClickOnBadge((prev) => !prev);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          borderRadius: "8px",
          cursor: "pointer",
          "&:hover": { bgcolor: "background.level2" },
        }}
      >
        <Skeleton animation="wave" variant="circular" width={30} height={30} />
        <Box>
          <Skeleton
            animation="wave"
            variant="text"
            level="body-sm"
            sx={{ width: 200 }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            level="body-sm"
            sx={{ width: 200 }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 20,
        width: 320,
        borderRadius: "12px 12px 0 0",
        boxShadow: "lg",
        bgcolor: "background.body",
        overflow: "hidden",
        transition: "all 0.3s ease",
        height: open ? 500 : 56,
      }}
    >
      {/* Header */}
      <Box
        onClick={toggleChat}
        sx={{
          height: 56,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderBottom: open ? "1px solid" : "none",
          borderColor: "divider",
          bgcolor: "background.level1",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={currentUser?.avatar} size="sm" />
          <Typography level="title-sm" sx={{ fontFamily: "Roboto Condensed" }}>
            Messaging
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <MoreHorizontal size={18} />
          <Edit3 size={18} />
          {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </Box>
      </Box>

      {/* Body */}
      {open && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Search */}
          <Box sx={{ p: 1 }}>
            <Input
              placeholder="Search messages"
              size="sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startDecorator={<Search />}
            />
          </Box>

          {/* Chat List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 1,
            }}
          >
            {filteredConversations.length === 0 ? (
              <Typography>No Chats Yet</Typography>
            ) : loading ? (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 1,
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={30}
                  height={30}
                />
                <Box>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    level="body-sm"
                    sx={{ width: 200 }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="text"
                    level="body-sm"
                    sx={{ width: 200 }}
                  />
                </Box>
              </Box>
            ) : (
              <List>
                {filteredConversations.map((item) => (
                  <Box
                    key={item.conversation_id}
                    sx={{
                      display: "flex",
                      gap: 1,
                      p: 1,
                      borderRadius: "8px",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "background.level2" },
                    }}
                    onClick={() => handleChatClick(item)}
                  >
                    {clickOnBadge ? null : (
                      <Badge
                        badgeContent={
                          item.unread_count > 0 ? item.unread_count : null
                        }
                        color="danger"
                        size="sm"
                      ></Badge>
                    )}

                    <Avatar
                      size="sm"
                      src={`${process.env.NEXT_PUBLIC_HOST_IP}${item.other_user_picture}`}
                    />
                    <Box>
                      <Typography level="body-sm" fontWeight="600">
                        {item.other_user_name}
                      </Typography>

                      <Typography level="body-xs" color="neutral">
                        {item.last_message}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </List>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
