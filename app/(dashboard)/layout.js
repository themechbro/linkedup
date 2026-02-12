import { Box } from "@mui/joy";
import { redirect } from "next/navigation";
import { fetchAuthData } from "../lib/fetchAuthData";
import HomeNavbar from "./components/home-navbar";
import MessagingProvider from "./components/chat/MessageProvider";
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
