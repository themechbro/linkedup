// import { Box, Typography } from "@mui/joy";
// import ProfileFirst from "./components/first-card";

// export default function ViewProfilePage() {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         paddingX: 10,
//         paddingTop: 3,
//         backgroundColor: "#F4F2EE",
//       }}
//     >
//       <ProfileFirst />
//     </Box>
//   );
// }
"use client";
import { Box } from "@mui/joy";
import ProfileFirst from "./components/first-card";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewProfilePage({ params }) {
  const path = usePathname();
  const user_id = path.split("/")[2]?.trim();
  const [data, setData] = useState({});

  const fetchProfileDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/profile/${user_id}`,
        { cache: "no-store" }
      );
      const profile = await res.json();
      setData(profile);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfileDetails();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        paddingX: 10,
        paddingTop: 3,
        backgroundColor: "#F4F2EE",
      }}
    >
      <ProfileFirst profile={data} />
    </Box>
  );
}
