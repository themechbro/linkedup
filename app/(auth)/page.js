import { Box, Button, Typography } from "@mui/joy";
import LandingNav from "./components/landing-nav";
import Image from "next/image";
import landingLogo from "@/public/assets/landingPage.png"; // Assuming this path is correct
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LinkedUpLandingPage() {
  return (
    <Box>
      <LandingNav />
      <Box
        component="main"
        sx={{
          minHeight: "calc(100vh - 64px)", // Adjust 64px to your LandingNav's height
          mt: "64px", // Offset content to be below the fixed nav
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          gap: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4, md: 10 },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            level="h1"
            sx={{
              fontFamily: "var(--font-roboto-condensed)",
              fontWeight: "bold",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)", // Responsive font size
              lineHeight: 1.2,
            }}
          >
            Find Jobs, Connections, and Insights to Grow Your Career
          </Typography>
          <Typography level="body-lg" textColor="text.secondary">
            Join a community of professionals. Discover opportunities, share
            your expertise, and build a network that lasts a lifetime.
          </Typography>
          <Button
            size="lg"
            endDecorator={<ArrowRight />}
            sx={{ mt: 2, alignSelf: "flex-start" }}
          >
            Get Started
          </Button>

          <Typography
            level="body-md"
            textColor="text.secondary"
            fontFamily="Roboto Condensed"
          >
            New to LinkedUp?{" "}
            <Link href="/sign-up" style={{ textDecoration: "underline" }}>
              Sign up
            </Link>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={landingLogo}
            alt="Landing Picture"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}
