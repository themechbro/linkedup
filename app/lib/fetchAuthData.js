// import { cookies } from "next/headers";

// export async function fetchAuthData() {
//   const cookieStore = cookies();

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

//     if (!response.ok) return { isAuthenticated: false, user: null };
//     const data = await response.json();
//     return { isAuthenticated: data.isAuthenticated, user: data.user };
//   } catch (error) {
//     console.error("Auth check failed:", error);
//     return { isAuthenticated: false, user: null };
//   }
// }

import { cookies } from "next/headers";

export async function fetchAuthData() {
  const cookieStore = await cookies();

  // ✅ Properly extract .value
  const cookieHeader = Array.from(cookieStore)
    .map(([name, cookie]) => `${name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/check_auth`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) return { isAuthenticated: false, user: null };

    const data = await response.json();
    return { isAuthenticated: data.isAuthenticated, user: data.user };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}
