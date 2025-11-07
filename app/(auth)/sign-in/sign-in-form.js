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
  Divider,
} from "@mui/joy";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { LoginAction } from "./sign-in-action";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function LinkedUpSignInPageForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, formAction, isPending] = useActionState(LoginAction, {});

  const router = useRouter();
  // const messageError = formState.errors ?? {};

  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => {
        router.replace("/home");
      }, 1500); // wait a moment so snackbar shows
      return () => clearTimeout(timer);
    }
  }, [formState.success, router]);

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
    <Card>
      <CardContent>
        <Box component="form" sx={{ mb: 3 }} action={formAction}>
          {/* Username */}
          <FormControl required sx={{ mb: 2 }}>
            <FormLabel sx={sx_formLabel}>Username</FormLabel>
            <Input type="text" name="username" />
            {/* {messageError.username ? (
              <FormHelperText sx={{ color: "red" }}>
                {messageError.username}
              </FormHelperText>
            ) : null} */}
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
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? (
                      <Eye color="green" />
                    ) : (
                      <EyeClosed color="red" />
                    )}
                  </IconButton>
                </Tooltip>
              }
            />
            {/* {messageError.password ? (
              <FormHelperText sx={{ color: "red" }}>
                {messageError.password}
              </FormHelperText>
            ) : null} */}
          </FormControl>
          <Button type="submit" sx={{ borderRadius: 30 }}>
            Sign In
          </Button>
        </Box>
        <Divider sx={{ color: "black", mb: 3 }} />
        <Button
          startDecorator={<GoogleIcon />}
          component="a"
          href={`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/google`}
          variant="soft"
          sx={{ fontFamily: "Roboto Condensed" }}
          color="success"
        >
          Login Using Google
        </Button>
        <Divider>
          <Typography level="body-lg" sx={{ fontFamily: "Roboto Condensed" }}>
            OR
          </Typography>
        </Divider>
        <Button
          startDecorator={<FacebookIcon />}
          component="a"
          href={`${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/facebook`}
          variant="soft"
          sx={{ fontFamily: "Roboto Condensed" }}
          color="primary"
        >
          Login Using Facebook
        </Button>
        <Divider sx={{ color: "black", mt: 3, mb: 3 }} />
        <Typography level="body-sm" sx={sx_typography}>
          New to LinkedUp? {""}
          <Link href="/sign-up" style={{ textDecoration: "underline" }}>
            Register Now
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
