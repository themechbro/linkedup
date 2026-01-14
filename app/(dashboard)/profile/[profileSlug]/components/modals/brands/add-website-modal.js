"use client";
import {
  Modal,
  ModalDialog,
  Input,
  Typography,
  Box,
  Button,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { useState } from "react";

// Backend wiring left
export default function WebsiteAdderModal({ open, close, owner }) {
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const OwneruserId = owner?.meta?.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!website.trim()) {
      alert("Website cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/update/post-website`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ website }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update website");
        return;
      }

      alert(data.message);
      setWebsite("");
      close();
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close}>
      <ModalDialog
        sx={{
          width: { xs: "95%", sm: 700 },
          maxHeight: "90vh",
          overflow: "auto",
          p: 0,
        }}
      >
        {/* 🔹 Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.body",
            zIndex: 1,
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            level="h4"
            fontWeight={600}
            sx={{ fontFamily: "Roboto Condensed" }}
          >
            Add Company Website
          </Typography>
        </Box>

        <Box component="form" sx={{ px: 3, py: 2 }} onSubmit={handleSubmit}>
          <FormControl required>
            <FormLabel>Add Website</FormLabel>
            <Input
              type="text"
              placeholder="Add your weblink here......"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </FormControl>
          {/* Footer */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.body",
              borderTop: "1px solid",
              borderColor: "divider",
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button variant="plain" onClick={close}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
