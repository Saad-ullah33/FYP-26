import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Lock } from "lucide-react";
import { useSubscription } from "../../hooks/useSubscription";
import { geminiService } from "../../services/geminiService";

export const AIChatbotAssistant = () => {
  const { currentPlan, canAccess, getRemainingQuota, incrementUsage, setIsUpgradeModalOpen } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Assalam-o-Alaikum! I am PropSight AI, your real estate assistant for Faisalabad. Ask me about property prices, investment areas like Canal Road or FDA City, or construction cost estimates!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    // Check message quota limits
    const hasAccess = canAccess("aiChatbotAssistant");
    if (!hasAccess) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const userMsg = message.trim();
    setMessage("");
    
    // Add user message to state
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    incrementUsage("aiChatbotAssistant");

    try {
      // Form chat history payload in Gemini SDK structure
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const botResponse = await geminiService.getChatbotResponse({
        message: userMsg,
        chatHistory: chatHistory,
      });

      setMessages((prev) => [...prev, { role: "model", text: botResponse }]);
    } catch (err) {
      console.error("Chatbot fault layer:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I experienced a connection issue. Can you please check your internet connectivity or API key setup?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const remaining = getRemainingQuota("aiChatbotAssistant");
  const isFree = currentPlan === "free";

  return (
    <div className="fixed bottom-6 right-6 z-[1050] font-sans">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer transition transform hover:scale-105 active:scale-95 group relative border border-white/10"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-black text-slate-900 items-center justify-center shadow-sm">
              AI
            </span>
          </span>
        </button>
      )}

      {/* CHAT WINDOW INTERFACE */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-4.5 py-4 text-white flex justify-between items-center border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 border border-white/20 rounded-xl">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs tracking-tight">PropSight AI Assistant</h4>
                {isFree ? (
                  <span className="text-[10px] text-amber-200 font-bold block mt-0.5">
                    Free Plan: {remaining === Infinity ? "Unlimited" : `${remaining} daily messages left`}
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 mt-0.5">
                    <Sparkles size={10} /> {currentPlan.toUpperCase()} (Unlimited Chat)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1 transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Chat Messages Frame */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3.5">
            {messages.map((msg, index) => {
              const isBot = msg.role === "model";
              return (
                <div key={index} className={`flex gap-2.5 items-start ${!isBot ? "flex-row-reverse" : ""}`}>
                  <div className={`p-1.5 rounded-lg shrink-0 border ${
                    isBot 
                      ? "bg-indigo-50 border-indigo-100 text-indigo-650" 
                      : "bg-blue-50 border-blue-100 text-blue-650"
                  }`}>
                    {isBot ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isBot 
                      ? "bg-white text-slate-700 shadow-sm border border-slate-150 rounded-tl-none" 
                      : "bg-blue-600 text-white shadow-sm rounded-tr-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {/* Typing Loader */}
            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-lg shrink-0 border bg-indigo-50 border-indigo-100 text-indigo-650">
                  <Bot size={14} />
                </div>
                <div className="bg-white text-slate-500 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm border border-slate-150 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Analyzing query...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gated Overlay for Quota Exhaustion */}
          {isFree && remaining === 0 && (
            <div className="absolute inset-x-0 bottom-0 top-[60px] bg-slate-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-150 flex flex-col items-center max-w-[85%]">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3 border border-rose-100 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Daily Chat Limit Reached</h4>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  You have used all 5 complimentary messages for today. Upgrade to Pro/Business for unlimited conversations.
                </p>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition cursor-pointer shadow-sm shadow-blue-500/10"
                >
                  Upgrade to Unlimited
                </button>
              </div>
            </div>
          )}

          {/* Chat Input Footer Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200/80 flex gap-2 shrink-0">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about properties in Faisalabad..."
              className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 bg-slate-50"
              disabled={isFree && remaining === 0}
            />
            <button
              type="submit"
              disabled={!message.trim() || loading || (isFree && remaining === 0)}
              className={`p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer shrink-0 ${
                !message.trim() || loading || (isFree && remaining === 0)
                  ? "bg-slate-100 text-slate-350 cursor-not-allowed border border-slate-200"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md text-white shadow-blue-500/10"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbotAssistant;
