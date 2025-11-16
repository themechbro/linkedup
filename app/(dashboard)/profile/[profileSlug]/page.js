import { Box, Typography } from "@mui/joy";
import ProfileFirst from "./components/first-card";

export default function ViewProfilePage() {
  return (
    <Box
      sx={{
        width: "100%",
        paddingX: 10,
        paddingTop: 3,
        backgroundColor: "#F4F2EE",
      }}
    >
      <ProfileFirst />
    </Box>
  );
}
