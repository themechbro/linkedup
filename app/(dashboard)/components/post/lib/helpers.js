export const deletePost = async (post_id, current_user) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP_MICRO}/api/posts/${post_id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-User-Id": current_user,
        },
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || "Failed to delete post",
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// lib/helpers.js
