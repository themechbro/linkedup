"use client";

import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import { Box, Button } from "@mui/joy";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  landing_nav_items,
  landing_nav_buttons,
} from "../misc/landing-nav-items";

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" }, color: "#000" }}
        >
          <Menu />
        </IconButton>

        <Box className="logo">
          <Link
            href="/"
            style={{
              color: "#000",
              fontFamily: "Roboto Condensed",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            LinkedUp
          </Link>
        </Box>
        <Box
          className="nav-items"
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            justifyContent: "center",
            flex: 1,
          }}
        >
          {landing_nav_items.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.link}
                style={{ color: "#000", fontFamily: "Roboto Condensed" }}
              >
                <Button startDecorator={item.icon} variant="plain">
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </Box>
        <Box
          className="nav-buttons"
          sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}
        >
          {landing_nav_buttons.map((button) => {
            return (
              <Link key={button.id} href={button.link}>
                <Button variant="outlined" sx={button.sx}>
                  {button.name}
                </Button>
              </Link>
            );
          })}
        </Box>
      </Toolbar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
            <List>
              {landing_nav_items.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <Link href={item.link} style={{ width: "100%" }}>
                    <Button
                      startDecorator={item.icon}
                      variant="plain"
                      fullWidth
                    >
                      {item.name}
                    </Button>
                  </Link>
                </ListItem>
              ))}
              {landing_nav_buttons.map((button) => (
                <ListItem key={button.id} disablePadding sx={{ mt: 1 }}>
                  <Link href={button.link} style={{ width: "100%" }}>
                    <Button variant="outlined" sx={button.sx} fullWidth>
                      {button.name}
                    </Button>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </nav>
    </AppBar>
  );
}
