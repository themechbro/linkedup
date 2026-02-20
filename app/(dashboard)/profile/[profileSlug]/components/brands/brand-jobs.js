"use client";

import { Box, CircularProgress } from "@mui/joy";
import { useState, useEffect, useRef, useCallback } from "react";
import BrandPostCard from "./brandPostCardprofile";
import JobsCarousel from "./jobCarousel";

export default function BrandJobPage({ profile }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch_brand_jobs_3?profileId=${profile?.userId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile?.userId) return;
    fetchJobs();
  }, [profile?.userId]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        p: 4,
      }}
    >
      <JobsCarousel jobs={jobs} />
    </Box>
  );
}
