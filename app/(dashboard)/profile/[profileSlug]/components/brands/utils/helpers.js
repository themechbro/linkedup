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
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
