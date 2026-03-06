import { Box, Avatar, Typography } from "@mui/joy";

export default function TypingIndicator({ otherUser }) {
  const privateMediaHosts = (
    process.env.NEXT_PUBLIC_PRIVATE_MEDIA_HOSTS ||
    "blr1.kos.olakrutrimsvc.com"
  )
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const resolveAssetUrl = (url) => {
    if (!url) return "";
    if (/^\/api\/private-media\?url=/i.test(url)) return url;

    if (/^(https?:)?\/\//i.test(url)) {
      try {
        const parsed = new URL(url);
        if (privateMediaHosts.includes(parsed.hostname.toLowerCase())) {
          return `/api/private-media?url=${encodeURIComponent(url)}`;
        }
      } catch {
        return url;
      }
      return url;
    }

    const base = process.env.NEXT_PUBLIC_HOST_IP || "";
    if (!base) return url;

    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${normalizedBase}${normalizedPath}`;
  };

  const otherUserAvatar =
    resolveAssetUrl(otherUser?.profilePicture) || "/default.img";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 1.5,
        px: 1,
      }}
    >
      <Avatar
        src={otherUserAvatar}
        size="sm"
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          backgroundColor: "neutral.100",
          px: 2,
          py: 1,
          borderRadius: "16px",
          animation: "fadeIn 0.3s ease-in",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.500",
              animation: "bounce 1.4s infinite ease-in-out",
              animationDelay: "0s",
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.500",
              animation: "bounce 1.4s infinite ease-in-out",
              animationDelay: "0.2s",
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.500",
              animation: "bounce 1.4s infinite ease-in-out",
              animationDelay: "0.4s",
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0)" },
                "40%": { transform: "scale(1)" },
              },
            }}
          />
        </Box>
        <Typography
          level="body-xs"
          sx={{ color: "neutral.600", fontWeight: 500 }}
        >
          typing...
        </Typography>
      </Box>
    </Box>
  );
}
