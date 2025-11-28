"use client";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Box,
  List,
  ListItem,
  ListItemDecorator,
  ListItemContent,
  Avatar,
  Chip,
  Skeleton,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function PostLikedList({ open, close, post_id }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/likelist?post_id=${post_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setList(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal open={open} onClose={close}>
      <ModalDialog
        sx={{
          width: 480,
          borderRadius: "lg",
          p: 0,
          overflow: "hidden",
        }}
      >
        <ModalClose />

        {/* Header */}
        <Box sx={{ borderBottom: "1px solid #e5e5e5", p: 2 }}>
          <Typography
            level="title-lg"
            sx={{ fontFamily: "Roboto Condensed", fontWeight: 700 }}
          >
            Liked by
          </Typography>

          {list && (
            <Typography
              level="body-sm"
              sx={{ mt: 0.5, color: "text.secondary" }}
            >
              {list.likes_count} {list.likes_count === 1 ? "person" : "people"}
            </Typography>
          )}
        </Box>

        {/* Body */}
        <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {!loading && list && (
            <List
              sx={{
                "--ListItemDecorator-size": "50px",
                p: 2,
              }}
            >
              {list.liked_users.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderRadius: "md",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    transition: "0.2s",
                    py: 1.5,
                    px: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    redirect(`/profile/${item.user_id}`);
                  }}
                >
                  <ListItemDecorator>
                    <Avatar
                      src={`${process.env.NEXT_PUBLIC_HOST_IP}${item.profile_picture}`}
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemDecorator>

                  <ListItemContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography level="title-md" sx={{ fontWeight: 600 }}>
                        {item.username}
                      </Typography>

                      {item.liked_by_me && (
                        <Chip
                          variant="soft"
                          color="primary"
                          size="sm"
                          sx={{
                            fontSize: "0.7rem",
                            textTransform: "none",
                            p: 0,
                            px: 1,
                          }}
                        >
                          You
                        </Chip>
                      )}
                    </Box>

                    <Typography
                      level="body-sm"
                      sx={{ color: "text.secondary", mt: 0.2 }}
                    >
                      @{item.username.split(" ")[0].toLowerCase()}
                    </Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          )}

          {/* Skeleton Loader */}
          {loading && (
            <Box sx={{ p: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </ModalDialog>
    </Modal>
  );
}
