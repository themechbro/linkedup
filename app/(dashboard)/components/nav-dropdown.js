"use client";
import {
  Menu,
  Dropdown,
  MenuButton,
  Avatar,
  MenuItem,
  ListItemDecorator,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRoundPen, Settings, Activity, LogOut } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function NavDropdown() {
  const router = useRouter();
  const [fetchedData, setFetchedData] = useState(null);
  const privateMediaHosts = (
    process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS ||
    "blr1.kos.olakrutrimsvc.com"
  )
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const resolveAssetUrl = (url) => {
    if (!url) return "";
    if (/^\/api\/private-media\?url=/i.test(url)) return url;

    if (/^(https?:)?\/\//i.test(url)) {
      try {
        const parsed = new URL(url);
        if (privateMediaHosts.includes(parsed.hostname.toLowerCase())) {
          return `/api/private-media?url=${encodeURIComponent(url)}`;
        }
      } catch {
        return url;
      }
      return url;
    }

    const base = process.env.NEXT_PUBLIC_HOST_IP || "";
    if (!base) return url;

    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${normalizedBase}${normalizedPath}`;
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
        { credentials: "include" },
      );
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  const user = fetchedData?.userData;
  const userAvatar = resolveAssetUrl(user?.profile_picture) || undefined;

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: Avatar }}
        slotProps={{
          root: {
            size: "sm",
            variant: "outlined",
            sx: { cursor: "pointer" },
            src: userAvatar,
          },
        }}
      />

      <Menu
        placement="bottom-end"
        sx={{
          width: 280,
          p: 1,
          borderRadius: "12px",
          boxShadow: "lg",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* PROFILE HEADER */}
        <Box sx={{ display: "flex", gap: 1.5, p: 1 }}>
          <Avatar
            size="lg"
            src={userAvatar}
          />
          <Box>
            <Typography level="title-sm">
              {user?.full_name || "User"}
            </Typography>
            <Typography level="body-xs" sx={{ color: "neutral.500" }}>
              {user?.headline || "View your profile"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: 1, pb: 1 }}>
          {fetchedData?.meta?.user_id && (
            <Link
              href={`/profile/${fetchedData.meta.user_id}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                size="sm"
                fullWidth
                variant="outlined"
                sx={{ borderRadius: "20px" }}
              >
                View Profile
              </Button>
            </Link>
          )}
        </Box>

        <Divider />

        {/* ACCOUNT */}
        <Typography
          level="body-xs"
          sx={{ px: 1.5, py: 0.5, color: "neutral.500" }}
        >
          Account
        </Typography>

        <MenuItem component={Link} href="/recent-activity">
          <ListItemDecorator>
            <Activity size={16} />
          </ListItemDecorator>
          Posts & Activity
        </MenuItem>

        <MenuItem component={Link} href="/settings">
          <ListItemDecorator>
            <Settings size={16} />
          </ListItemDecorator>
          Settings
        </MenuItem>

        <Divider />

        {/* LOGOUT */}
        <MenuItem color="danger" onClick={handleLogout}>
          <ListItemDecorator>
            <LogOut size={16} />
          </ListItemDecorator>
          Sign out
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
