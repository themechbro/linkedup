export async function LoginAction(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  let errors = {};

  if (!username) errors.username = "Username is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // ✅ important for session cookies
      },
    );

    const data = await response.json();

    // Too many requests
    if (response.status === 429) {
      return {
        success: false,
        errors: {
          server:
            data.message ||
            "Too many login attempts. Please wait before trying again.",
        },
        type: "rate_limit",
      };
    }

    // Invalid credentials
    if (response.status === 401) {
      return {
        success: false,
        errors: {
          server: "Invalid username or password",
        },
        type: "auth",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        errors: {
          server: data.message || "Login failed",
        },
      };
    }

    // ✅ success path
    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      errors: {
        server: "Server unreachable. Please try again later.",
      },
      type: "network",
    };
  }
}
