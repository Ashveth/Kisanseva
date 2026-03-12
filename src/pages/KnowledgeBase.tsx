import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, ChevronDown, ChevronUp, Shield, Leaf, Bug, MessageCircle, Loader2, Send, AlertCircle, RefreshCw, Mic, MicOff, Copy, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pests } from "@/data/mockData";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

const TypingDots = () => (
  <div className="flex items-center gap-1.5 py-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="h-2 w-2 rounded-full bg-primary/60"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const answerRef = useRef<HTMLDivElement>(null);

  const handleVoiceResult = useCallback((transcript: string) => {
    setAiQuery((prev) => (prev ? prev + " " + transcript : transcript));
  }, []);

  const { isListening, isSupported: voiceSupported, toggleListening } = useSpeechRecognition({
    lang: "en-IN",
    onResult: handleVoiceResult,
  });

  // Auto-scroll as content streams in
  useEffect(() => {
    if (aiAnswer && answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [aiAnswer]);

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.crops.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiAnswer);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const askAIDirect = async (query?: string) => {
    const q = query || lastQuery;
    if (!q.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    setAiError(null);
    setLastQuery(q);
    setCopied(false);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/farm-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `As a pest and disease expert for Indian agriculture, answer: ${q}. Include specific treatment dosages, organic alternatives, and prevention methods.` },
          ],
        }),
      });

      if (!resp.ok) throw new Error("Failed to get response");
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setAiAnswer(fullText);
            }
          } catch { /* skip */ }
        }
      }

      if (!fullText) throw new Error("No response received");
    } catch (err: any) {
      console.error("AI error:", err);
      setAiError(err.message || "Failed to get AI response. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          {t.pestTreatmentGuide}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t.searchPestsGuide}</p>
      </div>

      {/* AI Ask Section */}
      <div className="glass-card p-4 space-y-3">
        <h2 className="font-display font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Ask AI about any pest or disease
        </h2>
        <div className="flex gap-2">
          <Input
            placeholder={isListening ? "🎤 Listening..." : "e.g., How to treat rust in wheat?"}
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAIDirect(aiQuery)}
            className="bg-background"
          />
          {voiceSupported && (
            <Button onClick={toggleListening} variant={isListening ? "destructive" : "outline"}
              className={`px-3 flex-shrink-0 ${isListening ? "animate-pulse" : ""}`}>
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button onClick={() => askAIDirect(aiQuery)} disabled={!aiQuery.trim() || aiLoading} className="gradient-hero text-primary-foreground px-4">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        {/* AI Loading skeleton with typing dots */}
        {aiLoading && !aiAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-full gradient-hero flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-display font-bold text-foreground">KisanSeva AI</span>
              <span className="text-xs text-muted-foreground">is thinking...</span>
            </div>
            <TypingDots />
            <div className="space-y-2 mt-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </motion.div>
        )}

        {/* AI Error */}
        {aiError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/5 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{aiError}</p>
            </div>
            <Button onClick={() => askAIDirect()} size="sm" variant="outline" className="flex-shrink-0">
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </motion.div>
        )}

        {/* AI Answer — ChatGPT-style */}
        <AnimatePresence>
          {aiAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full gradient-hero flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-display font-bold text-foreground">KisanSeva AI</span>
                  {aiLoading && (
                    <span className="text-xs text-muted-foreground animate-pulse">generating...</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>

              {/* Content */}
              <div
                ref={answerRef}
                className="px-5 pb-5 max-h-[60vh] overflow-y-auto scroll-smooth"
              >
                <div className="ai-response-content prose prose-sm max-w-none dark:prose-invert
                  prose-headings:font-display prose-headings:text-foreground prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mb-3
                  prose-h1:text-xl prose-h1:mt-4 prose-h1:font-bold
                  prose-h2:text-lg prose-h2:mt-5 prose-h2:font-bold
                  prose-h3:text-base prose-h3:mt-4 prose-h3:font-semibold prose-h3:border-b-0
                  prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2
                  prose-li:text-foreground prose-li:my-0.5
                  prose-strong:text-primary prose-strong:font-bold
                  prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden
                  prose-th:bg-muted prose-th:text-foreground prose-th:font-display prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:px-3 prose-th:py-2
                  prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border-t prose-td:border-border
                  prose-hr:border-border prose-hr:my-4
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:text-foreground
                  prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border
                  prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
                  prose-img:rounded-lg
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiAnswer}</ReactMarkdown>
                </div>
                {aiLoading && (
                  <span className="inline-block w-2 h-5 bg-primary/70 rounded-sm animate-pulse ml-0.5 align-text-bottom" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search static guide */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t.searchPestsCrops} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card h-11" />
      </div>

      <p className="text-xs text-muted-foreground font-display font-bold">Quick Reference Guide</p>

      <div className="space-y-3">
        {filtered.map((pest, i) => (
          <motion.div key={pest.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pest.image}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground">{pest.name}</h3>
                  <p className="text-xs text-muted-foreground">{pest.crops.join(", ")}</p>
                </div>
              </div>
              {expanded === i ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs font-display font-bold text-muted-foreground mb-1 flex items-center gap-1">
                        <Bug className="h-3 w-3" /> {t.symptoms}
                      </p>
                      {pest.symptoms.map((s, j) => (
                        <p key={j} className="text-sm text-foreground ml-4">• {s}</p>
                      ))}
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-xs font-display font-bold text-primary mb-1">💊 {t.chemicalTreatment}</p>
                      <p className="text-sm text-foreground">{pest.treatment}</p>
                    </div>
                    <div className="bg-leaf/10 rounded-lg p-3">
                      <p className="text-xs font-display font-bold text-leaf mb-1">🌿 {t.organicAlternative}</p>
                      <p className="text-sm text-foreground">{pest.organic}</p>
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-muted-foreground mb-1 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> {t.prevention}
                      </p>
                      {pest.prevention.map((p, j) => (
                        <p key={j} className="text-sm text-foreground flex items-start gap-2 mb-1">
                          <Leaf className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
