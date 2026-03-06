"use client";
import {
  Modal,
  ModalDialog,
  Typography,
  Box,
  ModalClose,
  Textarea,
  Button,
  Chip,
  Avatar,
  FormControl,
  Input,
  FormLabel,
  Stack,
} from "@mui/joy";
import { useState } from "react";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
];

export default function PostJobModal({
  open,
  close,
  currentUser,
  refreshJobs,
  profileUrl,
}) {
  const privateMediaHosts = (
    process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS ||
    "blr1.kos.olakrutrimsvc.com"
  )
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const resolveAssetUrl = (url) => {
    if (!url) return "";
    if (/^\/api\/private-media\?url=/i.test(url)) return url;

    if (/^(https?:)?\/\//i.test(url)) {
      try {
        const parsed = new URL(url);
        if (privateMediaHosts.includes(parsed.hostname.toLowerCase())) {
          return `/api/private-media?url=${encodeURIComponent(url)}`;
        }
      } catch {
        return url;
      }
      return url;
    }

    const base = process.env.NEXT_PUBLIC_HOST_IP || "";
    if (!base) return url;

    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${normalizedBase}${normalizedPath}`;
  };

  const resolvedProfileUrl = currentUser?.userData?.profile_picture
    ? resolveAssetUrl(currentUser.userData.profile_picture)
    : profileUrl || "/default-avatar.png";

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [applyLink, setApplyLink] = useState("");

  const handlePost = async () => {
    const isBrand = currentUser?.userData?.isbrand;

    const finalCompany = isBrand ? currentUser.userData.full_name : company;

    if (!title || !finalCompany) return;

    const jobData = {
      title,
      company: finalCompany,
      location,
      job_type: jobType,
      description,
      is_brand: isBrand,
      applyLink,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_IP}/api/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for session cookies
        body: JSON.stringify(jobData),
      });

      if (!res.ok) {
        console.error(await res.json());
        return;
      }

      // Success → refresh parent job list
      refreshJobs?.();

      close();

      // Reset fields
      setTitle("");
      setCompany("");
      setLocation("");
      setJobType("");
      setDescription("");
      setApplyLink("");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <Modal open={open} onClose={close}>
      <ModalDialog
        sx={{ width: 550, p: 3, height: "auto", overflowY: "scroll" }}
      >
        <ModalClose />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar size="lg" src={resolvedProfileUrl} />
          <Box sx={{ ml: 1 }}>
            <Typography level="title-md">
              {currentUser?.userData?.full_name}
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.500" }}>
              Posting a job
            </Typography>
          </Box>
        </Box>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Job Title *</FormLabel>
          <Input
            placeholder="e.g., Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Company *</FormLabel>

          {currentUser?.userData?.isbrand ? (
            <Input value={currentUser.userData.full_name} disabled />
          ) : (
            <Input
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          )}
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Location</FormLabel>
          <Input
            placeholder="e.g., Remote, Bengaluru"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormControl>

        <FormLabel>Job Type</FormLabel>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {JOB_TYPES.map((type) => (
            <Chip
              key={type}
              variant={jobType === type ? "solid" : "outlined"}
              color="primary"
              onClick={() => setJobType(type)}
              sx={{ cursor: "pointer" }}
            >
              {type}
            </Chip>
          ))}
        </Stack>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Description</FormLabel>
          <Textarea
            minRows={4}
            placeholder="Describe the role..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Apply Link</FormLabel>
          <Textarea
            placeholder="Copy Paste the Job Link"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
          />
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="plain" onClick={close}>
            Cancel
          </Button>

          <Button
            variant="solid"
            color="primary"
            onClick={handlePost}
            disabled={!title}
          >
            Post Job
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
