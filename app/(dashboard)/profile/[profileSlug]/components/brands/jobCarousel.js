"use client";

import { useState } from "react";
import { Box, Typography, Card, Button } from "@mui/joy";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/navigation";

export default function JobsCarousel({ jobs }) {
  const [showViewMore, setShowViewMore] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    setShowViewMore(true);
  };

  const handleViewMore = () => {
    router.push("/jobs"); // change to your jobs page route
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography level="h4">Recommended jobs for you</Typography>

          <Typography level="body-sm" sx={{ color: "neutral.500" }}>
            Based on your Profile information
          </Typography>
        </Box>

        {!showViewMore ? (
          <Button
            size="sm"
            variant="plain"
            endDecorator={<KeyboardArrowRight />}
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button size="sm" variant="solid" onClick={handleViewMore}>
            View more jobs
          </Button>
        )}
      </Box>

      {/* Jobs */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        {jobs.map((job) => (
          <Card
            key={job.jobId}
            sx={{
              width: 300,
              cursor: "pointer",
              "&:hover": {
                boxShadow: "md",
              },
            }}
          >
            {/* Logo */}
            <Box
              component="img"
              src={`${process.env.NEXT_PUBLIC_HOST_IP}${job.profilePicture}`}
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                mb: 1,
              }}
            />

            {/* Title */}
            <Typography level="title-md">{job.title}</Typography>

            {/* Company */}
            <Typography level="body-sm">{job.company}</Typography>

            {/* Location */}
            <Typography level="body-sm" sx={{ color: "neutral.500" }}>
              {job.location}
            </Typography>

            {/* Time */}
            <Typography level="body-xs" sx={{ mt: 1 }}>
              {getTimeAgo(job.createdAt)}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

function getTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}
