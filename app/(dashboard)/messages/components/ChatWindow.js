"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  Input,
  IconButton,
  CircularProgress,
  Sheet,
  Tooltip,
} from "@mui/joy";
import { Send, ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fab } from "@mui/material";
import { MoveDown, Heart } from "lucide-react";
// export default function ChatWindow({ userId, onBack, onNewMessage }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [otherUser, setOtherUser] = useState(null);
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   useEffect(() => {
//     if (userId) {
//       fetchMessages();
//       fetchUserInfo();

//       // Poll for new messages every 3 seconds
//       const interval = setInterval(fetchMessages, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [userId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchMessages = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/get-coversation-specific/${userId}?limit=100`,
//         { credentials: "include" }
//       );
//       const data = await res.json();

//       if (data.success) {
//         setMessages(data.messages);
//       }
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserInfo = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/profile/${userId}`,
//         { credentials: "include" }
//       );
//       const data = await res.json();
//       setOtherUser(data);
//     } catch (err) {
//       console.error("Error fetching user:", err);
//     }
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || sending) return;

//     setSending(true);
//     const messageText = newMessage.trim();
//     setNewMessage("");

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/send_new_message`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             receiver_id: userId,
//             content: messageText,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         // Add message to list immediately (optimistic update)
//         setMessages((prev) => [...prev, data.message]);
//         onNewMessage(userId);
//       }
//     } catch (err) {
//       console.error("Error sending message:", err);
//       setNewMessage(messageText); // Restore message on error
//     } finally {
//       setSending(false);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const formatMessageTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const groupMessagesByDate = (messages) => {
//     const groups = {};
//     messages.forEach((msg) => {
//       const date = new Date(msg.created_at).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//       if (!groups[date]) groups[date] = [];
//       groups[date].push(msg);
//     });
//     return groups;
//   };

//   const messageGroups = groupMessagesByDate(messages);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100%",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       {/* Header */}
//       <Sheet
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           p: 2,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           backgroundColor: "white",
//         }}
//       >
//         {/* Back button for mobile */}
//         <IconButton
//           sx={{ display: { xs: "flex", md: "none" } }}
//           onClick={onBack}
//         >
//           <ArrowLeft />
//         </IconButton>

//         <Avatar
//           src={
//             otherUser?.profile_picture
//               ? `${process.env.NEXT_PUBLIC_HOST_IP}${otherUser.profile_picture}`
//               : "/default.img"
//           }
//           size="md"
//         />

//         <Box sx={{ flex: 1 }}>
//           <Typography level="title-md" sx={{ fontWeight: 600 }}>
//             {otherUser?.fullName || "Loading..."}
//           </Typography>
//           <Typography level="body-xs" sx={{ color: "neutral.500" }}>
//             @{otherUser?.username}
//           </Typography>
//         </Box>

//         <IconButton variant="plain">
//           <MoreVertical size={20} />
//         </IconButton>
//       </Sheet>

//       {/* Messages Area */}
//       <Box
//         ref={messagesContainerRef}
//         sx={{
//           flex: 1,
//           overflow: "auto",
//           p: 2,
//           display: "flex",
//           flexDirection: "column",
//           gap: 1,
//         }}
//       >
//         {Object.entries(messageGroups).map(([date, msgs]) => (
//           <Box key={date}>
//             {/* Date Divider */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 my: 2,
//               }}
//             >
//               <Typography
//                 level="body-xs"
//                 sx={{
//                   backgroundColor: "neutral.100",
//                   px: 2,
//                   py: 0.5,
//                   borderRadius: "12px",
//                   color: "neutral.600",
//                 }}
//               >
//                 {date}
//               </Typography>
//             </Box>

//             {/* Messages */}
//             {msgs.map((msg, index) => {
//               const isCurrentUser = msg.sender_id !== userId;
//               const showAvatar =
//                 index === msgs.length - 1 ||
//                 msgs[index + 1]?.sender_id !== msg.sender_id;

//               return (
//                 <Box
//                   key={msg.message_id}
//                   sx={{
//                     display: "flex",
//                     justifyContent: isCurrentUser ? "flex-end" : "flex-start",
//                     mb: showAvatar ? 2 : 0.5,
//                   }}
//                 >
//                   {!isCurrentUser && showAvatar && (
//                     <Avatar
//                       src={
//                         otherUser?.profilePicture
//                           ? `${process.env.NEXT_PUBLIC_HOST_IP}${otherUser.profilePicture}`
//                           : "/default.img"
//                       }
//                       size="sm"
//                       sx={{ mr: 1, alignSelf: "flex-end" }}
//                     />
//                   )}

//                   {!isCurrentUser && !showAvatar && (
//                     <Box sx={{ width: 40, mr: 1 }} /> // Spacer
//                   )}

//                   <Box
//                     sx={{
//                       maxWidth: "70%",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: isCurrentUser ? "flex-end" : "flex-start",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         backgroundColor: isCurrentUser
//                           ? "primary.500"
//                           : "white",
//                         color: isCurrentUser ? "white" : "text.primary",
//                         px: 2,
//                         py: 1,
//                         borderRadius: "18px",
//                         borderTopRightRadius: isCurrentUser ? "4px" : "18px",
//                         borderTopLeftRadius: isCurrentUser ? "18px" : "4px",
//                         boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//                       }}
//                     >
//                       <Typography
//                         level="body-md"
//                         sx={{ whiteSpace: "pre-wrap" }}
//                       >
//                         {msg.content}
//                       </Typography>
//                     </Box>

//                     {showAvatar && (
//                       <Typography
//                         level="body-xs"
//                         sx={{ color: "neutral.500", mt: 0.5, px: 1 }}
//                       >
//                         {formatMessageTime(msg.created_at)}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Box>
//               );
//             })}
//           </Box>
//         ))}
//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Input Area */}
//       <Sheet
//         sx={{
//           p: 2,
//           borderTop: "1px solid",
//           borderColor: "divider",
//           backgroundColor: "white",
//         }}
//       >
//         <form onSubmit={handleSend}>
//           <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
//             <Input
//               placeholder="Write a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               disabled={sending}
//               sx={{
//                 flex: 1,
//                 backgroundColor: "#f5f5f5",
//                 border: "none",
//                 borderRadius: "20px",
//                 "&:hover": { backgroundColor: "#ececec" },
//               }}
//               multiline
//               maxRows={4}
//             />
//             <IconButton
//               type="submit"
//               disabled={!newMessage.trim() || sending}
//               color="primary"
//               variant="solid"
//               sx={{ borderRadius: "50%" }}
//             >
//               {sending ? <CircularProgress size="sm" /> : <Send size={20} />}
//             </IconButton>
//           </Box>
//         </form>
//       </Sheet>
//     </Box>
//   );
// }

export default function ChatWindow({ userId, onBack, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const router = useRouter();
  const isInitialLoad = useRef(true);
  const [currUser, setCurrUser] = useState({});

  useEffect(() => {
    if (userId) {
      fetchMessages();
      fetchUserInfo();

      // Poll for new messages every 3 seconds (changed from 30000)
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isInitialLoad.current) {
        scrollToBottom(false);
        isInitialLoad.current = false;
      } else if (!showScrollButton) {
        // User is at bottom - auto-scroll for new messages
        scrollToBottom(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json();
        setCurrUser(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/get-coversation-specific/${userId}?limit=20`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/profile/${userId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      console.log("Fetched user info:", data); // 👈 ADD THIS FOR DEBUGGING
      setOtherUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/send_new_message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            receiver_id: userId,
            content: messageText,
          }),
        }
      );

      const data = await res.json();
      console.log("Send message response:", data); // 👈 ADD THIS FOR DEBUGGING

      if (data.success) {
        // Add message to list immediately (optimistic update)
        setMessages((prev) => [...prev, data.message]);
        onNewMessage(userId);
      } else {
        console.error("Send failed:", data.message);
        alert(data.message); // Show error to user
        setNewMessage(messageText); // Restore message
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  // Scroll
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if user is NOT at the bottom
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    setShowScrollButton(!isAtBottom);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // double click
  // const handledoubleClick = async (msg_id) => {
  //   console.log(currUser?.meta?.user_id);

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/message_micro/likeMessage/${msg_id}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           likedBy: currUser?.meta?.user_id,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       console.log("message liked successfully");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handledoubleClick = async (msg_id) => {
    const userId = currUser?.meta?.user_id;

    if (!userId) {
      console.warn("User not loaded yet, skipping like");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/message_micro/likeMessage/${msg_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            likedBy: userId,
          }),
        }
      );

      if (response.ok) {
        console.log("message liked successfully");
      }
    } catch (error) {
      console.log(error);
    }
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Sheet
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        {/* Back button for mobile */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={onBack}
        >
          <ArrowLeft />
        </IconButton>

        <Avatar
          src={
            otherUser?.profilePicture // ✅ FIXED: Was profile_picture, now profilePicture
              ? `${process.env.NEXT_PUBLIC_HOST_IP}${otherUser.profilePicture}`
              : "/default.img"
          }
          size="md"
        />

        <Box
          sx={{ flex: 1, cursor: "pointer" }}
          onClick={() => router.push(`/profile/${otherUser.userId}`)}
        >
          <Typography level="title-md" sx={{ fontWeight: 600 }}>
            {otherUser?.fullName || "Loading..."}{" "}
            {/* ✅ FIXED: Already correct */}
          </Typography>
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>
            @{otherUser?.username} {/* ✅ FIXED: Already correct */}
          </Typography>
        </Box>

        <IconButton variant="plain">
          <MoreVertical size={20} />
        </IconButton>
      </Sheet>

      {/* Messages Area */}
      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <Box key={date}>
            {/* Date Divider */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Typography
                level="body-xs"
                sx={{
                  backgroundColor: "neutral.100",
                  px: 2,
                  py: 0.5,
                  borderRadius: "12px",
                  color: "neutral.600",
                }}
              >
                {date}
              </Typography>
            </Box>

            {/* Messages */}
            {msgs.map((msg, index) => {
              const isCurrentUser = msg.sender_id !== userId;
              const showAvatar =
                index === msgs.length - 1 ||
                msgs[index + 1]?.sender_id !== msg.sender_id;

              return (
                <Box
                  key={msg.message_id}
                  sx={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    mb: showAvatar ? 2 : 0.5,
                  }}
                  onDoubleClick={() => {
                    handledoubleClick(msg.message_id);
                  }}
                >
                  {!isCurrentUser && showAvatar && (
                    <Avatar
                      src={
                        otherUser?.profilePicture
                          ? `${process.env.NEXT_PUBLIC_HOST_IP}${otherUser.profilePicture}`
                          : "/default.img"
                      }
                      size="sm"
                      sx={{ mr: 1, alignSelf: "flex-end" }}
                    />
                  )}

                  {!isCurrentUser && !showAvatar && (
                    <Box sx={{ width: 40, mr: 1 }} /> // Spacer
                  )}

                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <Tooltip title="Double tap on message to like">
                      <Box
                        sx={{
                          backgroundColor: isCurrentUser
                            ? "primary.300"
                            : "white",
                          color: isCurrentUser ? "white" : "text.primary",
                          px: 2,
                          py: 1,
                          borderRadius: "18px",
                          borderTopRightRadius: isCurrentUser ? "4px" : "18px",
                          borderTopLeftRadius: isCurrentUser ? "18px" : "4px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          msUserSelect: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Typography
                          level="body-md"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {msg.content}
                        </Typography>
                      </Box>
                    </Tooltip>

                    {/* Likes an counter for each message */}
                    {msg.likes > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 0.5,
                          gap: 0.5,
                          px: 1,
                        }}
                      >
                        <Typography
                          level="body-sm"
                          sx={{
                            fontSize: "14px",
                            cursor: "pointer",
                            color: isCurrentUser ? "primary.700" : "red",
                          }}
                        >
                          ❤️
                        </Typography>

                        {msg.liked_by?.length > 0 && (
                          <Typography
                            level="body-xs"
                            sx={{ color: "neutral.600" }}
                          >
                            {msg.liked_by.length}
                          </Typography>
                        )}
                      </Box>
                    )}
                    {showAvatar && (
                      <Typography
                        level="body-xs"
                        sx={{ color: "neutral.500", mt: 0.5, px: 1 }}
                      >
                        {formatMessageTime(msg.created_at)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {showScrollButton && (
        <Fab
          color="primary"
          aria-label="scroll down"
          onClick={scrollToBottom}
          size="small"
        >
          <MoveDown />
        </Fab>
      )}

      {/* Input Area */}
      <Sheet
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <form onSubmit={handleSend}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <Input
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              sx={{
                flex: 1,
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#ececec" },
              }}
              multiline
              maxRows={4}
            />
            <IconButton
              type="submit"
              disabled={!newMessage.trim() || sending}
              color="primary"
              variant="solid"
              sx={{ borderRadius: "50%" }}
            >
              {sending ? <CircularProgress size="sm" /> : <Send size={20} />}
            </IconButton>
          </Box>
        </form>
      </Sheet>
    </Box>
  );
}
