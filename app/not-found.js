"use client";

import { Box, Typography, Button } from "@mui/joy";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "neutral.200",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,247,250,0.95))",
          boxShadow: "sm",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            mx: "auto",
            mb: 2,
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "neutral.softBg",
            color: "neutral.600",
          }}
        >
          <SearchX size={26} />
        </Box>

        {/* Title */}
        <Typography level="h4">This page doesn’t exist</Typography>

        {/* Description */}
        <Typography level="body-sm" sx={{ color: "neutral.500", mt: 1 }}>
          The link you followed may be broken, or the page may have been
          removed. You can return to your feed or explore new opportunities.
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            mt: 3,
            flexWrap: "wrap",
          }}
        >
          <Button component={Link} href="/" variant="solid">
            Go to feed
          </Button>

          <Button component={Link} href="/jobs" variant="outlined">
            Browse jobs
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
