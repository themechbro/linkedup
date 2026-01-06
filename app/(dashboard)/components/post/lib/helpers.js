import { Typography } from "@mui/joy";

// Delete Post
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

// Send Request
export async function sendConnectionRequest(receiver_id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiver_id }),
      }
    );

    const data = await res.json();

    // 👇 Return consistent format
    return {
      ok: res.ok,
      success: res.ok, // ✅ Add this
      message: data.message,
    };
  } catch (err) {
    console.error("Send connection request error:", err);
    return {
      ok: false,
      success: false,
      message: "Failed to send request",
    };
  }
}

// Accept Request
export async function acceptConnection(sender_id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sender_id }),
      }
    );

    const data = await res.json();

    return {
      ok: res.ok,
      success: res.ok, // ✅ Add this
      message: data.message,
    };
  } catch (err) {
    return { ok: false, success: false, message: "Failed to accept" };
  }
}

// Reject Request
export async function rejectConnection(sender_id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sender_id }),
      }
    );

    const data = await res.json();

    return {
      ok: res.ok,
      success: res.ok, // ✅ Add this
      message: data.message,
    };
  } catch (err) {
    return { ok: false, success: false, message: "Failed to reject" };
  }
}

// Hashtags and Link Finder
export const renderContentWithHashtagsAndLinks = (text) => {
  if (!text) return null;

  // Regex patterns
  const hashtagRegex = /(#\w+)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Combined regex to match both hashtags and URLs
  const combinedRegex = /(#\w+|https?:\/\/[^\s]+)/g;

  const parts = text.split(combinedRegex);

  return parts.map((part, index) => {
    // Check if it's a hashtag
    if (part.match(hashtagRegex)) {
      return (
        <Typography
          key={index}
          component="span"
          sx={{
            fontWeight: "bold",
            color: "primary.500",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => {
            // Handle hashtag click - navigate to hashtag page
            console.log("Clicked hashtag:", part);
            // router.push(`/hashtag/${part.slice(1)}`);
          }}
        >
          {part}
        </Typography>
      );
    }

    // Check if it's a URL
    if (part.match(urlRegex)) {
      return (
        <Typography
          key={index}
          component="a"
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "primary.600",
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {part}
        </Typography>
      );
    }

    // Regular text
    return part;
  });
};

// Create viewPost Link
export const createViewPostLink = (postId) => {
  if (!postId) return null;
  let createdLink = `${process.env.NEXT_PUBLIC_HOST_IP_FRONT}/viewPost/${postId}`;
  return createdLink;
};

// Send request functions
