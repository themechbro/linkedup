"use client";

import { Card, CardContent, Box, Typography } from "@mui/joy";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAbout } from "../lib/helpers";
export default function AboutCard({ profile, requestedBy, isLoading }) {
  const [fetchedAbout, setFetchedAbout] = useState(null);

  useEffect(() => {
    if (!profile?.userId) return;

    const loadAbout = async () => {
      const data = await fetchAbout(profile.userId);
      setFetchedAbout(data);
    };

    loadAbout();
  }, [profile?.userId]);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 900,
        borderRadius: 20,
        overflow: "hidden",
        mx: "auto",
        p: 0,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box>
          <Typography
            sx={{ fontFamily: "Roboto Condensed", display: "flex", gap: 2 }}
            level="h3"
          >
            <Info size="30px" /> About me
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ mt: 2 }}>
            {fetchedAbout?.about || "No about information added yet."}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
