"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Input,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from "@mui/joy";
import { Search } from "lucide-react";

export default function NewConversationModal({ open, onClose, onSelectUser }) {
  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchConnections();
    }
  }, [open]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/get_connection_list`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (data.success) {
        setConnections(data.connections);
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = connections.filter(
    (conn) =>
      conn.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (userId) => {
    onSelectUser(userId);
    onClose();
    setSearchQuery("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 500,
          width: "90%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2 }}>
          New Message
        </Typography>

        {/* Search */}
        <Input
          placeholder="Search connections"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startDecorator={<Search size={18} />}
          sx={{ mb: 2 }}
          autoFocus
        />

        {/* Connections List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : filteredConnections.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "neutral.500" }}>
              <Typography>
                {searchQuery
                  ? "No connections found"
                  : "You don't have any connections yet"}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredConnections.map((connection) => (
                <ListItem key={connection.user_id} sx={{ p: 0 }}>
                  <ListItemButton
                    onClick={() => handleSelectUser(connection.user_id)}
                    sx={{
                      p: 2,
                      gap: 2,
                      "&:hover": { backgroundColor: "neutral.50" },
                    }}
                  >
                    <Avatar
                      src={
                        connection.profile_picture
                          ? `${process.env.NEXT_PUBLIC_HOST_IP}${connection.profile_picture}`
                          : "/default.img"
                      }
                      size="md"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-sm">
                        {connection.full_name}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: "neutral.600" }}>
                        @{connection.username}
                      </Typography>
                      {connection.headline && (
                        <Typography
                          level="body-xs"
                          sx={{ color: "neutral.500", mt: 0.5 }}
                        >
                          {connection.headline}
                        </Typography>
                      )}
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </ModalDialog>
    </Modal>
  );
}
