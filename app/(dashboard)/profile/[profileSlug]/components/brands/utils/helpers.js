export const fetchAboutforBrands = async (profileId) => {
  if (!profileId) {
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-about-brands?profileId=${profileId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const EMPTY_POST = {
  id: "",
  content: "",
  media_url: [],
  likes: 0,
  liked_by: [],
  repost_of: null,
  repost_count: 0,
  created_at: "",
  owner: "",
};
