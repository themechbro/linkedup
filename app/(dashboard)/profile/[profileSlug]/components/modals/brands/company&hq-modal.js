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
  Autocomplete,
} from "@mui/joy";
import { useState } from "react";
import { companySize } from "./list";
export default function CompanyhQModal({ open, close, owner }) {
  const [comp, setComp] = useState(null);
  const [hq, setHq] = useState("");
  const [loading, setLoading] = useState(false);
  const OwneruserId = owner?.meta?.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comp) {
      alert("Company Size cannot be empty");
      return;
    }

    if (!hq.trim()) {
      alert("Headquarters field cannot be empty");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/update/post-company-hq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ companysize: comp?.label, hq: hq }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update Company Size and Headquarters");
        return;
      }

      alert(data.message);
      setComp("");
      setHq("");
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
            Add Company Size and Headquarters
          </Typography>
        </Box>

        <Box component="form" sx={{ px: 3, py: 2 }} onSubmit={handleSubmit}>
          <FormControl required sx={{ m: 2 }}>
            <FormLabel>Add Headquarters</FormLabel>
            <Input
              type="text"
              placeholder="Where your HQ is located?"
              value={hq}
              onChange={(e) => setHq(e.target.value)}
            />
          </FormControl>

          <FormControl required sx={{ m: 2 }}>
            <FormLabel>Add Company Size</FormLabel>
            <Autocomplete
              placeholder="Select your company size"
              options={companySize}
              getOptionLabel={(option) => option.label}
              clearOnEscape
              autoHighlight
              sx={{ width: "100%" }}
              value={comp}
              onChange={(e, value) => setComp(value)}
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
