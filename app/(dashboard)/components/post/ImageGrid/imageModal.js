import { Modal, ModalClose, ModalDialog, IconButton, Box } from "@mui/joy";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImagegridModal({
  mediaViewer,
  closeMediaViewer,
  setMediaViewer,
  media,
}) {
  const goToNext = () => {
    setMediaViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % media.length,
    }));
  };

  const goToPrev = () => {
    setMediaViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + media.length) % media.length,
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
          maxWidth: "90vw",
          maxHeight: "90vh",
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

        {media?.length > 1 && (
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
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {media[mediaViewer.currentIndex]?.type === "videos" ? (
            <video
              src={`${process.env.NEXT_PUBLIC_HOST_IP}${
                media[mediaViewer.currentIndex].url
              }`}
              controls
              autoPlay
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={`${process.env.NEXT_PUBLIC_HOST_IP}${
                media[mediaViewer.currentIndex]?.url
              }`}
              alt="media"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
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
          {mediaViewer.currentIndex + 1} / {media.length}
        </Box>
      </ModalDialog>
    </Modal>
  );
}
