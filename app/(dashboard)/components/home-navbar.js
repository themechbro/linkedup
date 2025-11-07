"use client";
import { Button, Typography } from "@mui/joy";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import Link from "next/link";
import { home_nav_items } from "../misc/home-nav-items";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = usePathname();
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
      <Toolbar sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" }, color: "#000" }}
        >
          <Menu />
        </IconButton>
        <Box className="Logo">
          <Link
            href="/home"
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
          className="nav-list"
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            justifyContent: "center",
            flex: 1,
          }}
        >
          {home_nav_items.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.link}
                style={{ color: "#000", fontFamily: "Roboto Condensed" }}
              >
                <Button
                  startDecorator={item.icon}
                  variant={path === item.link ? "solid" : "plain"}
                  sx={{
                    backgroundColor:
                      path === item.link ? item.isActiveColor : "none",
                  }}
                >
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </Box>
      </Toolbar>
      {/* Mobile */}
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
              {home_nav_items.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={item.link}
                    style={{ color: "#000", fontFamily: "Roboto Condensed" }}
                  >
                    <Button
                      startDecorator={item.icon}
                      variant={path === item.link ? "solid" : "plain"}
                      sx={{
                        backgroundColor:
                          path === item.link ? item.isActiveColor : "none",
                      }}
                    >
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </nav>
    </AppBar>
  );
}
