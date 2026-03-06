"use client";
import {
  Modal,
  ModalDialog,
  Typography,
  Box,
  ModalClose,
  Textarea,
  Tooltip,
  IconButton,
  Button,
  Avatar,
  FormControl,
} from "@mui/joy";
import { Image, Video, Send, Smile } from "lucide-react";

export default function PostModal({
  open,
  setOpen,
  content,
  setContent,
  media,
  handleFileChange,
  handlePost,
  loading,
  currentUser,
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

  const resolvedProfileUrl = currentUser?.profile_picture
    ? resolveAssetUrl(currentUser.profile_picture)
    : profileUrl || "/default-avatar.png";

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{
          maxWidth: 600,
          width: "90%",
          borderRadius: "lg",
          boxShadow: "lg",
          p: 2,
          overflowY: "auto",
        }}
      >
        <ModalClose />
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar size="lg" src={resolvedProfileUrl} />
          <Box sx={{ ml: 1 }}>
            <Typography level="title-md">
              {currentUser?.full_name || "User"}
            </Typography>
            <Typography level="body-sm" textColor="neutral.500">
              Post to anyone
            </Typography>
          </Box>
        </Box>

        <FormControl required>
          <Textarea
            minRows={5}
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
        </FormControl>

        {/* Media preview */}
        {media.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            {media.map((file, i) => (
              <Box key={i} sx={{ width: 100, position: "relative" }}>
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                    }}
                    controls
                  />
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Upload & Post buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Hidden inputs */}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              id="image-upload"
              onChange={(e) => handleFileChange(e, "image")}
            />
            <input
              type="file"
              accept="video/*"
              multiple
              hidden
              id="video-upload"
              onChange={(e) => handleFileChange(e, "video")}
            />

            <Tooltip title="Add photo">
              <label htmlFor="image-upload">
                <IconButton component="span">
                  <Image color="#0a66c2" />
                </IconButton>
              </label>
            </Tooltip>

            <Tooltip title="Add video">
              <label htmlFor="video-upload">
                <IconButton component="span">
                  <Video color="#f8712e" />
                </IconButton>
              </label>
            </Tooltip>

            <Tooltip title="Add emoji">
              <IconButton>
                <Smile color="#915eff" />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            onClick={handlePost}
            disabled={loading}
            sx={{
              borderRadius: "50px",
              px: 3,
              bgcolor: "#0a66c2",
              color: "#fff",
              "&:hover": { bgcolor: "#004182" },
            }}
            startDecorator={<Send size={18} />}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
