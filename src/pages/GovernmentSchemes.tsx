import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Search, ChevronDown, ChevronUp, ExternalLink, IndianRupee, Users, CalendarCheck, CheckCircle, Tag, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Scheme {
  name: string;
  hindiName?: string;
  ministry: string;
  category: string;
  eligibility: string[];
  benefits: string[];
  description: string;
  website?: string;
  keyAmount?: string;
  icon: string;
}

const schemes: Scheme[] = [
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    hindiName: "प्रधानमंत्री किसान सम्मान निधि",
    ministry: "Ministry of Agriculture",
    category: "Income Support",
    keyAmount: "₹6,000/year",
    icon: "💰",
    description: "Direct income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments of ₹2,000 every four months.",
    eligibility: [
      "All landholding farmer families",
      "Must have cultivable landholding",
      "Aadhaar card mandatory",
      "Bank account linked with Aadhaar",
    ],
    benefits: [
      "₹6,000 per year in 3 installments of ₹2,000",
      "Direct bank transfer (DBT)",
      "No middlemen involved",
      "Covers all crops and seasons",
    ],
    website: "https://pmkisan.gov.in",
  },
  {
    name: "PM Fasal Bima Yojana (PMFBY)",
    hindiName: "प्रधानमंत्री फसल बीमा योजना",
    ministry: "Ministry of Agriculture",
    category: "Crop Insurance",
    keyAmount: "1.5-5% premium",
    icon: "🛡️",
    description: "Comprehensive crop insurance scheme providing financial support to farmers in case of crop loss due to natural calamities, pests, and diseases.",
    eligibility: [
      "All farmers including sharecroppers & tenant farmers",
      "Mandatory for loanee farmers",
      "Voluntary for non-loanee farmers",
      "Crops notified by state government",
    ],
    benefits: [
      "Premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops",
      "Full insured amount coverage",
      "Use of smart technology for faster claim settlement",
      "Covers pre-sowing to post-harvest losses",
    ],
    website: "https://pmfby.gov.in",
  },
  {
    name: "Kisan Credit Card (KCC)",
    hindiName: "किसान क्रेडिट कार्ड",
    ministry: "Ministry of Finance",
    category: "Credit & Loans",
    keyAmount: "Up to ₹3 lakh",
    icon: "💳",
    description: "Provides farmers with affordable short-term credit for cultivation, post-harvest expenses, and maintenance of farm assets at subsidized interest rates.",
    eligibility: [
      "All farmers – individual or joint borrowers",
      "Tenant farmers, sharecroppers, oral lessees",
      "Self-help groups or joint liability groups",
      "Fishermen and animal husbandry farmers also eligible",
    ],
    benefits: [
      "Credit limit up to ₹3 lakh at 4% interest (with subsidy)",
      "Flexible repayment options",
      "Coverage for crop cultivation, maintenance, and allied activities",
      "Personal accident insurance up to ₹50,000",
    ],
    website: "https://www.pmkisan.gov.in",
  },
  {
    name: "Soil Health Card Scheme",
    hindiName: "मृदा स्वास्थ्य कार्ड योजना",
    ministry: "Ministry of Agriculture",
    category: "Soil & Fertilizer",
    keyAmount: "Free service",
    icon: "🧪",
    description: "Provides soil health cards to farmers with crop-wise recommendations for nutrients and fertilizers to improve productivity and soil health.",
    eligibility: [
      "All farmers across India",
      "No minimum landholding required",
      "Available through local agriculture offices",
    ],
    benefits: [
      "Free soil testing every 2 years",
      "Crop-wise fertilizer recommendations",
      "Improves soil health & reduces input costs",
      "Helps increase crop productivity by 10-15%",
    ],
    website: "https://soilhealth.dac.gov.in",
  },
  {
    name: "PM Krishi Sinchai Yojana (PMKSY)",
    hindiName: "प्रधानमंत्री कृषि सिंचाई योजना",
    ministry: "Ministry of Agriculture & Jal Shakti",
    category: "Irrigation",
    keyAmount: "55-100% subsidy",
    icon: "💧",
    description: "Aims to extend irrigation coverage ('Har Khet Ko Pani') and improve water use efficiency through micro irrigation technologies like drip and sprinkler systems.",
    eligibility: [
      "All farmer categories",
      "Priority to drought-prone and water-scarce areas",
      "Small & marginal farmers get higher subsidy",
      "Available through state agriculture departments",
    ],
    benefits: [
      "55% subsidy for general farmers on micro irrigation",
      "100% subsidy for small & marginal farmers (some states)",
      "Drip irrigation, sprinkler systems coverage",
      "Watershed development and water harvesting support",
    ],
    website: "https://pmksy.gov.in",
  },
  {
    name: "e-NAM (National Agriculture Market)",
    hindiName: "राष्ट्रीय कृषि बाजार",
    ministry: "Ministry of Agriculture",
    category: "Market Access",
    keyAmount: "Free registration",
    icon: "🏪",
    description: "Online trading platform for agricultural commodities connecting APMC mandis across India, enabling farmers to get better prices through transparent bidding.",
    eligibility: [
      "All farmers with valid ID proof",
      "Traders, commission agents (FPOs)",
      "Available in e-NAM integrated mandis",
    ],
    benefits: [
      "Better price discovery through online bidding",
      "Reduced intermediaries and market fees",
      "Access to buyers across India",
      "Quality assaying at mandi level",
    ],
    website: "https://enam.gov.in",
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    hindiName: "परम्परागत कृषि विकास योजना",
    ministry: "Ministry of Agriculture",
    category: "Organic Farming",
    keyAmount: "₹50,000/ha",
    icon: "🌿",
    description: "Promotes organic farming through cluster approach. Farmers are supported for three years to adopt organic practices with financial assistance for inputs, certification, and marketing.",
    eligibility: [
      "Groups of 50+ farmers forming a cluster of 50 acres",
      "Farmers willing to adopt organic practices",
      "Available across all states",
    ],
    benefits: [
      "₹50,000 per hectare over 3 years",
      "Free organic certification (PGS)",
      "Training and capacity building",
      "Marketing and branding support",
    ],
    website: "https://pgsindia-ncof.gov.in",
  },
  {
    name: "Agriculture Infrastructure Fund (AIF)",
    hindiName: "कृषि अवसंरचना कोष",
    ministry: "Ministry of Agriculture",
    category: "Infrastructure",
    keyAmount: "3% interest subvention",
    icon: "🏗️",
    description: "Provides medium to long-term financing for investment in post-harvest management and community farming assets through interest subvention and credit guarantee.",
    eligibility: [
      "Farmers, FPOs, PACS, marketing cooperatives",
      "Startups, agri-entrepreneurs",
      "State agencies and APMCs",
      "Loan amount up to ₹2 crore",
    ],
    benefits: [
      "3% interest subvention on loans up to ₹2 crore",
      "Credit guarantee coverage up to ₹2 crore",
      "Moratorium period for loan repayment",
      "Covers warehouses, cold storage, processing units",
    ],
    website: "https://agriinfra.dac.gov.in",
  },
];

const categories = ["All", ...Array.from(new Set(schemes.map(s => s.category)))];

const GovernmentSchemes = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      (s.hindiName && s.hindiName.includes(search));
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Landmark className="h-7 w-7 text-primary" />
          Government Schemes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore central government schemes & subsidies for Indian farmers
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search schemes by name, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card h-11"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-display font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Count */}
      <p className="text-xs text-muted-foreground font-display font-bold">
        Showing {filtered.length} of {schemes.length} schemes
      </p>

      {/* Schemes List */}
      <div className="space-y-3">
        {filtered.map((scheme, i) => (
          <motion.div
            key={scheme.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card overflow-hidden"
          >
            {/* Collapsed Header */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-3xl flex-shrink-0">{scheme.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-foreground text-sm leading-tight">{scheme.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {scheme.category}
                    </Badge>
                    {scheme.keyAmount && (
                      <span className="text-[11px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {scheme.keyAmount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {expanded === i ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {/* Description */}
                    <div className="bg-muted/40 rounded-xl p-4">
                      <p className="text-sm text-foreground leading-relaxed">{scheme.description}</p>
                      {scheme.hindiName && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{scheme.hindiName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Landmark className="h-3 w-3" /> {scheme.ministry}
                      </p>
                    </div>

                    {/* Eligibility */}
                    <div className="glass-card overflow-hidden border border-border/50">
                      <div className="px-4 py-2.5 bg-muted/30 border-b border-border/50">
                        <h4 className="font-display font-bold text-foreground text-xs flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          Who Can Apply
                        </h4>
                      </div>
                      <div className="p-3 space-y-2">
                        {scheme.eligibility.map((item, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="glass-card overflow-hidden border border-border/50">
                      <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/10">
                        <h4 className="font-display font-bold text-foreground text-xs flex items-center gap-2">
                          <IndianRupee className="h-3.5 w-3.5 text-primary" />
                          Key Benefits
                        </h4>
                      </div>
                      <div className="p-3 space-y-2">
                        {scheme.benefits.map((item, j) => (
                          <div key={j} className="flex items-start gap-2.5 bg-primary/5 rounded-lg px-3 py-2">
                            <Tag className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Apply Link */}
                    {scheme.website && (
                      <a
                        href={scheme.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 text-primary font-display font-bold text-sm hover:bg-primary/20 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Visit Official Website
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Landmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-display">No schemes found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentSchemes;
