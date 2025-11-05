import { Snackbar, Alert } from "@mui/joy";

export default function SignupPageSnackbar({ open, close, message, color }) {
  return (
    <Snackbar
      autoHideDuration={4000}
      open={open}
      onClose={close}
      sx={{ mb: 2 }}
    >
      <Alert color={color}>{message}</Alert>
    </Snackbar>
  );
}
