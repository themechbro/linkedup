"use client";

import { useState, useEffect, useRef } from "react";
import SearchDropdown from "./searchDropdown";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const inComingRecent = (i) => {
    setQuery(i);
  };

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], posts: [] });
      setShowDropdown(true);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST_IP}/api/linkedup-search/search?q=${query}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();

        setResults(data.response);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "280px",
        flexShrink: 0,
      }}
    >
      <input
        type="text"
        placeholder="Search LinkedUp"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results && setShowDropdown(true)}
        style={{
          width: "100%",
          height: "36px",
          padding: "0 40px 0 16px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          backgroundColor: "#eef3f8",
          outline: "none",
          fontSize: "14px",
          boxSizing: "border-box",
          transition: "background-color 0.2s",
          color: "black",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#e0e7ee";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#eef3f8";
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = "#ffffff";
          e.target.style.border = "1px solid #0a66c2";
          if (results) setShowDropdown(true);
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = "#eef3f8";
          e.target.style.border = "1px solid #ddd";
        }}
      />

      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "16px",
          fill: "#666",
          pointerEvents: "none",
        }}
      >
        <path d="M14.56 12.44L11.3 9.18a5.51 5.51 0 10-2.12 2.12l3.26 3.26a1.5 1.5 0 102.12-2.12zM2.5 6.5a4 4 0 114 4 4 4 0 01-4-4z" />
      </svg>

      {showDropdown && (
        <SearchDropdown
          results={results}
          loading={loading}
          close={() => setShowDropdown(false)}
          recentClicked={inComingRecent}
          query={query}
        />
      )}
    </div>
  );
}
