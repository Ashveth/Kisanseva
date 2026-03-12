import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, ChevronDown, ChevronUp, Shield, Leaf, Bug } from "lucide-react";
import { Input } from "@/components/ui/input";
import { pests } from "@/data/mockData";

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.crops.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          Pest & Treatment Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Search for common pests and treatment methods</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pests, crops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card h-11"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((pest, i) => (
          <motion.div
            key={pest.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pest.image}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground">{pest.name}</h3>
                  <p className="text-xs text-muted-foreground">{pest.crops.join(", ")}</p>
                </div>
              </div>
              {expanded === i ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs font-display font-bold text-muted-foreground mb-1 flex items-center gap-1">
                        <Bug className="h-3 w-3" /> Symptoms
                      </p>
                      {pest.symptoms.map((s, j) => (
                        <p key={j} className="text-sm text-foreground ml-4">• {s}</p>
                      ))}
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-xs font-display font-bold text-primary mb-1">💊 Chemical Treatment</p>
                      <p className="text-sm text-foreground">{pest.treatment}</p>
                    </div>
                    <div className="bg-leaf/10 rounded-lg p-3">
                      <p className="text-xs font-display font-bold text-leaf mb-1">🌿 Organic Treatment</p>
                      <p className="text-sm text-foreground">{pest.organic}</p>
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-muted-foreground mb-1 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Prevention
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
