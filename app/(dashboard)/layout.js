// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { Box } from "@mui/joy";
// async function fetchAuthData() {
//   const cookieStore = await cookies();

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/check_auth`,
//       {
//         method: "GET",
//         headers: {
//           Cookie: cookieStore.toString(),
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) {
//       return { isAuthenticated: false, user: null };
//     }

//     const data = await response.json();
//     return { isAuthenticated: data.isAuthenticated, user: data.user };
//   } catch (error) {
//     console.error("Auth check failed:", error);
//     return { isAuthenticated: false, user: null };
//   }
// }

// export default async function LinkedUpHomeLayout({ children }) {
//   const authData = await fetchAuthData();
//   if (!authData.isAuthenticated) {
//     redirect("/sign-in?error=notLoggedIn");
//   }
//   return (
//     <Box className="flex h-full w-full">
//       <main className="flex-1 overflow-y-auto">{children}</main>
//     </Box>
//   );
// }

import { Box } from "@mui/joy";
import { redirect } from "next/navigation";
import { fetchAuthData } from "../lib/fetchAuthData";
import HomeNavbar from "./components/home-navbar";

export default async function DashboardLayout({ children }) {
  const authData = await fetchAuthData();
  if (!authData.isAuthenticated) redirect("/sign-in?error=notLoggedIn");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HomeNavbar />
      <Box
        component="main"
        sx={{ flex: 1, overflowY: "auto", pt: { xs: "56px", md: "64px" } }}
      >
        {children}
      </Box>
    </Box>
  );
}
