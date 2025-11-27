import {
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Input,
  Button,
} from "@mui/joy";
import { Camera, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProfilePictureModal({
  open,
  close,
  type,
  imgUrl,
  onUploadComplete,
}) {
  const [newImage, setNewImage] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImage(file);

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);
    setPreviewURL(localUrl);
  };

  const handleRemove = () => {
    setNewImage(null);
    setPreviewURL(imgUrl); // revert back to original
  };

  // const handleSubmit = async () => {
  //   if (!newImage) return;

  //   const formData = new FormData();
  //   formData.append("type", type);
  //   formData.append("image", newImage);

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_HOST_IP}/api/upload/profile_pic`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         body: formData,
  //       }
  //     );

  //     const data = await res.json();

  //     if (data.success) {
  //       if (onUploadComplete) {
  //         onUploadComplete();
  //       }
  //       setNewImage(null);
  //       close();
  //     }
  //   } catch (err) {
  //     console.error("Upload failed:", err);
  //   }
  // };

  const handleSubmit = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);

    // ✓ API URL decided by type
    const apiUrl =
      type === "profile" ? "/api/upload/profile_pic" : "/api/upload/cover_pic";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_IP}${apiUrl}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Parent refresh
        onUploadComplete && onUploadComplete();

        setNewImage(null);
        close();
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewURL(imgUrl);
    } else {
      // Cleanup when modal closes
      setPreviewURL("");
      setNewImage(null);
    }
  }, [open, imgUrl]);

  return (
    <Modal open={open} onClose={close}>
      <ModalDialog
        sx={{ width: "clamp(300px, 90vw, 600px)", p: 3, borderRadius: "lg" }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Box>
          <Typography sx={{ mb: 3, fontFamily: "Roboto Condensed" }} level="h3">
            {type === "cover" ? "Cover Photo" : "Profile Picture"}
          </Typography>

          {/* IMAGE PREVIEW */}
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: "md",
              overflow: "hidden",
              bgcolor: "#f5f5f5",
              position: "relative",
            }}
          >
            {previewURL && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewURL}
                alt="preview"
                style={{ objectFit: "contain" }}
              />
            )}
          </Box>

          <Divider sx={{ mt: 3, mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Hidden Input */}
            <Input
              id="upload-photo"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Upload Button */}
              <Tooltip title="Upload New Photo">
                <Button
                  component="label"
                  htmlFor="upload-photo"
                  variant="outlined"
                  startDecorator={<Camera />}
                >
                  Upload
                </Button>
              </Tooltip>

              {/* Remove Button */}
              <Tooltip title="Remove Selected Photo">
                <Button
                  onClick={handleRemove}
                  disabled={!newImage}
                  variant="soft"
                  color="danger"
                  startDecorator={<Trash />}
                >
                  Remove
                </Button>
              </Tooltip>
            </Box>

            {/* SAVE button */}
            <Button disabled={!newImage} onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

// import {
//   Box,
//   Modal,
//   ModalClose,
//   ModalDialog,
//   Typography,
//   IconButton,
//   Tooltip,
//   Divider,
//   Input,
//   Button,
// } from "@mui/joy";
// import { Camera, Trash } from "lucide-react";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function ProfilePictureModal({ open, close, type, imgUrl }) {
//   const [newImage, setNewImage] = useState(null);
//   const [previewURL, setPreviewURL] = useState("");

//   const buildFullUrl = (url) => {
//     if (!url) return "";
//     if (url.startsWith("http")) return url;
//     return `${process.env.NEXT_PUBLIC_HOST_IP}${url}`;
//   };

//   useEffect(() => {
//     if (imgUrl) {
//       setPreviewURL(buildFullUrl(imgUrl));
//     }
//   }, [imgUrl]);

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setNewImage(file);
//     setPreviewURL(URL.createObjectURL(file));
//   };

//   const handleRemove = () => {
//     setNewImage(null);
//     setPreviewURL(buildFullUrl(imgUrl)); // revert to original
//   };

//   const handleSubmit = async () => {
//     if (!newImage) return;

//     const formData = new FormData();
//     formData.append("image", newImage);
//     formData.append("type", type);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST_IP}/api/upload/profile_pic`,
//         {
//           method: "POST",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setPreviewURL(buildFullUrl(data.profile_picture));
//         close();
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   return (
//     <Modal open={open} onClose={close}>
//       <ModalDialog sx={{ width: 600, height: 500 }}>
//         <ModalClose />
//         <Box>
//           <Typography sx={{ mb: 3 }} level="h3">
//             {type === "cover" ? "Cover Photo" : "Profile Picture"}
//           </Typography>

//           <Box
//             sx={{
//               width: "100%",
//               height: 300,
//               borderRadius: 10,
//               overflow: "hidden",
//               bgcolor: "#f5f5f5",
//             }}
//           >
//             {previewURL && (
//               <Image
//                 src={previewURL}
//                 alt="preview"
//                 fill
//                 style={{ objectFit: "contain" }}
//               />
//             )}
//           </Box>

//           <Divider sx={{ mt: 3, mb: 3 }} />

//           <Box sx={{ width: "100%", gap: 5, display: "flex" }}>
//             <Input
//               id="upload-photo"
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={handleImageSelect}
//             />

//             <Tooltip title="Upload New Photo">
//               <label htmlFor="upload-photo">
//                 <IconButton component="span">
//                   <Camera />
//                 </IconButton>
//               </label>
//             </Tooltip>

//             <Tooltip title="Remove Selected Photo">
//               <IconButton onClick={handleRemove} disabled={!newImage}>
//                 <Trash />
//               </IconButton>
//             </Tooltip>

//             <Button
//               variant="solid"
//               color="primary"
//               disabled={!newImage}
//               onClick={handleSubmit}
//             >
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </ModalDialog>
//     </Modal>
//   );
// }
