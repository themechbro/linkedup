"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { skills, styles } from "./data/skillList";
// ─── Skill Data ──────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────

const MAX_SKILLS = 10;

function XIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7l4 4 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#666" strokeWidth="1.5" />
      <path
        d="M11 11l3 3"
        stroke="#666"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SkillsModal({ open, onClose, onSubmit }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Flatten all skill options
  const allOptions = useMemo(
    () =>
      skills.flatMap((cat) =>
        cat.items.map((skill) => ({ label: skill, category: cat.category })),
      ),
    [],
  );

  // Filtered options by query, excluding already selected
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allOptions.filter(
      (o) =>
        !selectedSkills.find((s) => s.label === o.label) &&
        (q === "" ||
          o.label.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q)),
    );
  }, [query, selectedSkills, allOptions]);

  // Group filtered by category
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((o) => {
      if (!map[o.category]) map[o.category] = [];
      map[o.category].push(o);
    });
    return Object.entries(map);
  }, [filtered]);

  // Flat list of all visible items for keyboard nav
  const flatFiltered = filtered;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addSkill = (skill) => {
    if (selectedSkills.length >= MAX_SKILLS) return;

    setSelectedSkills((prev) => [...prev, { ...skill, top_skill: false }]);

    setQuery("");
    inputRef.current?.focus();
  };

  const toggleTopSkill = (label) => {
    setSelectedSkills((prev) =>
      prev.map((s) =>
        s.label === label ? { ...s, top_skill: !s.top_skill } : s,
      ),
    );
  };

  const removeSkill = (label) => {
    setSelectedSkills((prev) => prev.filter((s) => s.label !== label));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        addSkill(flatFiltered[activeIndex]);
      } else if (query.trim() && filtered.length === 0 && !atMax) {
        addSkill({ label: query.trim(), category: "Custom" });
        setDropdownOpen(false);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    } else if (
      e.key === "Backspace" &&
      query === "" &&
      selectedSkills.length > 0
    ) {
      removeSkill(selectedSkills[selectedSkills.length - 1].label);
    }
  };

  const handleSubmit = async () => {
    const payload = selectedSkills.map((s) => ({
      name: s.label,
      top_skill: s.top_skill,
    }));
    await fetch(
      `${process.env.NEXT_PUBLIC_HOST_IP}/api/profile/update/skills`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: payload }),
      },
    );

    setSelectedSkills([]);
    setQuery("");
    onClose();
  };

  const handleClose = () => {
    setSelectedSkills([]);
    setQuery("");
    setDropdownOpen(false);
    onClose();
  };

  if (!open) return null;

  const atMax = selectedSkills.length >= MAX_SKILLS;

  return (
    <>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={handleClose} />

      {/* Modal */}
      <div
        style={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 id="modal-title" style={styles.title}>
              Add skills
            </h2>
            <p style={styles.subtitle}>
              Show your expertise — add up to {MAX_SKILLS} skills
            </p>
          </div>
          <button
            style={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div style={styles.divider} />

        {/* Body */}
        <div style={styles.body}>
          {/* Selected chips */}
          {selectedSkills.length > 0 && (
            <div style={styles.chipArea}>
              {selectedSkills.map((skill) => (
                <span key={skill.label} style={styles.chip}>
                  {skill.label}

                  <button
                    onClick={() => toggleTopSkill(skill.label)}
                    style={{
                      marginLeft: 6,
                      color: skill.top_skill ? "#f59e0b" : "#9ca3af",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                      fontSize: 14,
                    }}
                    title="Mark as top skill"
                  >
                    ★
                  </button>
                  <button
                    style={styles.chipRemove}
                    onClick={() => removeSkill(skill.label)}
                    aria-label={`Remove ${skill.label}`}
                  >
                    <XIcon size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input */}
          <div style={styles.searchWrapper}>
            <div style={styles.searchIcon}>
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              style={styles.input}
              type="text"
              placeholder={
                atMax
                  ? `Maximum ${MAX_SKILLS} skills reached`
                  : "Search skills (e.g. React, Design, SQL)"
              }
              value={query}
              disabled={atMax}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {query && (
              <button
                style={styles.clearBtn}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <XIcon size={12} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {dropdownOpen && filtered.length > 0 && (
            <div ref={dropdownRef} style={styles.dropdown}>
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <div style={styles.categoryLabel}>{category}</div>
                  {items.map((option) => {
                    const idx = flatFiltered.indexOf(option);
                    const isActive = idx === activeIndex;
                    return (
                      <div
                        key={option.label}
                        style={{
                          ...styles.dropdownItem,
                          ...(isActive ? styles.dropdownItemActive : {}),
                        }}
                        onMouseDown={() => addSkill(option)}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <span>{option.label}</span>
                        {isActive && <span style={styles.addHint}>+ Add</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {dropdownOpen && query && filtered.length === 0 && (
            <div style={styles.noResults}>
              No results for "<strong>{query}</strong>" —{" "}
              <span
                style={{ color: "#0a66c2", fontWeight: 600, cursor: "pointer" }}
                onMouseDown={() => {
                  addSkill({ label: query.trim(), category: "Custom" });
                  setDropdownOpen(false);
                }}
              >
                + Add "{query.trim()}"
              </span>
            </div>
          )}

          {/* Suggestions when empty */}
          {!dropdownOpen && selectedSkills.length === 0 && (
            <div style={styles.suggestions}>
              <p style={styles.suggestionsLabel}>Popular skills</p>
              <div style={styles.suggestionChips}>
                {[
                  "React",
                  "Python",
                  "TypeScript",
                  "Node.js",
                  "System Design",
                  "Figma",
                  "Docker",
                  "PostgreSQL",
                  "Machine Learning",
                  "Leadership",
                ].map((s) => {
                  const opt = allOptions.find((o) => o.label === s);
                  if (!opt) return null;
                  return (
                    <button
                      key={s}
                      style={styles.suggestionChip}
                      onClick={() => {
                        addSkill(opt);
                        setDropdownOpen(false);
                      }}
                    >
                      + {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={styles.divider} />

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.counter}>
            {selectedSkills.length}/{MAX_SKILLS} selected
          </span>
          <div style={styles.footerActions}>
            <button style={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button
              style={{
                ...styles.saveBtn,
                ...(selectedSkills.length === 0 ? styles.saveBtnDisabled : {}),
              }}
              onClick={handleSubmit}
              disabled={selectedSkills.length === 0}
            >
              <CheckIcon />
              Save
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
