import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark, Search, ChevronDown, ChevronUp, ExternalLink, IndianRupee,
  Users, CheckCircle, Tag, Globe, FileText, ClipboardList, Bookmark,
  BookmarkCheck, Sparkles, Loader2, MapPin, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { allSchemes, schemeCategories, schemeLevels, schemeStates, type Scheme } from "@/data/governmentSchemes";
import { AIErrorCard } from "@/components/ui/ai-loading";
import { Skeleton } from "@/components/ui/skeleton";

// ── Bookmark helpers ──
const BOOKMARKS_KEY = "farmwise-scheme-bookmarks";
const getBookmarks = (): string[] => {
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]"); } catch { return []; }
};
const toggleBookmark = (id: string): string[] => {
  const current = getBookmarks();
  const next = current.includes(id) ? current.filter(b => b !== id) : [...current, id];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return next;
};

// ── AI Eligibility Result ──
interface EligibilityResult {
  scheme: string;
  eligible: boolean;
  relevance: string;
  reason: string;
  estimatedBenefit: string;
}

const GovernmentSchemes = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [activeState, setActiveState] = useState<string>("All");
  const [bookmarks, setBookmarks] = useState<string[]>(getBookmarks());
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  // AI Eligibility
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [eligibilityResults, setEligibilityResults] = useState<EligibilityResult[] | null>(null);
  const [farmSize, setFarmSize] = useState("");
  const [state, setState] = useState("");
  const [crops, setCrops] = useState("");

  const handleBookmark = (id: string) => {
    const next = toggleBookmark(id);
    setBookmarks(next);
    toast.success(next.includes(id) ? "Scheme saved!" : "Scheme removed");
  };

  const filtered = allSchemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      (s.hindiName && s.hindiName.includes(search)) ||
      (s.state && s.state.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    const matchesLevel = activeLevel === "All" || s.level === activeLevel;
    const matchesState = activeState === "All" || s.state === activeState || (activeState === "Central" && s.level === "Central");
    const matchesBookmark = !showBookmarked || bookmarks.includes(s.id);
    return matchesSearch && matchesCategory && matchesLevel && matchesState && matchesBookmark;
  });

  const checkEligibility = async () => {
    if (!farmSize && !state && !crops) {
      toast.error("Please fill at least one field");
      return;
    }
    setEligibilityLoading(true);
    setEligibilityError(null);
    setEligibilityResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("scheme-eligibility", {
        body: { farmSize, state, crops, landOwnership: "Owner", farmerType: "Small" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEligibilityResults(data.recommendations);
    } catch (err: any) {
      setEligibilityError(err.message || "Failed to check eligibility");
    } finally {
      setEligibilityLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            <Landmark className="h-7 w-7 text-primary" />
            Government Schemes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central & state schemes for Indian farmers
          </p>
        </div>
        <button
          onClick={() => setShowBookmarked(!showBookmarked)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            showBookmarked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <BookmarkCheck className="h-3.5 w-3.5" />
          Saved ({bookmarks.length})
        </button>
      </div>

      {/* AI Eligibility Checker */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setShowEligibility(!showEligibility)}
          className="w-full px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-foreground text-sm">AI Eligibility Checker</span>
            <Badge variant="secondary" className="text-[9px]">AI</Badge>
          </div>
          {showEligibility ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {showEligibility && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="px-4 pb-4 space-y-3">
                <p className="text-xs text-muted-foreground">Enter your farm details and AI will recommend schemes you're eligible for</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input placeholder="Farm size (e.g., 2 acres)" value={farmSize} onChange={e => setFarmSize(e.target.value)} className="h-9 text-sm" />
                  <Input placeholder="State (e.g., Maharashtra)" value={state} onChange={e => setState(e.target.value)} className="h-9 text-sm" />
                  <Input placeholder="Crops (e.g., Rice, Wheat)" value={crops} onChange={e => setCrops(e.target.value)} className="h-9 text-sm" />
                </div>
                <Button onClick={checkEligibility} disabled={eligibilityLoading} className="w-full gradient-hero text-primary-foreground font-display font-bold h-10">
                  {eligibilityLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Check My Eligibility
                </Button>

                {eligibilityLoading && (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
                  </div>
                )}

                {eligibilityError && <AIErrorCard message={eligibilityError} onRetry={checkEligibility} />}

                {eligibilityResults && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {eligibilityResults.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-lg p-3 border ${
                          r.eligible ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display font-bold text-foreground text-xs">{r.scheme}</p>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              r.relevance === "High" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              {r.relevance}
                            </span>
                            {r.eligible ? (
                              <CheckCircle className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <span className="text-[10px] text-muted-foreground">Not eligible</span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{r.reason}</p>
                        {r.estimatedBenefit && (
                          <p className="text-[11px] text-primary font-bold mt-1">💰 {r.estimatedBenefit}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search schemes, states..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card h-11" />
      </div>

      {/* Filters row */}
      <div className="space-y-2">
        {/* Level pills */}
        <div className="flex gap-2">
          {schemeLevels.map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-3 py-1 rounded-full text-xs font-display font-bold transition-colors ${
                activeLevel === level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {level === "All" ? "All" : level === "Central" ? "🇮🇳 Central" : "🏛️ State"}
            </button>
          ))}
        </div>
        {/* State filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          {schemeStates.map(st => (
            <button
              key={st}
              onClick={() => setActiveState(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-display font-bold whitespace-nowrap transition-colors ${
                activeState === st ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          {schemeCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-display font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground font-display font-bold">
        {filtered.length} scheme{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Schemes List */}
      <div className="space-y-3">
        {filtered.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            isExpanded={expanded === scheme.id}
            isBookmarked={bookmarks.includes(scheme.id)}
            activeTab={expanded === scheme.id ? activeTab : "details"}
            onToggle={() => { setExpanded(expanded === scheme.id ? null : scheme.id); setActiveTab("details"); }}
            onBookmark={() => handleBookmark(scheme.id)}
            onTabChange={setActiveTab}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Landmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-display">No schemes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Scheme Card Component ──
interface SchemeCardProps {
  scheme: Scheme;
  isExpanded: boolean;
  isBookmarked: boolean;
  activeTab: string;
  onToggle: () => void;
  onBookmark: () => void;
  onTabChange: (tab: string) => void;
}

const SchemeCard = ({ scheme, isExpanded, isBookmarked, activeTab, onToggle, onBookmark, onTabChange }: SchemeCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card overflow-hidden"
  >
    {/* Header */}
    <div className="flex items-center">
      <button onClick={onToggle} className="flex-1 p-4 flex items-center justify-between text-left min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{scheme.icon}</span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-foreground text-sm leading-tight truncate">{scheme.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{scheme.category}</Badge>
              <Badge variant={scheme.level === "Central" ? "default" : "outline"} className="text-[9px] px-1.5 py-0">
                {scheme.level === "Central" ? "🇮🇳" : "🏛️"} {scheme.state || scheme.level}
              </Badge>
              {scheme.keyAmount && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{scheme.keyAmount}</span>
              )}
            </div>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      <button onClick={onBookmark} className="px-3 py-2 flex-shrink-0">
        {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5 text-muted-foreground" />}
      </button>
    </div>

    {/* Expanded */}
    <AnimatePresence>
      {isExpanded && (
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">{scheme.description}</p>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="w-full h-9">
                <TabsTrigger value="details" className="flex-1 text-xs gap-1"><Users className="h-3 w-3" /> Details</TabsTrigger>
                <TabsTrigger value="apply" className="flex-1 text-xs gap-1"><ClipboardList className="h-3 w-3" /> How to Apply</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1 text-xs gap-1"><FileText className="h-3 w-3" /> Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 mt-3">
                {/* Eligibility */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Who Can Apply</p>
                  <div className="space-y-1">
                    {scheme.eligibility.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Benefits */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Key Benefits</p>
                  <div className="space-y-1">
                    {scheme.benefits.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 bg-primary/5 rounded-lg px-2.5 py-1.5">
                        <Tag className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="apply" className="mt-3">
                <div className="space-y-2">
                  {scheme.howToApply.map((step) => (
                    <div key={step.step} className="flex gap-3">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{step.step}</span>
                      </div>
                      <div className="pt-0.5">
                        <p className="text-xs font-bold text-foreground">{step.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-3">
                <div className="space-y-1.5">
                  {scheme.documents.map((doc, j) => (
                    <div key={j} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
                      <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <p className="text-xs text-foreground">{doc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Website link */}
            {scheme.website && (
              <a
                href={scheme.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary font-display font-bold text-xs hover:bg-primary/20 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                Visit Official Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default GovernmentSchemes;
