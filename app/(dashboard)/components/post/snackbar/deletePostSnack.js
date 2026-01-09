import { Snackbar, Typography, Box } from "@mui/joy";
import { CheckCircle, XCircle } from "lucide-react";

export default function DeletePostSnackbar({ open, close, type }) {
  const isSuccess = type === "success";
  return (
    <Snackbar
      open={open}
      onClose={close}
      color={isSuccess ? "success" : "danger"}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        px: 2,
        py: 1.5,
        minWidth: 280,
        backdropFilter: "blur(6px)",
      }}
    >
      {" "}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <Typography level="body-md" sx={{ fontWeight: 500 }}>
          {isSuccess ? "Deleted this post Successfully" : "Failed to delete"}
        </Typography>
      </Box>
    </Snackbar>
  );
}
