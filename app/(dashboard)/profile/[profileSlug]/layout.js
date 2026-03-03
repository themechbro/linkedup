import { notFound } from "next/navigation";

export async function generateMetaData({ params }) {
  const { profileSlug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/fetch/fetch-profile?user_id=${profileSlug}`,
    { method: "GET", cache: "no-store", credentials: "include" },
  );
  if (!res.ok) return {};

  const user = await res.json();

  if (!user) return notFound();
  return {
    title: `${user.profile.full_name} (@${user.profile.username}) | LinkedUp`,
    description:
      user.profile.about ||
      `View ${user.profile.full_name}'s profile on LinkedUp.`,
    openGraph: {
      title: `${user.profile.full_name} (@${user.profile.username})`,
      description: user.profile.about,
      images: [
        {
          url: user.profile.profile_picture
            ? `${process.env.NEXT_PUBLIC_HOST_IP}${user.profile.profile_picture}`
            : "/default-avatar.png",
        },
      ],
    },
  };
}

export default function ProfileLayout({ children }) {
  return <>{children}</>;
}
