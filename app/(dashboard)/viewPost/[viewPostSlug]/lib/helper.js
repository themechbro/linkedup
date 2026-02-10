export const fetchPost = async (postId) => {
  if (!postId) return null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/getPost?postId=${postId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchComments = async (postId) => {
  if (!postId) return [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/${postId}/comments`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
