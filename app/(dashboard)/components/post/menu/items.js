import { Bookmark, Link, EyeOff, Flag, Trash2, Pencil } from "lucide-react";
export const postMenuItems = [
  {
    name: "Save",
    icon: <Bookmark />,
  },
  {
    name: "Copy link to Post",
    icon: <Link />,
  },
  {
    name: "Not Interested",
    icon: <EyeOff />,
  },
  {
    name: "Report Post",
    icon: <Flag />,
  },
  {
    name: "Edit Post",
    icon: <Pencil />,
  },
  {
    name: "Delete Post",
    icon: <Trash2 />,
  },
];
