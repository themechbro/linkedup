// "use client";
// import { Avatar, Button, Typography } from "@mui/joy";
// import {
//   AppBar,
//   Toolbar,
//   Box,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
// } from "@mui/material";
// import Link from "next/link";
// import { home_nav_items } from "../misc/home-nav-items";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import { Menu } from "lucide-react";
// import NavDropdown from "./nav-dropdown";

// export default function HomeNavbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const path = usePathname();
//   const handleDrawerToggle = () => {
//     setMobileOpen((prevState) => !prevState);
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         backgroundColor: "rgba(255, 255, 255, 0.7)",
//         boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
//         backdropFilter: "blur(10px)",
//         borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
//       }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "space-evenly" }}>
//         <IconButton
//           color="inherit"
//           aria-label="open drawer"
//           edge="start"
//           onClick={handleDrawerToggle}
//           sx={{ mr: 2, display: { md: "none" }, color: "#000" }}
//         >
//           <Menu />
//         </IconButton>
//         <Box className="Logo">
//           <Link
//             href="/home"
//             style={{
//               color: "#000",
//               fontFamily: "Roboto Condensed",
//               fontSize: "1.5rem",
//               fontWeight: "bold",
//             }}
//           >
//             LinkedUp
//           </Link>
//         </Box>
//         <Box
//           className="nav-list"
//           sx={{
//             display: { xs: "none", md: "flex" },
//             gap: 3,
//             justifyContent: "center",
//             flex: 1,
//           }}
//         >
//           {home_nav_items.map((item) => {
//             return (
//               <Link
//                 key={item.id}
//                 href={item.link}
//                 style={{ color: "#000", fontFamily: "Roboto Condensed" }}
//               >
//                 <Button
//                   startDecorator={item.icon}
//                   variant={path === item.link ? "solid" : "plain"}
//                   sx={{
//                     backgroundColor:
//                       path === item.link ? item.isActiveColor : "none",
//                   }}
//                 >
//                   {item.name}
//                 </Button>
//               </Link>
//             );
//           })}
//         </Box>
//         <Box>
//           <NavDropdown />
//         </Box>
//       </Toolbar>
//       {/* Mobile */}
//       <nav>
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: "block", md: "none" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: 240,
//             },
//           }}
//         >
//           <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
//             <List>
//               {home_nav_items.map((item) => {
//                 return (
//                   <Link
//                     key={item.id}
//                     href={item.link}
//                     style={{ color: "#000", fontFamily: "Roboto Condensed" }}
//                   >
//                     <Button
//                       startDecorator={item.icon}
//                       variant={path === item.link ? "solid" : "plain"}
//                       sx={{
//                         backgroundColor:
//                           path === item.link ? item.isActiveColor : "none",
//                       }}
//                     >
//                       {item.name}
//                     </Button>
//                   </Link>
//                 );
//               })}
//             </List>
//           </Box>
//         </Drawer>
//       </nav>
//     </AppBar>
//   );
// }
// 2nd version
// "use client";
// import { Avatar, Button, Input, Typography, Badge } from "@mui/joy";
// import {
//   AppBar,
//   Toolbar,
//   Box,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
// } from "@mui/material";
// import Link from "next/link";
// import { home_nav_items } from "../misc/home-nav-items";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Menu, Search } from "lucide-react";
// import NavDropdown from "./nav-dropdown";

// export default function HomeNavbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [badges, setBadges] = useState({
//     messages: 0,
//     notifications: 0,
//   });
//   const path = usePathname();

//   const handleDrawerToggle = () => {
//     setMobileOpen((prevState) => !prevState);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Handle search logic
//     console.log("Searching for:", searchQuery);
//     // router.push(`/search?q=${searchQuery}`);
//   };

//   useEffect(() => {
//     const fetchUnreadCounts = async () => {
//       try {
//         // Fetch unread messages count
//         const messagesRes = await fetch(
//           `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/unread_chat_count`,
//           { credentials: "include" }
//         );
//         const messagesData = await messagesRes.json();

//         // You can add notifications count here later
//         // const notificationsRes = await fetch(...);

//         setBadges({
//           messages: messagesData.success ? messagesData.unread_count : 0,
//           notifications: 0, // Add your notifications count here
//         });
//       } catch (err) {
//         console.error("Error fetching unread counts:", err);
//       }
//     };

//     fetchUnreadCounts();

//     // Poll every 10 seconds
//     const interval = setInterval(fetchUnreadCounts, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         backgroundColor: "#fff",
//         boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)",
//         borderBottom: "none",
//       }}
//     >
//       <Toolbar
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           maxWidth: "1200px",
//           width: "100%",
//           margin: "0 auto",
//           px: { xs: 2, md: 3 },
//         }}
//       >
//         {/* Left Section: Logo + Search */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           {/* Mobile Menu Button */}
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ display: { md: "none" }, color: "#000" }}
//           >
//             <Menu />
//           </IconButton>

//           {/* Logo */}
//           <Link href="/home" style={{ textDecoration: "none" }}>
//             <Typography
//               sx={{
//                 color: "#0a66c2",
//                 fontFamily: "Roboto Condensed",
//                 fontSize: { xs: "1.5rem", md: "2rem" },
//                 fontWeight: "bold",
//                 letterSpacing: "-0.5px",
//               }}
//             >
//               LinkedUp
//             </Typography>
//           </Link>

//           {/* Search Bar - Desktop */}
//           <Box
//             component="form"
//             onSubmit={handleSearch}
//             sx={{ display: { xs: "none", md: "block" } }}
//           >
//             <Input
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               startDecorator={<Search size={18} />}
//               sx={{
//                 width: "280px",
//                 backgroundColor: "#eef3f8",
//                 border: "none",
//                 "&:hover": {
//                   backgroundColor: "#e0e7ee",
//                 },
//                 "&:focus-within": {
//                   backgroundColor: "#fff",
//                   boxShadow: "0 0 0 2px #0a66c2",
//                 },
//                 "& input::placeholder": {
//                   color: "#666",
//                 },
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Center Section: Navigation Items - Desktop */}
//         <Box
//           className="nav-list"
//           sx={{
//             display: { xs: "none", md: "flex" },
//             gap: 0,
//             alignItems: "center",
//             flex: 1,
//             justifyContent: "center",
//             maxWidth: "600px",
//           }}
//         >
//           {home_nav_items.map((item) => {
//             const isActive = path === item.link;
//             const IconComponent = item.icon;
//             const badgeCount = item.showBadge ? badges[item.badgeKey] : 0;
//             return (
//               <Link
//                 key={item.id}
//                 href={item.link}
//                 style={{ textDecoration: "none" }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     padding: "12px 12px 8px",
//                     minWidth: "80px",
//                     cursor: "pointer",
//                     position: "relative",
//                     color: isActive ? "#0a66c2" : "#666",
//                     transition: "color 0.2s",
//                     "&:hover": {
//                       color: "#000",
//                     },
//                     "&::after": {
//                       content: '""',
//                       position: "absolute",
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       height: "2px",
//                       backgroundColor: isActive ? "#0a66c2" : "transparent",
//                     },
//                   }}
//                 >
//                   <Box sx={{ mb: 0.5 }}>
//                     {typeof item.icon === "function"
//                       ? item.icon({ size: 24 })
//                       : item.icon}
//                   </Box>
//                   <Typography
//                     level="body-xs"
//                     sx={{
//                       fontFamily: "Roboto Condensed",
//                       fontSize: "0.75rem",
//                       fontWeight: isActive ? 600 : 400,
//                       color: "inherit",
//                     }}
//                   >
//                     {item.name}
//                   </Typography>
//                 </Box>
//               </Link>
//             );
//           })}
//         </Box>

//         {/* Right Section: User Menu */}
//         <Box sx={{ display: { xs: "none", md: "block" } }}>
//           <NavDropdown />
//         </Box>

//         {/* Mobile User Menu */}
//         <Box sx={{ display: { xs: "block", md: "none" } }}>
//           <NavDropdown />
//         </Box>
//       </Toolbar>

//       {/* Mobile Search Bar */}
//       <Box
//         sx={{
//           display: { xs: "block", md: "none" },
//           px: 2,
//           pb: 1,
//         }}
//       >
//         <form onSubmit={handleSearch}>
//           <Input
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             startDecorator={<Search size={18} />}
//             sx={{
//               width: "100%",
//               backgroundColor: "#eef3f8",
//               border: "none",
//             }}
//           />
//         </form>
//       </Box>

//       {/* Mobile Drawer */}
//       <nav>
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: "block", md: "none" },
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: 280,
//               backgroundColor: "#fff",
//             },
//           }}
//         >
//           <Box sx={{ p: 2 }}>
//             {/* Logo in Drawer */}
//             <Typography
//               sx={{
//                 color: "#0a66c2",
//                 fontFamily: "Roboto Condensed",
//                 fontSize: "2rem",
//                 fontWeight: "bold",
//                 mb: 3,
//               }}
//             >
//               in
//             </Typography>

//             {/* Navigation Items */}
//             <List sx={{ p: 0 }}>
//               {home_nav_items.map((item) => {
//                 const isActive = path === item.link;
//                 return (
//                   <Link
//                     key={item.id}
//                     href={item.link}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <ListItem
//                       onClick={handleDrawerToggle}
//                       sx={{
//                         py: 2,
//                         px: 2,
//                         borderRadius: "8px",
//                         mb: 1,
//                         backgroundColor: isActive ? "#eef3f8" : "transparent",
//                         "&:hover": {
//                           backgroundColor: "#f3f6f8",
//                         },
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 2,
//                           width: "100%",
//                           color: isActive ? "#0a66c2" : "#666",
//                         }}
//                       >
//                         <Box>
//                           {typeof item.icon === "function"
//                             ? item.icon({ size: 24 })
//                             : item.icon}
//                         </Box>
//                         <Typography
//                           sx={{
//                             fontFamily: "Roboto Condensed",
//                             fontSize: "1rem",
//                             fontWeight: isActive ? 600 : 400,
//                             color: "inherit",
//                           }}
//                         >
//                           {item.name}
//                         </Typography>
//                       </Box>
//                     </ListItem>
//                   </Link>
//                 );
//               })}
//             </List>
//           </Box>
//         </Drawer>
//       </nav>
//     </AppBar>
//   );
// }

// 3rd version
"use client";
import { Avatar, Button, Input, Typography, Badge } from "@mui/joy";
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
import { useState, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import NavDropdown from "./nav-dropdown";

export default function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [badges, setBadges] = useState({
    messages: 0,
    notifications: 0,
  });
  const path = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Fetch unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        // Fetch unread messages count
        const messagesRes = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/messages/unread_chat_count`,
          { credentials: "include" }
        );
        const messagesData = await messagesRes.json();

        // You can add notifications count here later
        // const notificationsRes = await fetch(...);

        setBadges({
          messages: messagesData.success ? messagesData.unread_count : 0,
          notifications: 0, // Add your notifications count here
        });
      } catch (err) {
        console.error("Error fetching unread counts:", err);
      }
    };

    fetchUnreadCounts();

    // Poll every 10 seconds
    const interval = setInterval(fetchUnreadCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)",
        borderBottom: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Left Section: Logo + Search */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, color: "#000" }}
          >
            <Menu />
          </IconButton>

          <Link href="/home" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                color: "#0a66c2",
                fontFamily: "Roboto Condensed",
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: "bold",
                letterSpacing: "-0.5px",
              }}
            >
              in
            </Typography>
          </Link>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startDecorator={<Search size={18} />}
              sx={{
                width: "280px",
                backgroundColor: "#eef3f8",
                border: "none",
                "&:hover": {
                  backgroundColor: "#e0e7ee",
                },
                "&:focus-within": {
                  backgroundColor: "#fff",
                  boxShadow: "0 0 0 2px #0a66c2",
                },
              }}
            />
          </Box>
        </Box>

        {/* Center Section: Navigation Items - Desktop */}
        <Box
          className="nav-list"
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 0,
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            maxWidth: "600px",
          }}
        >
          {home_nav_items.map((item) => {
            const isActive = path === item.link;
            const IconComponent = item.icon;
            const badgeCount = item.showBadge ? badges[item.badgeKey] : 0;

            return (
              <Link
                key={item.id}
                href={item.link}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "12px 12px 8px",
                    minWidth: "80px",
                    cursor: "pointer",
                    position: "relative",
                    color: isActive ? "#0a66c2" : "#666",
                    transition: "color 0.2s",
                    "&:hover": {
                      color: "#000",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: isActive ? "#0a66c2" : "transparent",
                    },
                  }}
                >
                  {/* Icon with Badge */}
                  <Badge
                    badgeContent={badgeCount > 0 ? badgeCount : null}
                    color="danger"
                    size="sm"
                    sx={{ mb: 0.5 }}
                  >
                    <IconComponent size={24} />
                  </Badge>

                  <Typography
                    level="body-xs"
                    sx={{
                      fontFamily: "Roboto Condensed",
                      fontSize: "0.75rem",
                      fontWeight: isActive ? 600 : 400,
                      color: "inherit",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>

        {/* Right Section: User Menu */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <NavDropdown />
        </Box>

        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <NavDropdown />
        </Box>
      </Toolbar>

      {/* Mobile Search Bar */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          px: 2,
          pb: 1,
        }}
      >
        <form onSubmit={handleSearch}>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startDecorator={<Search size={18} />}
            sx={{
              width: "100%",
              backgroundColor: "#eef3f8",
              border: "none",
            }}
          />
        </form>
      </Box>

      {/* Mobile Drawer */}
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              backgroundColor: "#fff",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              sx={{
                color: "#0a66c2",
                fontFamily: "Roboto Condensed",
                fontSize: "2rem",
                fontWeight: "bold",
                mb: 3,
              }}
            >
              in
            </Typography>

            <List sx={{ p: 0 }}>
              {home_nav_items.map((item) => {
                const isActive = path === item.link;
                const IconComponent = item.icon;
                const badgeCount = item.showBadge ? badges[item.badgeKey] : 0;

                return (
                  <Link
                    key={item.id}
                    href={item.link}
                    style={{ textDecoration: "none" }}
                  >
                    <ListItem
                      onClick={handleDrawerToggle}
                      sx={{
                        py: 2,
                        px: 2,
                        borderRadius: "8px",
                        mb: 1,
                        backgroundColor: isActive ? "#eef3f8" : "transparent",
                        "&:hover": {
                          backgroundColor: "#f3f6f8",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                          color: isActive ? "#0a66c2" : "#666",
                        }}
                      >
                        <Badge
                          badgeContent={badgeCount > 0 ? badgeCount : null}
                          color="danger"
                          size="sm"
                        >
                          <IconComponent size={24} />
                        </Badge>

                        <Typography
                          sx={{
                            fontFamily: "Roboto Condensed",
                            fontSize: "1rem",
                            fontWeight: isActive ? 600 : 400,
                            color: "inherit",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    </ListItem>
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
