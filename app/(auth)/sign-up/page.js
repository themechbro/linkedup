import { Box, Sheet, Typography } from "@mui/joy";
import LinkedUpSignupForm from "./sign-up-form";

export default function LinkedUpdSignupPage() {
  return (
    <Box sx={{ backgroundColor: "#F3F2F0", minHeight: "100vh" }}>
      <Box
        component="header"
        sx={{
          py: 2,
          px: { xs: 2, md: 4 },
          backgroundColor: "transparent",
        }}
      >
        <Typography
          level="h3"
          sx={{
            color: "#0b0829ff",
            fontFamily: "Roboto Condensed",
            fontWeight: "bold",
          }}
          component="a"
          href="/"
        >
          LinkedUp
        </Typography>
      </Box>
      <Box
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          px: 2,
          py: { xs: 2, md: 4 },
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: "520px",
            p: { xs: 2, md: 4 },
            borderRadius: "md",
            boxShadow: "md",
          }}
        >
          <Typography
            level="h2"
            component="h2"
            sx={{
              color: "#0b0829ff",
              fontFamily: "Roboto Condensed",
              fontWeight: "bold",
              textAlign: "center",
              mb: 3,
            }}
          >
            Make the most of your professional life
          </Typography>
          <LinkedUpSignupForm />
        </Sheet>
      </Box>
    </Box>
  );
}
