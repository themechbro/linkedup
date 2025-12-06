"use client";
import { Typography, Box } from "@mui/joy";
import { useState, useEffect } from "react";
import ProfileSuggestionCard from "./components/profilecardnetwork";

export default function MyNetworkPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/suggestions?limit=10&offset=0`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const profile = [
    { name: "Gaurav Goel", headline: "AMazon | Microsoft" },
    { name: "Mrigakshi Saha", headline: "Engineering @GoldmanSachs" },
    { name: "Sanket Prasad", headline: "Consultant at deloitte" },
    { name: "Gaurav Goel", headline: "AMazon | Microsoft" },
    { name: "Mrigakshi Saha", headline: "Engineering @GoldmanSachs" },
    { name: "Sanket Prasad", headline: "Consultant at deloitte" },
    { name: "Gaurav Goel", headline: "AMazon | Microsoft" },
    { name: "Mrigakshi Saha", headline: "Engineering @GoldmanSachs" },
    { name: "Sanket Prasad", headline: "Consultant at deloitte" },
  ];
  return (
    // <Box component="main" sx={{ px: { xs: 2, md: 4 } }}>
    //   <Typography level="h2" sx={{ fontFamily: "Roboto Condensed", mb: 2 }}>
    //     Grow your network
    //   </Typography>

    //   <Box
    //     sx={{
    //       display: "flex",
    //       flexWrap: "wrap",
    //       gap: 2,
    //       overflowX: "auto",
    //       overflowY: "hidden",
    //       px: 5,
    //       pb: 2,
    //       scrollSnapType: "x mandatory",
    //       "&::-webkit-scrollbar": {
    //         display: "none",
    //       },
    //     }}
    //   >
    //     {suggestions?.map((item, index) => (
    //       <Box
    //         key={index}
    //         sx={{
    //           scrollSnapAlign: "start",
    //           flex: "0 0 auto",
    //         }}
    //       >
    //         <ProfileCardNetwork profile={item} onSuccess={fetchSuggestions} />
    //       </Box>
    //     ))}
    //   </Box>
    // </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 2,
        p: 2,
      }}
    >
      {suggestions.map((profile) => (
        <ProfileSuggestionCard
          key={profile.user_id}
          profile={profile}
          onConnect={(userId) => {
            console.log("Connected to:", userId);
            // Optionally remove from suggestions
          }}
          onReject={(userId) => {
            // Remove from suggestions list
            setSuggestions((prev) => prev.filter((p) => p.user_id !== userId));
          }}
        />
      ))}
    </Box>
  );
}
