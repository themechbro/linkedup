"use client";

import { Card, CardContent, Box, Typography, IconButton } from "@mui/joy";
import { Info, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAbout } from "../../lib/helpers";
import AboutMeModal from "../modals/about-modal";

export default function AboutCard({ profile, requestedBy, isLoading }) {
  const [fetchedAbout, setFetchedAbout] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const isOwnProfile =
    profile?.userId &&
    requestedBy?.meta?.user_id &&
    profile.userId === requestedBy.meta.user_id;
  useEffect(() => {
    if (!profile?.userId) return;

    const loadAbout = async () => {
      const data = await fetchAbout(profile.userId);
      setFetchedAbout(data);
    };

    loadAbout();
  }, [profile?.userId]);

  return (
    <>
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{ fontFamily: "Roboto Condensed", display: "flex", gap: 2 }}
              level="h3"
            >
              <Info size="30px" /> About me{" "}
            </Typography>
            {isOwnProfile && (
              <IconButton
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <Pencil />
              </IconButton>
            )}
          </Box>

          <Box>
            <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>
              {fetchedAbout?.about || "No about information added yet."}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Modal */}
      <AboutMeModal
        open={openModal}
        close={() => {
          setOpenModal(false);
        }}
        prevAbout={fetchedAbout?.about}
      />
    </>
  );
}
