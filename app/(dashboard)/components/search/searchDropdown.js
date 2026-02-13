// "use client";

// import { Avatar, Box, Typography } from "@mui/joy";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// export default function SearchDropdown({
//   results,
//   loading,
//   query,
//   close,
//   recentClicked,
// }) {
//   const router = useRouter();
//   const [recent, setRecent] = useState([]);

//   useEffect(() => {
//     const fetchRecents = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_HOST_IP}/api/linkedup-search/recent-searches`,
//           {
//             method: "GET",
//             credentials: "include",
//           },
//         );
//         const data = await res.json();
//         setRecent(data.searches);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchRecents();
//   }, []);

//   if (loading) {
//     return (
//       <DropdownContainer>
//         <div style={{ padding: "12px", color: "black" }}>Searching...</div>
//       </DropdownContainer>
//     );
//   }

//   if (!results) return null;

//   const { users = [], posts = [] } = results;

//   if (users.length === 0 && posts.length === 0) {
//     return (
//       <DropdownContainer>
//         <div style={{ padding: "12px", color: "black" }}>No results found</div>
//       </DropdownContainer>
//     );
//   }

//   return (
//     <DropdownContainer>
//       {query.trim() === "" && recent?.length > 0 ? (
//         <Box>
//           <SectionTitle>Recent Searches</SectionTitle>
//           {recent.map((i, idx) => (
//             <Typography
//               key={idx}
//               onClick={() => recentClicked(i)}
//               sx={{
//                 padding: "10px 12px",
//                 cursor: "pointer",
//                 "&:hover": { backgroundColor: "#f3f3f3" },
//               }}
//             >
//               {i}
//             </Typography>
//           ))}
//         </Box>
//       ) : (
//         <>
//           {/* Users */}
//           {users.length > 0 && (
//             <>
//               <SectionTitle>Users</SectionTitle>

//               {users.map((user) => (
//                 <Item
//                   key={user.user_id}
//                   onClick={() => {
//                     router.push(`/profile/${user.user_id}`);
//                     close();
//                   }}
//                 >
//                   <Box sx={{ padding: 2 }}>
//                     <Avatar
//                       src={`${process.env.NEXT_PUBLIC_HOST_IP}${user.profile_picture}`}
//                     />
//                   </Box>
//                   <Box>
//                     <div style={{ fontWeight: 600, color: "black" }}>
//                       {user.full_name}
//                     </div>

//                     <div
//                       style={{
//                         fontSize: "12px",
//                         color: "#666",
//                       }}
//                     >
//                       @{user.username}
//                     </div>

//                     {user.headline && (
//                       <div
//                         style={{
//                           fontSize: "11px",
//                           color: "#888",
//                           marginTop: "2px",
//                         }}
//                       >
//                         {user.headline}
//                       </div>
//                     )}
//                   </Box>
//                 </Item>
//               ))}
//             </>
//           )}

//           {/* Posts */}
//           {posts.length > 0 && (
//             <>
//               <SectionTitle>Posts</SectionTitle>

//               {posts.map((post) => (
//                 <Item
//                   key={post.id}
//                   onClick={() => {
//                     router.push(`/viewPost/${post.id}`);
//                     close();
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "12px",
//                       color: "#000000ff",
//                       marginTop: "4px",
//                     }}
//                   >
//                     {post.content.slice(0, 60)}...
//                   </div>

//                   <div
//                     style={{
//                       fontSize: "12px",
//                       color: "#000000ff",
//                       marginTop: "4px",
//                     }}
//                   >
//                     {new Date(post.created_at).toLocaleDateString()}
//                   </div>
//                 </Item>
//               ))}
//             </>
//           )}
//         </>
//       )}
//     </DropdownContainer>
//   );
// }

// function DropdownContainer({ children }) {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "45px",
//         left: 0,
//         width: "100%",
//         background: "white",
//         borderRadius: "8px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         border: "1px solid #ddd",
//         overflow: "hidden",
//         zIndex: 1000,
//         maxHeight: "400px",
//         overflowY: "auto",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <div
//       style={{
//         padding: "8px 12px",
//         fontSize: "12px",
//         fontWeight: "bold",
//         color: "#000000ff",
//         background: "#f7f7f7",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function Item({ children, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         padding: "10px 12px",
//         cursor: "pointer",
//         display: "flex",
//         gap: 2,
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f3f3")}
//       onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//     >
//       {children}
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";

export default function SearchDropdown({
  results,
  loading,
  query,
  close,
  recentClicked,
}) {
  const router = useRouter();
  const [recent, setRecent] = useState([]);

  // Fetch recent searches
  useEffect(() => {
    const fetchRecents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/linkedup-search/recent-searches`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();

        if (data?.searches) {
          setRecent(data.searches);
        }
      } catch (error) {
        console.log("Recent search fetch error:", error);
      }
    };

    fetchRecents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <DropdownContainer>
        <div style={{ padding: "12px", color: "black" }}>Searching...</div>
      </DropdownContainer>
    );
  }

  if (!results) return null;

  const { users = [], posts = [] } = results;

  const showRecents = query.trim() === "" && recent && recent.length > 0;

  const showNoResults =
    query.trim() !== "" && users.length === 0 && posts.length === 0;

  return (
    <DropdownContainer>
      {/* Recent searches */}
      {showRecents && (
        <Box>
          <SectionTitle>Recent Searches</SectionTitle>

          {recent.map((term, idx) => (
            <Typography
              key={idx}
              onClick={() => recentClicked(term)}
              sx={{
                padding: "10px 12px",
                cursor: "pointer",
                color: "black",
                "&:hover": {
                  backgroundColor: "#f3f3f3",
                },
              }}
            >
              {term}
            </Typography>
          ))}
        </Box>
      )}

      {/* No results */}
      {showNoResults && (
        <div style={{ padding: "12px", color: "black" }}>No results found</div>
      )}

      {/* Users */}
      {!showRecents && users.length > 0 && (
        <>
          <SectionTitle>Users</SectionTitle>

          {users.map((user) => (
            <Item
              key={user.user_id}
              onClick={() => {
                router.push(`/profile/${user.user_id}`);
                close();
              }}
            >
              <Box sx={{ padding: 1 }}>
                <Avatar
                  src={
                    user.profile_picture
                      ? `${process.env.NEXT_PUBLIC_HOST_IP}${user.profile_picture}`
                      : ""
                  }
                />
              </Box>

              <Box>
                <div
                  style={{
                    fontWeight: 600,
                    color: "black",
                  }}
                >
                  {user.full_name}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  @{user.username}
                </div>

                {user.headline && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#888",
                    }}
                  >
                    {user.headline}
                  </div>
                )}
              </Box>
            </Item>
          ))}
        </>
      )}

      {/* Posts */}
      {!showRecents && posts.length > 0 && (
        <>
          <SectionTitle>Posts</SectionTitle>

          {posts.map((post) => (
            <Item
              key={post.id}
              onClick={() => {
                router.push(`/viewPost/${post.id}`);
                close();
              }}
            >
              <Box>
                <div
                  style={{
                    fontSize: "12px",
                    color: "black",
                  }}
                >
                  {post.content.slice(0, 60)}...
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#666",
                  }}
                >
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </Box>
            </Item>
          ))}
        </>
      )}
    </DropdownContainer>
  );
}

/* Container */

function DropdownContainer({ children }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "45px",
        left: 0,
        width: "100%",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #ddd",
        maxHeight: "400px",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  );
}

/* Section title */

function SectionTitle({ children }) {
  return (
    <div
      style={{
        padding: "8px 12px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "black",
        background: "#f7f7f7",
      }}
    >
      {children}
    </div>
  );
}

/* Item */

function Item({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f3f3")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
    >
      {children}
    </div>
  );
}
