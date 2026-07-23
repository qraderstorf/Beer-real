import React from "react";
import { UserProfile } from "../types";

interface UserAvatarProps {
  username: string;
  users: UserProfile[];
  className?: string;
}

export default function UserAvatar({ username, users, className = "w-9 h-9 text-lg" }: UserAvatarProps) {
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  
  return (
    <div className={`${className} bg-slate-100 border border-slate-250/60 rounded-xl flex items-center justify-center overflow-hidden shadow-inner shrink-0`}>
      {user?.photoUrl ? (
        <img 
          src={user.photoUrl} 
          alt={username} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="select-none">{user?.avatar || "👤"}</span>
      )}
    </div>
  );
}
