"use client";
import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Input,
  FormControl,
  FormLabel,
  Box,
  Textarea,
  Button,
  Checkbox,
  Divider,
  Autocomplete,
} from "@mui/joy";
import { useState } from "react";

// UI Upgrades needed like snackbar and all

const type = [
  "Full Time",
  "Part Time",
  "Self Employed",
  "Freelance",
  "Internship",
  "Apprenticeship",
];

export default function PositionModal({ open, close }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [curr, setCurr] = useState(false);
  const [etype, setEtype] = useState("");
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrChange = (e) => {
    const checked = e.target.checked;
    setCurr(checked);

    // If currently studying, clear end_date
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        end_date: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      currently_working: curr,
      type: etype,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/update/post-work`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(data.message);
      // Reset Form
      setFormData({
        school_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        grade: "",
        activities: "",
        description: "",
      });
      setCurr(false);
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
        <ModalClose sx={{ color: "#000" }} />

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
            Add Position
          </Typography>
        </Box>

        {/* 🔹 Form */}
        <Box component="form" sx={{ px: 3, py: 2 }} onSubmit={handleSubmit}>
          <Box sx={{ display: "grid", gap: 2 }}>
            <FormControl required>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Ex: Full Stack Developer"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
              />
            </FormControl>

            <FormControl required>
              <FormLabel>Company or Organization</FormLabel>
              <Input
                placeholder="Ex: LinkedUp"
                name="company"
                value={formData.company}
                onChange={handleFormChange}
              />
            </FormControl>

            <FormControl required>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="Ex: New Delhi"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
              />
            </FormControl>
          </Box>

          {/* 🔹 Dates */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mt: 2,
            }}
          >
            <FormControl required>
              <FormLabel>Start date</FormLabel>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleFormChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>End date</FormLabel>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                disabled={curr ? true : false}
                onChange={handleFormChange}
              />
            </FormControl>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Checkbox
              label="I am currently working here"
              name="curr"
              checked={curr}
              onChange={handleCurrChange}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 🔹 Additional details */}
          <Box sx={{ display: "grid", gap: 2 }}>
            <FormControl>
              <FormLabel>Employment Type</FormLabel>
              <Autocomplete
                placeholder="Select a type"
                options={type}
                clearOnEscape
                autoHighlight
                sx={{ width: "100%" }}
                value={etype}
                onChange={(e, value) => setEtype(value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                minRows={4}
                placeholder="Describe your achievements, or experience"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </FormControl>
          </Box>

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
