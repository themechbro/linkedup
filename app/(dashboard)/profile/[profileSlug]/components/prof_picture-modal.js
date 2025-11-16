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

// export default function ProfilePictureModal({ open, close, type, imgUrl }) {
//   const [newImage, setNewImage] = useState("");

//   return (
//     <Modal open={open} onClose={close}>
//       <ModalDialog sx={{ width: 600, height: 500 }}>
//         <ModalClose />
//         <Box>
//           <Typography sx={{ mb: 3, fontFamily: "Roboto Condensed" }} level="h3">
//             {type == "cover" ? "Cover Photo" : null}
//             {type == "profile" ? "Profile Picture" : null}
//           </Typography>
//           <Box
//             sx={{
//               width: "100%",
//               height: 300,
//               borderRadius: 10,
//               overflow: "hidden",
//             }}
//           >
//             <Image
//               src={imgUrl}
//               alt="preview"
//               width={100}
//               height={100}
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </Box>
//           <Divider sx={{ mt: 3, mb: 3 }} />
//           <Box
//             className="buttons"
//             sx={{ width: "100%", gap: 5, display: "flex" }}
//           >
//             <Input
//               id="upload-photo"
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={(e) => setNewImage(e)}
//             />

//             <Tooltip title="Upload New Photo">
//               <label htmlFor="upload-photo">
//                 <IconButton component="span">
//                   <Camera /> <Typography>Upload Photo</Typography>
//                 </IconButton>
//               </label>
//             </Tooltip>
//             <Tooltip title="Remove Photo">
//               <IconButton>
//                 <Trash /> <Typography>Remove Photo</Typography>
//               </IconButton>
//             </Tooltip>
//           </Box>
//         </Box>
//       </ModalDialog>
//     </Modal>
//   );
// }

export default function ProfilePictureModal({ open, close, type, imgUrl }) {
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

  const handleSubmit = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/upload/profile_pic`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        // Immediately update preview
        setPreviewURL(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.profile_picture}`
        );

        // Optionally notify parent component
        if (typeof onUpdated === "function") {
          onUpdated(data.profile_picture);
        }

        close();
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    if (imgUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewURL(imgUrl);
    }
  }, [imgUrl]);

  return (
    <Modal open={open} onClose={close}>
      <ModalDialog sx={{ width: 600, height: 500 }}>
        <ModalClose />
        <Box>
          <Typography sx={{ mb: 3, fontFamily: "Roboto Condensed" }} level="h3">
            {type === "cover" ? "Cover Photo" : "Profile Picture"}
          </Typography>

          {/* IMAGE PREVIEW */}
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: 10,
              overflow: "hidden",
              bgcolor: "#f5f5f5",
            }}
          >
            <Image
              src={previewURL}
              alt="preview"
              width={100}
              height={100}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>

          <Divider sx={{ mt: 3, mb: 3 }} />

          {/* BUTTONS */}
          <Box sx={{ width: "100%", gap: 5, display: "flex" }}>
            {/* Hidden Input */}
            <Input
              id="upload-photo"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />

            {/* Upload Button */}
            <Tooltip title="Upload New Photo">
              <label htmlFor="upload-photo">
                <IconButton component="span">
                  <Camera />
                  <Typography>Upload Photo</Typography>
                </IconButton>
              </label>
            </Tooltip>

            {/* Remove Button */}
            <Tooltip title="Remove Selected Photo">
              <IconButton onClick={handleRemove} disabled={!newImage}>
                <Trash />
                <Typography>Remove Photo</Typography>
              </IconButton>
            </Tooltip>

            {/* SAVE button */}
            <Button
              variant="solid"
              color="primary"
              disabled={!newImage}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
