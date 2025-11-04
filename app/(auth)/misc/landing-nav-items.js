import {
  Rocket,
  Users,
  MonitorPlay,
  Briefcase,
  Puzzle,
  LaptopMinimal,
} from "lucide-react";

export const landing_nav_items = [
  {
    id: 1,
    name: "Top Content",
    link: "/top-content",
    icon: <Rocket />,
  },
  {
    id: 2,
    name: "People",
    link: "/people",
    icon: <Users />,
  },
  {
    id: 3,
    name: "Learning",
    link: "/learning",
    icon: <MonitorPlay />,
  },
  {
    id: 4,
    name: "Jobs",
    link: "/jobs",
    icon: <Briefcase />,
  },
  {
    id: 5,
    name: "Games",
    link: "/games",
    icon: <Puzzle />,
  },
  {
    id: 6,
    name: "Get the App",
    link: "/get-the-app",
    icon: <LaptopMinimal />,
  },
];

export const landing_nav_buttons = [
  {
    id: 1,
    name: "Sign in",
    link: "/sign-in",
    sx: {
      borderRadius: 50,
      backgroundColor: "#FFF",
      color: "#0b4fa8ff",
      "&:hover": {
        backgroundColor: "#b3cae9ff",
        color: "#0b4fa8ff",
        transform: "translateY(-2px)",
      },
    },
  },
  {
    id: 2,
    name: "Register Now",
    link: "sign-up",
    sx: {
      borderRadius: 50,
      backgroundColor: "#2869bdff",
      "&:hover": {
        backgroundColor: "#0b4fa8ff",
        color: "#FFF",
        transform: "translateY(-2px)",
      },
      color: "#FFF",
    },
  },
];
