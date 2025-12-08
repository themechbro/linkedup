"use client";
import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Badge,
  CircularProgress,
  Sheet,
  Button,
} from "@mui/joy";
import { Search, MessageSquare, Edit } from "lucide-react";
import NewConversationModal from "./NewConversationModal";

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
  loading,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newConvModalOpen, setNewConvModalOpen] = useState(false);

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const truncateMessage = (text, maxLength = 35) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography level="h4" sx={{ fontWeight: 600 }}>
            Messaging
          </Typography>

          {/* New Message Button */}
          <Button
            size="sm"
            variant="plain"
            color="primary"
            startDecorator={<Edit size={18} />}
            onClick={() => setNewConvModalOpen(true)}
            sx={{
              minWidth: "auto",
              fontWeight: 600,
            }}
          >
            New
          </Button>
        </Box>

        {/* Search */}
        <Input
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startDecorator={<Search size={18} />}
          sx={{
            backgroundColor: "#eef3f8",
            border: "none",
            "&:hover": { backgroundColor: "#e0e7ee" },
          }}
        />
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: "auto", overflowX: "hidden", p: 1 }}>
        {filteredConversations.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 3,
              color: "neutral.500",
            }}
          >
            <MessageSquare size={48} style={{ marginBottom: "16px" }} />
            <Typography level="body-md" textAlign="center" sx={{ mb: 2 }}>
              {searchQuery ? "No conversations found" : "No messages yet"}
            </Typography>
            <Button
              variant="solid"
              color="primary"
              startDecorator={<Edit size={18} />}
              onClick={() => setNewConvModalOpen(true)}
            >
              Start a conversation
            </Button>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredConversations.map((conv) => (
              <ListItem key={conv.conversation_id} sx={{ p: 0 }}>
                <ListItemButton
                  selected={selectedUserId === conv.other_user_id}
                  onClick={() => onSelectConversation(conv.other_user_id)}
                  sx={{
                    p: 2,
                    gap: 2,
                    "&:hover": { backgroundColor: "neutral.50" },
                    backgroundColor:
                      selectedUserId === conv.other_user_id
                        ? "primary.50"
                        : "transparent",
                  }}
                >
                  {/* Avatar with unread badge */}
                  <Badge
                    badgeContent={
                      conv.unread_count > 0 ? conv.unread_count : null
                    }
                    color="danger"
                    size="sm"
                  >
                    <Avatar
                      src={
                        conv.other_user_picture
                          ? `${process.env.NEXT_PUBLIC_HOST_IP}${conv.other_user_picture}`
                          : "/default.img"
                      }
                      size="lg"
                    />
                  </Badge>

                  {/* Content */}
                  <ListItemContent sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        level="title-sm"
                        sx={{
                          fontWeight: conv.unread_count > 0 ? 600 : 400,
                        }}
                      >
                        {conv.other_user_name}
                      </Typography>
                      <Typography
                        level="body-xs"
                        sx={{ color: "neutral.500", flexShrink: 0, ml: 1 }}
                      >
                        {formatTime(conv.last_message_at)}
                      </Typography>
                    </Box>

                    <Typography
                      level="body-sm"
                      sx={{
                        color: "neutral.600",
                        fontWeight: conv.unread_count > 0 ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conv.last_message
                        ? truncateMessage(conv.last_message)
                        : "Start a conversation"}
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* New Conversation Modal */}
      <NewConversationModal
        open={newConvModalOpen}
        onClose={() => setNewConvModalOpen(false)}
        onSelectUser={onSelectConversation}
      />
    </Box>
  );
}
