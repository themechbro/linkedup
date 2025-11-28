export async function SignupAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const full_name = formData.get("full_name");

  let errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }
  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (!full_name) {
    errors.full_name = "Name is required";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username, full_name }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message;
      return {
        errors: {
          server: errorMessage,
        },
      };
    }

    return { success: data, errors: null };
  } catch (error) {
    console.error("Error during Signup", error);
    return {
      errors: {
        server: "Oh Snap! Something went wrong. Please try again later.",
      },
    };
  }
}
