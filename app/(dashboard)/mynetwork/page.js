"use client";
import { Typography, Box } from "@mui/joy";
import { useState, useEffect } from "react";
import ProfileSuggestionCard from "./components/profilecardnetwork";
import { UserRoundCheck } from "lucide-react";

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

  if (suggestions.length == 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            p: 4,
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "neutral.200",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,247,250,0.9))",
            boxShadow: "sm",
          }}
        >
          <Box
            sx={{
              mx: "auto",
              mb: 2,
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.softBg",
              color: "primary.600",
            }}
          >
            <UserRoundCheck size={26} />
          </Box>

          <Typography level="title-md">You’re all caught up</Typography>

          <Typography level="body-sm" sx={{ color: "neutral.500", mt: 0.5 }}>
            You’ve connected with all users. Check back later for more.
          </Typography>
        </Box>
      </Box>
    );
  }

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
