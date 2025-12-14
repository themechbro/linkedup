"use client";
import { Card, CardContent, Typography, Box, Avatar, Button } from "@mui/joy";
import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
export default function RightSideOfJobs({ selectedJob }) {
  const router = useRouter();

  const handleApply = async (job_id, link) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/jobs_micro/jobApplyCount/${job_id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) router.push(link);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Avatar
            src={`${process.env.NEXT_PUBLIC_HOST_IP}${selectedJob.posted_by_pic}`}
          />{" "}
          <Typography
            level="title-sm"
            sx={{ mt: 0.5, fontFamily: "Roboto Condensed" }}
          >
            {selectedJob.company}
          </Typography>
        </Box>

        <Typography level="h2" sx={{ fontFamily: "Roboto Condensed" }}>
          {selectedJob.title}
        </Typography>
        <Typography
          level="body-sm"
          sx={{ mt: 1, color: "neutral.500", fontFamily: "Roboto Condensed" }}
        >
          Posted by {selectedJob.posted_by_name}
        </Typography>
        <Typography
          level="body-sm"
          sx={{ color: "neutral.600", mt: 0.5, fontFamily: "Roboto Condensed" }}
        >
          {selectedJob.location} • {selectedJob.job_type} •{" "}
          {selectedJob.apply_count > 100
            ? `Over ${selectedJob.apply_count} people clicked apply`
            : `${selectedJob.apply_count} people clicked apply`}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography level="title-lg" sx={{ fontFamily: "Roboto Condensed" }}>
            Job description
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              whiteSpace: "pre-line",
              mt: 1,
              fontFamily: "Roboto Condensed",
            }}
          >
            {selectedJob.description}
          </Typography>
        </Box>

        {selectedJob.applylink ? (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="solid"
              sx={{ fontFamily: "Roboto Condensed", gap: 1 }}
              onClick={() => {
                handleApply(selectedJob.id, selectedJob.applylink);
              }}
              startDecorator={<SquareArrowOutUpRight />}
            >
              Apply
            </Button>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
