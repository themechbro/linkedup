"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Sheet } from "@mui/joy";
// import ConversationList from "@/components/messages/ConversationList";
// import ChatWindow from "@/components/messages/ChatWindow";
// import EmptyState from "@/components/messages/EmptyState";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import EmptyState from "./components/EmptyState";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("user");

  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userIdParam || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle URL parameter
  useEffect(() => {
    if (userIdParam) {
      setSelectedUserId(userIdParam);
    }
  }, [userIdParam]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/all-conversation`,
        { credentials: "include" }
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

  const handleNewMessage = (userId) => {
    fetchConversations();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        mt: 8,
        maxWidth: "1200px",
        mx: "auto",
        gap: 0,
      }}
    >
      <Sheet
        sx={{
          width: { xs: "100%", md: "350px" },
          display: { xs: selectedUserId ? "none" : "block", md: "block" },
          borderRight: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <ConversationList
          conversations={conversations}
          selectedUserId={selectedUserId}
          onSelectConversation={setSelectedUserId}
          loading={loading}
        />
      </Sheet>

      <Box
        sx={{
          flex: 1,
          display: { xs: selectedUserId ? "flex" : "none", md: "flex" },
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        {selectedUserId ? (
          <ChatWindow
            userId={selectedUserId}
            onBack={() => setSelectedUserId(null)}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <EmptyState />
        )}
      </Box>
    </Box>
  );
}
