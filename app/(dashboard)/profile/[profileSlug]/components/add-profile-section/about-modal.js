import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Box,
  Textarea,
  Button,
} from "@mui/joy";

export default function AboutMeModal({ open, close }) {
  return (
    <Modal open={open} onClose={close}>
      <ModalDialog
        sx={{
          width: { xs: "95%", sm: 700 },
          maxHeight: "90vh",
          overflow: "auto",
          p: 0,
        }}
      >
        <ModalClose />

        {/* 🔹 Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.body",
            zIndex: 1,
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography level="h4" fontWeight={600}>
            About Me
          </Typography>
        </Box>

        <Box component="form" sx={{ px: 3, py: 2 }}>
          <Textarea
            name="about"
            minRows={5}
            placeholder="Add something about yourself......"
          />

          {/* 🔹 Footer */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.body",
              borderTop: "1px solid",
              borderColor: "divider",
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button variant="plain" onClick={close}>
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
