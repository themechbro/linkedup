import {
  School,
  BriefcaseBusiness,
  Handshake,
  Lightbulb,
  Languages,
  Award,
  Info,
  Globe,
  Factory,
  Building2,
  MapPin,
} from "lucide-react";

export const core = [
  {
    name: "Add Education",
    icon: <School />,
  },
  {
    name: "Add Position",
    icon: <BriefcaseBusiness />,
  },
  {
    name: "Add Services",
    icon: <Handshake />,
  },
  {
    name: "Skills",
    icon: <Lightbulb />,
  },
  {
    name: "About me",
    icon: <Info />,
  },
];

export const additional = [
  {
    name: "Add Languages",
    icon: <Languages />,
  },
  {
    name: "Add Honors & Awards",
    icon: <Award />,
  },
];

export const coreBrands = [
  {
    name: "Overview", //in About column of users
    icon: <Info />,
  },
  {
    name: "Website",
    icon: <Globe />,
  },
  {
    name: "Industry",
    icon: <Factory />,
  },
  {
    name: "Company Size and Headquarters",
    icon: <Building2 />,
  },
];

export const additionalBrands = [
  {
    name: "Location",
    icon: <MapPin />,
  },
];
