import { House, Users, Briefcase, MessagesSquare, Bell } from "lucide-react";

export const home_nav_items = [
  {
    id: 1,
    name: "Home",
    icon: <House />,
    link: "/home",
    isActiveColor: "#0958a1ff",
  },
  {
    id: 2,
    name: "My Network",
    icon: <Users />,
    link: "/mynetwork",
    isActiveColor: "#0958a1ff",
  },
  {
    id: 3,
    name: "Jobs",
    icon: <Briefcase />,
    link: "/jobs",
    isActiveColor: "#0958a1ff",
  },
  {
    id: 4,
    name: "Messaging",
    icon: <MessagesSquare />,
    link: "/messaging",
    isActiveColor: "#0958a1ff",
  },
  {
    id: 5,
    name: "Notifications",
    icon: <Bell />,
    link: "/messaging",
    isActiveColor: "#0958a1ff",
  },
];
