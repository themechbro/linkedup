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
import { fetchWork } from "../../lib/helpers";
import PositionModal from "../modals/normal/position-modal";

export default function WorkCard({ profile, requestedBy }) {
  const [fetchedWork, setFetchedWork] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!profile?.userId) return;

    const loadWork = async () => {
      const data = await fetchWork(profile.userId);
      setFetchedWork(data);
    };

    loadWork();
  }, [profile?.userId]);

  const workList = fetchedWork?.work || [];
  const isOwnProfile =
    profile?.userId &&
    requestedBy?.meta?.user_id &&
    profile.userId === requestedBy.meta.user_id;

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
              <BriefcaseBusiness size={30} /> Work Experience
            </Typography>

            {isOwnProfile && (
              <IconButton onClick={() => setOpenModal(true)}>
                <Plus />
              </IconButton>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ mt: 2 }}>
            {workList.length === 0 && (
              <Typography level="body-md" color="neutral.500">
                No Work details added yet.
              </Typography>
            )}

            {workList.map((work, index) => (
              <Box key={work.work_id}>
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
                    {work.company?.[0]}
                  </Avatar>

                  {/* Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-md">{work.company}</Typography>

                    <Typography level="body-md">
                      {work.title}
                      {work.type}
                    </Typography>

                    <Typography level="body-sm" color="neutral.500">
                      {formatDate(work.start_date)} –{" "}
                      {work.currently_working
                        ? "Present"
                        : formatDate(work.end_date)}
                    </Typography>

                    {work.description && (
                      <Typography level="body-sm" sx={{ mt: 0.5 }}>
                        {work.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Divider */}
                {index !== workList.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Education Modal goes here */}
      <PositionModal
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
