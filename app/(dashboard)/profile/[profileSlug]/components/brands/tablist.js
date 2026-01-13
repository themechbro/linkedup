import { Box, Typography, Tabs, TabList, Tab, tabClasses } from "@mui/joy";
const List = ["Home", "About", "Posts", "Jobs", "Life", "People"];
export default function TabforProfileBrands() {
  return (
    <Tabs
      aria-label="tabs"
      defaultValue={0}
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <TabList
        sx={{
          gap: 0.5,
        }}
      >
        {List.map((item, index) => {
          return <Tab key={index}>{item}</Tab>;
        })}
      </TabList>
    </Tabs>
  );
}
