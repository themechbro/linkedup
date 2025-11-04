import { Box } from "@mui/joy";
export default function AuthLayout({ children }) {
  return (
    <Box
      className="h-screen w-full"
      sx={{
        background: "linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)",
        position: "relative", // Establish a stacking context for the layout
      }}
    >
      {" "}
      <Box sx={{ position: "relative", zIndex: 10 }}>{children}</Box>
    </Box>
  );
}
