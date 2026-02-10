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
} from "@mui/joy";
import {
  ThumbsUp,
  MessageCircleMore,
  Send,
  Repeat,
  EllipsisVertical,
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
  renderContentWithHashtagsAndLinks,
  createViewPostLink,
} from "./lib/helpers";
import EditPostModal from "./modals/editpostModal";
import ConnectionButtons from "./connection/buttons";
import ImagegridModal from "./ImageGrid/imageModal";
import RepostViewerModal from "./modals/repostviewer";
import CopyClipboardSnack from "./snackbar/copyClipboardSnack";
import RepostSnackbar from "../../viewPost/[viewPostSlug]/components/repostSnackbar";
import DeletePostSnackbar from "./snackbar/deletePostSnack";
import VideoPlayer from "./player/videoPlayer";

export default function PostCard({
  post,
  loadingIni,
  onPostDeleted,
  onConnectionStatusChanged,
  requestedBy,
}) {
  useEffect(() => {
    setLikes(post.likes || 0);
    setLiked(post.liked_by_me || false); // ✅ TRUST BACKEND
    setComments(post.comments || []);
    setLocalStatus(post.connection_status || "not_connected");
  }, [post]);

  // const media =
  //   typeof post.media_url === "string"
  //     ? JSON.parse(post.media_url)
  //     : post.media_url || [];

  let media = [];
  try {
    media =
      typeof post.media_url === "string"
        ? JSON.parse(post.media_url)
        : post.media_url || [];
  } catch {
    media = [];
  }
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
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
  const [repostSnack, setRepostSnack] = useState({
    open: false,
    type: "",
  });
  const [deleteSnack, setDeleteSnack] = useState({
    open: false,
    type: "",
  });

  const [localStatus, setLocalStatus] = useState(
    post.connection_status || "not_connected",
  );
  const [connLoading, setConnLoading] = useState(false);
  const [mediaViewer, setMediaViewer] = useState({
    open: false,
    currentIndex: 0,
  });
  const [repostModal, setRepostModal] = useState(false);
  const [clipboardSnack, setClipboardSnack] = useState({
    open: false,
    type: "success",
  });
  const [commentLength, setCommentLength] = useState(0);

  // Functions
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

  //split loading into another component
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

  const originalMedia =
    post.original_post && typeof post.original_post.media_url === "string"
      ? JSON.parse(post.original_post.media_url)
      : post.original_post?.media_url || [];

  // Media
  const openMediaViewer = (index) => {
    setMediaViewer({ open: true, currentIndex: index });
  };

  const closeMediaViewer = () => {
    setMediaViewer({ open: false, currentIndex: 0 });
  };

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

  const commentLengthFetch = async (postId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/posts/comment_length?post_id=${postId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const fetchedLength = await res.json();
      setCommentLength(fetchedLength.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLiked(post?.liked_by_me);
  }, [post]);

  useEffect(() => {
    commentLengthFetch(post?.id);
  }, [post]);

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
                  })}{" "}
                  · {post.status == "edited" ? post.status : null}
                </Typography>
              </Box>
            </Box>

            <Box className="post-menu" sx={{ display: "flex", gap: 2 }}>
              {/* Buttons */}
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
          </Box>

          {/* Content */}
          <Typography level="body-md" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {renderContentWithHashtagsAndLinks(post.content)}
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
                cursor: "pointer",
              }}
              onClick={() => setRepostModal(true)}
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
                      },
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Original Post Content */}
              <Typography
                level="body-sm"
                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
              >
                {renderContentWithHashtagsAndLinks(post.original_post.content)}
              </Typography>

              {/* Original Post Media */}
              {originalMedia.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gap: 0.5,
                    mt: 2,
                    borderRadius: "lg",
                    overflow: "hidden",
                    gridTemplateColumns:
                      originalMedia.length === 1
                        ? "1fr"
                        : originalMedia.length === 2
                          ? "1fr 1fr"
                          : originalMedia.length === 3
                            ? "repeat(2, 1fr)"
                            : originalMedia.length === 4
                              ? "repeat(2, 1fr)"
                              : "repeat(3, 1fr)",
                  }}
                >
                  {originalMedia.slice(0, 5).map((m, i) => {
                    const isVideo = m.type === "videos";
                    const isLastItem = i === 4 && originalMedia.length > 5;
                    const remainingCount = originalMedia.length - 5;

                    return (
                      <Box
                        key={i}
                        sx={{
                          position: "relative",
                          width: "100%",
                          height:
                            originalMedia.length === 1
                              ? "400px"
                              : originalMedia.length === 2
                                ? "300px"
                                : "200px",
                          overflow: "hidden",
                          bgcolor: "black",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                          ...(originalMedia.length === 3 &&
                            i === 0 && {
                              gridColumn: "span 2",
                              height: "300px",
                            }),
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
                                zIndex: 1,
                              }}
                            >
                              +{remainingCount}
                            </Box>
                          </>
                        ) : isVideo ? (
                          <video
                            src={`${process.env.NEXT_PUBLIC_HOST_IP}${m.url}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              pointerEvents: "none",
                            }}
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
              )}
            </Card>
          )}

          {/* Media */}
          {media.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gap: 0.5,
                mt: 2,
                borderRadius: "lg",
                overflow: "hidden",
                gridTemplateColumns:
                  media.length === 1
                    ? "1fr"
                    : media.length === 2
                      ? "1fr 1fr"
                      : media.length === 3
                        ? "repeat(2, 1fr)"
                        : media.length === 4
                          ? "repeat(2, 1fr)"
                          : "repeat(3, 1fr)",
              }}
            >
              {media.slice(0, 5).map((m, i) => {
                const isVideo = m.type === "videos";
                const isLastItem = i === 4 && media.length > 5;
                const remainingCount = media.length - 5;

                return (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height:
                        media.length === 1
                          ? "400px"
                          : media.length === 2
                            ? "300px"
                            : "200px",
                      overflow: "hidden",
                      bgcolor: "black",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                      ...(media.length === 3 &&
                        i === 0 && {
                          gridColumn: "span 2",
                          height: "300px",
                        }),
                    }}
                    // onClick={() => openMediaViewer(i)}
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
                            zIndex: 1,
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
            <Box className="comment-counts" sx={{ display: "flex", gap: 1 }}>
              <Typography
                level="body-sm"
                color="neutral"
                onClick={() => setOpenComment(true)}
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {commentLength} {commentLength === 1 ? "comment" : "comments"}
              </Typography>

              <Typography
                level="body-sm"
                color="neutral"
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {post.repost_count}{" "}
                {post.repost_count === 1 ? "repost" : "reposts"}
              </Typography>
            </Box>
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

      {/* Other Components that are connected to the above Post Card */}

      {/* Liked List Modal */}
      <PostLikedList
        open={openLiked}
        close={() => setOpenLiked(false)}
        post_id={post.id}
      />

      <RepostSnackbar
        open={repostSnack.open}
        close={() => {
          setRepostSnack({ open: false, type: "" });
        }}
        type={repostSnack.type}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        openEdit={openEdit}
        closeEdit={() => setOpenEdit(false)}
        post={post}
        requestedBy={requestedBy}
      />
      {/* Image grid viewer */}
      <ImagegridModal
        mediaViewer={mediaViewer}
        closeMediaViewer={closeMediaViewer}
        setMediaViewer={setMediaViewer}
        media={media}
      />

      {/* Repost Post Viewer Modal */}
      {post.repost_of && post.original_post && (
        <RepostViewerModal
          open={repostModal}
          close={() => setRepostModal(false)}
          repostedPost={post.original_post}
        />
      )}

      {/* Copy to clipboard Snack */}
      <CopyClipboardSnack
        open={clipboardSnack.open}
        type={clipboardSnack.type}
        close={() => setClipboardSnack((prev) => ({ ...prev, open: false }))}
      />

      <DeletePostSnackbar
        open={deleteSnack.open}
        close={() => {
          setDeleteSnack({ open: false, type: "" });
        }}
        type={deleteSnack.type}
      />
    </>
  );
}
