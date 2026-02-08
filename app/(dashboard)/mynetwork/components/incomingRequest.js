import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
  Skeleton,
  Chip,
} from "@mui/joy";
import { Check, X, VerifiedIcon } from "lucide-react";

const IncomingRequestCard = ({ request, onAccept, onIgnore, loading }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "md",
          borderColor: "primary.200",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          {/* Avatar */}
          <Avatar
            src={`${process.env.NEXT_PUBLIC_HOST_IP}${request.profile_picture}`}
            alt={request.full_name}
            sx={{ width: 64, height: 64, cursor: "pointer" }}
            onClick={() =>
              (window.location.href = `/profile/${request.user_id}`)
            }
          />

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Name and Verification */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              <Typography
                level="title-md"
                sx={{
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() =>
                  (window.location.href = `/profile/${request.username}`)
                }
              >
                {request.full_name}
              </Typography>
              {request.isVerified && (
                <VerifiedIcon
                  size={16}
                  fill="#0A66C2"
                  color="white"
                  style={{ flexShrink: 0 }}
                />
              )}
            </Box>

            {/* Headline */}
            <Typography
              level="body-sm"
              sx={{
                color: "text.secondary",
                mb: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {request.headline || "No headline"}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="sm"
                variant="solid"
                color="primary"
                startDecorator={<Check size={16} />}
                onClick={() => onAccept(request.user_id)}
                loading={loading === `accept-${request.user_id}`}
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  borderRadius: "16px",
                }}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                startDecorator={<X size={16} />}
                onClick={() => onIgnore(request.user_id)}
                loading={loading === `ignore-${request.user_id}`}
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  borderRadius: "16px",
                }}
              >
                Ignore
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const IncomingRequestsSkeleton = () => (
  <Card variant="outlined">
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Skeleton variant="circular" width={64} height={64} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1.5 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton
              variant="rectangular"
              height={32}
              sx={{ flex: 1, borderRadius: "16px" }}
            />
            <Skeleton
              variant="rectangular"
              height={32}
              sx={{ flex: 1, borderRadius: "16px" }}
            />
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const fetchIncomingRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/incoming_requests`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      setActionLoading(`accept-${userId}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/accept`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender_id: userId }),
        },
      );

      if (!res.ok) throw new Error("Failed to accept request");

      // Remove from list
      setRequests((prev) => prev.filter((req) => req.user_id !== userId));
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleIgnore = async (userId) => {
    try {
      setActionLoading(`ignore-${userId}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender_id: userId }),
        },
      );

      if (!res.ok) throw new Error("Failed to ignore request");

      // Remove from list
      setRequests((prev) => prev.filter((req) => req.user_id !== userId));
    } catch (error) {
      console.error("Error ignoring request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography level="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Invitations
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <IncomingRequestsSkeleton key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box>
        <Typography level="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Invitations
        </Typography>
        <Card variant="outlined">
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography level="body-md" sx={{ color: "text.secondary" }}>
              No pending invitations
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography level="h4" sx={{ fontWeight: 600 }}>
          Invitations
        </Typography>
        <Chip size="sm" variant="soft" color="primary">
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </Chip>
      </Box>

      {/* Request Cards */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {requests.map((request) => (
          <IncomingRequestCard
            key={request.user_id}
            request={request}
            onAccept={handleAccept}
            onIgnore={handleIgnore}
            loading={actionLoading}
          />
        ))}
      </Box>
    </Box>
  );
};

export default IncomingRequests;
