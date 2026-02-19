"use client";
import {
  Card,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Stack,
  Divider,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  ListItemDecorator,
} from "@mui/joy";
import {
  EllipsisVertical,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
} from "lucide-react";
import VideoPlayer from "@/app/(dashboard)/components/post/player/videoPlayer";
import Image from "next/image";
import PostLikedList from "@/app/(dashboard)/components/post/liked-list/postliked_list";
import { useState } from "react";
import ImagegridModal from "@/app/(dashboard)/components/post/ImageGrid/imageModal";
import RepostViewerModal from "@/app/(dashboard)/components/post/modals/repostviewer";
import CommentComposer from "@/app/(dashboard)/components/comments/comment-composer";
import CommentList from "@/app/(dashboard)/components/comments/commentList";
import {
  repostPost,
  renderContentWithHashtagsAndLinks,
  deletePost,
  createViewPostLink,
} from "@/app/(dashboard)/components/post/lib/helpers";
import { postMenuItems } from "@/app/(dashboard)/components/post/menu/items";
import EditPostModal from "@/app/(dashboard)/components/post/modals/editpostModal";
import RepostSnackbar from "@/app/(dashboard)/viewPost/[viewPostSlug]/components/repostSnackbar";
import DeletePostSnackbar from "@/app/(dashboard)/components/post/snackbar/deletePostSnack";
import CopyClipboardSnack from "@/app/(dashboard)/components/post/snackbar/copyClipboardSnack";

export default function BrandPostCard({ post, requestedBy }) {
  const formatTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };
  const [openLiked, setOpenLiked] = useState(false);
  const [mediaViewer, setMediaViewer] = useState({
    open: false,
    currentIndex: 0,
  });
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [repostModal, setRepostModal] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [repostSnack, setRepostSnack] = useState({
    open: false,
    type: "",
  });
  const [clipboardSnack, setClipboardSnack] = useState({
    open: false,
    type: "success",
  });
  const [deleteSnack, setDeleteSnack] = useState({
    open: false,
    type: "",
  });
  const isRepost = !!post.repostedPost;
  let media = [];
  try {
    media =
      typeof post.media_url === "string"
        ? JSON.parse(post.media_url)
        : post.media_url || [];
  } catch {
    media = [];
  }

  let mediaR = [];

  try {
    mediaR =
      typeof post.repostedPost?.media_url === "string"
        ? JSON.parse(post.repostedPost.media_url)
        : post.repostedPost?.media_url || [];
  } catch {
    mediaR = [];
  }

  const renderMediaGrid = (mediaArray) => {
    if (!mediaArray?.length) return null;

    return (
      <Box
        sx={{
          display: "grid",
          gap: 0.5,
          mt: 2,
          borderRadius: "lg",
          overflow: "hidden",
          gridTemplateColumns:
            mediaArray.length === 1
              ? "1fr"
              : mediaArray.length === 2
                ? "1fr 1fr"
                : mediaArray.length === 3
                  ? "repeat(2, 1fr)"
                  : mediaArray.length === 4
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
        }}
      >
        {mediaArray.slice(0, 5).map((m, i) => {
          const isVideo = m.type === "videos";

          const isLastItem = i === 4 && mediaArray.length > 5;

          const remainingCount = mediaArray.length - 5;

          return (
            <Box
              key={i}
              sx={{
                position: "relative",
                width: "100%",
                height:
                  mediaArray.length === 1
                    ? "400px"
                    : mediaArray.length === 2
                      ? "300px"
                      : "200px",
                overflow: "hidden",
                bgcolor: "black",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
                ...(mediaArray.length === 3 &&
                  i === 0 && {
                    gridColumn: "span 2",
                    height: "300px",
                  }),
              }}
              onClick={() => {
                if (!isVideo) openMediaViewer(i);
              }}
            >
              {isLastItem ? (
                <>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                    alt="post media"
                    fill
                    style={{
                      objectFit: "cover",
                      filter: "brightness(0.4)",
                    }}
                    unoptimized
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    +{remainingCount}
                  </Box>
                </>
              ) : isVideo ? (
                <VideoPlayer
                  src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                  alt="post media"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  const openMediaViewer = (index) => {
    setMediaViewer({ open: true, currentIndex: index });
  };

  const closeMediaViewer = () => {
    setMediaViewer({ open: false, currentIndex: 0 });
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/likes/${post.id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setLiked(data.liked);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };
  async function handleRepost() {
    const result = await repostPost(post.id, post.current_user);

    if (result.success) {
      setRepostSnack({
        open: true,
        type: "success",
      });
    } else {
      setRepostSnack({
        open: true,
        type: "fail",
      });
    }
  }

  const handleCommentAdded = (comment) => {
    setNewComment(comment);
  };

  const handleMenuClick = async (action) => {
    if (action === "Delete Post") {
      const result = await deletePost(post.id, requestedBy);

      if (result.success) {
        onPostDeleted(post.id);
        setDeleteSnack({
          open: true,
          type: "success",
        });
      } else {
        setDeleteSnack({
          open: true,
          type: "fail",
        });
      }
    }

    if (action === "Edit Post") {
      setOpenEdit(true);
    }

    if (action === "Report Post") {
      // open report modal
      alert("Report feature coming soon.");
    }

    if (action === "Not Interested") {
      alert("This feature coming soon.");
    }
    if (action === "Save") {
      alert("This feature coming soon.");
    }

    if (action === "Copy link to Post") {
      const link = createViewPostLink(post.id);
      if (!link) return;

      navigator.clipboard
        .writeText(link)
        .then(() => {
          setClipboardSnack({ open: true, type: "success" });

          setTimeout(() => {
            setClipboardSnack((prev) => ({ ...prev, open: false }));
          }, 3000);
        })
        .catch(() => {
          setClipboardSnack({ open: true, type: "danger" });

          setTimeout(() => {
            setClipboardSnack((prev) => ({ ...prev, open: false }));
          }, 3000);
        });
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "12px",
          mb: 2,
          p: 2,
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={
                post.profile_picture
                  ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`
                  : ""
              }
            />

            <Box>
              <Typography fontWeight="lg">
                {post.full_name || post.username}
              </Typography>

              <Typography level="body-xs">
                {formatTime(post.createdAt)}

                {isRepost && " • Reposted"}
              </Typography>
            </Box>
          </Box>

          {/* Dropdown Menu */}
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: "plain", color: "neutral" } }}
            >
              <EllipsisVertical />
            </MenuButton>

            <Menu>
              {postMenuItems
                .filter((item) => {
                  // Only show Delete Post if current user owns the post
                  if (item.name === "Delete Post") {
                    return requestedBy === post.owner;
                  }
                  if (item.name == "Not Interested") {
                    return post.current_user !== post.owner;
                  }
                  if (item.name == "Report Post") {
                    return post.current_user !== post.owner;
                  }
                  if (item.name == "Edit Post") {
                    return requestedBy === post.owner;
                  }
                  return true; // show all other items always
                })
                .map((item, index) => (
                  <MenuItem
                    key={index}
                    sx={{ fontFamily: "Roboto Condensed" }}
                    onClick={() => handleMenuClick(item.name)}
                  >
                    <ListItemDecorator>{item.icon}</ListItemDecorator>
                    {item.name}
                  </MenuItem>
                ))}
            </Menu>
          </Dropdown>
        </Box>

        {/* Caption */}
        {post.content && (
          <Typography level="body-md" sx={{ mt: 1, whiteSpace: "pre-line" }}>
            {renderContentWithHashtagsAndLinks(post.content)}
          </Typography>
        )}

        {/* Repost */}
        {isRepost ? (
          <Card
            variant="outlined"
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: "10px",
              backgroundColor: "background.level1",
              cursor: "pointer",
            }}
            onClick={() => setRepostModal(true)}
          >
            {/* Original Header */}
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                size="sm"
                src={
                  post.repostedPost.profile_picture
                    ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.repostedPost.profile_picture}`
                    : ""
                }
              />

              <Box>
                <Typography fontWeight="md" level="body-sm">
                  {post.repostedPost.full_name || post.repostedPost.username}
                </Typography>

                <Typography level="body-xs">
                  {formatTime(post.repostedPost.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Original Content */}
            {post.repostedPost.content && (
              <Typography level="body-sm" sx={{ mt: 1 }}>
                {post.repostedPost.content}
              </Typography>
            )}

            {/* Original Media */}
            {/* {renderMedia(post.repostedPost.media_url)} */}
            {renderMediaGrid(mediaR)}
          </Card>
        ) : (
          // renderMedia(post.media_url)

          renderMediaGrid(media)
        )}

        {/* Stats */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          {/* <Typography
            level="body-xs"
            onClick={() => setOpenLiked(true)}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            👍{" "}
            {post.liked_by_me
              ? `You and ${post.likes - 1} others liked this post`
              : post.likes || 0}
          </Typography> */}

          {likes > 0 && (
            <Box className="counts">
              <Typography
                level="body-sm"
                color="neutral"
                onClick={() => setOpenLiked((prev) => !prev)}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {(() => {
                  if (liked) {
                    if (likes === 1) {
                      return "You liked this";
                    }
                    const otherLikes = likes - 1;
                    return `You and ${otherLikes} other${
                      otherLikes > 1 ? "s" : ""
                    } liked this`;
                  }
                  return `${likes} like${likes > 1 ? "s" : ""}`;
                })()}
              </Typography>
            </Box>
          )}

          <Typography level="body-xs">
            {post.commentCount || 0} comments • {post.repostCount || 0} reposts
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Actions */}
        <Stack direction="row" justifyContent="space-around">
          <Button
            variant="plain"
            startDecorator={<ThumbsUp size={18} />}
            color={liked || post.liked_by_me ? "primary" : "neutral"}
            onClick={handleLike}
          >
            {post.liked_by_me ? "Liked" : "Like"}
          </Button>

          <Button
            variant="plain"
            startDecorator={<MessageCircle size={18} />}
            color="neutral"
            onClick={() => setOpenComment((prev) => !prev)}
          >
            Comment
          </Button>

          <Button
            variant="plain"
            startDecorator={<Repeat2 size={18} />}
            color="neutral"
            onClick={handleRepost}
          >
            Repost
          </Button>

          <Button
            variant="plain"
            startDecorator={<Send size={18} />}
            color="neutral"
          >
            Send
          </Button>
        </Stack>

        {openComment && (
          <Box>
            <Divider sx={{ mt: 1, mb: 1 }} />

            <CommentComposer
              post_id={post.id}
              onCommentAdded={handleCommentAdded}
            />

            <CommentList post_id={post.id} newComment={newComment} />
          </Box>
        )}
      </Card>

      {/* Misc items */}
      <PostLikedList
        open={openLiked}
        close={() => setOpenLiked(false)}
        post_id={post.id}
      />

      <ImagegridModal
        mediaViewer={mediaViewer}
        closeMediaViewer={closeMediaViewer}
        setMediaViewer={setMediaViewer}
        media={media}
      />
      {isRepost ? (
        <RepostViewerModal
          open={repostModal}
          close={() => setRepostModal(false)}
          repostedPost={post.repostedPost}
        />
      ) : null}

      <EditPostModal
        openEdit={openEdit}
        closeEdit={() => {
          setOpenEdit(false);
        }}
        post={post}
        requestedBy={requestedBy}
      />

      <RepostSnackbar
        open={repostSnack.open}
        close={() => {
          setRepostSnack({ open: false, type: "" });
        }}
        type={repostSnack.type}
      />
      <DeletePostSnackbar
        open={deleteSnack.open}
        close={() => {
          setDeleteSnack({ open: false, type: "" });
        }}
        type={deleteSnack.type}
      />

      <CopyClipboardSnack
        open={clipboardSnack.open}
        type={clipboardSnack.type}
        close={() => setClipboardSnack((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
