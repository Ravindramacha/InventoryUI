import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function ChatUI() {
  const [conversations, setConversations] = useState({});
  const [currentId, setCurrentId] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("conversations");
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed);
      const ids = Object.keys(parsed);
      if (ids.length > 0) setCurrentId(ids[0]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const currentMessages = currentId ? conversations[currentId] || [] : [];

  const handleSend = () => {
    if (!input.trim() || !currentId) return;

    const newMessage = { id: Date.now(), sender: "user", text: input };
    const updatedMessages = [...currentMessages, newMessage];

    setConversations({
      ...conversations,
      [currentId]: updatedMessages,
    });
    setInput("");

    // Simulated bot reply
    setTimeout(() => {
      const reply = {
        id: Date.now(),
        sender: "bot",
        text: "🤖 This is a simulated response.",
      };
      setConversations((prev) => ({
        ...prev,
        [currentId]: [...(prev[currentId] || []), reply],
      }));
    }, 800);
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setConversations({
      ...conversations,
      [newId]: [],
    });
    setCurrentId(newId);
  };

  const handleDeleteChat = (id) => {
    const updated = { ...conversations };
    delete updated[id];
    setConversations(updated);

    if (currentId === id) {
      const remainingIds = Object.keys(updated);
      setCurrentId(remainingIds.length > 0 ? remainingIds[0] : null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  return (
    <Box sx={{ display: "flex", height: "85vh", bgcolor: "white" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          borderRight: "1px solid #e5e5e5",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleNewChat}
            sx={{
              textTransform: "none",
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#556370ff" },
            }}
          >
            New Chat
          </Button>
        </Box>

        <List sx={{ flexGrow: 1, overflowY: "auto" }}>
          {Object.keys(conversations).length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 2, textAlign: "center" }}
            >
              No conversations yet
            </Typography>
          ) : (
            Object.entries(conversations).map(([id, msgs]) => (
              <ListItem
                key={id}
                button
                selected={id === currentId}
                onClick={() => setCurrentId(id)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={msgs[0]?.text || "New Conversation"}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: 14,
                  }}
                />
                <IconButton
                  size="small"
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      
     {/* Chat Panel */}
<Box
  sx={{
    flex: 1,
    overflowY : "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bgcolor: "white",
    height: "80vh", // full height
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: 800,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    }}
  >
    {/* Chat body (scrollable area) */}
    <Box
      sx={{
        flexGrow: 1,          // take available space
        overflowY: "auto",    // enable scroll only for messages
        p: 2,
        minHeight: 0,  
      }}
    >
      {!currentId || currentMessages.length === 0 ? (
        // Welcome screen
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: "100%",
            px: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "#10a37f", width: 64, height: 64, mb: 2 }}>
            AI
          </Avatar>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to ChatUI
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Ask me anything to get started.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              maxWidth: 500,
            }}
          >
            {[
              "Explain quantum computing in simple terms",
              "Give me creative ideas for a birthday party",
              "Write a poem about the ocean",
              "How do I learn React faster?",
            ].map((example, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
                onClick={() => setInput(example)}
              >
                <Typography variant="body2">{example}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      ) : (
        // Messages
        <>
          {currentMessages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              {msg.sender === "bot" && (
                <Avatar
                  sx={{
                    bgcolor: "#10a37f",
                    width: 32,
                    height: 32,
                    mr: 1,
                    fontSize: 14,
                  }}
                >
                  AI
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: "80%",
                  bgcolor: msg.sender === "user" ? "#10a37f" : "#f1f1f1",
                  color: msg.sender === "user" ? "white" : "black",
                  borderRadius: 3,
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
              {msg.sender === "user" && (
                <Avatar
                  sx={{
                    bgcolor: "grey.500",
                    ml: 1,
                    width: 32,
                    height: 32,
                    fontSize: 14,
                  }}
                >
                  U
                </Avatar>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </Box>

    {/* Input box - fixed at bottom */}
    <Box
      sx={{
        borderTop: "1px solid #e5e5e5",
        p: 2,
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #3157d3ff",
          borderRadius: 3,
          p: "4px 8px",
          bgcolor: "white",
        }}
      >
        <TextField
          variant="standard"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && handleSend()
          }
          multiline
          maxRows={6}
          InputProps={{ disableUnderline: true }}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  </Box>
</Box>
    </Box>
  );
}
