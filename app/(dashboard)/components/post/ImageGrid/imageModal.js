import { Modal, ModalDialog, IconButton, Box } from "@mui/joy";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "../player/videoPlayer";
import Image from "next/image";

export default function ImagegridModal({
  mediaViewer,
  closeMediaViewer,
  setMediaViewer,
  media,
}) {
  const mediaCount = media?.length || 0;
  const currentMedia = media?.[mediaViewer.currentIndex];

  const goToNext = () => {
    if (mediaCount === 0) return;
    setMediaViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % mediaCount,
    }));
  };

  const goToPrev = () => {
    if (mediaCount === 0) return;
    setMediaViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + mediaCount) % mediaCount,
    }));
  };

  return (
    <Modal
      open={mediaViewer.open}
      onClose={closeMediaViewer}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ModalDialog
        sx={{
          width: { xs: "95vw", sm: "90vw" },
          height: { xs: "85vh", sm: "90vh" },
          maxWidth: "1400px",
          maxHeight: "95vh",
          minWidth: 320,
          p: 0,
          bgcolor: "black",
          overflow: "hidden",
        }}
      >
        <IconButton
          onClick={closeMediaViewer}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
          }}
        >
          <X />
        </IconButton>

        {mediaCount > 1 && (
          <>
            <IconButton
              onClick={goToPrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                zIndex: 10,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentMedia?.type === "videos" ? (
            <VideoPlayer
              src={currentMedia.url}
              spriteSrc={currentMedia.sprite_url}
            />
          ) : currentMedia?.url ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={currentMedia.url}
                alt="media"
                fill
                sizes="100vw"
                style={{
                  objectFit: "contain",
                }}
                unoptimized
              />
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            bgcolor: "rgba(0,0,0,0.7)",
            px: 2,
            py: 1,
            borderRadius: "lg",
          }}
        >
          {mediaViewer.currentIndex + 1} / {mediaCount}
        </Box>
      </ModalDialog>
    </Modal>
  );
}
