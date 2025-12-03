// In your profile page or component
export const checkConnection = async (profileId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/connections/check_connection?profileId=${profileId}`,
      { credentials: "include" }
    );
    const data = await res.json();

    // data.status can be: "own_profile", "connected", "pending", "incoming_request", "not_connected"
    console.log(data.status); // Use this to show appropriate button
    return data;
  } catch (err) {
    console.error("Error checking connection:", err);
  }
};
