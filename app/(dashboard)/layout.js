import { Box } from "@mui/joy";
import { redirect } from "next/navigation";
import { fetchAuthData } from "../lib/fetchAuthData";
import HomeNavbar from "./components/home-navbar";
import MessagingProvider from "./components/chat/MessageProvider";

const siteTitle = "Home";
const siteUrl = "http://localhost:3000/home";
const siteDescription =
  "LinkedUp is a production-grade LinkedIn-style platform built with a Node.js gateway, Spring Boot microservices, PostgreSQL, Redis, and object storage for scalable social interactions and media delivery. It's Free and Always will be. Developed by Adrin T paul";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | LinkedUp",
  },
  description: siteDescription,
  keywords: [
    "LinkedUp",
    "Clone of Linkedin",
    "Developed by Adrin",
    "Adrin T Paul",
    "Its Free and always will be",
    "Made in India",
    "Linkedin Clone called LinkedUp",
    "Scalable System Design Engineer",
    "Adrin T Paul",
    "Adrin Paul",
    "Adrin",
  ],
  applicationName: "LinkedUp",
  authors: [{ name: "Adrin T Paul", url: siteUrl }],
  creator: "Adrin T Paul",
  publisher: "Adrin T Paul",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function DashboardLayout({ children }) {
  const authData = await fetchAuthData();
  const currentUser = authData.user;
  if (!authData.isAuthenticated) redirect("/sign-in?error=notLoggedIn");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HomeNavbar />
      <Box
        component="main"
        sx={{ flex: 1, overflowY: "auto", pt: { xs: "56px", md: "64px" } }}
      >
        {children}
        <MessagingProvider currentUser={currentUser} />
      </Box>
    </Box>
  );
}
