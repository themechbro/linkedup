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
//   Divider,
// } from "@mui/joy";
// import { Eye, EyeClosed } from "lucide-react";
// import Link from "next/link";
// import { useState, useActionState, useEffect } from "react";
// import { LoginAction } from "./sign-in-action";
// import { useRouter } from "next/navigation";
// import GoogleIcon from "@mui/icons-material/Google";
// import FacebookIcon from "@mui/icons-material/Facebook";

// export default function LinkedUpSignInPageForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formState, formAction, isPending] = useActionState(LoginAction, {});

//   const router = useRouter();
//   // const messageError = formState.errors ?? {};

//   useEffect(() => {
//     if (formState.success) {
//       const timer = setTimeout(() => {
//         router.replace("/home");
//       }, 1500); // wait a moment so snackbar shows
//       return () => clearTimeout(timer);
//     }
//   }, [formState.success, router]);

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
//     <Card>
//       <CardContent>
//         <Box component="form" sx={{ mb: 3 }} action={formAction}>
//           {/* Username */}
//           <FormControl required sx={{ mb: 2 }}>
//             <FormLabel sx={sx_formLabel}>Username</FormLabel>
//             <Input type="text" name="username" />
//             {/* {messageError.username ? (
//               <FormHelperText sx={{ color: "red" }}>
//                 {messageError.username}
//               </FormHelperText>
//             ) : null} */}
//           </FormControl>
//           {/* Password */}
//           <FormControl required sx={{ mb: 2 }}>
//             <FormLabel sx={sx_formLabel}>Password</FormLabel>
//             <Input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               endDecorator={
//                 <Tooltip
//                   arrow
//                   title={showPassword ? "Hide Password" : "Show Password"}
//                 >
//                   <IconButton onClick={() => setShowPassword((prev) => !prev)}>
//                     {showPassword ? (
//                       <Eye color="green" />
//                     ) : (
//                       <EyeClosed color="red" />
//                     )}
//                   </IconButton>
//                 </Tooltip>
//               }
//             />
//             {/* {messageError.password ? (
//               <FormHelperText sx={{ color: "red" }}>
//                 {messageError.password}
//               </FormHelperText>
//             ) : null} */}
//           </FormControl>
//           <Button type="submit" sx={{ borderRadius: 30 }}>
//             Sign In
//           </Button>
//         </Box>
//         <Divider sx={{ color: "black", mb: 3 }} />
//         <Button
//           startDecorator={<GoogleIcon />}
//           component="a"
//           href={`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/google`}
//           variant="soft"
//           sx={{ fontFamily: "Roboto Condensed" }}
//           color="success"
//         >
//           Login Using Google
//         </Button>
//         <Divider>
//           <Typography level="body-lg" sx={{ fontFamily: "Roboto Condensed" }}>
//             OR
//           </Typography>
//         </Divider>
//         <Button
//           startDecorator={<FacebookIcon />}
//           component="a"
//           href={`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/facebook`}
//           variant="soft"
//           sx={{ fontFamily: "Roboto Condensed" }}
//           color="primary"
//         >
//           Login Using Facebook
//         </Button>
//         <Divider sx={{ color: "black", mt: 3, mb: 3 }} />
//         <Typography level="body-sm" sx={sx_typography}>
//           New to LinkedUp? {""}
//           <Link href="/sign-up" style={{ textDecoration: "underline" }}>
//             Register Now
//           </Link>
//         </Typography>
//       </CardContent>
//     </Card>
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
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Link,
} from "@mui/joy";

import { Eye, EyeClosed } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginAction } from "./sign-in-action";

export default function LinkedUpSignInPageForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, formAction, isPending] = useActionState(LoginAction, {});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (formState.success || formState.errors?.server) {
      setOpenSnackbar(true);
    }

    if (formState.success) {
      const timer = setTimeout(() => {
        router.replace("/home");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formState, router]);

  const errors = formState.errors || {};

  return (
    <>
      <Card>
        <CardContent>
          <Box component="form" action={formAction}>
            {/* Username */}
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

            {/* Password */}
            <FormControl error={!!errors.password} sx={{ mb: 2 }}>
              <FormLabel>Password</FormLabel>

              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                color={errors.password ? "danger" : "neutral"}
                endDecorator={
                  <Tooltip title={showPassword ? "Hide" : "Show"}>
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

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              loading={isPending}
              disabled={isPending}
              sx={{ borderRadius: 30 }}
            >
              {isPending ? (
                <>
                  <CircularProgress size="sm" sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* OAuth buttons unchanged */}
          <Button
            startDecorator={<GoogleIcon />}
            component="a"
            href={`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/google`}
            fullWidth
            sx={{ mb: 1 }}
          >
            Continue with Google
          </Button>

          <Button
            startDecorator={<FacebookIcon />}
            component="a"
            href={`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/facebook`}
            fullWidth
          >
            Continue with Facebook
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography level="body-sm">
            New to LinkedUp? <Link href="/sign-up">Register Now</Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert color={formState.success ? "success" : "danger"} variant="solid">
          {formState.success ? "Login successful" : errors.server}
        </Alert>
      </Snackbar>
    </>
  );
}
