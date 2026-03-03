"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  acceptConnection,
  rejectConnection,
} from "../components/post/lib/helpers";

const LIMIT = 20;

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-notification connection status: { [notificationId]: 'accepted' | 'rejected' | 'loading' }
  const [connectionStatuses, setConnectionStatuses] = useState({});

  const loaderRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchNotifications = useCallback(async (newOffset) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (newOffset === 0) setInitialLoading(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/notifications/notifications?limit=${LIMIT}&offset=${newOffset}`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();

      setNotifications((prev) =>
        newOffset === 0 ? data.notifications : [...prev, ...data.notifications],
      );
      setUnreadCount(data.unreadCount ?? 0);
      setHasMore(data.pagination?.hasMore ?? false);
      setOffset(newOffset + LIMIT);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError("Something went wrong. Please try again.");
    } finally {
      if (newOffset === 0) setInitialLoading(false);
      else setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isFetchingRef.current
        ) {
          fetchNotifications(offset);
        }
      },
      { threshold: 1 },
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [offset, hasMore, loading, fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_HOST_IP}/api/notifications/notifications/mark-read`,
        { method: "POST", credentials: "include" },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleAccept = async (notification) => {
    setConnectionStatuses((prev) => ({
      ...prev,
      [notification.id]: "loading",
    }));
    try {
      const res = await acceptConnection(
        notification.actor_id,
        notification.id,
      );
      if (res.ok) {
        setConnectionStatuses((prev) => ({
          ...prev,
          [notification.id]: "accepted",
        }));
      } else {
        setConnectionStatuses((prev) => ({ ...prev, [notification.id]: null }));
      }
    } catch (error) {
      console.error("Accept error", error);
      setConnectionStatuses((prev) => ({ ...prev, [notification.id]: null }));
    }
  };

  const handleReject = async (notification) => {
    setConnectionStatuses((prev) => ({
      ...prev,
      [notification.id]: "loading",
    }));
    try {
      const res = await rejectConnection(
        notification.actor_id,
        notification.id,
      );
      if (res.ok) {
        setConnectionStatuses((prev) => ({
          ...prev,
          [notification.id]: "rejected",
        }));
      } else {
        setConnectionStatuses((prev) => ({ ...prev, [notification.id]: null }));
      }
    } catch (error) {
      console.error("Reject error", error);
      setConnectionStatuses((prev) => ({ ...prev, [notification.id]: null }));
    }
  };

  function renderMessage(n) {
    switch (n.type) {
      case "LIKE_POST":
        return `${n.full_name} liked your post`;
      case "COMMENT_POST":
        return `${n.full_name} commented on your post`;
      case "REPLY_COMMENT":
        return `${n.full_name} replied to your comment`;
      case "FOLLOW":
        return `${n.full_name} started following you`;
      case "CONNECTION_REQUEST":
        return `${n.full_name} sent you a connection request`;
      default:
        return "New notification";
    }
  }

  function getTypeIcon(type) {
    switch (type) {
      case "LIKE_POST":
        return { icon: "♥", bg: "bg-rose-100 text-rose-500" };
      case "COMMENT_POST":
        return { icon: "💬", bg: "bg-indigo-100 text-indigo-500" };
      case "REPLY_COMMENT":
        return { icon: "↩", bg: "bg-violet-100 text-violet-500" };
      case "FOLLOW":
        return { icon: "✦", bg: "bg-amber-100 text-amber-500" };
      case "CONNECTION_REQUEST":
        return { icon: "⊕", bg: "bg-sky-100 text-sky-500" };
      default:
        return { icon: "•", bg: "bg-gray-100 text-gray-500" };
    }
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{
        background:
          "linear-gradient(135deg, #ffffffff 0%, #ffffffff 50%, #dfe2e0ff 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .notif-page * { font-family: 'DM Sans', sans-serif; }
        .notif-title  { font-family: 'Instrument Serif', serif; }

        .notif-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          border-left: 3px solid transparent;
        }
        .notif-card:hover {
          transform: translateX(3px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
        }
        .notif-card.unread {
          border-left-color: #6366f1;
          background: linear-gradient(to right, #eef2ff, #ffffff);
        }
        .notif-card.read {
          border-left-color: transparent;
          background: #ffffff;
        }

        .btn-accept {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .btn-accept:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-accept:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-decline {
          background: transparent;
          color: #6b7280;
          border: 1.5px solid #e5e7eb;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .btn-decline:hover:not(:disabled) { background: #f3f4f6; border-color: #d1d5db; }
        .btn-decline:disabled { opacity: 0.6; cursor: not-allowed; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .badge-accepted { background: #dcfce7; color: #16a34a; }
        .badge-rejected { background: #f3f4f6; color: #6b7280; }

        .post-preview {
          margin-top: 10px;
          border-radius: 10px;
          padding: 10px 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .post-preview:hover { background: #f3f4f6; }

        .dot-unread {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
          margin-top: 6px;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }

        .mark-read-btn {
          font-size: 13px;
          color: #6366f1;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 500;
          transition: background 0.15s;
        }
        .mark-read-btn:hover { background: #eef2ff; }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        .badge-count {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
        }
      `}</style>

      <div className="notif-page max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <h1
              className="notif-title text-3xl"
              style={{ color: "#1e1b4b", fontFamily: "Roboto Condensed" }}
            >
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="badge-count">{unreadCount} new</span>
            )}
          </div>

          {unreadCount > 0 && (
            <button className="mark-read-btn" onClick={markAllAsRead}>
              Mark all read
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            }}
          >
            <span>⚠</span> {error}
            <button
              onClick={() => fetchNotifications(0)}
              style={{
                marginLeft: "auto",
                color: "#dc2626",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton loader */}
        {initialLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 flex gap-4"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="skeleton w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="skeleton h-3 w-2/3" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!initialLoading && notifications.length === 0 && !error && (
          <div
            className="rounded-2xl p-16 text-center"
            style={{
              background: "white",
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
            <p style={{ color: "#9ca3af", fontWeight: 500 }}>
              All caught up — no notifications yet
            </p>
          </div>
        )}

        {/* Notification list */}
        {!initialLoading && (
          <div className="space-y-2">
            {notifications.map((n) => {
              const { icon, bg } = getTypeIcon(n.type);
              const truncated =
                n.post_content && n.post_content.length > 120
                  ? n.post_content.slice(0, 120) + "…"
                  : n.post_content;

              // Resolved status: local action takes precedence over server-side metadata
              const localStatus = connectionStatuses[n.id];
              const serverStatus = n.metadata?.connection_status;
              const resolvedStatus = localStatus ?? serverStatus;
              const isActionLoading = localStatus === "loading";

              return (
                <div
                  key={n.id}
                  className={`notif-card rounded-2xl p-4 ${!n.is_read ? "unread" : "read"}`}
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex gap-3 items-start">
                    {/* Avatar + type badge */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          n.profile_picture
                            ? `${process.env.NEXT_PUBLIC_HOST_IP}${n.profile_picture}`
                            : "/default-avatar.png"
                        }
                        alt={n.full_name}
                        className="w-11 h-11 rounded-full object-cover"
                        style={{ border: "2px solid #e5e7eb" }}
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${bg}`}
                        style={{ fontSize: 10, border: "1.5px solid white" }}
                      >
                        {icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm leading-snug"
                        style={{ color: "#111827" }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontFamily: "Roboto Condensed",
                          }}
                        >
                          {n.full_name}
                        </span>{" "}
                        {renderMessage(n).replace(n.full_name, "").trim()}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#9ca3af" }}
                      >
                        {timeAgo(n.created_at)}
                      </p>

                      {/* Post preview */}
                      {n.entity_type === "post" && n.post_content && (
                        <div
                          className="post-preview"
                          onClick={() => router.push(`/viewPost/${n.post_id}`)}
                        >
                          <p className="text-xs" style={{ color: "#4b5563" }}>
                            {truncated}
                          </p>
                        </div>
                      )}

                      {/* Connection request actions */}
                      {n.type === "CONNECTION_REQUEST" && (
                        <div className="mt-3">
                          {resolvedStatus === "accepted" && (
                            <span className="status-badge badge-accepted">
                              ✓ Connected
                            </span>
                          )}
                          {resolvedStatus === "rejected" && (
                            <span className="status-badge badge-rejected">
                              ✕ Declined
                            </span>
                          )}
                          {!resolvedStatus && (
                            <div className="flex gap-2 mt-1">
                              <button
                                className="btn-accept"
                                onClick={() => handleAccept(n)}
                                disabled={isActionLoading}
                              >
                                {isActionLoading ? "…" : "Accept"}
                              </button>
                              <button
                                className="btn-decline"
                                onClick={() => handleReject(n)}
                                disabled={isActionLoading}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Unread dot */}
                    {!n.is_read && <div className="dot-unread" />}
                  </div>
                </div>
              );
            })}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={loaderRef} className="py-6 text-center">
                {loading && (
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#a5b4fc",
                          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!hasMore && notifications.length > 0 && (
              <p
                className="text-center text-xs py-4"
                style={{ color: "#d1d5db" }}
              >
                You're all caught up ✦
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
