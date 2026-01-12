"use client";
import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Box,
  Textarea,
  Button,
} from "@mui/joy";
import { useState } from "react";

export default function AboutMeModal({ open, close, prevAbout, type }) {
  const [about, setAbout] = useState(prevAbout);

  const handleChange = (e) => {
    setAbout(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/update/post-about`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ about }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(data.message);
      // Reset Form
      setAbout("");
      close();
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
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
        <ModalClose />

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
          <Typography level="h4" fontWeight={600}>
            {type === "normal" ? "About Me" : "Overview"}
          </Typography>
        </Box>

        <Box component="form" sx={{ px: 3, py: 2 }} onSubmit={handleSubmit}>
          <Textarea
            name="about"
            minRows={5}
            placeholder="Add something about yourself......"
            onChange={handleChange}
            value={about}
          />

          {/* 🔹 Footer */}
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
