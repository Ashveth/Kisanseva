import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, ChevronDown, ChevronUp, Shield, Leaf, Bug, MessageCircle, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pests } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const { t } = useLanguage();

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.crops.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const askAI = async (query: string) => {
    if (!query.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    try {
      const { data, error } = await supabase.functions.invoke("farm-chat", {
        body: {
          messages: [
            { role: "user", content: `As a pest and disease expert, answer this: ${query}. Be specific with treatment dosages and prevention methods.` },
          ],
        },
      });
      
      if (error) throw error;
      
      // Handle streaming response
      if (data) {
        // If it's a non-streaming text response
        if (typeof data === "string") {
          setAiAnswer(data);
        }
      }
    } catch (err: any) {
      // Try reading as stream
      console.error("AI query error:", err);
      toast.error("Failed to get AI response");
    } finally {
      setAiLoading(false);
    }
  };

  // Use non-streaming fetch for knowledge base queries
  const askAIDirect = async (query: string) => {
    if (!query.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/farm-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `As a pest and disease expert for Indian agriculture, answer: ${query}. Include specific treatment dosages, organic alternatives, and prevention methods.` },
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
    } catch (err: any) {
      console.error("AI error:", err);
      toast.error("Failed to get AI response");
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
          <MessageCircle className="h-4 w-4 text-primary" /> Ask AI about any pest or disease
        </h2>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., How to treat rust in wheat?"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAIDirect(aiQuery)}
            className="bg-background"
          />
          <Button onClick={() => askAIDirect(aiQuery)} disabled={!aiQuery.trim() || aiLoading} className="gradient-hero text-primary-foreground px-4">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <AnimatePresence>
          {aiAnswer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-muted/50 rounded-lg p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{aiAnswer}</ReactMarkdown>
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
