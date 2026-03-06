"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/joy";
import RightSideOfJobs from "./components/rightSideJob";

export default function JobsPage() {
  const LIMIT = 10;

  const [jobs, setJobs] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const isFetchingRef = useRef(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const jobsListRef = useRef(null);

  // Fetch jobs
  const fetchJobs = async (offset) => {
    console.log(
      "🔍 Fetching jobs - Offset:",
      offset,
      "Current jobs:",
      jobs.length,
    );

    if (isFetchingRef.current) {
      console.log("⚠️ Already fetching, skipping...");
      return;
    }

    isFetchingRef.current = true;

    if (offset === 0) setLoadingInitial(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/jobs?limit=${LIMIT}&offset=${offset}`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();

      setJobs((prev) => {
        if (offset === 0) {
          return data.jobs; // Fresh load
        }

        // Deduplication
        const existingIds = new Set(prev.map((j) => j.id));
        const uniqueNew = data.jobs.filter((j) => !existingIds.has(j.id));

        if (uniqueNew.length === 0) {
          return prev;
        }

        return [...prev, ...uniqueNew];
      });

      // Check if there are more jobs
      if (data.jobs.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
      if (offset === 0) setLoadingInitial(false);
      else setLoadingMore(false);
    }
  };

  // Load first page
  useEffect(() => {
    fetchJobs(0);
  }, []);

  // Intersection Observer
  const initiateObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isFetchingRef.current &&
          hasMore &&
          !loadingMore &&
          !loadingInitial &&
          jobs.length > 0
        ) {
          fetchJobs(jobs.length);
        }
      },
      {
        root: jobsListRef.current,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [jobs.length, hasMore, loadingInitial, loadingMore]);

  useEffect(() => {
    initiateObserver();
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [initiateObserver]);

  // Auto-select first job on initial load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  if (loadingInitial) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography level="h4">No jobs available</Typography>
        <Typography level="body-md" sx={{ color: "neutral.500", mt: 1 }}>
          Check back later for new opportunities
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "420px 1fr" },
        gap: 2,
        maxWidth: 1200,
        mx: "auto",
        mt: 3,
        px: 2,
      }}
    >
      {/* LEFT – JOB LIST with Infinite Scroll */}
      <Box
        ref={jobsListRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          pr: 1,
          // Custom scrollbar
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "neutral.300",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "neutral.400",
            },
          },
        }}
      >
        {jobs.map((job) => (
          <Card
            key={job.id}
            variant="outlined"
            sx={{
              cursor: "pointer",
              borderColor:
                selectedJob?.id === job.id ? "primary.400" : "neutral.200",
              backgroundColor:
                selectedJob?.id === job.id ? "primary.50" : "white",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.300",
                boxShadow: "sm",
              },
            }}
            onClick={() => setSelectedJob(job)}
          >
            <CardContent>
              <Typography level="title-md" sx={{ fontWeight: 600 }}>
                {job.title}
              </Typography>

              <Typography
                level="body-sm"
                sx={{ color: "neutral.600", mt: 0.5 }}
              >
                {job.company} • {job.location}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip size="sm" variant="soft" color="neutral">
                  {job.job_type}
                </Chip>
                {job.is_brand && (
                  <Chip size="sm" color="primary" variant="soft">
                    Verified
                  </Chip>
                )}
              </Stack>

              <Typography level="body-xs" sx={{ color: "neutral.500", mt: 1 }}>
                Posted by {job.posted_by_name}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: "1px" }} />

        {/* Loading indicator */}
        {loadingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size="sm" />
          </Box>
        )}

        {/* End of list */}
        {!hasMore && jobs.length > 0 && (
          <Divider sx={{ my: 2 }}>
            <Typography level="body-xs" sx={{ color: "neutral.500" }}>
              No more jobs available
            </Typography>
          </Divider>
        )}
      </Box>

      {/* RIGHT – JOB DETAILS */}
      <Box
        sx={{
          position: "sticky",
          top: 80, // Adjust based on your navbar height
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        {selectedJob ? (
          <RightSideOfJobs selectedJob={selectedJob} />
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography
                level="body-md"
                sx={{ color: "neutral.500", textAlign: "center" }}
              >
                Select a job to view details
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
