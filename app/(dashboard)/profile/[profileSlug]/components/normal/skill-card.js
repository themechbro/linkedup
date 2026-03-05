"use client";

import { useState, useEffect } from "react";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

export default function SkillsSection({ profile }) {
  console.log(profile);

  const [expanded, setExpanded] = useState(false);
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    if (!profile?.userId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-skills?profileId=${profile.userId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();
      setSkills(data.skills || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const DISPLAY_LIMIT = 5;

  const visibleSkills = expanded ? skills : skills.slice(0, DISPLAY_LIMIT);

  useEffect(() => {
    if (profile?.userId) {
      fetchSkills();
    }
  }, [profile?.userId]);
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography level="h4" sx={{ fontFamily: "Roboto Condensed" }}>
          Skills
        </Typography>
      </Stack>

      {/* Fallback */}
      {skills.length === 0 ? (
        <Typography level="body-md" color="neutral">
          No skills added yet.
        </Typography>
      ) : (
        <>
          {/* Skills */}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {visibleSkills.map((skill) => (
              <Chip
                key={skill.skill_id}
                variant="soft"
                size="md"
                sx={{ fontFamily: "Roboto Condensed" }}
              >
                {skill.name}
              </Chip>
            ))}
          </Stack>

          {/* Show more */}
          {skills.length > DISPLAY_LIMIT && (
            <Button
              variant="plain"
              size="sm"
              sx={{ mt: 2, alignSelf: "flex-start" }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : `Show all ${skills.length} skills`}
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
