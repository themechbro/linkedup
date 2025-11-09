import { Card, CardContent, Tooltip, Typography, Divider, Box } from "@mui/joy";
import { Info } from "lucide-react";
import { News } from "../misc/news-list";
export default function LinkedupNewsCard() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography
            level="h3"
            sx={{
              fontFamily: "Roboto Condensed",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            LinkedUp News{" "}
            <Tooltip
              title="These are the day’s top professional news stories and conversations. Learn more about how they’re selected."
              arrow
              placement="left"
              sx={{
                width: 200,
                backgroundColor: "transparent",
                color: "black",
                backdropFilter: "blur(10px)",
              }}
            >
              <Info />
            </Tooltip>
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box className="news">
          <Typography level="body-lg" fontFamily="Roboto Condensed">
            Top stories
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {News.map((item) => {
              return (
                <Box key={item.id} sx={{ p: 1, "&hover": "" }}>
                  <Typography
                    sx={{ fontFamily: "Roboto Condensed" }}
                    level="h4"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Roboto Condensed",
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    {item.posted} {item.readers}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
