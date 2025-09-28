import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaMicrophone, FaTimes } from 'react-icons/fa';
import { useTheme } from "../context/ThemeContext";
const ConsumerChatbot = () => {
  const { theme, isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! How can I help you with your food orders, menu, payments, or nutrition insights today?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Import API keys from env
  const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY;
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Voice recognition for routing
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setInput(transcript);
      // Simple routing commands
      if (transcript.includes('menu')) window.location.href = '/consumer/menu';
      else if (transcript.includes('dashboard')) window.location.href = '/consumer/dashboard';
      else if (transcript.includes('payments')) window.location.href = '/consumer/payments';
      else if (transcript.includes('nutrition')) window.location.href = '/consumer/nutritioninsights';
    };
    recognitionRef.current.onend = () => setListening(false);
  }, []);

  const handleVoice = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  // Chatbot API call (Grok/Gemini)
  const sendMessage = async (msg) => {
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    // Example: Gemini API call (replace with Grok if needed)
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: msg }] }],
          safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }]
        })
      });
      const data = await res.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not help with that.';
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, there was an error.' }]);
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg border-2 flex items-center justify-center backdrop-blur-md hover:scale-110 transition-all"
        style={{ backgroundColor: `${theme.panels}95`, borderColor: theme.primary, color: theme.primary }}
        aria-label="Open Chatbot"
      >
        <FaCommentDots style={{ fontSize: '2rem' }} />
      </button>
      {/* Chatbot Window */}
      {open && (
        <div
          className="fixed bottom-20 right-8 z-[60] flex flex-col rounded-2xl border-2 shadow-2xl overflow-hidden"
          style={{
            width: '350px',
            height: '30vh',
            maxHeight: '340px',
            background: isDarkMode
              ? 'linear-gradient(135deg, #18181b 0%, #23272f 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
            borderColor: theme.primary,
            fontFamily: 'Merriweather, serif',
            boxShadow: isDarkMode
              ? `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}30`
              : `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}60`,
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: isDarkMode
              ? `radial-gradient(circle at 80% 20%, ${theme.primary}30 0%, transparent 60%), radial-gradient(circle at 20% 80%, ${theme.secondary}20 0%, transparent 60%)`
              : `radial-gradient(circle at 80% 20%, ${theme.primary}40 0%, transparent 60%), radial-gradient(circle at 20% 80%, ${theme.secondary}30 0%, transparent 60%)`
          }} />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-2 right-2 text-xl p-2 rounded-full transition-all z-50 cursor-pointer"
            style={{ 
              color: theme.primary,
              backgroundColor: `${theme.panels}80`,
              ':hover': {
                backgroundColor: `${theme.primary}20`
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${theme.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${theme.panels}80`;
            }}
            aria-label="Close Chatbot"
            title="Close Chatbot"
          >
            <FaTimes />
          </button>
          <div className="flex-1 overflow-y-auto px-4 pt-8 pb-2 z-10" style={{ fontSize: '0.95rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '8px', textAlign: msg.role === 'bot' ? 'left' : 'right' }}>
                <span style={{ color: msg.role === 'bot' ? theme.textSecondary : theme.primary, fontWeight: msg.role === 'bot' ? '500' : '700' }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form
            className="flex items-center gap-2 px-4 pb-4 z-10"
            onSubmit={e => { e.preventDefault(); if (input.trim()) sendMessage(input.trim()); }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about menu, orders, payments..."
              className="flex-1 rounded-lg px-3 py-2 border"
              style={{ borderColor: theme.primary, background: isDarkMode ? '#23272f' : '#f8fafc', color: theme.text }}
            />
            <button type="button" onClick={handleVoice} className="p-2 rounded-full" style={{ color: listening ? theme.secondary : theme.primary }}>
              <FaMicrophone />
            </button>
            <button type="submit" className="p-2 rounded-full" style={{ color: theme.primary }}>
              <FaCommentDots />
            </button>
          </form>
          {/* Glowing border effect */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '1.25rem', pointerEvents: 'none', zIndex: 1,
            boxShadow: isDarkMode
              ? `0 0 32px 8px ${theme.primary}60`
              : `0 0 32px 8px ${theme.primary}80`,
            border: `2px solid ${theme.primary}`,
            opacity: 0.7,
          }} />
        </div>
      )}
    </>
  );
};

export default ConsumerChatbot;
