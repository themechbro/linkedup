import {
  Modal,
  ModalClose,
  ModalDialog,
  Box,
  Typography,
  Card,
  Avatar,
} from "@mui/joy";
import Image from "next/image";
import { renderContentWithHashtagsAndLinks } from "../lib/helpers";
import ImagegridModal from "../ImageGrid/imageModal";
import { useState } from "react";

export default function RepostViewerModal({ repostedPost, open, close }) {
  const [mediaViewer, setMediaViewer] = useState({
    open: false,
    currentIndex: 0,
  });
  const privateMediaHosts = (
    process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS ||
    "blr1.kos.olakrutrimsvc.com"
  )
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const resolveAssetUrl = (url) => {
    if (!url) return "";

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
  const openMediaViewer = (index) => {
    setMediaViewer({ open: true, currentIndex: index });
  };

  const closeMediaViewer = () => {
    setMediaViewer({ open: false, currentIndex: 0 });
  };
  let originalMedia = [];
  try {
    originalMedia =
      repostedPost && typeof repostedPost.media_url === "string"
        ? JSON.parse(repostedPost.media_url)
        : repostedPost?.media_url || [];
  } catch {
    originalMedia = [];
  }
  const normalizedOriginalMedia = originalMedia.map((m) => ({
    ...m,
    url: resolveAssetUrl(m?.url),
    sprite_url: resolveAssetUrl(m?.sprite_url),
  }));
  return (
    <>
      <Modal open={open} onClose={close}>
        <ModalDialog
          sx={{
            overflowY: "scroll",
            width: originalMedia.length > 0 ? 1200 : "auto",
          }}
        >
          <ModalClose />
          <Card
            variant="soft"
            sx={{
              borderRadius: "lg",
              backgroundColor: "neutral.softBg",
              p: 2,
              my: 2,
              height: "auto",
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box sx={{ width: 400 }}>
              {/* User Info */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Avatar
                    src={
                      repostedPost?.profile_picture
                        ? resolveAssetUrl(repostedPost.profile_picture)
                        : "/default.img"
                    }
                  />
                  <Box>
                    <Typography
                      level="title-md"
                      onClick={() => redirect(`/profile/${repostedPost.owner}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      {repostedPost.full_name}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      @{repostedPost.username} ·{" "}
                      {new Date(repostedPost.created_at).toLocaleString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        }
                      )}{" "}
                      ·{" "}
                      {repostedPost.status == "edited"
                        ? repostedPost.status
                        : null}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Original Post Content */}
              <Typography
                level="body-sm"
                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
              >
                {renderContentWithHashtagsAndLinks(repostedPost.content)}
              </Typography>
            </Box>

            {/* Media */}
            {normalizedOriginalMedia.length > 0 ? (
              <Box sx={{ width: 700 }}>
                {/* Original Post Media */}
                {normalizedOriginalMedia.length > 0 && (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 0.5,
                      mt: 2,
                      borderRadius: "lg",
                      overflow: "hidden",
                      gridTemplateColumns:
                        normalizedOriginalMedia.length === 1
                          ? "1fr"
                          : normalizedOriginalMedia.length === 2
                          ? "1fr 1fr"
                          : normalizedOriginalMedia.length === 3
                          ? "repeat(2, 1fr)"
                          : normalizedOriginalMedia.length === 4
                          ? "repeat(2, 1fr)"
                          : "repeat(3, 1fr)",
                    }}
                  >
                    {normalizedOriginalMedia.slice(0, 5).map((m, i) => {
                      const isVideo = m.type === "videos";
                      const isLastItem =
                        i === 4 && normalizedOriginalMedia.length > 5;
                      const remainingCount = normalizedOriginalMedia.length - 5;

                      return (
                        <Box
                          key={i}
                          sx={{
                            position: "relative",
                            width: "100%",
                            height:
                              normalizedOriginalMedia.length === 1
                                ? "400px"
                                : normalizedOriginalMedia.length === 2
                                ? "300px"
                                : "200px",
                            overflow: "hidden",
                            bgcolor: "black",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                            },
                            ...(normalizedOriginalMedia.length === 3 &&
                              i === 0 && {
                                gridColumn: "span 2",
                                height: "300px",
                              }),
                          }}
                          onClick={() => openMediaViewer(i)}
                        >
                          {isLastItem ? (
                            <>
                              <Image
                                src={m.url}
                                alt="post media"
                                fill
                                style={{
                                  objectFit: "cover",
                                  filter: "brightness(0.4)",
                                }}
                                unoptimized
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  color: "white",
                                  fontSize: "2rem",
                                  fontWeight: "bold",
                                  zIndex: 1,
                                }}
                              >
                                +{remainingCount}
                              </Box>
                            </>
                          ) : isVideo ? (
                            <video
                              src={m.url}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                pointerEvents: "none",
                              }}
                            />
                          ) : (
                            <Image
                              src={m.url}
                              alt="post media"
                              fill
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            ) : null}
          </Card>
        </ModalDialog>
      </Modal>

      <ImagegridModal
        mediaViewer={mediaViewer}
        closeMediaViewer={closeMediaViewer}
        setMediaViewer={setMediaViewer}
        media={normalizedOriginalMedia}
      />
    </>
  );
}
