// export async function LoginAction(prevState, formData) {
//   const username = formData.get("username");
//   const password = formData.get("password");

//   let errors = {};

//   if (!username) {
//     errors.username = "Username is required";
//   }
//   if (!password) {
//     errors.password = "Password is required";
//   }

//   if (Object.keys(errors).length > 0) {
//     return {
//       errors,
//     };
//   }

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_HOST_IP}/api/auth/login`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//         credentials: "include",
//       }
//     );
//     const data = await response.json();
//     if (!response.ok) {
//       const errorMessage = data.message;
//       return {
//         errors: {
//           server: errorMessage,
//         },
//       };
//     }
//   } catch (error) {
//     console.log(error);
//     return {
//       errors: {
//         message: "Oh Snap! Something went wrong. Please try again later.",
//       },
//     };
//   }
// }

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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: { server: data.message || "Invalid credentials" },
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
      errors: { server: "Something went wrong. Please try again later." },
    };
  }
}
