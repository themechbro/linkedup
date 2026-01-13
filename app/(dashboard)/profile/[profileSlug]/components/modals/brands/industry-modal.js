"use client";
import {
  Modal,
  ModalDialog,
  Typography,
  Box,
  Button,
  Autocomplete,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { useState } from "react";
import { industryList } from "./list";

// Backend wiring left
export default function IndustryAdderModal({ open, close, owner }) {
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const OwneruserId = owner.meta.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!industry.trim()) {
      alert("Industry cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/profile/update-industry/${OwneruserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ industry }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update Industry");
        return;
      }

      alert(data.message);
      setIndustry("");
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
            Add Industry
          </Typography>
        </Box>

        <Box component="form" sx={{ px: 3, py: 2 }} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Select your Industry</FormLabel>
            <Autocomplete
              placeholder="Select an industry"
              options={industryList}
              clearOnEscape
              autoHighlight
              sx={{ width: "100%" }}
              value={industry}
              onChange={(e, value) => setIndustry(value)}
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
