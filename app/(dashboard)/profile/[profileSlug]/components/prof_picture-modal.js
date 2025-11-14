import {
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  IconButton,
} from "@mui/joy";
import { Camera, Trash } from "lucide-react";
import Image from "next/image";

export default function ProfilePictureModal({ open, close, type, imgUrl }) {
  return (
    <Modal open={open} onClose={close}>
      <ModalDialog sx={{ width: 600, height: 500 }}>
        <ModalClose />
        <Box>
          <Typography sx={{ mb: 3, fontFamily: "Roboto Condensed" }}>
            {type == "cover" ? "Cover Photo" : null}
            {type == "profile" ? "Profile Picture" : null}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Image
              src={imgUrl}
              alt="preview"
              width={100}
              height={100}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Box className="buttons">
            <IconButton>
              <Camera />
            </IconButton>
            <IconButton>
              <Trash />
            </IconButton>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
