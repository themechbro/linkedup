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
} from "@mui/joy";
import {
  ThumbsUp,
  MessageCircleMore,
  Send,
  Repeat,
  EllipsisVertical,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import CommentComposer from "../comments/comment-composer";
import CommentList from "../comments/commentList";
import { postMenuItems } from "./menu/items";
import PostLikedList from "./liked-list/postliked_list";
import { redirect } from "next/navigation";

export default function PostCard({ post }) {
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

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: "lg" }}>
        <CardContent>
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

            <Box className="post-menu">
              {post.current_user !== post.owner ? (
                <Button
                  variant="plain"
                  sx={{ fontFamily: "Roboto Condensed" }}
                  startDecorator={<Plus />}
                >
                  Connect
                </Button>
              ) : null}
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
            <Button startDecorator={<Repeat />} variant="plain" color="neutral">
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
    </>
  );
}
