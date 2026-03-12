import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark, Search, ChevronRight, ExternalLink, IndianRupee,
  Users, CheckCircle, Tag, Globe, FileText, ClipboardList, Bookmark,
  BookmarkCheck, Sparkles, Loader2, MapPin, Filter, X, ArrowRight,
  Shield, Banknote, Droplets, Store, Sprout, Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Income Support": <Banknote className="h-3.5 w-3.5" />,
  "Crop Insurance": <Shield className="h-3.5 w-3.5" />,
  "Credit & Loans": <IndianRupee className="h-3.5 w-3.5" />,
  "Irrigation": <Droplets className="h-3.5 w-3.5" />,
  "Market Access": <Store className="h-3.5 w-3.5" />,
  "Organic Farming": <Sprout className="h-3.5 w-3.5" />,
  "Infrastructure": <Building2 className="h-3.5 w-3.5" />,
  "Soil & Fertilizer": <Sprout className="h-3.5 w-3.5" />,
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

  const activeFiltersCount = [activeCategory !== "All", activeLevel !== "All", activeState !== "All", showBookmarked].filter(Boolean).length;

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveLevel("All");
    setActiveState("All");
    setShowBookmarked(false);
    setSearch("");
  };

  const filtered = useMemo(() => allSchemes.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.hindiName && s.hindiName.includes(search)) ||
      (s.state && s.state.toLowerCase().includes(q));
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    const matchesLevel = activeLevel === "All" || s.level === activeLevel;
    const matchesState = activeState === "All" || s.state === activeState;
    const matchesBookmark = !showBookmarked || bookmarks.includes(s.id);
    return matchesSearch && matchesCategory && matchesLevel && matchesState && matchesBookmark;
  }), [search, activeCategory, activeLevel, activeState, showBookmarked, bookmarks]);

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
    <div className="min-h-screen pb-24">
      {/* ── Hero Header ── */}
      <div className="gradient-hero px-4 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold font-display text-primary-foreground flex items-center gap-2">
                <Landmark className="h-6 w-6" />
                Government Schemes
              </h1>
              <p className="text-primary-foreground/70 text-xs mt-1 font-display">
                {allSchemes.length} schemes • Central & State
              </p>
            </div>
            <button
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                showBookmarked
                  ? "bg-harvest text-harvest-foreground shadow-lg scale-105"
                  : "bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/25"
              }`}
            >
              {showBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {bookmarks.length}
            </button>
          </div>

          {/* Search inside hero */}
          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes by name, state, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card/95 backdrop-blur-sm border-0 shadow-elevated rounded-xl text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 -mt-3 space-y-4">
        {/* ── Compact Filters Bar ── */}
        <div className="glass-card p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-display font-bold text-foreground uppercase tracking-wider">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-accent text-accent-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-[10px] text-primary font-bold flex items-center gap-1">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Level pills */}
            <div className="flex rounded-lg overflow-hidden border border-border">
              {schemeLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-3 py-1.5 text-[11px] font-display font-bold transition-colors ${
                    activeLevel === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {level === "All" ? "All" : level === "Central" ? "🇮🇳 Central" : "🏛️ State"}
                </button>
              ))}
            </div>

            {/* State dropdown */}
            <Select value={activeState} onValueChange={setActiveState}>
              <SelectTrigger className="h-8 w-auto min-w-[140px] text-[11px] font-display font-bold border-border bg-card gap-1">
                <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                {schemeStates.map(st => (
                  <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {schemeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-display font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary/15 text-primary border border-primary/25 shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
                }`}
              >
                {cat !== "All" && categoryIcons[cat]}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── AI Eligibility Checker ── */}
        <motion.div className="rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-leaf/5">
          <button
            onClick={() => setShowEligibility(!showEligibility)}
            className="w-full px-4 py-3.5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl gradient-hero flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left">
                <span className="font-display font-extrabold text-foreground text-sm">AI Eligibility Checker</span>
                <p className="text-[10px] text-muted-foreground">Find schemes you qualify for</p>
              </div>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showEligibility ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
          </button>
          <AnimatePresence>
            {showEligibility && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3 border-t border-border/50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
                    <Input placeholder="Farm size (e.g., 2 acres)" value={farmSize} onChange={e => setFarmSize(e.target.value)} className="h-9 text-xs bg-card" />
                    <Input placeholder="State (e.g., Maharashtra)" value={state} onChange={e => setState(e.target.value)} className="h-9 text-xs bg-card" />
                    <Input placeholder="Crops (e.g., Rice, Wheat)" value={crops} onChange={e => setCrops(e.target.value)} className="h-9 text-xs bg-card" />
                  </div>
                  <Button onClick={checkEligibility} disabled={eligibilityLoading} size="sm" className="w-full gradient-hero text-primary-foreground font-display font-bold h-9 rounded-xl">
                    {eligibilityLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Check My Eligibility
                  </Button>

                  {eligibilityLoading && (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
                    </div>
                  )}
                  {eligibilityError && <AIErrorCard message={eligibilityError} onRetry={checkEligibility} />}
                  {eligibilityResults && (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {eligibilityResults.map((r, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={`rounded-xl p-3 border ${
                            r.eligible ? "border-primary/20 bg-primary/5" : "border-border bg-muted/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-display font-bold text-foreground text-xs flex-1">{r.scheme}</p>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                r.relevance === "High" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                              }`}>{r.relevance}</span>
                              {r.eligible && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{r.reason}</p>
                          {r.estimatedBenefit && (
                            <p className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> {r.estimatedBenefit}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-display font-bold">
            {filtered.length} scheme{filtered.length !== 1 ? "s" : ""} found
          </p>
          {showBookmarked && (
            <Badge variant="outline" className="text-[10px] gap-1 border-harvest/30 text-harvest">
              <BookmarkCheck className="h-3 w-3" /> Saved only
            </Badge>
          )}
        </div>

        {/* ── Schemes List ── */}
        <div className="space-y-3 pb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((scheme, idx) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                index={idx}
                isExpanded={expanded === scheme.id}
                isBookmarked={bookmarks.includes(scheme.id)}
                activeTab={expanded === scheme.id ? activeTab : "details"}
                onToggle={() => { setExpanded(expanded === scheme.id ? null : scheme.id); setActiveTab("details"); }}
                onBookmark={() => handleBookmark(scheme.id)}
                onTabChange={setActiveTab}
              />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Landmark className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground font-display font-bold text-sm">No schemes found</p>
              <p className="text-muted-foreground text-xs mt-1">Try adjusting your filters</p>
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={clearFilters}>
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Scheme Card Component ──
interface SchemeCardProps {
  scheme: Scheme;
  index: number;
  isExpanded: boolean;
  isBookmarked: boolean;
  activeTab: string;
  onToggle: () => void;
  onBookmark: () => void;
  onTabChange: (tab: string) => void;
}

const SchemeCard = ({ scheme, index, isExpanded, isBookmarked, activeTab, onToggle, onBookmark, onTabChange }: SchemeCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ delay: Math.min(index * 0.03, 0.3) }}
    className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
      isExpanded
        ? "bg-card border-primary/20 shadow-elevated"
        : "bg-card/80 border-border hover:border-primary/15 hover:shadow-card"
    }`}
  >
    {/* Card Header */}
    <div className="flex items-stretch">
      <button onClick={onToggle} className="flex-1 p-3.5 flex items-center gap-3 text-left min-w-0 group">
        {/* Icon bubble */}
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors ${
          isExpanded ? "bg-primary/10" : "bg-muted/60 group-hover:bg-primary/10"
        }`}>
          {scheme.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-foreground text-[13px] leading-tight line-clamp-2">
            {scheme.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
              scheme.level === "Central"
                ? "bg-sky/10 text-sky"
                : "bg-accent/10 text-accent"
            }`}>
              {scheme.level === "Central" ? "🇮🇳 Central" : `🏛️ ${scheme.state}`}
            </span>
            {scheme.keyAmount && (
              <span className="text-[10px] font-extrabold text-primary bg-primary/8 px-1.5 py-0.5 rounded-md">
                {scheme.keyAmount}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
      </button>
      <button
        onClick={onBookmark}
        className={`px-3 flex items-center border-l transition-colors ${
          isBookmarked ? "border-harvest/20 bg-harvest/5" : "border-transparent"
        }`}
      >
        {isBookmarked
          ? <BookmarkCheck className="h-5 w-5 text-harvest" />
          : <Bookmark className="h-5 w-5 text-muted-foreground/40 hover:text-muted-foreground" />
        }
      </button>
    </div>

    {/* Expanded Content */}
    <AnimatePresence>
      {isExpanded && (
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
          <div className="px-3.5 pb-4 space-y-3">
            {/* Category badge + description */}
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-[9px] px-2 py-0.5 flex-shrink-0 mt-0.5 gap-1">
                {categoryIcons[scheme.category]}
                {scheme.category}
              </Badge>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{scheme.description}</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="w-full h-8 p-0.5 bg-muted/50 rounded-xl">
                <TabsTrigger value="details" className="flex-1 text-[10px] gap-1 rounded-lg data-[state=active]:shadow-sm">
                  <Users className="h-3 w-3" /> Eligibility
                </TabsTrigger>
                <TabsTrigger value="apply" className="flex-1 text-[10px] gap-1 rounded-lg data-[state=active]:shadow-sm">
                  <ClipboardList className="h-3 w-3" /> Steps
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex-1 text-[10px] gap-1 rounded-lg data-[state=active]:shadow-sm">
                  <FileText className="h-3 w-3" /> Docs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 mt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Who Can Apply</p>
                  <div className="space-y-1.5">
                    {scheme.eligibility.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Benefits</p>
                  <div className="grid gap-1.5">
                    {scheme.benefits.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 bg-primary/5 rounded-xl px-3 py-2">
                        <Tag className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="apply" className="mt-3">
                <div className="space-y-0">
                  {scheme.howToApply.map((step, i) => (
                    <div key={step.step} className="flex gap-3 relative">
                      {/* Connector line */}
                      {i < scheme.howToApply.length - 1 && (
                        <div className="absolute left-[13px] top-8 bottom-0 w-[2px] bg-primary/10" />
                      )}
                      <div className="h-7 w-7 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                        <span className="text-[10px] font-bold text-primary-foreground">{step.step}</span>
                      </div>
                      <div className="pb-4 pt-0.5">
                        <p className="text-xs font-display font-bold text-foreground">{step.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-3">
                <div className="grid grid-cols-2 gap-1.5">
                  {scheme.documents.map((doc, j) => (
                    <div key={j} className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2.5 border border-border/50">
                      <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <p className="text-[11px] text-foreground leading-tight">{doc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Website CTA */}
            {scheme.website && (
              <a
                href={scheme.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
              >
                <Globe className="h-3.5 w-3.5" />
                Visit Official Website
                <ArrowRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default GovernmentSchemes;
