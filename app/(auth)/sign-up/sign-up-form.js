// "use client";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   FormControl,
//   FormHelperText,
//   Input,
//   FormLabel,
//   IconButton,
//   Tooltip,
//   Typography,
// } from "@mui/joy";
// import { Eye, EyeClosed } from "lucide-react";
// import Link from "next/link";
// import { useState, useActionState, useEffect } from "react";
// import { SignupAction } from "./sign-up-action";
// import SignupPageSnackbar from "./snackbar";

// export default function LinkedUpSignupForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formState, formAction, isPending] = useActionState(SignupAction, {});
//   const messageError = formState.errors ?? {};
//   const messageSuccess = formState.success ?? {};
//   const [snackbar, setSnackbar] = useState(false);
//   const snackColor = messageError.server ? "danger" : "success";

//   useEffect(() => {
//     if (formState.success || formState.errors?.server) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setSnackbar(true);
//     }
//   }, [formState]);

//   const sx_formLabel = {
//     fontFamily: "Roboto Condensed",
//     fontWeight: "bold",
//     color: "#0b0829ff",
//   };
//   const sx_typography = {
//     fontFamily: "Roboto Condensed",
//     fontWeight: "thin",
//     color: "#0b0829ff",
//   };

//   return (
//     <>
//       <Card>
//         <CardContent>
//           <Box component="form" sx={{ mb: 3 }} action={formAction}>
//             {/* Email */}
//             <FormControl required sx={{ mb: 2 }}>
//               <FormLabel sx={sx_formLabel}>Email Address</FormLabel>
//               <Input type="email" name="email" />
//               {messageError.email ? (
//                 <FormHelperText sx={{ color: "red" }}>
//                   {messageError.email}
//                 </FormHelperText>
//               ) : null}
//             </FormControl>
//             {/* Username */}
//             <FormControl required sx={{ mb: 2 }}>
//               <FormLabel sx={sx_formLabel}>Username</FormLabel>
//               <Input type="text" name="username" />
//               {messageError.username ? (
//                 <FormHelperText sx={{ color: "red" }}>
//                   {messageError.username}
//                 </FormHelperText>
//               ) : null}
//             </FormControl>

//             {/* Full name */}
//             <FormControl required sx={{ mb: 2 }}>
//               <FormLabel sx={sx_formLabel}>Full Name</FormLabel>
//               <Input type="text" name="full_name" />
//               {messageError.full_name ? (
//                 <FormHelperText sx={{ color: "red" }}>
//                   {messageError.full_name}
//                 </FormHelperText>
//               ) : null}
//             </FormControl>

//             {/* Password */}
//             <FormControl required sx={{ mb: 2 }}>
//               <FormLabel sx={sx_formLabel}>Password</FormLabel>
//               <Input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 endDecorator={
//                   <Tooltip
//                     arrow
//                     title={showPassword ? "Hide Password" : "Show Password"}
//                   >
//                     <IconButton
//                       onClick={() => setShowPassword((prev) => !prev)}
//                     >
//                       {showPassword ? (
//                         <Eye color="green" />
//                       ) : (
//                         <EyeClosed color="red" />
//                       )}
//                     </IconButton>
//                   </Tooltip>
//                 }
//               />
//               {messageError.password ? (
//                 <FormHelperText sx={{ color: "red" }}>
//                   {messageError.password}
//                 </FormHelperText>
//               ) : null}
//             </FormControl>

//             <FormLabel sx={{ mb: 2 }}>
//               {" "}
//               <Typography level="body-sm" sx={sx_typography}>
//                 By clicking Agree & Join or Continue, you agree to the LinkedUp
//                 User Agreement, Privacy Policy, and Cookie Policy. Agree & Join
//               </Typography>
//             </FormLabel>

//             {messageError.server && (
//               <FormHelperText sx={{ color: "red", mb: 2 }}>
//                 {messageError.server}
//               </FormHelperText>
//             )}
//             <Button type="submit">Agree & Join</Button>
//           </Box>
//           <Typography level="body-sm" sx={sx_typography}>
//             Already on LinkedUp?{" "}
//             <Link href="/sign-in" style={{ textDecoration: "underline" }}>
//               Sign in
//             </Link>
//           </Typography>
//         </CardContent>
//       </Card>

//       {snackbar ? (
//         <SignupPageSnackbar
//           open={snackbar}
//           close={() => setSnackbar(false)}
//           severity={snackColor}
//           message={messageSuccess?.message || messageError.server}
//         />
//       ) : null}
//     </>
//   );
// }

"use client";

import {
  Card,
  CardContent,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
  FormHelperText,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Link,
} from "@mui/joy";

import { Eye, EyeClosed } from "lucide-react";
import { useActionState, useState, useEffect } from "react";
import { SignupAction } from "./sign-up-action";

export default function LinkedUpSignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [formState, formAction, isPending] = useActionState(SignupAction, {});

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const errors = formState.errors || {};

  useEffect(() => {
    if (formState.success || errors.server) setSnackbarOpen(true);
  }, [formState]);

  return (
    <>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Box component="form" action={formAction}>
            {/* EMAIL */}
            <FormControl error={!!errors.email} sx={{ mb: 2 }}>
              <FormLabel>Email</FormLabel>

              <Input
                name="email"
                type="email"
                disabled={isPending}
                color={errors.email ? "danger" : "neutral"}
              />

              {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
            </FormControl>

            {/* USERNAME */}
            <FormControl error={!!errors.username} sx={{ mb: 2 }}>
              <FormLabel>Username</FormLabel>

              <Input
                name="username"
                disabled={isPending}
                color={errors.username ? "danger" : "neutral"}
              />

              {errors.username && (
                <FormHelperText>{errors.username}</FormHelperText>
              )}
            </FormControl>

            {/* FULL NAME */}
            <FormControl error={!!errors.full_name} sx={{ mb: 2 }}>
              <FormLabel>Full Name</FormLabel>

              <Input
                name="full_name"
                disabled={isPending}
                color={errors.full_name ? "danger" : "neutral"}
              />

              {errors.full_name && (
                <FormHelperText>{errors.full_name}</FormHelperText>
              )}
            </FormControl>

            {/* PASSWORD */}
            <FormControl error={!!errors.password} sx={{ mb: 2 }}>
              <FormLabel>Password</FormLabel>

              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                color={errors.password ? "danger" : "neutral"}
                endDecorator={
                  <Tooltip title="Toggle password">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </IconButton>
                  </Tooltip>
                }
              />

              {errors.password && (
                <FormHelperText>{errors.password}</FormHelperText>
              )}
            </FormControl>

            {/* SERVER ERROR */}
            {errors.server && (
              <Alert color="danger" sx={{ mb: 2 }}>
                {errors.server}
              </Alert>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              fullWidth
              disabled={isPending}
              loading={isPending}
            >
              {isPending ? <CircularProgress size="sm" /> : "Agree & Join"}
            </Button>
          </Box>

          <Typography sx={{ mt: 2 }}>
            Already have account? <Link href="/sign-in">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert color={formState.success ? "success" : "danger"}>
          {formState.success ? formState.message : errors.server}
        </Alert>
      </Snackbar>
    </>
  );
}
