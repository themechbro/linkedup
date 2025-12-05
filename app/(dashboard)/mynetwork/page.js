"use client";
import { Typography, Box } from "@mui/joy";
import ProfileCardNetwork from "./components/profilecardnetwork";
import { useState, useEffect } from "react";

export default function MyNetworkPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    <Box component="main" sx={{ px: { xs: 2, md: 4 } }}>
      <Typography level="h2" sx={{ fontFamily: "Roboto Condensed", mb: 2 }}>
        Grow your network
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden",
          px: 5,
          pb: 2,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {suggestions?.map((item, index) => (
          <Box
            key={index}
            sx={{
              scrollSnapAlign: "start",
              flex: "0 0 auto",
            }}
          >
            <ProfileCardNetwork profile={item} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
