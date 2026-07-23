import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface MentionDropdownProps {
  text: string;
  onChange: (newVal: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  users: UserProfile[];
  currentUser: string;
  className?: string;
}

export default function MentionDropdown({
  text,
  onChange,
  inputRef,
  users,
  currentUser,
  className = ""
}: MentionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [startIndex, setStartIndex] = useState(-1);
  const [cursorPos, setCursorPos] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse text at the current cursor position to see if we are typing a mention
  const checkMention = () => {
    const input = inputRef.current;
    if (!input) return;

    const currentCursor = input.selectionStart ?? 0;
    setCursorPos(currentCursor);

    const beforeCursor = text.slice(0, currentCursor);
    const match = beforeCursor.match(/@([a-zA-Z0-9_-]*)$/);

    if (match) {
      setIsOpen(true);
      setQuery(match[1]);
      setStartIndex(currentCursor - match[1].length - 1); // Index of '@'
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    checkMention();
  }, [text]);

  // Handle inputs events to update cursor and check for mentions
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleEvent = () => {
      checkMention();
    };

    input.addEventListener("click", handleEvent);
    input.addEventListener("keyup", handleEvent);
    input.addEventListener("focus", handleEvent);

    return () => {
      input.removeEventListener("click", handleEvent);
      input.removeEventListener("keyup", handleEvent);
      input.removeEventListener("focus", handleEvent);
    };
  }, [inputRef, text]);

  // Filter users based on query
  const filteredUsers = React.useMemo(() => {
    if (!isOpen) return [];
    
    // Sort so exact/prefix matches come first, but show matching usernames
    const q = query.toLowerCase();
    const matches = users.filter((u) => {
      // Don't show current user in list, or do show? Usually good to show others but showing everyone is fine
      return u.username.toLowerCase().includes(q);
    });

    // Sort by prefix match first
    return matches.sort((a, b) => {
      const aStart = a.username.toLowerCase().startsWith(q);
      const bStart = b.username.toLowerCase().startsWith(q);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;
      return a.username.localeCompare(b.username);
    }).slice(0, 5); // Limit to top 5 matches
  }, [isOpen, query, users]);

  useEffect(() => {
    // Reset selected index when list changes
    setSelectedIndex(0);
  }, [filteredUsers]);

  const handleSelectUser = (username: string) => {
    if (startIndex === -1 || cursorPos === -1) return;

    const beforeMention = text.slice(0, startIndex);
    const afterCursor = text.slice(cursorPos);
    
    const newText = beforeMention + "@" + username + " " + afterCursor;
    onChange(newText);

    const newCursorPos = startIndex + username.length + 2; // +1 for '@', +1 for ' '
    
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);

    setIsOpen(false);
  };

  // Keyboard navigation inside the open dropdown
  useEffect(() => {
    const input = inputRef.current;
    if (!input || !isOpen || filteredUsers.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSelectUser(filteredUsers[selectedIndex].username);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    input.addEventListener("keydown", handleKeyDown);
    return () => {
      input.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredUsers, selectedIndex, startIndex, cursorPos, text]);

  if (!isOpen || filteredUsers.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 min-w-[180px] max-w-[240px] text-left divide-y divide-slate-100 dark:divide-slate-800/50 ${className}`}
    >
      <div className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Mention User
      </div>
      <div className="pt-1 space-y-0.5">
        {filteredUsers.map((user, idx) => (
          <button
            key={user.username}
            type="button"
            onClick={() => handleSelectUser(user.username)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left font-semibold ${
              idx === selectedIndex
                ? "bg-amber-500 text-white"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="text-sm shrink-0">{user.avatar || "👤"}</span>
            <span className="truncate flex-1">{user.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
