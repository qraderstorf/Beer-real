import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Plus, Trash2, LogOut, Check, Shield, AlertCircle, 
  Sparkles, Edit2, Image, Smile, Send, UserPlus, X, 
  Trophy, Award, Zap, Moon, Coffee, Crown, ArrowLeft, TrendingUp, 
  Beer, Star, Calendar, ChevronRight, ChevronDown, Pin, Filter, BarChart3, LineChart as LineChartIcon,
  MessageSquare, Flame
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Pub, UserProfile, BeerLog, PubChatMessage } from "../types";
import { getMostDrankBeerForUser } from "../utils";
import UserAvatar from "./UserAvatar";

interface PubHubProps {
  currentUser: string;
  users: UserProfile[];
  pubs: Pub[];
  logs: BeerLog[];
  selectedPubId?: string;
  onPubSelect?: (pubId: string) => void;
  pinnedPubId?: string;
  onPinPub?: (pubId: string) => void;
  onPubCreated: (newPub: Pub) => void;
  onPubUpdated: (updatedPub: Pub) => void;
  onPubDeleted: (pubId: string) => void;
  onViewProfileRequested?: (username: string) => void;
}

const MEMBER_COLORS = [
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#eab308", // Yellow
  "#6366f1", // Indigo
];

interface PubChatSectionProps {
  pubId: string;
  pubName: string;
  pubOwner: string;
  currentUser: string;
  users: UserProfile[];
  onViewProfileRequested?: (username: string) => void;
  messageRefreshKey?: number;
}

function PubChatSection({
  pubId,
  pubName,
  pubOwner,
  currentUser,
  users,
  onViewProfileRequested,
  messageRefreshKey
}: PubChatSectionProps) {
  const [messages, setMessages] = useState<PubChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    if (!pubId) return;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`/api/pubs/${encodeURIComponent(pubId)}/messages`, {
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch (e) {
      console.warn("Could not fetch pub messages:", e);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [pubId, messageRefreshKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend || sending) return;

    if (!customText) setInputText("");
    setSending(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`/api/pubs/${encodeURIComponent(pubId)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser, username: currentUser, text: textToSend }),
        signal: controller.signal,
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (err) {
      console.error("Failed to send pub message:", err);
    } finally {
      clearTimeout(timeoutId);
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Chat Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            {pubName} Banter & Chat
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Live member chat & session banter</p>
        </div>
        <span className="text-[10px] text-amber-600 font-extrabold bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Pub Chat
        </span>
      </div>

      {/* Messages List Area */}
      <div className="bg-slate-900 rounded-xl p-4 min-h-[220px] max-h-[380px] overflow-y-auto space-y-3 border border-slate-800">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs italic">Loading pub chat...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <p className="text-2xl">🍻</p>
            <p className="font-bold text-slate-300">No chat messages in this pub yet!</p>
            <p className="text-[11px] text-slate-500">Break the ice and start the banter with your mates.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.user.toLowerCase() === currentUser.toLowerCase();
            const isOwner = msg.user.toLowerCase() === pubOwner.toLowerCase();
            const timeStr = msg.date ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className="cursor-pointer shrink-0 mt-0.5"
                  onClick={() => onViewProfileRequested?.(msg.user)}
                >
                  <UserAvatar username={msg.user} users={users} className="w-8 h-8 text-xs" />
                </div>

                <div className={`max-w-[85%] space-y-1 ${isMe ? "items-end text-right" : "items-start"}`}>
                  <div className={`flex items-center gap-1.5 text-[10px] ${isMe ? "justify-end text-slate-400" : "text-slate-400"}`}>
                    <span 
                      onClick={() => onViewProfileRequested?.(msg.user)}
                      className="font-extrabold text-slate-300 hover:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      @{msg.user}
                      {isOwner && <Shield className="w-3 h-3 text-amber-400" title="Host" />}
                    </span>
                    <span>•</span>
                    <span className="text-[9px] text-slate-500">{timeStr}</span>
                  </div>

                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed break-words shadow-xs ${
                      isMe
                        ? "bg-amber-500 text-slate-950 rounded-tr-none"
                        : "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={`Say something in ${pubName}...`}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 rounded-xl px-4 py-2.5 text-sm font-medium outline-hidden transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
      </form>
    </div>
  );
}

export default function PubHub({
  currentUser,
  users,
  pubs,
  logs,
  selectedPubId,
  onPubSelect,
  pinnedPubId,
  onPinPub,
  onPubCreated,
  onPubUpdated,
  onPubDeleted,
  onViewProfileRequested
}: PubHubProps) {
  const [newPubName, setNewPubName] = useState("");
  const [selectedInvitees, setSelectedInvitees] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoster, setShowRoster] = useState<Record<string, boolean>>({});
  const [allBeers, setAllBeers] = useState<BeerLog[]>([]);
  const [loadingBeers, setLoadingBeers] = useState(false);

  // Pub timeframe filter state
  const [superlativeTimeframe, setSuperlativeTimeframe] = useState<"7d" | "30d" | "year" | "all">("7d");

  const fetchAllBeers = async (retries = 2) => {
    setLoadingBeers(true);
    try {
      // Zero client Firestore reads: fetched from backend cached endpoint
      const res = await fetch("/api/leaderboard-beers");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllBeers(data);
          return;
        }
      }
      setAllBeers(logs || []);
    } catch (e) {
      if (retries > 0) {
        setTimeout(() => fetchAllBeers(retries - 1), 1000);
        return;
      }
      console.warn("Could not fetch all beers for PubHub, using live logs fallback:", e);
      setAllBeers(logs || []);
    } finally {
      setLoadingBeers(false);
    }
  };

  useEffect(() => {
    fetchAllBeers();
  }, [pubs]);

  // Combine server allBeers with any real-time live logs passed via prop
  const combinedLogs = useMemo(() => {
    const map = new Map<string, BeerLog>();
    if (allBeers && allBeers.length > 0) {
      allBeers.forEach(b => {
        if (b && b.id) map.set(b.id, b);
      });
    }
    if (logs && logs.length > 0) {
      logs.forEach(b => {
        if (b && b.id) map.set(b.id, b);
      });
    }
    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [allBeers, logs]);

  // Emblem state for creation
  const [newPubEmblemType, setNewPubEmblemType] = useState<"emoji" | "url">("emoji");
  const [newPubEmoji, setNewPubEmoji] = useState("🍺");
  const [newPubUrl, setNewPubUrl] = useState("");

  // Edit pub state
  const [editingPubId, setEditingPubId] = useState<string | null>(null);
  const [editPubName, setEditPubName] = useState("");
  const [editPubEmblemType, setEditPubEmblemType] = useState<"emoji" | "url">("emoji");
  const [editPubEmoji, setEditPubEmoji] = useState("🍺");
  const [editPubUrl, setEditPubUrl] = useState("");

  // Invite people state inside an existing pub
  const [invitingPubId, setInvitingPubId] = useState<string | null>(null);
  const [additionalInvitees, setAdditionalInvitees] = useState<string[]>([]);

  // Rally launch station state
  const [showRallyStation, setShowRallyStation] = useState(false);
  const [rallySending, setRallySending] = useState(false);
  const [rallySentNotice, setRallySentNotice] = useState(false);
  const [chatRefreshKey, setChatRefreshKey] = useState(0);

  const handleTriggerRally = async (pubId: string) => {
    if (rallySending) return;
    setRallySending(true);
    try {
      const pubName = activePub?.name || "the Pub";
      const rallyText = `🔥 THE BEACONS ARE LIT! 🔥 @${currentUser} has lit the beacons for @${pubName}! Pints call for aid! Who will answer? 🍺⚔️🏃‍♂️💨`;
      const res = await fetch(`/api/pubs/${encodeURIComponent(pubId)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser, username: currentUser, text: rallyText })
      });
      if (res.ok) {
        setRallySentNotice(true);
        setChatRefreshKey(prev => prev + 1);
        setTimeout(() => setRallySentNotice(false), 5000);
      }
    } catch (e) {
      console.error("Failed to trigger pub rally:", e);
    } finally {
      setRallySending(false);
    }
  };

  // Derived pub state
  const myPubs = useMemo(() => pubs.filter(p => p.members.includes(currentUser)), [pubs, currentUser]);
  const myInvites = useMemo(() => pubs.filter(p => p.invited.includes(currentUser)), [pubs, currentUser]);
  const otherPubs = useMemo(() => pubs.filter(p => !p.members.includes(currentUser)), [pubs, currentUser]);
  const otherUsers = useMemo(() => users.filter(u => u.username !== currentUser), [users, currentUser]);

  // Default pub ID if no specific selection is active (strictly from joined pubs)
  const defaultPubId = useMemo(() => {
    if (pinnedPubId && myPubs.some(p => p.id === pinnedPubId)) {
      return pinnedPubId;
    }
    if (myPubs.length > 0) {
      return myPubs[0].id;
    }
    return "";
  }, [pinnedPubId, myPubs]);

  // Local selection override state
  const [localPubId, setLocalPubId] = useState<string | null>(null);

  // Active Pub ID (strictly from joined pubs)
  const activePubId = useMemo(() => {
    if (localPubId && myPubs.some(p => p.id === localPubId)) {
      return localPubId;
    }
    if (selectedPubId && myPubs.some(p => p.id === selectedPubId)) {
      return selectedPubId;
    }
    return defaultPubId;
  }, [localPubId, selectedPubId, myPubs, defaultPubId]);

  const activePub = useMemo(() => {
    return myPubs.find(p => p.id === activePubId);
  }, [myPubs, activePubId]);

  const handleSelectPub = (id: string) => {
    setLocalPubId(id);
    onPubSelect?.(id);
  };

  const isUrl = (str: string) => {
    if (!str) return false;
    return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("/") || str.startsWith("data:image");
  };

  const renderEmblem = (emblem: string | undefined, sizeClass = "w-9 h-9 text-xl") => {
    if (!emblem) return <span className="shrink-0 text-lg">🍺</span>;
    const isImg = isUrl(emblem);
    if (isImg) {
      return (
        <img
          src={emblem}
          alt="Pub Emblem"
          className={`${sizeClass} rounded-xl object-cover shrink-0 align-middle shadow-sm border border-slate-200/50 dark:border-slate-800/80`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = document.createElement("span");
            fallback.innerText = "🍺";
            fallback.className = "shrink-0 text-xl";
            e.currentTarget.parentElement?.appendChild(fallback);
          }}
        />
      );
    }
    return <span className="shrink-0 text-xl align-middle">{emblem}</span>;
  };

  const startEditing = (pub: Pub) => {
    setEditingPubId(pub.id);
    setEditPubName(pub.name);
    if (pub.emblem && isUrl(pub.emblem)) {
      setEditPubEmblemType("url");
      setEditPubUrl(pub.emblem);
      setEditPubEmoji("🍺");
    } else {
      setEditPubEmblemType("emoji");
      setEditPubEmoji(pub.emblem || "🍺");
      setEditPubUrl("");
    }
  };

  const handleUpdatePub = async (pubId: string) => {
    setError(null);
    setSuccess(null);
    if (!editPubName.trim()) {
      setError("Pub name cannot be empty.");
      return;
    }
    const emblem = editPubEmblemType === "emoji" ? editPubEmoji : editPubUrl.trim();
    setSubmitting(true);
    try {
      const currentPub = pubs.find(p => p.id === pubId);
      if (!currentPub) throw new Error("Pub not found.");

      const response = await fetch("/api/pubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          pubId,
          name: editPubName.trim(),
          emblem,
          user: currentUser
        })
      });

      if (!response.ok) throw new Error("Could not update pub details.");
      const updatedPub: Pub = await response.json();
      onPubUpdated(updatedPub);
      setSuccess("Pub updated successfully!");
      setEditingPubId(null);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePub = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPubName.trim()) {
      setError("Please enter a pub name.");
      return;
    }

    const emblem = newPubEmblemType === "emoji" ? newPubEmoji : newPubUrl.trim();
    setSubmitting(true);
    try {
      const response = await fetch("/api/pubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name: newPubName.trim(),
          emblem,
          owner: currentUser,
          invited: selectedInvitees
        })
      });

      if (!response.ok) throw new Error("Failed to establish pub.");

      const newPub: Pub = await response.json();
      onPubCreated(newPub);
      setSuccess(`Pub "${newPub.name}" established successfully!`);
      setNewPubName("");
      setSelectedInvitees([]);
      setNewPubUrl("");
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while establishing pub.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinPub = async (pubId: string) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/pubs/${pubId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser })
      });

      if (!response.ok) throw new Error("Could not join pub.");
      const updatedPub: Pub = await response.json();
      onPubUpdated(updatedPub);
      setSuccess(`Joined "${updatedPub.name}"!`);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const handleLeavePub = async (pubId: string) => {
    if (!window.confirm("Are you sure you want to leave this pub?")) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/pubs/${pubId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser })
      });

      if (!response.ok) throw new Error("Could not leave pub.");
      const updatedPub: Pub = await response.json();
      onPubUpdated(updatedPub);
      setSuccess("You left the pub.");
      if (localPubId === pubId) setLocalPubId(null);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const handleDeletePub = async (pubId: string) => {
    if (!window.confirm("Are you sure you want to disband this pub? This action cannot be undone.")) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/pubs/${pubId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser })
      });

      if (!response.ok) throw new Error("Could not disband pub.");
      onPubDeleted(pubId);
      setSuccess("Pub successfully disbanded.");
      if (localPubId === pubId) setLocalPubId(null);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const handleSendInvitations = async (pubId: string) => {
    if (additionalInvitees.length === 0) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/pubs/${pubId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitees: additionalInvitees, sender: currentUser })
      });

      if (!response.ok) throw new Error("Could not send invitations.");
      const updatedPub: Pub = await response.json();
      onPubUpdated(updatedPub);
      setSuccess(`Invites sent successfully!`);
      setInvitingPubId(null);
      setAdditionalInvitees([]);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const toggleInvitee = (username: string) => {
    setSelectedInvitees(prev => 
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  const toggleAdditionalInvitee = (username: string) => {
    setAdditionalInvitees(prev => 
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]
    );
  };

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // PUB PAGE FILTERED DATA COMPUTATION
  // ---------------------------------------------------------------------------
  const activeMembers = useMemo(() => {
    if (activePub) return activePub.members;
    return [];
  }, [activePub]);

  const activePubFilteredLogs = useMemo(() => {
    if (!activePub) return [];
    const members = activePub.members;
    return combinedLogs.filter(log => members.includes(log.user));
  }, [activePub, combinedLogs]);

  // Leaderboard ranking
  const pubLeaderboard = useMemo(() => {
    const members = activeMembers;
    const counts: Record<string, number> = {};
    members.forEach(m => counts[m] = 0);

    activePubFilteredLogs.forEach(log => {
      if (counts[log.user] !== undefined) {
        counts[log.user] += 1;
      }
    });

    return members
      .map(member => ({
        username: member,
        pints: counts[member] || 0,
        profile: users.find(u => u.username === member)
      }))
      .sort((a, b) => b.pints - a.pints);
  }, [activeMembers, activePubFilteredLogs, users]);

  // Timeframe-filtered logs for pub superlatives
  const superlativeFilteredLogs = useMemo(() => {
    if (!activePubFilteredLogs) return [];
    if (superlativeTimeframe === "all") return activePubFilteredLogs;

    const now = Date.now();
    let days = 7;
    if (superlativeTimeframe === "30d") days = 30;
    if (superlativeTimeframe === "year") days = 365;

    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return activePubFilteredLogs.filter((l) => {
      const t = new Date(l.date).getTime();
      return !isNaN(t) && t >= cutoff;
    });
  }, [activePubFilteredLogs, superlativeTimeframe]);

  // Dynamic Superlatives Computation
  const pubSuperlatives = useMemo(() => {
    const members = activeMembers;
    if (members.length === 0) return null;

    const memberStats = members.map(member => {
      const mLogs = superlativeFilteredLogs.filter(l => l.user === member);
      const activeDates = new Set<string>();
      let totalDarts = 0;
      let lateNightCount = 0;
      let maxAbv = 0;
      let maxAbvBeer = "";
      let ratedLogsCount = 0;
      let sumRating = 0;
      let guinnessCount = 0;
      let cheersReceived = 0;
      const uniqueBeersSet = new Set<string>();

      mLogs.forEach(log => {
        if (log.beerName) uniqueBeersSet.add(log.beerName.trim().toLowerCase());
        try {
          const d = new Date(log.date);
          if (!isNaN(d.getTime())) {
            activeDates.add(d.toISOString().split("T")[0]);
            const hour = d.getHours();
            if (hour >= 22 || hour < 5) lateNightCount++;
          }
        } catch (e) {}

        if (log.hadCig) totalDarts++;
        if (log.abv && log.abv > maxAbv) {
          maxAbv = log.abv;
          maxAbvBeer = log.beerName;
        }
        if (log.rating && log.rating > 0) {
          ratedLogsCount++;
          sumRating += log.rating;
        }
        if (
          log.beerName?.toLowerCase().includes("guinness") ||
          log.beerName?.toLowerCase().includes("stout") ||
          log.beerStyle?.toLowerCase().includes("stout")
        ) {
          guinnessCount++;
        }
        if (log.cheersCount) cheersReceived += log.cheersCount;
        if (log.cheersUsers) cheersReceived += log.cheersUsers.length;
      });

      const totalDaysInPeriod = superlativeTimeframe === "7d" ? 7 : (superlativeTimeframe === "30d" ? 30 : (superlativeTimeframe === "year" ? 365 : 30));
      const soberDays = Math.max(0, totalDaysInPeriod - activeDates.size);

      return {
        username: member,
        totalPints: mLogs.length,
        soberDays,
        totalDarts,
        lateNightCount,
        maxAbv,
        maxAbvBeer,
        guinnessCount,
        cheersReceived,
        uniqueBeersCount: uniqueBeersSet.size,
        avgRating: ratedLogsCount > 0 ? parseFloat((sumRating / ratedLogsCount).toFixed(1)) : 0
      };
    });

    const candidates = [
      {
        id: "regular",
        title: "Pub Regular 👑",
        winner: [...memberStats].filter((m) => m.totalPints > 0).sort((a, b) => b.totalPints - a.totalPints)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.totalPints} ${w.totalPints === 1 ? "pint" : "pints"} poured`,
        getScore: (w: typeof memberStats[0]) => (w ? 100 + w.totalPints : 0),
        cardClass: "bg-amber-50/70 dark:bg-amber-500/10 border-amber-200/80 dark:border-amber-500/30",
        titleClass: "text-amber-800 dark:text-amber-300",
        badgeClass: "text-amber-900/80 dark:text-amber-300/80",
        IconComponent: Crown,
        iconClass: "text-amber-600 dark:text-amber-400",
        noStatText: "No pours in period",
      },
      {
        id: "guinness",
        title: "Dark Arts Master ☘️",
        winner: [...memberStats].filter((m) => m.guinnessCount > 0).sort((a, b) => b.guinnessCount - a.guinnessCount)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.guinnessCount} Stout ${w.guinnessCount === 1 ? "pint" : "pints"}`,
        getScore: (w: typeof memberStats[0]) => (w ? 90 + w.guinnessCount * 3 : 0),
        cardClass: "bg-slate-900 text-slate-100 border-slate-800",
        titleClass: "text-amber-300",
        badgeClass: "text-slate-400",
        IconComponent: Beer,
        iconClass: "text-amber-400",
        noStatText: "No stout logs",
      },
      {
        id: "nightowl",
        title: "Night Owl 🦉",
        winner: [...memberStats].filter((m) => m.lateNightCount > 0).sort((a, b) => b.lateNightCount - a.lateNightCount)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.lateNightCount} late night check-ins`,
        getScore: (w: typeof memberStats[0]) => (w ? 85 + w.lateNightCount * 4 : 0),
        cardClass: "bg-purple-50/70 dark:bg-purple-900/20 border-purple-200/80 dark:border-purple-800/40",
        titleClass: "text-purple-800 dark:text-purple-300",
        badgeClass: "text-purple-900/80 dark:text-purple-300/80",
        IconComponent: Moon,
        iconClass: "text-purple-600 dark:text-purple-400",
        noStatText: "No late night logs",
      },
      {
        id: "highvoltage",
        title: "High Voltage ⚡",
        winner: [...memberStats].filter((m) => m.maxAbv > 0).sort((a, b) => b.maxAbv - a.maxAbv)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.maxAbv}% ABV (${w.maxAbvBeer})`,
        getScore: (w: typeof memberStats[0]) => (w ? 80 + w.maxAbv * 2 : 0),
        cardClass: "bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40",
        titleClass: "text-rose-700 dark:text-rose-300",
        badgeClass: "text-rose-800 dark:text-rose-300",
        IconComponent: Zap,
        iconClass: "text-rose-500",
        noStatText: "No high ABV logs",
      },
      {
        id: "toastmaster",
        title: "Toastmaster 🥂",
        winner: [...memberStats].filter((m) => m.cheersReceived > 0).sort((a, b) => b.cheersReceived - a.cheersReceived)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.cheersReceived} cheers received`,
        getScore: (w: typeof memberStats[0]) => (w ? 75 + w.cheersReceived * 2 : 0),
        cardClass: "bg-sky-50/70 dark:bg-sky-950/20 border-sky-200/80 dark:border-sky-900/40",
        titleClass: "text-sky-800 dark:text-sky-300",
        badgeClass: "text-sky-900/80 dark:text-sky-300/80",
        IconComponent: Trophy,
        iconClass: "text-sky-600 dark:text-sky-400",
        noStatText: "No cheers received",
      },
      {
        id: "explorer",
        title: "Craft Explorer 🧭",
        winner: [...memberStats].filter((m) => m.uniqueBeersCount > 0).sort((a, b) => b.uniqueBeersCount - a.uniqueBeersCount)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.uniqueBeersCount} unique beers tried`,
        getScore: (w: typeof memberStats[0]) => (w ? 70 + w.uniqueBeersCount * 2 : 0),
        cardClass: "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-900/40",
        titleClass: "text-indigo-800 dark:text-indigo-300",
        badgeClass: "text-indigo-900/80 dark:text-indigo-300/80",
        IconComponent: Sparkles,
        iconClass: "text-indigo-600 dark:text-indigo-400",
        noStatText: "No unique beers",
      },
      {
        id: "tastemaker",
        title: "The Tastemaker ⭐",
        winner: [...memberStats].filter((m) => m.avgRating > 0).sort((a, b) => b.avgRating - a.avgRating)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.avgRating} / 5.0 avg rating`,
        getScore: (w: typeof memberStats[0]) => (w ? 65 + w.avgRating * 4 : 0),
        cardClass: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/40",
        titleClass: "text-amber-700 dark:text-amber-300",
        badgeClass: "text-amber-900/80 dark:text-amber-300/80",
        IconComponent: Star,
        iconClass: "fill-amber-400 text-amber-400",
        noStatText: "No ratings logged",
      },
      {
        id: "dartcaptain",
        title: "Dart Captain 🎯",
        winner: [...memberStats].filter((m) => m.totalDarts > 0).sort((a, b) => b.totalDarts - a.totalDarts)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.totalDarts} dart & break logs`,
        getScore: (w: typeof memberStats[0]) => (w ? 60 + w.totalDarts * 3 : 0),
        cardClass: "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40",
        titleClass: "text-emerald-800 dark:text-emerald-300",
        badgeClass: "text-emerald-900/80 dark:text-emerald-300/80",
        IconComponent: Coffee,
        iconClass: "text-emerald-600 dark:text-emerald-400",
        noStatText: "No dart logs",
      },
      {
        id: "drydays",
        title: "Dry Spell Champ 💧",
        winner: [...memberStats].filter((m) => m.soberDays > 0).sort((a, b) => b.soberDays - a.soberDays)[0],
        getStatText: (w: typeof memberStats[0]) => `${w.soberDays} dry days logged`,
        getScore: (w: typeof memberStats[0]) => (w ? 30 + w.soberDays : 0),
        cardClass: "bg-teal-50/70 dark:bg-teal-950/20 border-teal-200/80 dark:border-teal-900/40",
        titleClass: "text-teal-800 dark:text-teal-300",
        badgeClass: "text-teal-900/80 dark:text-teal-300/80",
        IconComponent: Coffee,
        iconClass: "text-teal-600 dark:text-teal-400",
        noStatText: "No dry days",
      },
    ];

    // Evaluate candidates with scored winners
    const evaluated = candidates.map((cand) => ({
      ...cand,
      score: cand.winner ? cand.getScore(cand.winner) : 0,
    }));

    // Sort candidates with actual activity first
    const activeCandidates = evaluated.filter((c) => c.winner && c.score > 0);
    activeCandidates.sort((a, b) => b.score - a.score);

    // Pick top 4 active, or pad with defaults if fewer than 4 have activity
    const top4 = [...activeCandidates.slice(0, 4)];
    if (top4.length < 4) {
      const usedIds = new Set(top4.map((c) => c.id));
      for (const item of evaluated) {
        if (top4.length >= 4) break;
        if (!usedIds.has(item.id)) {
          top4.push(item);
          usedIds.add(item.id);
        }
      }
    }

    return {
      top4,
      totalPeriodLogs: superlativeFilteredLogs.length
    };
  }, [activeMembers, superlativeFilteredLogs, superlativeTimeframe]);

  // Graph 1: "A Pint in Time" Cumulative Timeline
  const pubGraphData = useMemo(() => {
    const members = activeMembers;
    if (members.length === 0 || activePubFilteredLogs.length === 0) return [];

    const sortedLogs = [...activePubFilteredLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const dateMap: Record<string, BeerLog[]> = {};
    sortedLogs.forEach((log) => {
      const dStr = new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!dateMap[dStr]) dateMap[dStr] = [];
      dateMap[dStr].push(log);
    });

    const runningUserTotals: Record<string, number> = {};
    members.forEach(m => runningUserTotals[m] = 0);

    let runningTotal = 0;
    return Object.entries(dateMap).map(([dateLabel, dayLogs]) => {
      const dayUserCounts: Record<string, number> = {};
      dayLogs.forEach(l => {
        dayUserCounts[l.user] = (dayUserCounts[l.user] || 0) + 1;
        runningTotal += 1;
      });

      const baseValues: Record<string, number> = {};
      members.forEach(m => {
        runningUserTotals[m] += dayUserCounts[m] || 0;
        baseValues[m] = runningUserTotals[m];
      });

      const valGroups: Record<number, string[]> = {};
      members.forEach(m => {
        const v = baseValues[m];
        if (!valGroups[v]) valGroups[v] = [];
        valGroups[v].push(m);
      });

      const pointItem: any = { date: dateLabel, Total: runningTotal };

      members.forEach(m => {
        const rawVal = baseValues[m];
        const grp = valGroups[rawVal];
        if (grp && grp.length > 1 && rawVal > 0) {
          const idx = grp.indexOf(m);
          const offset = (idx - (grp.length - 1) / 2) * 0.08;
          pointItem[m] = rawVal + offset;
        } else {
          pointItem[m] = rawVal;
        }
      });

      return pointItem;
    });
  }, [activeMembers, activePubFilteredLogs]);

  // Graph 2: Guinness & Stout Breakdown
  const guinnessBreakdown = useMemo(() => {
    const members = activeMembers;
    if (members.length === 0 || !activePubFilteredLogs) return { memberData: [], totalGuinness: 0, totalPints: 0, percentage: 0 };

    let totalGuinness = 0;
    const totalPints = activePubFilteredLogs.length;

    const memberData = members.map(member => {
      const mLogs = activePubFilteredLogs.filter(l => l.user === member);
      const guinnessCount = mLogs.filter(l => l.beerName?.toLowerCase().includes("guinness") || l.beerName?.toLowerCase().includes("stout")).length;
      const otherCount = mLogs.length - guinnessCount;
      totalGuinness += guinnessCount;

      return {
        user: member,
        "Guinness & Stout": guinnessCount,
        "Other Craft": otherCount,
        total: mLogs.length
      };
    }).filter(m => m.total > 0).sort((a, b) => b["Guinness & Stout"] - a["Guinness & Stout"]);

    const percentage = totalPints > 0 ? Math.round((totalGuinness / totalPints) * 100) : 0;

    return { memberData, totalGuinness, totalPints, percentage };
  }, [activeMembers, activePubFilteredLogs]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xs bg-amber-500/20 border border-amber-500/50 text-amber-400 font-black px-2.5 py-1 rounded-lg">#1 🥇</span>;
    if (rank === 2) return <span className="text-xs bg-slate-300/20 border border-slate-300/50 text-slate-300 font-black px-2.5 py-1 rounded-lg">#2 🥈</span>;
    if (rank === 3) return <span className="text-xs bg-amber-700/20 border border-amber-700/50 text-amber-600 font-black px-2.5 py-1 rounded-lg">#3 🥉</span>;
    return <span className="text-xs bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-lg">#{rank}</span>;
  };

  const isOwner = activePub ? activePub.owner === currentUser : false;
  const isInviting = activePub ? invitingPubId === activePub.id : false;

  // ===========================================================================
  // RENDER UNIFIED PUB PAGE VIEW
  // ===========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Pub Navigation & Toggle Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Dropdown Pub Selector + Pin Button + Establish Pub Button */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <select
                value={activePubId}
                onChange={(e) => handleSelectPub(e.target.value)}
                disabled={myPubs.length === 0}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer appearance-none shadow-2xs"
              >
                {myPubs.length === 0 ? (
                  <option value="">No Pubs Joined Yet</option>
                ) : (
                  myPubs.map((p) => {
                    const isImg = p.emblem && (p.emblem.startsWith("http") || p.emblem.startsWith("/") || p.emblem.startsWith("data:"));
                    const displayEmblem = p.emblem ? (isImg ? "🖼️" : p.emblem) : "🏠";
                    const isPinned = pinnedPubId === p.id;
                    return (
                      <option key={p.id} value={p.id}>
                        {displayEmblem} {p.name} {isPinned ? "📌 (Pinned)" : ""}
                      </option>
                    );
                  })
                )}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pin Button */}
            {onPinPub && (
              <button
                type="button"
                id="pin-pub-hub-button"
                onClick={() => onPinPub(activePubId)}
                title={pinnedPubId === activePubId ? "Unpin this view" : "Pin as default view across app"}
                className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  pinnedPubId === activePubId
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-xs"
                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100"
                }`}
              >
                <Pin className={`w-4 h-4 ${pinnedPubId === activePubId ? "fill-slate-950" : ""}`} />
              </button>
            )}

            {/* Create New Pub Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              <span className="hidden sm:inline">New Pub</span>
            </button>
          </div>

          {/* Right: Pub Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowRoster(prev => ({ ...prev, [activePubId]: !prev[activePubId] }))}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              Roster ({activeMembers.length})
            </button>

            {activePub && isOwner && (
              <>
                <button
                  onClick={() => setInvitingPubId(invitingPubId === activePub.id ? null : activePub.id)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Invite
                </button>
                <button
                  onClick={() => startEditing(activePub)}
                  className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                  title="Edit Pub"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {activePub && !isOwner && activePub.members.includes(currentUser) && (
              <button
                onClick={() => handleLeavePub(activePub.id)}
                className="px-2.5 py-1.5 text-red-500 hover:bg-red-500/10 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Leave
              </button>
            )}
          </div>
        </div>

        {/* Header Info Sub-bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shrink-0">
              {activePub ? renderEmblem(activePub.emblem, "w-7 h-7 text-xl") : <span className="shrink-0 text-xl">🍻</span>}
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 dark:text-white leading-snug flex items-center gap-2">
                {activePub ? activePub.name : "No Pub Selected"}
                {activePub && pinnedPubId === activePub.id && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5 fill-amber-500" /> Pinned View
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {activePub ? (
                  <>
                    <span>Host: @{activePub.owner}</span>
                    <span>•</span>
                    <span>{activePub.members.length} Members</span>
                    <span>•</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{activePubFilteredLogs.length} Pints</span>
                  </>
                ) : (
                  <span>Establish or join a pub to get started</span>
                )}
              </div>
            </div>
          </div>

          {activePub && !activePub.members.includes(currentUser) && (
            <button
              onClick={() => handleJoinPub(activePub.id)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Join {activePub.name}
            </button>
          )}
        </div>

        {/* Roster & Invites Expandable Panel */}
        <AnimatePresence>
          {showRoster[activePubId] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap gap-2">
                {activeMembers.map(member => (
                  <div
                    key={member}
                    onClick={() => onViewProfileRequested?.(member)}
                    className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:border-amber-400 transition-all"
                  >
                    <UserAvatar username={member} users={users} className="w-4 h-4 text-[10px]" />
                    <span>@{member}</span>
                    {activePub && member === activePub.owner && <Shield className="w-3 h-3 text-amber-500 fill-amber-500" title="Host" />}
                  </div>
                ))}
              </div>

              {activePub && isInviting && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Invite Friends to {activePub.name}:</p>
                  <div className="max-h-32 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 custom-scrollbar">
                    {otherUsers
                      .filter(u => !activePub.members.includes(u.username) && !activePub.invited.includes(u.username))
                      .map(u => {
                        const selected = additionalInvitees.includes(u.username);
                        return (
                          <button
                            key={u.username}
                            type="button"
                            onClick={() => toggleAdditionalInvitee(u.username)}
                            className={`p-2 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              selected
                                ? "bg-amber-50 dark:bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-200"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <UserAvatar username={u.username} users={users} className="w-4 h-4 text-[10px]" />
                            <span className="truncate">{u.realName || u.username}</span>
                          </button>
                        );
                      })}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setInvitingPubId(null); setAdditionalInvitees([]); }}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg"
                    >
                      Cancel
                    </button>
                    {additionalInvitees.length > 0 && (
                      <button
                        onClick={() => handleSendInvitations(activePub.id)}
                          className="px-4 py-1.5 bg-amber-500 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> Send ({additionalInvitees.length})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        {/* Community Highlights & Dynamic Superlatives */}
        {pubSuperlatives && (
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Pub Honor Roll & Superlatives
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                  Dynamic weekly & monthly honors calculated for pub members
                </p>
              </div>

              {/* Timeframe Selector Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setSuperlativeTimeframe("7d")}
                  className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    superlativeTimeframe === "7d"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => setSuperlativeTimeframe("30d")}
                  className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    superlativeTimeframe === "30d"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => setSuperlativeTimeframe("year")}
                  className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    superlativeTimeframe === "year"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  This Year
                </button>
                <button
                  type="button"
                  onClick={() => setSuperlativeTimeframe("all")}
                  className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    superlativeTimeframe === "all"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {pubSuperlatives.totalPeriodLogs === 0 ? (
              <div className="py-8 px-4 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/60 space-y-1">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  No pub check-ins logged in{" "}
                  {superlativeTimeframe === "7d"
                    ? "the past 7 days"
                    : superlativeTimeframe === "30d"
                    ? "the past 30 days"
                    : superlativeTimeframe === "year"
                    ? "this past year"
                    : "all time"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Switch timeframes above or log a pint to kick off the pub superlatives! 🍻
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pubSuperlatives.top4.map((item) => {
                  const IconComp = item.IconComponent;
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-xl p-3.5 space-y-1.5 transition-all hover:scale-[1.02] shadow-2xs ${item.cardClass}`}
                    >
                      <div className={`flex items-center gap-1.5 ${item.titleClass}`}>
                        <IconComp className={`w-3.5 h-3.5 ${item.iconClass}`} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{item.title}</span>
                      </div>
                      {item.winner ? (
                        <div>
                          <p className="font-extrabold text-xs truncate">
                            @{item.winner.username}
                          </p>
                          <p className={`text-[10px] font-bold ${item.badgeClass}`}>
                            {item.getStatText(item.winner)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] opacity-60 italic">{item.noStatText}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Squad Beacon Station (Light the Beacons theme) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowRallyStation(prev => !prev)}
            className="w-full bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-xl p-3 shadow-sm text-left flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500/30 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-100 uppercase tracking-wider">
                    🔥 Light the Beacons!
                  </span>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase">
                    Pub Beacon
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Signal your mates that a pint session is underway</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 group-hover:bg-slate-750 transition-all flex items-center gap-1.5 shrink-0">
              {showRallyStation ? "Hide Beacon Control ▲" : "Light the Beacons! ▼"}
            </span>
          </button>

          <AnimatePresence>
            {showRallyStation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-2 border-orange-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 mt-1">
                  {/* Fiery animated top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 animate-pulse" />

                  <div className="flex items-center gap-4 z-10">
                    <div className="p-3.5 bg-orange-500/15 border border-orange-500/40 rounded-2xl text-orange-400 shrink-0 shadow-inner">
                      <Flame className="w-8 h-8 text-orange-500 fill-orange-500/30 animate-bounce" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded">
                          BEACON STATION
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">• @{activePub?.name || "Pub"} Signal</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
                        The Beacons of Amon Dîn Are Lit! 🔥
                      </h2>
                      <p className="text-xs text-slate-300 max-w-lg">
                        Hit the beacon button to send an urgent signal to all mates in @{activePub?.name || "Pub"} chat: <span className="text-amber-300 font-bold">"THE BEACONS ARE LIT! Pints call for aid!"</span>
                      </p>
                    </div>
                  </div>

                  {/* Big Beacon Button */}
                  <div className="flex flex-col items-center z-10 shrink-0 pt-1 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handleTriggerRally(activePub?.id || "")}
                      disabled={rallySending}
                      className="group relative inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-orange-500/50 shadow-2xl cursor-pointer hover:border-amber-400 active:scale-95 transition-all"
                      title="LIGHT THE BEACON!"
                    >
                      {/* Outer pulsing fiery ring */}
                      <span className="absolute -inset-1 rounded-full bg-orange-500/30 animate-ping pointer-events-none" />

                      {/* 3D Round Fiery Beacon Button */}
                      <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-600 to-red-700 border-2 border-amber-300/80 shadow-[inset_0_3px_6px_rgba(255,255,255,0.5),0_8px_20px_rgba(234,88,12,0.5)] flex flex-col items-center justify-center gap-0.5 text-white font-black tracking-wider uppercase group-hover:from-amber-300 group-hover:to-red-600 active:shadow-inner transition-all">
                        <Flame className="w-8 h-8 sm:w-9 sm:h-9 text-amber-100 fill-amber-200/50 drop-shadow-md animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] text-white font-black tracking-wider drop-shadow-md text-center leading-tight">
                          {rallySending ? "LIGHTING..." : "LIGHT THE BEACONS!"}
                        </span>
                      </div>
                    </button>
                    <span className="text-[10px] font-black text-orange-400 mt-2 uppercase tracking-widest flex items-center gap-1">
                      🔥 PRESS TO LIGHT BEACON
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {rallySentNotice && (
            <div className="p-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg animate-bounce border border-amber-300">
              <Flame className="w-4 h-4 fill-slate-950/40" />
              <span>🔥 THE BEACONS ARE LIT! Broadcast sent to chat: "Pints call for aid!" ⚔️🍺</span>
            </div>
          )}
        </div>

        {/* Pub Community Chat Section */}
        <PubChatSection
          pubId={activePub?.id || ""}
          pubName={activePub?.name || "Pub"}
          pubOwner={activePub?.owner || "System"}
          currentUser={currentUser}
          users={users}
          onViewProfileRequested={onViewProfileRequested}
          messageRefreshKey={chatRefreshKey}
        />

        {/* Is it a Guinness? Speedometer Gauge Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Beer className="w-4 h-4 text-amber-500" />
                Is it a Guinness?
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Creamy stout vs other craft beers logged in {activePub?.name || "this Pub"}</p>
            </div>
          </div>

            <div className="flex flex-col items-center justify-center py-2">
              {activePubFilteredLogs.length === 0 ? (
                <div className="w-full h-56 flex items-center justify-center text-slate-400 italic">No logs within filtered period</div>
              ) : (() => {
                const totalBeers = activePubFilteredLogs.length;
                const guinnessCount = activePubFilteredLogs.filter(log => log.beerName && log.beerName.toLowerCase().includes("guinness")).length;
                const otherCount = totalBeers - guinnessCount;
                const guinnessPercent = totalBeers > 0 ? Math.round((guinnessCount / totalBeers) * 100) : 0;
                const otherPercent = totalBeers > 0 ? 100 - guinnessPercent : 0;
                
                // Gauge logic:
                // angle goes from 180 degrees (0% - Left) to 0 degrees (100% - Right)
                const angleDegrees = 180 - (guinnessPercent / 100) * 180;
                const angleRad = (angleDegrees * Math.PI) / 180;
                const cx = 100;
                const cy = 100;
                const needleLen = 58;
                const nx = cx + needleLen * Math.cos(angleRad);
                const ny = cy - needleLen * Math.sin(angleRad);

                // Zone and messages
                let ratingTitle = "";
                let ratingDesc = "";
                let ratingColorClass = "";
                let ratingBg = "";
                let ratingBorder = "";

                if (guinnessPercent < 25) {
                  ratingTitle = "Really Bad";
                  ratingDesc = "🚨 Muddy and flat choices! Go find a pint of the black stuff immediately.";
                  ratingColorClass = "text-rose-500";
                  ratingBg = "bg-rose-500/5";
                  ratingBorder = "border-rose-500/10";
                } else if (guinnessPercent >= 25 && guinnessPercent < 75) {
                  ratingTitle = "Adequate";
                  ratingDesc = "⚖️ Average. Tolerable balance, but your soul still yearns for more creamy foam.";
                  ratingColorClass = "text-amber-500";
                  ratingBg = "bg-amber-500/5";
                  ratingBorder = "border-amber-500/10";
                } else {
                  ratingTitle = "Creamy Goodness";
                  ratingDesc = "✨ Stout Heaven! Absolute velvet perfection in your decision making.";
                  ratingColorClass = "text-emerald-500";
                  ratingBg = "bg-emerald-500/5";
                  ratingBorder = "border-emerald-500/10";
                }
                
                return (
                  <div className="w-full flex flex-col items-center">
                    {/* Gauge Widget */}
                    <div className="w-full max-w-[280px] aspect-[1.8/1] relative flex items-center justify-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 120">
                        {/* Definitions for gold and guinness gradients */}
                        <defs>
                          <linearGradient id="pubGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C5A059" />
                            <stop offset="50%" stopColor="#E2C58F" />
                            <stop offset="100%" stopColor="#8A662D" />
                          </linearGradient>
                          <linearGradient id="pubGuinnessGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7E7770" />
                            <stop offset="45%" stopColor="#4A4139" />
                            <stop offset="75%" stopColor="#1E1B18" />
                            <stop offset="100%" stopColor="#0B0908" />
                          </linearGradient>
                          <linearGradient id="pubGoldRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#94A3B8" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#FBBF24" />
                          </linearGradient>
                          <filter id="pubGaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                          </filter>
                        </defs>

                        {/* Gauge Arcs */}
                        <path
                          d="M 30,100 A 70,70 0 0,1 170,100"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="11"
                          strokeLinecap="round"
                        />

                        <path
                          d="M 30,100 A 70,70 0 0,1 170,100"
                          fill="none"
                          stroke="url(#pubGuinnessGaugeGrad)"
                          strokeWidth="11"
                          strokeLinecap="round"
                        />

                        <path
                          d="M 24,100 A 76,76 0 0,1 176,100"
                          fill="none"
                          stroke="url(#pubGoldRimGrad)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.9"
                        />

                        <path
                          d="M 36,100 A 64,64 0 0,1 164,100"
                          fill="none"
                          stroke="url(#pubGoldRimGrad)"
                          strokeWidth="1"
                          strokeLinecap="round"
                          opacity="0.4"
                        />

                        {/* Center Needle & Pivot */}
                        <g filter="url(#pubGaugeShadow)">
                          <line
                            x1={cx}
                            y1={cy}
                            x2={nx}
                            y2={ny}
                            stroke="#C5A059"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1={cx}
                            y1={cy}
                            x2={nx}
                            y2={ny}
                            stroke="#1E1B18"
                            strokeWidth="1"
                            strokeLinecap="round"
                          />
                          <circle cx={cx} cy={cy} r="8" fill="url(#pubGoldGrad)" />
                          <circle cx={cx} cy={cy} r="4" fill="#1E1B18" />
                          <circle cx={cx} cy={cy} r="1.5" fill="#FDFBF7" />
                        </g>

                        {/* Gauge Labels & Ticks */}
                        <text x="21" y="118" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-400 uppercase tracking-wider">0%</text>
                        <text x="179" y="118" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-400 uppercase tracking-wider">100%</text>
                        
                        {/* Floating percentage readout */}
                        <text x="100" y="15" textAnchor="middle" fill="url(#pubGoldGrad)" className="text-[22px] font-black font-mono tracking-tight">{guinnessPercent}%</text>
                      </svg>
                    </div>

                    {/* Playful rating review banner */}
                    <div className={`w-full max-w-sm mt-2 p-3 rounded-xl border ${ratingBg} ${ratingBorder} text-center shadow-sm`}>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed font-sans">
                        {ratingDesc}
                      </p>
                    </div>
                    
                    {/* High-Contrast Custom Legend/Details */}
                    <div className="w-full mt-4 flex flex-col gap-2 max-w-sm mx-auto">
                      {/* Creamy Pint of Guinness */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <span className="w-4 h-4 rounded-md shrink-0 bg-[#FDFBF7] border-2 border-[#C5A059] shadow-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-sm bg-[#C5A059]" />
                          </span>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-xs text-slate-800 font-sans tracking-tight">Creamy Pint of Guinness</span>
                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Creamy Goodness 🍻</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="font-mono text-xs font-black text-slate-800">{guinnessCount} {guinnessCount === 1 ? "pint" : "pints"}</span>
                          <span className="font-sans text-[10px] text-amber-600 font-bold">{guinnessPercent}%</span>
                        </div>
                      </div>

                      {/* Not a Guinness */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-all opacity-85">
                        <div className="flex items-center gap-3">
                          <span className="w-4 h-4 rounded-md shrink-0 bg-[#7E7770] border-2 border-[#645F5A] shadow-sm flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-sm bg-[#645F5A]" />
                          </span>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-xs text-slate-600 font-sans tracking-tight">Not a Guinness</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flat & Muddy 🌧️</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="font-mono text-xs font-bold text-slate-500">{otherCount} {otherCount === 1 ? "pint" : "pints"}</span>
                          <span className="font-sans text-[10px] text-slate-400 font-bold">{otherPercent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
      {/* Modal to Establish Pub */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4 shrink-0">
                <h3 className="font-extrabold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  Establish a Pub
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-5 space-y-4 custom-scrollbar flex-1">
                <form onSubmit={handleCreatePub} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Pub Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Drunken Dragon, Rusty Anchor"
                      value={newPubName}
                      onChange={(e) => setNewPubName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500 font-semibold"
                      maxLength={35}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Pub Emblem
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setNewPubEmblemType("emoji")}
                        className={`flex-1 py-1.5 px-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          newPubEmblemType === "emoji"
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 font-extrabold"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        <Smile className="w-3.5 h-3.5" /> Emoji
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPubEmblemType("url")}
                        className={`flex-1 py-1.5 px-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          newPubEmblemType === "url"
                            ? "bg-amber-500/20 border-amber-500 text-amber-400 font-extrabold"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        <Image className="w-3.5 h-3.5" /> Picture URL
                      </button>
                    </div>

                    {newPubEmblemType === "emoji" ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-8 sm:grid-cols-9 gap-1 p-1.5 bg-slate-950 border border-slate-800 rounded-xl max-h-32 overflow-y-auto custom-scrollbar">
                          {[
                            "🍺", "🍻", "🥂", "🍷", "🥃", "🍹", "🥤", "🍾", "🍕", "🍔", "🍟", "🌮", "🌯", "🥨", "🍖", "🥩", "🍗", "🌭", "🧀", "🍿", "🍳", "🥓", "🍩", "🍪", "🔥", "❤️", "🎉", "✨", "🌟", "👑", "🏰", "🎪", "🎯", "🎲", "🎰", "🎮", "🎸", "🥁", "🐉", "🦁", "🐺", "🐻", "🦅", "🦉", "🦖", "🦄", "🍀", "⚓", "🏴‍☠️", "🏴", "🚀", "🛸", "👾", "🤖", "👹", "💀", "💩"
                          ].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setNewPubEmoji(em)}
                              className={`p-1 text-[13px] sm:text-base rounded hover:bg-slate-800 transition-all text-center flex items-center justify-center select-none cursor-pointer ${
                                newPubEmoji === em ? "bg-amber-500/20 scale-110 border border-amber-500/30" : ""
                              }`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={newPubUrl}
                          onChange={(e) => setNewPubUrl(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500 font-semibold"
                        />
                        <p className="text-[9px] text-slate-400 mt-1">Provide a direct web image path/link to set as your custom pub emblem.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Invite Mates (Optional)
                    </label>
                    <div className="border border-slate-800/80 rounded-xl p-1.5 bg-slate-950 max-h-28 overflow-y-auto grid grid-cols-1 gap-1">
                      {otherUsers.map((u) => {
                        const isSelected = selectedInvitees.includes(u.username);
                        return (
                          <button
                            key={u.username}
                            type="button"
                            onClick={() => toggleInvitee(u.username)}
                            className={`p-1.5 rounded-lg border text-left text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold"
                                : "bg-slate-900 border-slate-800/60 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <UserAvatar username={u.username} users={users} className="w-5 h-5 text-xs" />
                            <span className="truncate">{u.realName || u.username}</span>
                          </button>
                        );
                      })}
                      {otherUsers.length === 0 && (
                        <p className="text-center text-[10px] text-slate-500 py-4 font-semibold">No other pub companions registered on BeerReal yet.</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-1 cursor-pointer mt-2"
                  >
                    {submitting ? "Establishing Pub..." : "Establish Pub 🍻"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
