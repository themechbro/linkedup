import {
  Menu,
  Dropdown,
  MenuButton,
  Avatar,
  MenuItem,
  ListItemDecorator,
} from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRoundPen, Settings, Activity, LogOut } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
export default function NavDropdown() {
  const router = useRouter();
  const [fetchedData, setFetchedData] = useState({});

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/user_details`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout Error", error);
    }
  };
  const list = [
    { name: "View profile", link: "/profile", icon: <UserRoundPen /> },
    { name: "Settings", link: "/settings", icon: <Settings /> },
    {
      name: "Posts and Activity",
      link: "/recent-activity",
      icon: <Activity />,
    },
  ];
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: Avatar }}
        slotProps={{
          root: {
            variant: "outlined",
            src: fetchedData?.userData?.profile_picture
              ? `${process.env.NEXT_PUBLIC_HOST_IP}${fetchedData.userData.profile_picture}`
              : "image.com",
          },
        }}
      ></MenuButton>
      <Menu
        placement="bottom-end"
        sx={{ backgroundColor: "#f5f5f579", backdropFilter: "blur(10px)" }}
        invertedColors
      >
        {list.map((i, k) => {
          return (
            <MenuItem key={k}>
              <ListItemDecorator>{i.icon}</ListItemDecorator>
              <Link href={i.link}>{i.name}</Link>
            </MenuItem>
          );
        })}
        <MenuItem onClick={handleLogout}>
          <ListItemDecorator>
            <LogOut />
          </ListItemDecorator>
          Logout
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
