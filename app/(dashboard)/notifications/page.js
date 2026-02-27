"use client";

import { useEffect, useState, useRef } from "react";
import { getSocket } from "../messages/components/utils/socket";
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const socket = getSocket();
  const LIMIT = 20;

  useEffect(() => {
    socket.on("notification:new", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => socket.off("notification:new");
  }, []);

  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const fetchNotifications = async (newOffset) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/notifications/notifications?limit=${LIMIT}&offset=${newOffset}`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (newOffset === 0) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      setUnreadCount(data.unreadCount);
      setHasMore(data.pagination.hasMore);
      setOffset(newOffset + LIMIT);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotifications(offset);
        }
      },
      { threshold: 1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [offset, hasMore]);

  const markAllAsRead = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/notifications/notifications/mark-read`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const renderMessage = (n) => {
    switch (n.type) {
      case "LIKE_POST":
        return `${n.full_name} liked your post`;
      case "COMMENT_POST":
        return `${n.full_name} commented on your post`;
      case "FOLLOW":
        return `${n.full_name} started following you`;
      default:
        return "interacted with you";
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {notifications.length === 0 && (
          <div className="p-6 text-gray-500 text-center">
            No notifications yet
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex gap-4 p-4 border-b last:border-none transition ${
              !n.is_read ? "bg-blue-50" : "bg-white"
            }`}
          >
            {/* Actor Avatar */}
            <img
              src={
                `${process.env.NEXT_PUBLIC_HOST_IP}${n.profile_picture}` ||
                "/default-avatar.png"
              }
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{n.name}</span>{" "}
                {renderMessage(n)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>

            {!n.is_read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            )}
          </div>
        ))}

        {hasMore && (
          <div ref={loaderRef} className="p-4 text-center text-gray-400">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
