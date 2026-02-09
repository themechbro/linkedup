"use client";
import { Box, Typography } from "@mui/joy";
import ProfileFirst from "./components/first-card";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AboutCard from "./components/normal/about-card";
import EducationCard from "./components/normal/education-card";
import TabforProfileBrands from "./components/brands/tablist";
import BrandAboutPage from "./components/brands/brand-about";
import BrandPostPage from "./components/brands/brand-posts";
import WorkCard from "./components/normal/work-card";
export default function ViewProfilePage({ params }) {
  const path = usePathname();
  const user_id = path.split("/")[2]?.trim();
  const [data, setData] = useState({});
  const [byWho, setByWho] = useState({});
  const [loading, setLoading] = useState(false);
  const [chosenPage, setChosenPage] = useState(0);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/fetch/fetch-profile?user_id=${user_id}`,
        { method: "GET", cache: "no-store", credentials: "include" },
      );
      const whoRequested = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
        { method: "GET", credentials: "include" },
      );
      const profile = await res.json();
      const reqBy = await whoRequested.json();
      if (profile) {
        setData(profile.profile);
      }
      setByWho(reqBy);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfileDetails();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        paddingX: 10,
        paddingTop: 3,
        backgroundColor: "#F4F2EE",
      }}
    >
      <Box sx={{ mb: 1 }}>
        <ProfileFirst profile={data} requestedBy={byWho} isLoading={loading} />
      </Box>
      {data?.isBrand ? (
        <Box sx={{ mb: 3 }}>
          <TabforProfileBrands
            chosenPage={chosenPage}
            onPageChange={setChosenPage}
          />
          {chosenPage == 0 ? (
            <Box sx={{ mt: 1 }}>
              <BrandAboutPage profile={data} />
            </Box>
          ) : null}
          {chosenPage == 1 ? (
            <Box sx={{ mt: 1 }}>
              <BrandPostPage profile={data} />
            </Box>
          ) : null}
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 3 }}>
            <AboutCard profile={data} requestedBy={byWho} isLoading={loading} />
          </Box>
          <Box sx={{ mb: 3 }}>
            <EducationCard
              profile={data}
              requestedBy={byWho}
              isLoading={loading}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <WorkCard profile={data} requestedBy={byWho} isLoading={loading} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
