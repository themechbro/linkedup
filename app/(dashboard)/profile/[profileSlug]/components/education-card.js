"use client";

import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
} from "@mui/joy";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEdu } from "../lib/helpers";
import EducationModal from "./modals/normal/education-modal";

export default function EducationCard({ profile }) {
  const [fetchedEdu, setFetchedEdu] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!profile?.userId) return;

    const loadEdu = async () => {
      const data = await fetchEdu(profile.userId);
      setFetchedEdu(data);
    };

    loadEdu();
  }, [profile?.userId]);

  const educationList = fetchedEdu?.education || [];

  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 20,
          mx: "auto",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              level="h3"
              sx={{ fontFamily: "Roboto Condensed", display: "flex", gap: 2 }}
            >
              <BriefcaseBusiness size={30} /> Education
            </Typography>

            <IconButton onClick={() => setOpenModal(true)}>
              <Plus />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ mt: 2 }}>
            {educationList.length === 0 && (
              <Typography level="body-md" color="neutral.500">
                No education details added yet.
              </Typography>
            )}

            {educationList.map((edu, index) => (
              <Box key={edu.education_id}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* School Logo Placeholder */}
                  <Avatar
                    size="lg"
                    sx={{
                      bgcolor: "neutral.200",
                      color: "neutral.700",
                      fontWeight: 600,
                    }}
                  >
                    {edu.school_name?.[0]}
                  </Avatar>

                  {/* Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-md">{edu.school_name}</Typography>

                    <Typography level="body-md">
                      {edu.degree}
                      {edu.field_of_study ? ` · ${edu.field_of_study}` : ""}
                    </Typography>

                    <Typography level="body-sm" color="neutral.500">
                      {formatDate(edu.start_date)} –{" "}
                      {edu.currently_studying
                        ? "Present"
                        : formatDate(edu.end_date)}
                    </Typography>

                    {edu.grade && (
                      <Typography level="body-sm" sx={{ mt: 0.5 }}>
                        <strong>Grade:</strong> {edu.grade}
                      </Typography>
                    )}

                    {edu.activities && (
                      <Typography level="body-sm" sx={{ mt: 0.5 }}>
                        <strong>Activities:</strong> {edu.activities}
                      </Typography>
                    )}

                    {edu.description && (
                      <Typography level="body-sm" sx={{ mt: 0.5 }}>
                        {edu.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Divider */}
                {index !== educationList.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Education Modal goes here */}
      <EducationModal
        open={openModal}
        close={() => {
          setOpenModal(false);
        }}
      />
    </>
  );
}

/* ----------------------------- */
/* Helpers                       */
/* ----------------------------- */
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
