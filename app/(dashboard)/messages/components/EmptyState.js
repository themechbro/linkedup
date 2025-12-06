import { Box, Typography } from "@mui/joy";
import { MessageSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "neutral.500",
        p: 3,
      }}
    >
      <MessageSquare size={64} style={{ marginBottom: "24px", opacity: 0.3 }} />
      <Typography level="h4" sx={{ mb: 1 }}>
        Select a conversation
      </Typography>
      <Typography level="body-md" textAlign="center">
        Choose a conversation from the list to start messaging
      </Typography>
    </Box>
  );
}
