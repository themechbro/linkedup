import { Modal, ModalDialog, ModalClose, Box, Typography } from "@mui/joy";

export default function ProfilePictureViewer({
  openviewer,
  closeviewer,
  type,
  imgurl,
}) {
  return (
    <Modal open={openviewer} onClose={closeviewer}>
      <ModalDialog>
        <ModalClose />
        <Typography sx={{ mb: 3, fontFamily: "Roboto Condensed" }} level="h3">
          {type === "cover" ? "Cover Photo" : "Profile Picture"}
        </Typography>

        <img src={imgurl} alt="preview" style={{ objectFit: "contain" }} />
      </ModalDialog>
    </Modal>
  );
}
