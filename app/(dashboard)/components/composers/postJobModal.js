// "use client";
// import {
//   Modal,
//   ModalDialog,
//   Typography,
//   Box,
//   ModalClose,
//   Textarea,
//   Tooltip,
//   Button,
//   Chip,
//   Avatar,
//   FormControl,
//   Input,
//   FormLabel,
//   Stack,
// } from "@mui/joy";
// import { useState } from "react";

// const JOB_TYPES = [
//   "Full-time",
//   "Part-time",
//   "Internship",
//   "Contract",
//   "Remote",
// ];

// export default function PostJobModal({
//   open,
//   close,
//   currentUser,
//   onSubmit,
//   profileUrl,
// }) {
//   const [title, setTitle] = useState("");
//   const [company, setCompany] = useState("");
//   const [location, setLocation] = useState("");
//   const [jobType, setJobType] = useState("");
//   const [description, setDescription] = useState("");

//   const handlePost = () => {
//     if (!title || !company) return;

//     onSubmit?.({
//       title,
//       company,
//       location,
//       jobType,
//       description,
//       postedBy: currentUser?.id,
//     });

//     close();
//   };

//   return (
//     <Modal open={open} onClose={close}>
//       <ModalDialog
//         sx={{
//           width: "100%",
//           maxWidth: 550,
//           borderRadius: "md",
//           p: 3,
//           height: "auto",
//           overflowY: "scroll",
//         }}
//       >
//         <ModalClose />

//         {/* Header */}
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           <Avatar size="lg" src={profileUrl} />
//           <Box sx={{ ml: 1 }}>
//             <Typography level="title-md">
//               {currentUser?.userData?.full_name || "User"}
//             </Typography>
//             <Typography level="body-sm" sx={{ color: "neutral.500" }}>
//               Posting a job
//             </Typography>
//           </Box>
//         </Box>

//         {/* Job Title */}
//         <FormControl sx={{ mb: 2 }}>
//           <FormLabel>Job Title *</FormLabel>

//           <Input
//             placeholder="e.g., Frontend Developer"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </FormControl>

//         {/* Company */}
//         <FormControl sx={{ mb: 2 }}>
//           <FormLabel>Company *</FormLabel>
//           {currentUser?.userData?.isbrand ? (
//             <Input
//               value={currentUser.userData.full_name}
//               disabled // brand users cannot edit
//             />
//           ) : (
//             <Input
//               placeholder="Company name"
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//             />
//           )}
//         </FormControl>

//         {/* Location */}
//         <FormControl sx={{ mb: 2 }}>
//           <FormLabel>Location</FormLabel>
//           <Input
//             placeholder="e.g., Bengaluru, Remote"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </FormControl>

//         {/* Job Type Chips */}
//         <FormLabel sx={{ fontSize: 14, mb: 1 }}>Job Type</FormLabel>
//         <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
//           {JOB_TYPES.map((type) => (
//             <Chip
//               key={type}
//               variant={jobType === type ? "solid" : "outlined"}
//               color="primary"
//               onClick={() => setJobType(type)}
//               sx={{ cursor: "pointer" }}
//             >
//               {type}
//             </Chip>
//           ))}
//         </Stack>

//         {/* Description */}
//         <FormControl sx={{ mb: 3 }}>
//           <FormLabel>Description</FormLabel>
//           <Textarea
//             minRows={4}
//             placeholder="Describe the role, responsibilities, and requirements…"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </FormControl>

//         {/* Footer Buttons */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
//           <Button variant="plain" onClick={close}>
//             Cancel
//           </Button>
//           <Button
//             variant="solid"
//             color="primary"
//             onClick={handlePost}
//             disabled={!title || !company}
//           >
//             Post Job
//           </Button>
//         </Box>
//       </ModalDialog>
//     </Modal>
//   );
// }

"use client";
import {
  Modal,
  ModalDialog,
  Typography,
  Box,
  ModalClose,
  Textarea,
  Button,
  Chip,
  Avatar,
  FormControl,
  Input,
  FormLabel,
  Stack,
} from "@mui/joy";
import { useState } from "react";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
];

export default function PostJobModal({
  open,
  close,
  currentUser,
  refreshJobs,
  profileUrl,
}) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");

  const handlePost = async () => {
    const isBrand = currentUser?.userData?.isbrand;

    const finalCompany = isBrand ? currentUser.userData.full_name : company;

    if (!title || !finalCompany) return;

    const jobData = {
      title,
      company: finalCompany,
      location,
      job_type: jobType,
      description,
      is_brand: isBrand,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_IP}/api/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for session cookies
        body: JSON.stringify(jobData),
      });

      if (!res.ok) {
        console.error(await res.json());
        return;
      }

      // Success → refresh parent job list
      refreshJobs?.();

      close();

      // Reset fields
      setTitle("");
      setCompany("");
      setLocation("");
      setJobType("");
      setDescription("");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <Modal open={open} onClose={close}>
      <ModalDialog
        sx={{ width: 550, p: 3, height: "auto", overflowY: "scroll" }}
      >
        <ModalClose />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar size="lg" src={profileUrl} />
          <Box sx={{ ml: 1 }}>
            <Typography level="title-md">
              {currentUser?.userData?.full_name}
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.500" }}>
              Posting a job
            </Typography>
          </Box>
        </Box>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Job Title *</FormLabel>
          <Input
            placeholder="e.g., Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Company *</FormLabel>

          {currentUser?.userData?.isbrand ? (
            <Input value={currentUser.userData.full_name} disabled />
          ) : (
            <Input
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          )}
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Location</FormLabel>
          <Input
            placeholder="e.g., Remote, Bengaluru"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormControl>

        <FormLabel>Job Type</FormLabel>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {JOB_TYPES.map((type) => (
            <Chip
              key={type}
              variant={jobType === type ? "solid" : "outlined"}
              color="primary"
              onClick={() => setJobType(type)}
              sx={{ cursor: "pointer" }}
            >
              {type}
            </Chip>
          ))}
        </Stack>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Description</FormLabel>
          <Textarea
            minRows={4}
            placeholder="Describe the role..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="plain" onClick={close}>
            Cancel
          </Button>

          <Button
            variant="solid"
            color="primary"
            onClick={handlePost}
            disabled={!title}
          >
            Post Job
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
