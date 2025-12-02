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

// Repost
export async function repostPost(postId, userId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/${postId}/repost`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Repost failed",
      };
    }

    return {
      success: true,
      message: data.message || "Reposted!",
      repostId: data.repost_id,
    };
  } catch (err) {
    console.error("Repost error:", err);
    return {
      success: false,
      message: "Network error. Try again.",
    };
  }
}

// connection request
export async function sendConnectionRequest(receiverId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/request`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id: receiverId }),
    }
  );
  return await res.json();
}

// Accept Connection
export async function acceptConnection(otherUserId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/accept`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_id: otherUserId }), // The user who sent request
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to accept" };
    }

    return {
      success: true,
      message: data.message || "Connection accepted",
    };
  } catch (err) {
    console.error("Accept connection error:", err);
    return {
      success: false,
      message: "Network error",
    };
  }
}

// Reject Connections
export async function rejectConnection(otherUserId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/reject`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_id: otherUserId }), // The user who sent request
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to reject request",
      };
    }

    return {
      success: true,
      message: data.message || "Request rejected",
    };
  } catch (err) {
    console.error("Reject connection error:", err);
    return {
      success: false,
      message: "Network error",
    };
  }
}
