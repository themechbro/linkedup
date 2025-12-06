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

export default function RepostViewerModal({ repostedPost, open, close }) {
  const originalMedia =
    repostedPost && typeof repostedPost.media_url === "string"
      ? JSON.parse(repostedPost.media_url)
      : repostedPost?.media_url || [];
  return (
    <Modal open={open} onClose={close}>
      <ModalDialog sx={{ overflowY: "scroll" }}>
        <ModalClose />
        <Card
          variant="soft"
          sx={{
            borderRadius: "lg",
            backgroundColor: "neutral.softBg",
            p: 2,
            my: 2,
            height: "auto",
          }}
        >
          {/* User Info */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Avatar
                src={
                  repostedPost?.profile_picture
                    ? `${process.env.NEXT_PUBLIC_HOST_IP}${repostedPost.profile_picture}`
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
                  {new Date(repostedPost.created_at).toLocaleString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                  ·{" "}
                  {repostedPost.status == "edited" ? repostedPost.status : null}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Original Post Content */}
          <Typography level="body-sm" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {renderContentWithHashtagsAndLinks(repostedPost.content)}
          </Typography>

          {/* Original Post Media */}
          {originalMedia.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gap: 0.5,
                mt: 2,
                borderRadius: "lg",
                overflow: "hidden",
                gridTemplateColumns:
                  originalMedia.length === 1
                    ? "1fr"
                    : originalMedia.length === 2
                    ? "1fr 1fr"
                    : originalMedia.length === 3
                    ? "repeat(2, 1fr)"
                    : originalMedia.length === 4
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
              }}
            >
              {originalMedia.slice(0, 5).map((m, i) => {
                const isVideo = m.type === "videos";
                const isLastItem = i === 4 && originalMedia.length > 5;
                const remainingCount = originalMedia.length - 5;

                return (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height:
                        originalMedia.length === 1
                          ? "400px"
                          : originalMedia.length === 2
                          ? "300px"
                          : "200px",
                      overflow: "hidden",
                      bgcolor: "black",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                      ...(originalMedia.length === 3 &&
                        i === 0 && {
                          gridColumn: "span 2",
                          height: "300px",
                        }),
                    }}
                    // onClick={() => openMediaViewer(i)}
                  >
                    {isLastItem ? (
                      <>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
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
                        src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                        }}
                      />
                    ) : (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
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
        </Card>
      </ModalDialog>
    </Modal>
  );
}
