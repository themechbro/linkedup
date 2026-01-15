import { Box, Typography, Tabs, TabList, Tab, tabClasses } from "@mui/joy";
const List = ["About", "Posts", "Jobs", "Life", "People"];
export default function TabforProfileBrands({ chosenPage, onPageChange }) {
  return (
    <Tabs
      aria-label="tabs"
      defaultValue={0}
      sx={{
        width: "100%",
        maxWidth: 900,
        overflow: "hidden",
        mx: "auto",
        p: 0,
      }}
      onChange={(event, newValue) => {
        onPageChange(newValue);
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
