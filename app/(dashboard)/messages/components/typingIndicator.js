import { Box, Avatar, Typography } from "@mui/joy";

export default function TypingIndicator({ otherUser }) {
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
        src={
          otherUser?.profilePicture
            ? `${process.env.NEXT_PUBLIC_HOST_IP}${otherUser.profilePicture}`
            : "/default.img"
        }
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
