// "use client";
// import {
//   Box,
//   Typography,
//   Modal,
//   ModalClose,
//   ModalDialog,
//   Avatar,
//   Dropdown,
//   MenuItem,
//   Menu,
//   MenuButton,
//   Textarea,
//   Button,
//   IconButton,
//   Sheet,
// } from "@mui/joy";
// import { useState, useEffect } from "react";
// import { Image as ImageIcon, X } from "lucide-react";

// export default function EditPostModal({ post, openEdit, closeEdit, onSave }) {
//   const [content, setContent] = useState("");
//   const [media, setMedia] = useState([]);

//   useEffect(() => {
//     if (post) {
//       setContent(post.content || "");
//       setMedia(post ? post.media_url : []);
//     }
//   }, [post]);

//   const handleSave = () => {
//     onSave({
//       post_id: post.id,
//       content,
//       media,
//     });
//     closeEdit();
//   };

//   return (
//     <Modal open={openEdit} onClose={closeEdit}>
//       <ModalDialog
//         sx={{
//           width: 800,
//           maxWidth: "95vw",
//           height: "85vh", // 🔥 ENFORCE TALL MODAL
//           borderRadius: "lg",
//           p: 0,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <ModalClose />

//         {/* HEADER (fixed) */}
//         <Box
//           sx={{ p: 3, pb: 2, display: "flex", gap: 2, alignItems: "center" }}
//         >
//           <Avatar
//             src={
//               post?.profile_picture
//                 ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`
//                 : "/default.img"
//             }
//             sx={{ width: 52, height: 52 }}
//           />

//           <Box>
//             <Typography fontWeight="lg">{post?.full_name}</Typography>

//             <Dropdown>
//               <MenuButton size="sm" variant="soft" sx={{ borderRadius: "lg" }}>
//                 Visibility: Anyone
//               </MenuButton>
//               <Menu>
//                 <MenuItem>Anyone</MenuItem>
//                 <MenuItem>Connections Only</MenuItem>
//                 <MenuItem>Only Me</MenuItem>
//               </Menu>
//             </Dropdown>
//           </Box>
//         </Box>

//         {/* SCROLLABLE CONTENT */}
//         <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
//           <Textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="What do you want to talk about?"
//             minRows={6}
//             sx={{
//               fontSize: "1rem",
//               borderRadius: "lg",
//               mb: 1,
//             }}
//           />

//           <Typography level="body-xs" textAlign="right" sx={{ opacity: 0.6 }}>
//             {content.length} / 3000 characters
//           </Typography>

//           {/* Media preview grid */}
//           {media.length > 0 && (
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
//                 gap: 1.5,
//                 mt: 2,
//               }}
//             >
//               {media.map((m, index) => (
//                 <Sheet
//                   key={index}
//                   variant="outlined"
//                   sx={{
//                     position: "relative",
//                     borderRadius: "md",
//                     overflow: "hidden",
//                     height: 150,
//                   }}
//                 >
//                   <img
//                     src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
//                     style={{
//                       objectFit: "cover",
//                       width: "100%",
//                       height: "100%",
//                     }}
//                   />

//                   <IconButton
//                     variant="solid"
//                     color="danger"
//                     size="sm"
//                     onClick={() =>
//                       setMedia(media.filter((_, i) => i !== index))
//                     }
//                     sx={{ position: "absolute", top: 6, right: 6 }}
//                   >
//                     <X size={14} />
//                   </IconButton>
//                 </Sheet>
//               ))}
//             </Box>
//           )}
//         </Box>

//         {/* FOOTER (fixed) */}
//         <Box
//           sx={{
//             p: 3,
//             borderTop: "1px solid #ddd",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: "background.body",
//           }}
//         >
//           <IconButton variant="soft">
//             <ImageIcon size={20} />
//           </IconButton>

//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Button variant="plain" onClick={closeEdit}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSave}
//               disabled={content.trim().length === 0}
//               sx={{ borderRadius: "lg" }}
//             >
//               Save Changes
//             </Button>
//           </Box>
//         </Box>
//       </ModalDialog>
//     </Modal>
//   );
// }

"use client";
import {
  Box,
  Typography,
  Modal,
  ModalClose,
  ModalDialog,
  Avatar,
  Dropdown,
  MenuItem,
  Menu,
  MenuButton,
  Textarea,
  Button,
  IconButton,
  Sheet,
  CircularProgress,
} from "@mui/joy";
import { useState, useEffect } from "react";
import { Image, X } from "lucide-react";

export default function EditPostModal({ post, openEdit, closeEdit, onSave }) {
  const [content, setContent] = useState("");
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content || "");

      // Parse media_url if it's a string, otherwise use as-is
      let mediaArray = [];
      if (post.media_url) {
        if (typeof post.media_url === "string") {
          try {
            mediaArray = JSON.parse(post.media_url);
          } catch (e) {
            mediaArray = [];
          }
        } else if (Array.isArray(post.media_url)) {
          mediaArray = post.media_url;
        }
      }

      setExistingMedia(mediaArray);
      setNewMediaFiles([]);
      setNewMediaPreviews([]);
    }
  }, [post]);

  // Handle new file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Limit total media to 10
    const remainingSlots = 10 - (existingMedia.length + newMediaFiles.length);
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      alert(`Only ${remainingSlots} more files can be added (10 total limit)`);
    }

    // Create preview URLs for new files
    const newPreviews = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setNewMediaFiles((prev) => [...prev, ...filesToAdd]);
    setNewMediaPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove existing media
  const removeExistingMedia = (index) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new media before upload
  const removeNewMedia = (index) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(newMediaPreviews[index].preview);

    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("existingMedia", JSON.stringify(existingMedia));

      // Append new files
      newMediaFiles.forEach((file) => {
        formData.append("mediaFiles", file);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/edit/${post.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include", // Important for session cookies
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Clean up preview URLs
        newMediaPreviews.forEach((preview) => {
          URL.revokeObjectURL(preview.preview);
        });

        // Call parent's onSave callback with updated post data
        if (onSave) {
          onSave({
            ...post,
            content,
            media_url: data.media || [...existingMedia, ...newMediaFiles],
          });
        }

        closeEdit();
      } else {
        alert(data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      newMediaPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, []);

  const totalMediaCount = existingMedia.length + newMediaPreviews.length;

  return (
    <Modal open={openEdit} onClose={closeEdit}>
      <ModalDialog
        sx={{
          width: 800,
          maxWidth: "95vw",
          height: "85vh",
          borderRadius: "lg",
          p: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ModalClose />

        {/* HEADER (fixed) */}
        <Box
          sx={{ p: 3, pb: 2, display: "flex", gap: 2, alignItems: "center" }}
        >
          <Avatar
            src={
              post?.profile_picture
                ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`
                : "/default.img"
            }
            sx={{ width: 52, height: 52 }}
          />

          <Box>
            <Typography fontWeight="lg">{post?.full_name}</Typography>

            <Dropdown>
              <MenuButton size="sm" variant="soft" sx={{ borderRadius: "lg" }}>
                Visibility: Anyone
              </MenuButton>
              <Menu>
                <MenuItem>Anyone</MenuItem>
                <MenuItem>Connections Only</MenuItem>
                <MenuItem>Only Me</MenuItem>
              </Menu>
            </Dropdown>
          </Box>
        </Box>

        {/* SCROLLABLE CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            minRows={6}
            maxRows={12}
            sx={{
              fontSize: "1rem",
              borderRadius: "lg",
              mb: 1,
            }}
          />

          <Typography level="body-xs" textAlign="right" sx={{ opacity: 0.6 }}>
            {content.length} / 3000 characters
          </Typography>

          {/* Media preview grid */}
          {totalMediaCount > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 1.5,
                mt: 2,
              }}
            >
              {/* Existing media */}
              {existingMedia.map((m, index) => (
                <Sheet
                  key={`existing-${index}`}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    borderRadius: "md",
                    overflow: "hidden",
                    height: 150,
                  }}
                >
                  {m.type === "videos" ? (
                    <video
                      src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <img
                      src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                      alt="Media"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}

                  <IconButton
                    variant="solid"
                    color="danger"
                    size="sm"
                    onClick={() => removeExistingMedia(index)}
                    sx={{ position: "absolute", top: 6, right: 6 }}
                  >
                    <X size={14} />
                  </IconButton>
                </Sheet>
              ))}

              {/* New media previews */}
              {newMediaPreviews.map((preview, index) => (
                <Sheet
                  key={`new-${index}`}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    borderRadius: "md",
                    overflow: "hidden",
                    height: 150,
                    border: "2px dashed",
                    borderColor: "primary.300",
                  }}
                >
                  {preview.type === "video" ? (
                    <video
                      src={preview.preview}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <img
                      src={preview.preview}
                      alt="New media"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  )}

                  <IconButton
                    variant="solid"
                    color="danger"
                    size="sm"
                    onClick={() => removeNewMedia(index)}
                    sx={{ position: "absolute", top: 6, right: 6 }}
                  >
                    <X size={14} />
                  </IconButton>

                  {/* New badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 6,
                      left: 6,
                      bgcolor: "primary.500",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: "sm",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                    }}
                  >
                    NEW
                  </Box>
                </Sheet>
              ))}
            </Box>
          )}

          {totalMediaCount > 0 && (
            <Typography level="body-xs" sx={{ mt: 1, opacity: 0.6 }}>
              {totalMediaCount} / 10 media files
            </Typography>
          )}
        </Box>

        {/* FOOTER (fixed) */}
        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "background.body",
          }}
        >
          <Box>
            <input
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
              disabled={totalMediaCount >= 10}
            />
            <label htmlFor="media-upload">
              <IconButton
                variant="soft"
                component="span"
                disabled={totalMediaCount >= 10}
              >
                <Image size={20} />
              </IconButton>
            </label>

            {totalMediaCount >= 10 && (
              <Typography
                level="body-xs"
                sx={{ mt: 0.5, color: "warning.500" }}
              >
                Max 10 files
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="plain" onClick={closeEdit} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={content.trim().length === 0 || isLoading}
              sx={{ borderRadius: "lg" }}
              startDecorator={isLoading ? <CircularProgress size="sm" /> : null}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
