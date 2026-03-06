import { Modal, ModalDialog, ModalClose, Typography, Box } from "@mui/joy";

export default function ProfilePictureViewer({
  openviewer,
  closeviewer,
  type,
  imgurl,
}) {
  return (
    <Modal open={openviewer} onClose={closeviewer}>
      <ModalDialog
        sx={{
          maxWidth: 800,
          width: "90vw",
        }}
      >
        <ModalClose />

        <Typography sx={{ mb: 2, fontFamily: "Roboto Condensed" }} level="h3">
          {type === "cover" ? "Cover Photo" : "Profile Picture"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "70vh",
            overflow: "hidden",
          }}
        >
          <img
            src={imgurl}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: type === "profile" ? "50%" : "8px",
            }}
          />
        </Box>
      </ModalDialog>
    </Modal>
  );
}
