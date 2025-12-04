"use client";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  ListItemDecorator,
  Skeleton,
  Snackbar,
  Tooltip,
} from "@mui/joy";
import {
  ThumbsUp,
  MessageCircleMore,
  Send,
  Repeat,
  EllipsisVertical,
  Plus,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import CommentComposer from "../comments/comment-composer";
import CommentList from "../comments/commentList";
import { postMenuItems } from "./menu/items";
import PostLikedList from "./liked-list/postliked_list";
import { redirect } from "next/navigation";
import {
  deletePost,
  repostPost,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
} from "./lib/helpers";
import EditPostModal from "./modals/editpostModal";
import ConnectionButtons from "./connection/buttons";

export default function PostCard({
  post,
  loadingIni,
  onPostDeleted,
  onConnectionStatusChanged,
}) {
  const media =
    typeof post.media_url === "string"
      ? JSON.parse(post.media_url)
      : post.media_url || [];
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(
    post.liked_by?.includes(post.current_user) || false
  );
  const [openComment, setOpenComment] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState(null);
  const [openLiked, setOpenLiked] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    color: "success",
  });

  const [localStatus, setLocalStatus] = useState(
    post.connection_status || "not_connected"
  );
  const [connLoading, setConnLoading] = useState(false);

  const handleCommentAdded = (comment) => {
    setNewComment(comment);
  };
  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/likes/${post.id}`,
        {
          method: "POST",
          credentials: "include",
        }
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

  const renderContentWithHashtags = (text) => {
    if (!text) return null;

    // Regex to find hashtags: a '#' followed by one or more word characters.
    const hashtagRegex = /(#\w+)/g;
    const parts = text.split(hashtagRegex);

    return parts.map((part, index) => {
      if (part.match(hashtagRegex)) {
        // This part is a hashtag, so we style it.
        return (
          <Typography
            key={index}
            component="span" // Render as a span to stay inline
            sx={{
              fontWeight: "bold",
              color: "primary.500", // Joy UI's primary blue color
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {part}
          </Typography>
        );
      }
      // This part is regular text.
      return part;
    });
  };

  if (loadingIni) {
    return (
      <Card variant="outlined" sx={{ borderRadius: "lg" }}>
        <CardContent>
          {/* USER HEADER */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left side (avatar + name) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton
                variant="circular"
                width={46}
                height={46}
                animation="wave"
              />

              <Box>
                <Skeleton variant="text" width={140} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width={180} sx={{ mb: 0.5 }} />
              </Box>
            </Box>

            {/* Right Menu Button Skeleton */}
            <Skeleton
              variant="rectangular"
              width={35}
              height={35}
              sx={{ borderRadius: "50%" }}
            />
          </Box>

          {/* POST CONTENT */}
          <Skeleton variant="text" sx={{ mb: 1 }} width="90%" />
          <Skeleton variant="text" sx={{ mb: 1 }} width="80%" />
          <Skeleton variant="text" sx={{ mb: 2 }} width="60%" />

          {/* MEDIA (IF ANY) */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            animation="wave"
            sx={{ borderRadius: "lg", my: 2 }}
          />

          {/* LIKE + COMMENT COUNTS */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={80} />
          </Box>

          <Divider />

          {/* CTA BUTTONS */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              gap: 2,
              mt: 2,
            }}
          >
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={100} height={32} />
            <Skeleton variant="rectangular" width={90} height={32} />
            <Skeleton variant="rectangular" width={85} height={32} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const handleMenuClick = async (action) => {
    if (action === "Delete Post") {
      const result = await deletePost(post.id, post.current_user);

      if (result.success) {
        onPostDeleted(post.id);
        setSnack({
          open: true,
          message: "Post deleted successfully",
          color: "success",
        });
      } else {
        alert(result.error || "Failed to delete post");
        setSnack({
          open: true,
          message: result.error || "Failed to delete post",
          color: "danger",
        });
      }
    }

    if (action === "Edit Post") {
      setOpenEdit(true);
    }

    if (action === "Report Post") {
      // open report modal
    }

    if (action === "Not Interested") {
      // hide post from feed
    }
  };

  async function handleRepost() {
    const result = await repostPost(post.id, post.current_user);

    if (result.success) {
      alert("Reposted this Post");
    } else {
      alert(result.message || "Failed to repost");
    }
  }

  const originalMedia =
    post.original_post && typeof post.original_post.media_url === "string"
      ? JSON.parse(post.original_post.media_url)
      : post.original_post?.media_url || [];

  // async function handleConnect() {
  //   const res = await sendConnectionRequest(post.owner);
  //   if (res.success) {
  //     setLocalStatus("pending"); // instantly update UI
  //   }
  // }

  // const handleAccept = async (id) => {
  //   const res = await acceptConnection(id);
  //   if (res.success) setLocalStatus("connected");
  // };

  // const handleReject = async (id) => {
  //   const res = await rejectConnection(id);
  //   if (res.success) setLocalStatus("not_connected");
  // };

  const handleConnect = async () => {
    if (connLoading) return;
    setConnLoading(true);

    setLocalStatus("pending");

    try {
      const res = await sendConnectionRequest(post.owner);

      // 👇 Change this check
      if (res.ok) {
        // Instead of: res.ok && res.success
        setLocalStatus("pending");
      } else {
        setLocalStatus(post.connection_status || "not_connected");
        console.error("Connect failed:", res.message);
      }
    } catch (err) {
      console.error("Connect error:", err);
      setLocalStatus(post.connection_status || "not_connected");
    } finally {
      setConnLoading(false);
    }
  };
  // accept a request (the other user was sender)
  const handleAccept = async (senderId) => {
    if (connLoading) return;
    setConnLoading(true);

    try {
      const res = await acceptConnection(senderId);
      if (res.ok && res.success) {
        setLocalStatus("connected");

        // 👇 Update ALL posts from this user in the parent feed
        if (onConnectionStatusChanged) {
          onConnectionStatusChanged(post.owner, "connected");
        }
      } else {
        console.error("Accept failed:", res.message);
      }
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setConnLoading(false);
    }
  };

  // reject a request
  const handleReject = async (senderId) => {
    if (connLoading) return;
    setConnLoading(true);

    try {
      const res = await rejectConnection(senderId);
      if (res.ok && res.success) {
        setLocalStatus("not_connected");
        // 👇 DON'T trigger any parent updates that might cause scroll
      } else {
        console.error("Reject failed:", res.message);
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setConnLoading(false);
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: "lg" }}>
        <CardContent>
          {/* 🔄 REPOST HEADER */}
          {post.repost_of && post.original_post && (
            <Box
              sx={{
                mb: 1,
                p: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "neutral.600",
                fontFamily: "Roboto Condensed",
              }}
            >
              <Repeat size={16} />
              <Typography level="body-sm">
                {post.owner == post.original_post.owner
                  ? `${post.full_name} reposted there own post`
                  : `${post.full_name} reposted ${post.original_post.full_name}'s post`}
              </Typography>
            </Box>
          )}

          {/* User info */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Avatar
                src={
                  post?.profile_picture
                    ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.profile_picture}`
                    : "/default.img"
                }
              />
              <Box>
                <Typography
                  level="title-md"
                  onClick={() => redirect(`/profile/${post.owner}`)}
                  sx={{ cursor: "pointer" }}
                >
                  {post.full_name}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  @{post.username} ·{" "}
                  {new Date(post.created_at).toLocaleString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </Typography>
              </Box>
            </Box>

            <Box className="post-menu" sx={{ display: "flex", gap: 2 }}>
              {/* {post.current_user !== post.owner ? (
                <Button
                  variant="plain"
                  sx={{ fontFamily: "Roboto Condensed" }}
                  startDecorator={<Plus />}
                  onClick={sendConnectionRequest(post.owner)}
                >
                  Connect
                </Button>
              ) : null} */}

              {/* Connection Buttons */}

              {/* {post.owner !== post.current_user && (
                <>
                  {localStatus === "not_connected" && (
                    <Button onClick={handleConnect}>Connect</Button>
                  )}

                  {localStatus === "pending" && (
                    <Button disabled>Pending...</Button>
                  )}

                  {post.connection_status === "incoming_request" && (
                    <Box>
                      <Tooltip title="Accept Request">
                        <Button
                          sx={{ mr: 3 }}
                          onClick={() => acceptConnection(post.owner)}
                          startDecorator={<Check />}
                        ></Button>
                      </Tooltip>
                      <Tooltip title="Reject Request">
                        <Button
                          onClick={() => rejectConnection(post.owner)}
                          startDecorator={<X />}
                        ></Button>
                      </Tooltip>
                    </Box>
                  )}

                  {post.connection_status === "connected" && (
                    <Button disabled variant="plain">
                      Connected
                    </Button>
                  )}
                </>
              )} */}

              <ConnectionButtons
                post={post}
                handleConnect={handleConnect}
                localStatus={localStatus}
                acceptConnection={handleAccept}
                rejectConnection={handleReject}
              />
              {/* Dropdown Menu */}
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{ root: { variant: "plain", color: "neutral" } }}
                >
                  <EllipsisVertical />
                </MenuButton>
                {/* <Menu>
                {postMenuItems.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      sx={{ fontFamily: "Roboto Condensed" }}
                    >
                      <ListItemDecorator>{item.icon}</ListItemDecorator>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Menu> */}
                <Menu>
                  {postMenuItems
                    .filter((item) => {
                      // Only show Delete Post if current user owns the post
                      if (item.name === "Delete Post") {
                        return post.current_user === post.owner;
                      }
                      if (item.name == "Not Interested") {
                        return post.current_user !== post.owner;
                      }
                      if (item.name == "Report Post") {
                        return post.current_user !== post.owner;
                      }
                      if (item.name == "Edit Post") {
                        return post.current_user === post.owner;
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
          </Box>

          {/* Content */}
          <Typography level="body-md" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {renderContentWithHashtags(post.content)}
          </Typography>

          {/* 🔄 ORIGINAL POST CONTENT (inside repost) */}
          {post.repost_of && post.original_post && (
            <Card
              variant="soft"
              sx={{
                borderRadius: "lg",
                backgroundColor: "neutral.softBg",
                p: 2,
                my: 2,
              }}
            >
              {/* Original Post Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={
                    post.original_post.profile_picture
                      ? `${process.env.NEXT_PUBLIC_HOST_IP}${post.original_post.profile_picture}`
                      : "/default.img"
                  }
                />
                <Box>
                  <Typography level="title-sm">
                    {post.original_post.full_name}
                  </Typography>
                  <Typography level="body-xs" color="neutral">
                    @{post.original_post.username} ·{" "}
                    {new Date(post.original_post.created_at).toLocaleString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Original Post Content */}
              <Typography
                level="body-sm"
                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
              >
                {renderContentWithHashtags(post.original_post.content)}
              </Typography>

              {/* Original Post Media */}
              {originalMedia.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {originalMedia.map((m, i) =>
                    m.type === "videos" ? (
                      <video
                        key={i}
                        src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                        controls
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                    ) : (
                      <img
                        key={i}
                        src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                        alt="post media"
                        style={{ borderRadius: "8px", width: "100%" }}
                      />
                    )
                  )}
                </Box>
              )}
            </Card>
          )}

          {/* Media */}
          {media.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {media.map((m, i) =>
                m.type === "videos" ? (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      mt: "10px",
                      borderRadius: "lg",
                      overflow: "hidden",
                      bgcolor: "black",
                    }}
                  >
                    <video
                      src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                      controls
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9", // Or another ratio that fits your images
                      mt: "10px",
                      borderRadius: "lg",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                      alt="post media"
                      fill
                      sizes="100vw"
                      unoptimized
                    />
                  </Box>
                )
              )}
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            {post.comment_count > 0 && (
              <Box className="comment-counts">
                <Typography
                  level="body-sm"
                  color="neutral"
                  onClick={() => setOpenComment(true)}
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {post.comment_count} comments
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />
          <Box
            className="call_to_action"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              gap: 2,
              mt: 2,
              flexShrink: 1,
            }}
          >
            <Button
              size="sm"
              variant="plain"
              color={liked ? "primary" : "neutral"}
              startDecorator={<ThumbsUp size={16} />}
              onClick={handleLike}
            >
              {liked ? "Liked" : "Like"}
            </Button>

            <Button
              startDecorator={<MessageCircleMore />}
              variant="plain"
              color="neutral"
              onClick={() => setOpenComment((prev) => !prev)}
            >
              Comment
            </Button>
            <Button
              startDecorator={<Repeat />}
              variant="plain"
              color="neutral"
              onClick={handleRepost}
            >
              Repost
            </Button>
            <Button startDecorator={<Send />} variant="plain" color="neutral">
              Share
            </Button>
          </Box>

          {openComment && (
            <Box>
              <Divider sx={{ mt: 1, mb: 1 }} />

              {/* CommentComposer comes first */}
              <CommentComposer
                post_id={post.id}
                onCommentAdded={handleCommentAdded}
              />

              {/* Then the list — it listens for changes in newComment */}
              <CommentList post_id={post.id} newComment={newComment} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Liked List Modal */}
      <PostLikedList
        open={openLiked}
        close={() => setOpenLiked(false)}
        post_id={post.id}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        color={snack.color}
        onClose={() => setSnack({ ...snack, open: false })}
        autoHideDuration={2000}
        sx={{ fontFamily: "Roboto Condensed" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {snack.message}
      </Snackbar>

      {/* Edit Post Modal */}
      <EditPostModal
        openEdit={openEdit}
        closeEdit={() => setOpenEdit(false)}
        post={post}
      />
    </>
  );
}
