import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Mic, MicOff, Copy, Check, Trash2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/farm-chat`;

const TypingIndicator = () => (
  <div className="flex gap-2.5">
    <div className="h-8 w-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
      <Sparkles className="h-4 w-4 text-primary-foreground" />
    </div>
    <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-primary/50"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </div>
    </div>
  </div>
);

const MessageBubble = ({ msg, onCopy }: { msg: Message; onCopy: (text: string) => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2.5 justify-end"
      >
        <div className="max-w-[75%] gradient-hero text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm">
          <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5 group"
    >
      <div className="h-8 w-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="max-w-[88%] flex-1 min-w-0">
        <div className="bg-card border border-border text-foreground rounded-2xl rounded-bl-md px-4 py-3 text-sm">
          <div className="ai-response">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        </div>
        {/* Action bar */}
        <div className="flex items-center gap-1 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CACHE_KEY = "kisanseva-chat-history";

const AIChatPage = () => {
  const { t } = useLanguage();

  const loadCachedMessages = (): Message[] => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return [{ role: "assistant", content: t.chatWelcome }];
  };

  const [messages, setMessages] = useState<Message[]>(loadCachedMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInput((prev) => (prev ? prev + " " + transcript : transcript));
  }, []);

  const { isListening, isSupported: voiceSupported, toggleListening } = useSpeechRecognition({
    lang: "en-IN",
    onResult: handleVoiceResult,
  });

  const quickQuestions = [t.quickQ1, t.quickQ2, t.quickQ3, t.quickQ4, t.quickQ5];

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollDown(gap > 150);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: t.chatWelcome }]);
    toast.success("Chat cleared");
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setIsTyping(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const upsertAssistant = (nextChunk: string) => {
        assistantSoFar += nextChunk;
        const content = assistantSoFar;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      toast.error(err.message || "Failed to get response");
      if (!assistantSoFar) {
        setMessages((prev) => [...prev, { role: "assistant", content: t.chatError }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const hasConversation = messages.length > 1;

  return (
    <div className="container py-4 flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full gradient-hero flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-foreground">{t.aiFarmingAssistant}</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs text-muted-foreground">{t.poweredByAI}</p>
            </div>
          </div>
        </div>
        {hasConversation && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-destructive h-8 px-2">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-5 mb-3 pr-1 relative scroll-smooth">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onCopy={copyToClipboard} />
        ))}

        {isTyping && !messages[messages.length - 1]?.content && <TypingIndicator />}

        {/* Blinking cursor while streaming */}
        {isTyping && messages[messages.length - 1]?.role === "assistant" && (
          <div className="ml-[42px]">
            <span className="inline-block w-1.5 h-4 bg-primary/60 rounded-sm animate-pulse" />
          </div>
        )}

        {/* Empty state with suggestions */}
        {!hasConversation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center pt-8 text-center"
          >
            <div className="h-16 w-16 rounded-full gradient-hero flex items-center justify-center mb-4 opacity-80">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-base font-display font-bold text-foreground mb-1">How can I help you today?</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Ask me anything about crops, pests, weather, market prices, or farming best practices.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-card border border-border text-foreground hover:border-primary hover:text-primary px-3.5 py-2 rounded-xl transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll to bottom */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 h-8 w-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="bg-card border border-border rounded-2xl flex items-end gap-2 px-3 py-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "🎤 Listening..." : t.chatPlaceholder}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[36px] max-h-[120px] py-1.5 leading-relaxed"
        />
        {voiceSupported && (
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "ghost"}
            size="sm"
            className={`h-9 w-9 p-0 flex-shrink-0 rounded-xl ${isListening ? "animate-pulse" : "text-muted-foreground hover:text-foreground"}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          size="sm"
          className="h-9 w-9 p-0 rounded-xl gradient-hero text-primary-foreground flex-shrink-0 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatPage;
