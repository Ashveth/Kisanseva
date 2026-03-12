import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Bot, User, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "Which crop should I grow this season?",
  "How to treat leaf spots?",
  "Will it rain tomorrow?",
  "Best fertilizer for wheat?",
  "When to harvest rice?",
];

const mockResponses: Record<string, string> = {
  "crop": "Based on current weather conditions (28°C, moderate rainfall), **Rice** and **Maize** are excellent choices for this season. Rice thrives in warm, humid conditions while Maize is versatile. I recommend using the Crop Advisor tool for a detailed analysis based on your soil nutrients!",
  "leaf": "**Leaf spots** can be caused by fungal or bacterial infections. Here's what to do:\n\n1. **Remove affected leaves** immediately\n2. **Chemical:** Spray Mancozeb 75% WP @ 2.5g/litre\n3. **Organic:** Apply neem oil solution (5ml/litre)\n4. **Prevention:** Ensure proper plant spacing and avoid overhead watering\n\nFor accurate diagnosis, use the Disease Detection scanner!",
  "rain": "Based on current weather data:\n\n- **Today:** 40% chance of rain ⛅\n- **Tomorrow:** 70% chance 🌧️\n- **Wednesday:** 80% chance 🌧️\n\n**Advisory:** Complete any pesticide spraying today. Hold off on irrigation. Consider harvesting ripe crops before Wednesday.",
  "fertilizer": "For **wheat cultivation**, here's the recommended fertilizer schedule:\n\n1. **Basal dose:** DAP 50kg + MOP 40kg per acre at sowing\n2. **First top-dressing:** Urea 30kg at 21 days (CRI stage)\n3. **Second top-dressing:** Urea 30kg at tillering\n\nAlways test soil before application. Organic compost (2-3 tons/acre) improves soil health!",
  "harvest": "**Rice harvesting guidelines:**\n\n- Harvest when 80-85% of grains turn golden\n- Grain moisture should be 20-25%\n- Best time: early morning after dew dries\n- Cut 15-20cm above ground\n- Dry to 14% moisture for storage\n\nCurrent forecast shows rain on Wednesday — try to harvest before then!",
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("crop") || lower.includes("grow")) return mockResponses["crop"];
  if (lower.includes("leaf") || lower.includes("spot") || lower.includes("disease") || lower.includes("treat")) return mockResponses["leaf"];
  if (lower.includes("rain") || lower.includes("weather") || lower.includes("tomorrow")) return mockResponses["rain"];
  if (lower.includes("fertilizer") || lower.includes("nutrient")) return mockResponses["fertilizer"];
  if (lower.includes("harvest") || lower.includes("when")) return mockResponses["harvest"];
  return "I can help you with crop recommendations, disease treatment, weather forecasts, fertilizer advice, and harvesting tips. Try asking me something specific! 🌾";
};

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm your AI Farming Assistant. Ask me anything about crops, diseases, weather, or farming tips! 🌾" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="container py-6 flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center">
          <Sprout className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display text-foreground">AI Farming Assistant</h1>
          <p className="text-xs text-muted-foreground">Ask anything about farming</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.role === "user"
                ? "gradient-hero text-primary-foreground rounded-br-sm"
                : "glass-card text-foreground rounded-bl-sm"
            }`}>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="glass-card rounded-2xl rounded-bl-sm p-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick questions */}
        {messages.length === 1 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs text-muted-foreground font-display font-bold">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-muted text-foreground hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about crops, weather, diseases..."
          className="bg-card h-11"
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="h-11 w-11 p-0 gradient-hero text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatPage;
