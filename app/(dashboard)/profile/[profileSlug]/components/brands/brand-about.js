import { Card, Box, Typography, Divider, Link } from "@mui/joy";
import { fetchAboutforBrands } from "./utils/helpers";
import { useEffect, useState } from "react";

export default function BrandAboutCard({ profile }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      const res = await fetchAboutforBrands(profile?.userId);
      if (isMounted) {
        setData(res?.about || null);
        setLoading(false);
      }
    };

    if (profile?.userId) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [profile?.userId]);

  if (loading) {
    return null; // or skeleton
  }

  if (!data) {
    return null;
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        borderRadius: "20px",
        p: 4,
      }}
    >
      {/* Overview */}
      <Box>
        <Typography level="h3" sx={{ mb: 1 }}>
          Overview
        </Typography>

        <Typography
          level="body-md"
          sx={{ color: "neutral.700", lineHeight: 1.7 }}
        >
          {data.about}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Website */}
      <Box sx={{ mb: 2 }}>
        <Typography level="title-md">Website</Typography>
        <Link href={data.website} target="_blank">
          {data.website}
        </Link>
      </Box>

      {/* Industry */}
      <Box sx={{ mb: 2 }}>
        <Typography level="title-md">Industry</Typography>
        <Typography level="body-sm" sx={{ color: "neutral.600" }}>
          {data.industry}
        </Typography>
      </Box>

      {/* Company Size */}
      <Box sx={{ mb: 2 }}>
        <Typography level="title-md">Company size</Typography>
        <Typography level="body-sm" sx={{ color: "neutral.600" }}>
          {data.companysize}
        </Typography>
      </Box>

      {/* Headquarters */}
      <Box>
        <Typography level="title-md">Headquarters</Typography>
        <Typography level="body-sm" sx={{ color: "neutral.600" }}>
          {data.hq}
        </Typography>
      </Box>
    </Card>
  );
}
