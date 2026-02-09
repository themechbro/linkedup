// In your profile page or component
export const checkConnection = async (profileId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/check_connection?profileId=${profileId}`,
      { credentials: "include" },
    );
    const data = await res.json();

    console.log(data.status);
    return data;
  } catch (err) {
    console.error("Error checking connection:", err);
  }
};

export const fetchAbout = async (profileId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-about?profileId=${profileId}`,
      { credentials: "include" },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error checking connection:", err);
  }
};

export const fetchEdu = async (profileId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-education?profileId=${profileId}`,
      { credentials: "include" },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error checking connection:", err);
  }
};

export const fetchWork = async (profileId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/details/get/fetch-work?profileId=${profileId}`,
      { credentials: "include" },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error checking connection:", err);
  }
};
