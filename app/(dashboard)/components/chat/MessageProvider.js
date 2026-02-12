"use client";

import { useState } from "react";
import ChatList from "./chatList";
import ChatPopup from "./chatPopup";

export default function MessagingProvider({ currentUser }) {
  const [openChats, setOpenChats] = useState([]);

  const openChat = (conversation) => {
    setOpenChats((prev) => {
      const exists = prev.find(
        (c) => c.conversation_id === conversation.conversation_id,
      );

      if (exists) return prev;

      return [...prev, conversation];
    });
  };

  const closeChat = (conversationId) => {
    setOpenChats((prev) =>
      prev.filter((c) => c.conversation_id !== conversationId),
    );
  };

  return (
    <>
      <ChatList currentUser={currentUser} onUserClick={openChat} />

      {openChats.map((conversation, index) => (
        <ChatPopup
          key={conversation.conversation_id}
          conversation={conversation}
          index={index}
          onClose={closeChat}
        />
      ))}
    </>
  );
}
