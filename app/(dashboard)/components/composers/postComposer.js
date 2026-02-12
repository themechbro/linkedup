"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Avatar,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Textarea,
  Button,
  IconButton,
  Tooltip,
} from "@mui/joy";
import { Image, Video, FileText, Send, Smile } from "lucide-react";
import PostModal from "./postModal";
import PostJobModal from "./postJobModal";

export default function PostComposer({ currentUser, onSucess, otherUserData }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");
  const [jobModal, setJobModal] = useState(false);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setMedia(files);
    setMediaType(type);
  };

  const handlePost = async () => {
    if (!content.trim() && media.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    media.forEach((file) => formData.append("media", file));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_IP}/api/posts`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setContent("");
        setMedia([]);
        setOpen(false);
        onSucess(data.post);
      }
    } catch (err) {
      console.error("Error posting:", err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const urlbuilder = () => {
    if (currentUser.profile_picture) {
      setFinalUrl(
        `${process.env.NEXT_PUBLIC_HOST_IP}${currentUser.profile_picture}`,
      );
    }
  };

  useEffect(() => {
    urlbuilder();
  }, [urlbuilder]);

  return (
    <>
      {/* =========== COLLAPSED POST CARD =========== */}
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          borderRadius: "xl",
          mb: 2,
          cursor: "pointer",
          "&:hover": { boxShadow: "md" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
          <Avatar size="lg" src={finalUrl} sx={{ cursor: "pointer" }} />
          <Box
            sx={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "50px",
              py: 1,
              px: 2,
              color: "#555",
            }}
            onClick={() => setOpen(true)}
          >
            Start a post
          </Box>
        </Box>

        {/* Action buttons (Media / Job / Article) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: -1,
            mb: 2,
          }}
        >
          <Tooltip title="Add image">
            <IconButton color="neutral" onClick={() => setOpen(true)}>
              <Image color="#0a66c2" />
              <Typography level="body-sm" sx={{ ml: 1 }}>
                Media
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="Post job">
            <IconButton color="neutral" onClick={() => setJobModal(true)}>
              <FileText color="#915eff" />
              <Typography level="body-sm" sx={{ ml: 1 }}>
                Job
              </Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title="Write article">
            <IconButton color="neutral" onClick={() => setOpen(true)}>
              <FileText color="#f8712e" />
              <Typography level="body-sm" sx={{ ml: 1 }}>
                Write article
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Card>

      {/* =========== POST MODAL =========== */}
      <PostModal
        open={open}
        setOpen={setOpen}
        content={content}
        setContent={setContent}
        media={media}
        handleFileChange={handleFileChange}
        handlePost={handlePost}
        loading={loading}
        currentUser={currentUser}
        profileUrl={finalUrl}
      />

      {/* Post Job Modal */}
      <PostJobModal
        open={jobModal}
        close={() => {
          setJobModal(false);
        }}
        currentUser={otherUserData}
        profileUrl={finalUrl}
      />
    </>
  );
}
