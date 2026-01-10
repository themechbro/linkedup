"use client";
import { Box } from "@mui/joy";
import ProfileFirst from "./components/first-card";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewProfilePage({ params }) {
  const path = usePathname();
  const user_id = path.split("/")[2]?.trim();
  const [data, setData] = useState({});
  const [byWho, setByWho] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/profile/${user_id}`,
        { cache: "no-store" }
      );
      const whoRequested = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
        { method: "GET", credentials: "include" }
      );
      const profile = await res.json();
      const reqBy = await whoRequested.json();
      setData(profile);
      setByWho(reqBy);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
      <ProfileFirst profile={data} requestedBy={byWho} isLoading={loading} />
    </Box>
  );
}
