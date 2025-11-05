"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Input,
  FormLabel,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/joy";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { SignupAction } from "./sign-up-action";
import SignupPageSnackbar from "./snackbar";

export default function LinkedUpSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, formAction, isPending] = useActionState(SignupAction, {});
  const messageError = formState.errors ?? {};
  const messageSuccess = formState.success ?? {};
  const [snackbar, setSnackbar] = useState(false);
  const snackColor = messageError.server ? "danger" : "success";

  useEffect(() => {
    if (formState.success || formState.errors?.server) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackbar(true);
    }
  }, [formState]);

  const sx_formLabel = {
    fontFamily: "Roboto Condensed",
    fontWeight: "bold",
    color: "#0b0829ff",
  };
  const sx_typography = {
    fontFamily: "Roboto Condensed",
    fontWeight: "thin",
    color: "#0b0829ff",
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box component="form" sx={{ mb: 3 }} action={formAction}>
            {/* Email */}
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel sx={sx_formLabel}>Email Address</FormLabel>
              <Input type="email" name="email" />
              {messageError.email ? (
                <FormHelperText sx={{ color: "red" }}>
                  {messageError.email}
                </FormHelperText>
              ) : null}
            </FormControl>
            {/* Username */}
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel sx={sx_formLabel}>Username</FormLabel>
              <Input type="text" name="username" />
              {messageError.username ? (
                <FormHelperText sx={{ color: "red" }}>
                  {messageError.username}
                </FormHelperText>
              ) : null}
            </FormControl>
            {/* Password */}
            <FormControl required sx={{ mb: 2 }}>
              <FormLabel sx={sx_formLabel}>Password</FormLabel>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                endDecorator={
                  <Tooltip
                    arrow
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Eye color="green" />
                      ) : (
                        <EyeClosed color="red" />
                      )}
                    </IconButton>
                  </Tooltip>
                }
              />
              {messageError.password ? (
                <FormHelperText sx={{ color: "red" }}>
                  {messageError.password}
                </FormHelperText>
              ) : null}
            </FormControl>

            <FormLabel sx={{ mb: 2 }}>
              {" "}
              <Typography level="body-sm" sx={sx_typography}>
                By clicking Agree & Join or Continue, you agree to the LinkedUp
                User Agreement, Privacy Policy, and Cookie Policy. Agree & Join
              </Typography>
            </FormLabel>

            {messageError.server && (
              <FormHelperText sx={{ color: "red", mb: 2 }}>
                {messageError.server}
              </FormHelperText>
            )}
            <Button type="submit">Agree & Join</Button>
          </Box>
          <Typography level="body-sm" sx={sx_typography}>
            Already on LinkedUp?{" "}
            <Link href="/sign-in" style={{ textDecoration: "underline" }}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>

      {snackbar ? (
        <SignupPageSnackbar
          open={snackbar}
          close={() => setSnackbar(false)}
          severity={snackColor}
          message={messageSuccess.message || messageError.server}
        />
      ) : null}
    </>
  );
}
