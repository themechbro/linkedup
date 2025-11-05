// import { Box } from "@mui/joy";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

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

// export default async function AuthLayout({ children }) {
//   const authData = await fetchAuthData();
//   if (authData.isAuthenticated) {
//     redirect("/home");
//   }
//   return (
//     <Box
//       className="h-screen w-full"
//       sx={{
//         background: "linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)",
//         position: "relative", // Establish a stacking context for the layout
//       }}
//     >
//       {" "}
//       <Box sx={{ position: "relative", zIndex: 10 }}>{children}</Box>
//     </Box>
//   );
// }
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { Box } from "@mui/joy";
import { redirect } from "next/navigation";
import { fetchAuthData } from "../lib/fetchAuthData";
export default async function AuthLayout({ children }) {
  const authData = await fetchAuthData();
  if (authData.isAuthenticated) redirect("/home");

  return (
    <Box
      className="h-screen w-full"
      sx={{
        background: "linear-gradient(135deg, #fff 0%, #fff 100%)",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 10 }}>{children}</Box>
    </Box>
  );
}
