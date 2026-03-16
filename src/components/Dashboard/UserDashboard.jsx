import { useState, useEffect, useRef } from "react";
import MyParticipated from "./MyParticipated";
import MyWinning from "./MyWinning";
import MyProfile from "./MyProfile";
import { io } from "socket.io-client";
// Cloudinary upload helper
const CLOUDINARY_CLOUD = "dmacfkxe6";
const CLOUDINARY_PRESET = "contesthub_messages"; // unsigned preset — create this in Cloudinary dashboard

async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", "messages");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (data.secure_url) resolve(data.secure_url);
      else reject(new Error(data.error?.message || "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}
import {
  FaTrophy, FaMedal, FaChartLine, FaDollarSign,
  FaUser, FaListAlt, FaCrown, FaSignOutAlt,
  FaTachometerAlt, FaBars, FaTimes, FaBell,
  FaChartBar, FaCog, FaHistory, FaSearch,
  FaPaperPlane, FaEllipsisV, FaSmile,
  FaMicrophone, FaCheckDouble, FaPlus,
  FaPaperclip, FaStop, FaImage, FaFile, FaTimes as FaX,
} from "react-icons/fa";

// ── Emoji list ────────────────────────────────────────────────────
const EMOJIS = [
  "😀","😂","😍","🥰","😎","🤩","😭","😤","🥺","😏",
  "👍","👎","❤️","🔥","🎉","✅","💯","🙏","💪","👏",
  "😊","🤔","😴","🤣","😇","🤗","😈","👀","💀","🫡",
  "🌟","💫","⚡","🎯","🚀","💥","🌈","🎊","🏆","🎁",
];

// ─────────────────────────────────────────────────────────────────
// 🔧 SOCKET SINGLETON
// Change VITE_SOCKET_URL in your .env file to your backend URL
// e.g.  VITE_SOCKET_URL=http://localhost:5000
// ─────────────────────────────────────────────────────────────────
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
let _socket = null;
function getSocket(uid) {
  if (_socket) return _socket;
  _socket = io(SOCKET_URL, {
    auth: { uid },
    transports: ["polling", "websocket"],
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 10000,
    forceNew: false,
  });
  return _socket;
}

// ─────────────────────────────────────────────────────────────────
// BAR CHART  (no external lib)
// ─────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map((d, i) => {
        const pct = max > 0 ? (d.value / max) * 100 : 0;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[9px] text-gray-400">{d.value > 0 ? `$${d.value}` : ""}</span>
            <div
              className="w-full rounded-t-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
              style={{ height: `${Math.max(pct, 4)}%` }}
            />
            <span className="text-[10px] text-gray-400">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MESSAGES SECTION  — real socket.io
//
// Expected socket events FROM server:
//   "contacts"        → [{ id, name, initials, color, time, unread, online, lastMsg }]
//   "message_history" → { contactId, messages: [{ id, from, text, time }] }
//   "receive_message" → { contactId, id, from, text, time }
//   "typing"          → { contactId }
//   "stop_typing"     → { contactId }
//
// Events EMITTED to server:
//   "get_contacts"    → { userId }
//   "get_history"     → { userId, contactId }
//   "send_message"    → { from, to, text, time }
//   "typing"          → { to, from }
//   "stop_typing"     → { to, from }
// ─────────────────────────────────────────────────────────────────
function MessagesSection({ user }) {
  const userId = user?.uid;

  // Emoji
  const [showEmoji, setShowEmoji]       = useState(false);
  // Voice
  const [recording, setRecording]       = useState(false);
  const [audioBlob, setAudioBlob]       = useState(null);
  const [audioURL, setAudioURL]         = useState(null);
  const [recordSecs, setRecordSecs]     = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef   = useRef([]);
  const recordTimer      = useRef(null);
  // File
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [showNewMsg, setShowNewMsg]   = useState(false);
  const [userSearch, setUserSearch]   = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searching, setSearching]     = useState(false);

  const [contacts, setContacts]       = useState([]);
  const [selectedId, setSelectedId]   = useState(null);
  const [messages, setMessages]       = useState({});
  const [search, setSearch]           = useState("");
  const [input, setInput]             = useState("");
  const [connected, setConnected]     = useState(false);
  const [typing, setTyping]           = useState(false);

  const socketRef   = useRef(null);
  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);

  // ── Connect & register listeners ────────────────────────────
  useEffect(() => {
    if (!userId) {
      console.warn("No userId — not connecting socket");
      return;
    }
    const s = getSocket(userId);
    socketRef.current = s;

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
      setConnected(true);
      s.emit("get_contacts", { userId: userId });
    });
    s.on("connect_error", (err) => {
      console.error("❌ Socket connect_error:", err.message);
      setConnected(false);
    });
    s.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setConnected(false);
    });

    s.on("contacts", (list) => setContacts(list));

    s.on("message_history", ({ contactId, messages: msgs }) =>
      setMessages((prev) => ({ ...prev, [contactId]: msgs }))
    );

    s.on("receive_message", ({ contactId, ...msg }) => {
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), msg],
      }));
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, lastMsg: msg.text, time: "Just Now", unread: (c.unread || 0) + 1 }
            : c
        )
      );
    });

    s.on("typing",      ({ contactId }) => { if (contactId === selectedId) setTyping(true);  });
    s.on("stop_typing", ({ contactId }) => { if (contactId === selectedId) setTyping(false); });

    // Ask server for contact list
    s.emit("get_contacts", { userId: userId });

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("contacts");
      s.off("message_history");
      s.off("receive_message");
      s.off("typing");
      s.off("stop_typing");
    };
  }, [userId]);

  // ── Load history when switching conversation ─────────────────
  useEffect(() => {
    if (!selectedId) return;
    setContacts((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c))
    );
    if (!messages[selectedId]) {
      socketRef.current?.emit("get_history", { userId: userId, contactId: selectedId });
    }
    setTyping(false);
  }, [selectedId]);

  // ── Auto-scroll ──────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedId]?.length, selectedId]);

  // ── Send message ─────────────────────────────────────────────
  const sendMessage = () => {
    if (!input.trim() || !selectedId) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const msg  = { id: Date.now(), from: "me", text: input.trim(), time: now };

    // Optimistic UI update
    setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), msg] }));
    setContacts((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, lastMsg: msg.text, time: "Just Now" } : c))
    );

    socketRef.current?.emit("send_message", { from: userId, to: selectedId, text: msg.text, time: now });
    socketRef.current?.emit("stop_typing",  { to: selectedId, from: userId });
    setInput("");
  };

  // ── Typing indicator ─────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    socketRef.current?.emit("typing", { to: selectedId, from: userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing", { to: selectedId, from: userId });
    }, 1500);
  };

  const selected = contacts.find((c) => c.id === selectedId);
  const chat     = messages[selectedId] || [];
  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Emoji ────────────────────────────────────────────────────
  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // ── Voice recording ───────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);
      setRecordSecs(0);
      recordTimer.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
    } catch {
      alert("Microphone permission denied!");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(recordTimer.current);
  };

  const cancelVoice = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setRecordSecs(0);
  };

  const sendVoice = async () => {
    if (!audioBlob || !selectedId) return;
    setUploading(true);
    try {
      const file = new File([audioBlob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
      const url = await uploadToCloudinary(file, setUploadProgress);
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const msg = { id: Date.now(), from: "me", text: "", type: "voice", fileURL: url, time: now };
      setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), msg] }));
      socketRef.current?.emit("send_message", { from: userId, to: selectedId, text: "", type: "voice", fileURL: url, time: now });
      cancelVoice();
    } catch (err) {
      console.error("Voice upload error:", err);
      alert("Voice upload failed: " + err.message);
    }
    setUploading(false);
    setUploadProgress(0);
  };

  // ── File / Image upload ───────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedId) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, setUploadProgress);
      const isImage = file.type.startsWith("image/");
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const msg = { id: Date.now(), from: "me", text: file.name, type: isImage ? "image" : "file", fileURL: url, time: now };
      setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), msg] }));
      socketRef.current?.emit("send_message", { from: userId, to: selectedId, text: file.name, type: isImage ? "image" : "file", fileURL: url, time: now });
    } catch (err) {
      console.error("File upload error:", err);
      alert("File upload failed: " + err.message);
    }
    setUploading(false);
    setUploadProgress(0);
    e.target.value = "";
  };

  // ── Search users to start new conversation ──────────────────
  const searchUsers = async (q) => {
    setUserSearch(q);
    if (!q.trim()) { setUserResults([]); return; }
    setSearching(true);
    try {
      // Firebase user থেকে fresh token নিন
      let authToken = null;
      if (user?.getIdToken) {
        authToken = await user.getIdToken();
      }
      const res = await fetch(
        `${SOCKET_URL}/api/users/search?q=${encodeURIComponent(q)}`,
        { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} }
      );
      const data = await res.json();
      setUserResults((data.users || []).filter((u) => u._id !== userId && u.uid !== userId));
    } catch {
      setUserResults([]);
    }
    setSearching(false);
  };

  const startConversation = (u) => {
    const contactId = u._id;
    // Add to contacts if not already there
    setContacts((prev) => {
      if (prev.find((c) => c.id === contactId)) return prev;
      return [{
        id: contactId,
        name: u.name,
        initials: u.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?",
        color: "bg-indigo-400",
        online: false,
        unread: 0,
        lastMsg: "",
        time: "",
      }, ...prev];
    });
    setSelectedId(contactId);
    setShowNewMsg(false);
    setUserSearch("");
    setUserResults([]);
  };

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* ── Contact List ─────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col relative">
        {/* Search + New Message */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">
              <FaSearch className="text-gray-400 text-xs flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none w-full placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowNewMsg(true)}
              title="New Message"
              className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>
          <p className={`text-[10px] px-1 font-medium ${connected ? "text-emerald-500" : "text-red-400"}`}>
            {connected ? "● Connected" : "○ Connecting..."}
          </p>
        </div>

        {/* New Message Modal */}
        {showNewMsg && (
          <div className="absolute inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col" style={{width:"288px"}}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">New Message</p>
              <button onClick={() => { setShowNewMsg(false); setUserSearch(""); setUserResults([]); }}
                className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                <FaSearch className="text-gray-400 text-xs flex-shrink-0" />
                <input
                  autoFocus
                  value={userSearch}
                  onChange={(e) => searchUsers(e.target.value)}
                  placeholder="Search by name or email..."
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none w-full placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
              {searching && <p className="text-center text-xs text-gray-400 mt-4">Searching...</p>}
              {!searching && userSearch && userResults.length === 0 && (
                <p className="text-center text-xs text-gray-400 mt-4">No users found</p>
              )}
              {userResults.map((u) => (
                <button
                  key={u._id}
                  onClick={() => startConversation(u)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 mt-10">No conversations yet</p>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 dark:border-gray-800 transition-colors text-left
                ${selectedId === c.id ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${c.color || "bg-indigo-400"} flex items-center justify-center text-white text-sm font-bold`}>
                  {c.initials || c.name?.[0]?.toUpperCase() || "?"}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.name}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{c.lastMsg}</p>
              </div>
              <div className="flex-shrink-0 ml-1">
                {c.unread > 0 ? (
                  <span className="w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {c.unread}
                  </span>
                ) : (
                  <FaCheckDouble className="text-indigo-400 text-xs" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Window ──────────────────────────────────────── */}
      {!selectedId ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <FaBell className="text-4xl mb-3 text-indigo-200" />
          <p className="font-medium">Select a conversation to start chatting</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${selected?.color || "bg-indigo-400"} flex items-center justify-center text-white text-sm font-bold`}>
                {selected?.initials || selected?.name?.[0] || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selected?.name}</p>
                <p className={`text-[11px] ${selected?.online ? "text-emerald-500" : "text-gray-400"}`}>
                  {typing ? "Typing..." : selected?.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <button className="hover:text-gray-600 transition-colors"><FaSearch /></button>
              <button className="hover:text-gray-600 transition-colors"><FaEllipsisV /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50 dark:bg-gray-950">
            {chat.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-10">No messages yet. Say hi! 👋</p>
            )}
            {chat.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.from === "me" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold
                  ${msg.from === "me" ? "bg-indigo-500" : selected?.color || "bg-indigo-400"}`}>
                  {msg.from === "me"
                    ? user?.displayName?.[0]?.toUpperCase() || "U"
                    : selected?.initials || selected?.name?.[0] || "?"}
                </div>
                <div className={`flex flex-col gap-1 max-w-[65%] ${msg.from === "me" ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-gray-400 px-1 flex items-center gap-1">
                    {msg.from === "me" && <FaCheckDouble className="text-indigo-400" />}
                    {msg.time} · {msg.from === "me" ? "You" : selected?.name}
                  </span>
                  <div className={`rounded-2xl text-sm leading-relaxed overflow-hidden
                    ${msg.from === "me"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm shadow-sm"
                    } ${msg.type === "image" ? "p-0" : "px-4 py-2.5"}`}>
                    {msg.type === "image" ? (
                      <a href={msg.fileURL} target="_blank" rel="noreferrer">
                        <img src={msg.fileURL} alt="img" className="max-w-[220px] max-h-[200px] object-cover rounded-2xl" />
                      </a>
                    ) : msg.type === "voice" ? (
                      <audio controls src={msg.fileURL} className="h-8 max-w-[220px]" />
                    ) : msg.type === "file" ? (
                      <a href={msg.fileURL} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 hover:opacity-80">
                        <FaFile className="flex-shrink-0" />
                        <span className="truncate max-w-[160px]">{msg.text}</span>
                      </a>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-end gap-2">
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${selected?.color || "bg-indigo-400"}`}>
                  {selected?.initials || "?"}
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-3">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="px-4 pb-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl max-h-32 overflow-y-auto">
                {EMOJIS.map((e, i) => (
                  <button key={i} onClick={() => addEmoji(e)}
                    className="text-xl hover:scale-125 transition-transform">
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice preview */}
          {audioURL && (
            <div className="px-4 pb-2 bg-white dark:bg-gray-900 flex items-center gap-3">
              <audio controls src={audioURL} className="h-8 flex-1" />
              <button onClick={cancelVoice} className="text-red-400 hover:text-red-600"><FaX /></button>
              <button onClick={sendVoice} disabled={uploading}
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white">
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="px-4 pb-1">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all rounded-full" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Uploading... {uploadProgress}%</p>
            </div>
          )}

          {/* Input Bar */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-2">
            {/* Emoji */}
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className={`text-lg flex-shrink-0 transition-colors ${showEmoji ? "text-indigo-500" : "text-gray-400 hover:text-indigo-500"}`}>
              <FaSmile />
            </button>

            {/* File upload */}
            <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.doc,.docx,.txt"
              className="hidden" onChange={handleFileChange} />
            <button onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-indigo-500 transition-colors flex-shrink-0">
              <FaPaperclip />
            </button>

            {/* Voice */}
            {recording ? (
              <button onClick={stopRecording}
                className="flex items-center gap-1.5 text-red-500 flex-shrink-0 text-sm font-medium animate-pulse">
                <FaStop /> {recordSecs}s
              </button>
            ) : (
              <button onClick={startRecording}
                className="text-gray-400 hover:text-indigo-500 transition-colors flex-shrink-0">
                <FaMicrophone />
              </button>
            )}

            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message here..."
              className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none border border-gray-100 dark:border-gray-700 focus:border-indigo-300 transition-colors placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0 shadow-sm"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────
export default function UserDashboard({ user }) {
  const [activeTab, setActiveTab]     = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = {
    totalParticipated: 12,
    totalWon: 3,
    winRate: 25,
    totalPrize: 480,
    activeContests: 4,
    totalContestants: 340,
  };

  const monthlyEarnings = [
    { month: "Jan", value: 80  }, { month: "Feb", value: 100 },
    { month: "Mar", value: 68  }, { month: "Apr", value: 110 },
    { month: "May", value: 105 }, { month: "Jun", value: 80  },
    { month: "Jul", value: 88  }, { month: "Aug", value: 85  },
    { month: "Sep", value: 30  }, { month: "Oct", value: 98  },
    { month: "Nov", value: 95  }, { month: "Dec", value: 88  },
  ];

  const mainNav = [
    { id: "overview",     label: "Dashboard",      icon: <FaTachometerAlt /> },
    { id: "participated", label: "My Participated", icon: <FaListAlt /> },
    { id: "winning",      label: "My Winnings",     icon: <FaCrown /> },
    { id: "profile",      label: "My Profile",      icon: <FaUser /> },
    { id: "analytics",    label: "Analytics",       icon: <FaChartBar /> },
    { id: "history",      label: "History",         icon: <FaHistory /> },
    { id: "messages",     label: "Messages",        icon: <FaBell /> },
  ];

  const statCards = [
    { label: "Total Participated", value: stats.totalParticipated,    icon: <FaListAlt />,    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { label: "Total Won",          value: `0${stats.totalWon}`,       icon: <FaTrophy />,     color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
    { label: "Win Rate",           value: `${stats.winRate}%`,        icon: <FaChartLine />,  color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { label: "Active Contests",    value: `0${stats.activeContests}`, icon: <FaMedal />,      color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
    { label: "Total Contestants",  value: stats.totalContestants,     icon: <FaUser />,       color: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
    { label: "Total Prize Won",    value: `$${stats.totalPrize}`,     icon: <FaDollarSign />, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  const recentContests = [
    { name: "Logo Design Challenge", status: "Won",          prize: "$120", date: "Mar 10, 2026" },
    { name: "Web Banner Contest",    status: "Participated", prize: "—",    date: "Mar 7, 2026"  },
    { name: "Photography Contest",   status: "Participated", prize: "—",    date: "Feb 28, 2026" },
    { name: "UI Design Sprint",      status: "Live",         prize: "$200", date: "Live now"     },
  ];

  const statusStyle = {
    Won:          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Participated: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    Live:         "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 font-sans">

      {/* ── Purple Header ───────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-r from-indigo-800 via-indigo-600 to-violet-500 px-8 py-6 flex items-center justify-between">
        <div className="absolute right-48 -top-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-24 top-4  w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-10 -top-4 w-28 h-28 rounded-full bg-violet-300/20 pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-14 h-14 rounded-full object-cover ring-4 ring-white/30" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-300 ring-4 ring-white/30 flex items-center justify-center text-indigo-900 font-bold text-xl">
                {user?.displayName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-tight">{user?.displayName || "User"} ✏️</p>
            <p className="text-indigo-200 text-sm">Contestant</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <a href="/all-contests" className="bg-white text-indigo-700 font-semibold text-sm px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors shadow-sm">
            Browse Contests
          </a>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors shadow-sm">
            My Dashboard
          </button>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white ml-2">
            <FaBars size={20} />
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-56 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto
        `}>
          <div className="lg:hidden flex justify-end px-4 pt-4">
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </div>

          <nav className="px-3 pt-5 space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
            {mainNav.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                  ${activeTab === item.id
                    ? "text-red-600 dark:text-red-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <span className={`text-sm ${activeTab === item.id ? "text-red-500" : "text-gray-400"}`}>{item.icon}</span>
                {item.label}
                {activeTab === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
              </button>
            ))}
          </nav>

          <div className="px-3 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Account Settings</p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <FaCog className="text-gray-400 text-sm" /> Settings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all">
              <FaSignOutAlt className="text-sm" /> Logout
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto min-w-0">

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {statCards.map((card, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${card.color}`}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{card.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Earnings by Month</h2>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">
                    📅 01/01/2026 – {today}
                  </span>
                </div>
                <BarChart data={monthlyEarnings} />
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recently Participated Contests</h2>
                  <button onClick={() => setActiveTab("participated")} className="text-xs font-semibold text-red-500 hover:text-red-600">
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-3 px-5 py-2 bg-gray-50 dark:bg-gray-800/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Contests</span><span className="text-center">Prize</span><span className="text-center">Status</span>
                </div>
                {recentContests.map((c, i) => (
                  <div key={i} className="grid grid-cols-3 items-center px-5 py-3.5 border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <FaTrophy className="text-red-400 text-xs" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{c.name}</p>
                        <p className="text-[11px] text-gray-400">{c.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{c.prize}</p>
                    <div className="flex justify-center">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusStyle[c.status]}`}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "participated" && <MyParticipated user={user} />}
          {activeTab === "winning"      && <MyWinning user={user} />}
          {activeTab === "profile"      && <MyProfile user={user} />}
          {activeTab === "messages"     && <MessagesSection user={user} />}

          {["analytics", "history"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center min-h-64 text-gray-400">
              <p className="text-4xl mb-3">🚧</p>
              <p className="font-medium text-gray-500 dark:text-gray-400">
                {mainNav.find((n) => n.id === activeTab)?.label} — Coming Soon
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}