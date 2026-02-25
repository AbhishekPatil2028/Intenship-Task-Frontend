import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import chatSocket from "../chat/socket";
import chatApi from "../chat/chatApi";
import "./chatPage.css";

export default function ChatPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("chatUser"));

  const [users, setUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [lastSeenMap, setLastSeenMap] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [unreadMap, setUnreadMap] = useState({});
  const [lastMessageMap, setLastMessageMap] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null); // ✅ IMAGE

  if (!user) return <h2>Please login</h2>;



/* ================= PREVENT BACK ARROW LOGOUT ================= */
useEffect(() => {
  const preventBack = () => {
    window.history.pushState(null, "", window.location.href);
  };

  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", preventBack);

  return () => window.removeEventListener("popstate", preventBack);
}, []);


  /* ================= HELPERS ================= */
  const isToday = (d) =>
    new Date(d).toDateString() === new Date().toDateString();

  const isYesterday = (d) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return new Date(d).toDateString() === y.toDateString();
  };

  const formatDateLabel = (d) =>
    isToday(d)
      ? "Today"
      : isYesterday(d)
      ? "Yesterday"
      : new Date(d).toLocaleDateString();

  const formatLastSeen = (time) => {
    const d = new Date(time);
    if (isToday(d))
      return `last seen at ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    if (isYesterday(d)) return "last seen yesterday";
    return `last seen on ${d.toLocaleDateString()}`;
  };

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    chatApi.get("/chatAuth/users").then((res) => {
      setUsers(res.data.filter((u) => u._id !== user._id));
    });
  }, [user._id]);
  useEffect(() => {
  chatApi.get("/chat/last-messages").then((res) => {
    // response format: { userId: { message, type, createdAt } }
    setLastMessageMap(res.data);
  });
}, []);

useEffect(() => {
  const handleOnlineUsers = async () => {
    const res = await chatApi.get("/chatAuth/users");
    setUsers(res.data.filter((u) => u._id !== user._id));
  };

  chatSocket.on("onlineUsers", handleOnlineUsers);

  return () => {
    chatSocket.off("onlineUsers", handleOnlineUsers);
  };
}, [user._id]);



/* ================= LOAD CHAT ================= */
useEffect(() => {
  if (!selectedUser) return;

  chatApi
    .get(`/chat/${user._id}/${selectedUser._id}`)
    .then((res) => {
      setMessages(
        res.data.map((m) => ({
          ...m,
          status: m.isRead ? "seen" : "delivered",
        }))
      );

      const lastMsg = res.data[res.data.length - 1];
      if (lastMsg) {
        setLastMessageMap((prev) => ({
          ...prev,
          [selectedUser._id]: lastMsg,   // full object ठेव
        }));
      }

      setUnreadMap((p) => ({ ...p, [selectedUser._id]: 0 }));
    });
}, [selectedUser]);


  /* ================= SOCKET ================= */
  useEffect(() => {
      chatSocket.connect();
      chatSocket.emit("join", { userId: user._id });
    

    chatSocket.on("onlineUsers", (list) => {
       console.log("ONLINE USERS FROM SERVER:", list);
      const newOnline = new Set(list.map((u) => u._id));
      setOnlineUserIds((prev) => {
        prev.forEach((id) => {
          if (!newOnline.has(id)) {
            setLastSeenMap((p) => ({
              ...p,
              [id]: new Date().toISOString(),
            }));
          }
        });
        return newOnline;
      });
    });

  chatSocket.on("receiveMessage", (msg) => {
  const isActive =
    selectedUser &&
    ((msg.senderId === user._id &&
      msg.receiverId === selectedUser._id) ||
      (msg.senderId === selectedUser._id &&
        msg.receiverId === user._id));

  if (isActive) {
    setMessages((p) => [...p, { ...msg, status: "delivered" }]);
  } else {
    setUnreadMap((p) => ({
      ...p,
      [msg.senderId]: (p[msg.senderId] || 0) + 1,
    }));
  }

  // 🔥 ADD THIS
  setLastMessageMap((prev) => ({
    ...prev,
    [msg.senderId === user._id ? msg.receiverId : msg.senderId]: msg,
  }));

  if (msg.senderId !== user._id) {
    chatSocket.emit("messageDelivered", {
      messageId: msg._id,
      senderId: msg.senderId,
    });
  }
});


    chatSocket.on("messageSeen", ({ messageId }) => {
      setMessages((p) =>
        p.map((m) =>
          m._id === messageId ? { ...m, status: "seen" } : m
        )
      );
    });

chatSocket.on("typing", ({ senderId }) => {
  if (!selectedUser) return;

  if (senderId === selectedUser._id) {
    setTypingUser(true);
  }
});

chatSocket.on("stopTyping", ({ senderId }) => {
  if (!selectedUser) return;

  if (senderId === selectedUser._id) {
    setTypingUser(false);
  }
});




    return () => chatSocket.off();
  }, [selectedUser]);

  /* ================= SCROLL + SEEN ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    messages.forEach((m) => {
      if (
        selectedUser &&
        m.senderId === selectedUser._id &&
        m.status !== "seen"
      ) {
        chatSocket.emit("messageSeen", {
          messageId: m._id,
          senderId: m.senderId,
        });
      }
    });
  }, [messages]);

  /* ================= SEND TEXT ================= */
  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    chatSocket.emit("sendMessage", {
      senderId: user._id,
      receiverId: selectedUser._id,
      senderName: user.name,
      message: text,
      type: "text",
    });

    setText("");
  };

  /* ================= SEND IMAGE ================= */
  const handleImageSend = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    const reader = new FileReader();
    reader.onload = () => {
      chatSocket.emit("sendMessage", {
        senderId: user._id,
        receiverId: selectedUser._id,
        senderName: user.name,
        message: reader.result, // base64
        type: "image",
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ================= LOGOUT ================= */
  const confirmLogout = () => {
    chatSocket.disconnect();
    localStorage.removeItem("chatUser");
    navigate("/chat-login");
  };

  /* ================= UI ================= */
  let lastDateLabel = "";

  return (
    <div className="wa-container">
      {/* SIDEBAR */}
      <div className="wa-sidebar">
        <div className="wa-profile">
          <span>{user.name}</span>
          <button onClick={() => setShowLogoutModal(true)}>Logout</button>
        </div>

        {users.map((u) => (
  <div
    key={u._id}
    className={`wa-user ${
      selectedUser?._id === u._id ? "active" : ""
    }`}
    onClick={() => setSelectedUser(u)}
  >
    <div className="wa-user-left">
      <div className="wa-avatar">
        {u.avatar ? (
          <img src={u.avatar} alt={u.name} />
        ) : (
          <span>{u.name.charAt(0).toUpperCase()}</span>
        )}

        {onlineUserIds.has(u._id) && (
          <span className="wa-avatar-online" />
        )}
      </div>

        <div className="wa-user-text">
    <div className="wa-user-name">{u.name}</div>

    {/* 👇 याच line वर latest message */}
   <div className="wa-user-lastmsg">
  {lastMessageMap[u._id]?.type === "image"
    ? "📷 Photo"
    : lastMessageMap[u._id]?.message || " "}
</div>

  </div>


    </div>

    {unreadMap[u._id] > 0 && (
      <span className="badge">{unreadMap[u._id]}</span>
    )}
  </div>
))}

      </div>

      {/* CHAT */}

      <div className="wa-chat">
       <div className="wa-header">
  {selectedUser ? (
    <>
    
      
<div className="wa-header-left">
  {/* AVATAR */}
  <div className="wa-avatar large">
    {selectedUser.avatar ? (
      <img src={selectedUser.avatar} alt={selectedUser.name} />
    ) : (
      <span>{selectedUser.name.charAt(0).toUpperCase()}</span>
    )}
  </div>

  {/* NAME + STATUS */}
  <div>
    <div className="wa-header-name">{selectedUser.name}</div>

    <div
      className={`wa-header-status ${
        typingUser
          ? "typing-active"
          : onlineUserIds.has(selectedUser._id)
          ? "online"
          : "offline"
      }`}
    >
      {typingUser ? (
        <>
          typing
          <span className="dot-typing one">.</span>
          <span className="dot-typing two">.</span>
          <span className="dot-typing three">.</span>
        </>
      ) : onlineUserIds.has(selectedUser._id) ? (
        "online"
      ) : lastSeenMap[selectedUser._id] ? (
        formatLastSeen(lastSeenMap[selectedUser._id])
      ) : (
        "offline"
      )}
    </div>
  </div>
</div>


    </>
  ) : (
    "Select a chat"
  )}
</div>


        <div className="wa-messages">
          {messages.map((m) => {
            const label = formatDateLabel(m.createdAt);
            const show = label !== lastDateLabel;
            lastDateLabel = label;

            const own = m.senderId === user._id;

            return (
              <div key={m._id}>
                {show && <div className="date-label">{label}</div>}

                <div className={`msg ${own ? "own" : ""}`}>
                  <div className="bubble">
                    {m.type === "image" ? (
                      <img
                        src={m.message}
                        alt="img"
                        className="chat-image"
                      />
                    ) : (
                      m.message
                    )}
                    <div className="time">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {own &&
                        (m.status === "seen" ? " ✔✔" : " ✔")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {typingUser && <div className="typing">{typingUser}</div>}
          <div ref={bottomRef} />
        </div>
           
           {selectedUser &&(

             <div className="wa-input">

          <input
  value={text}
  onChange={(e) => {
    setText(e.target.value);
    
    if (!selectedUser) return;
    
    // 🔥 EMIT TYPING
    chatSocket.emit("typing", {
      receiverId: selectedUser._id,
      senderId: user._id,
    });
    
    // stop typing after delay
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      chatSocket.emit("stopTyping", {
        receiverId: selectedUser._id,
        senderId: user._id,
      });
    }, 800);
  }}
   onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();   // Enter press = Send
    }
  }}
  placeholder={
    selectedUser ? `Message ${selectedUser.name}` : "Select user"
  }
/>


          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageSend}
          />

          <button onClick={() => fileInputRef.current.click()}>
            📷
          </button>

          <button onClick={sendMessage}>Send</button>
        </div>
      )}
      </div>

      {/* LOGOUT MODAL */}
     {/* LOGOUT MODAL */}
{showLogoutModal && (
  <div className="wa-modal-overlay">
    <div className="wa-modal">
      <h3 className="wa-modal-title">Logout</h3>
      <p className="wa-modal-text">
        Are you sure you want to logout?
      </p>

      <div className="wa-modal-actions">
        <button
          className="wa-btn cancel"
          onClick={() => setShowLogoutModal(false)}
        >
          Cancel
        </button>

        <button
          className="wa-btn danger"
          onClick={confirmLogout}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
