import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Droplets, Thermometer, CloudRain, MapPin, Sprout, ChevronRight, Loader2, FlaskConical, Gauge, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIErrorCard, ResultCardSkeleton } from "@/components/ui/ai-loading";
import { Progress } from "@/components/ui/progress";

interface CropRecommendation {
  name: string;
  yield: string;
  confidence: number;
  season: string;
  waterNeed: string;
  tips: string[];
}

const nutrientConfig = [
  { key: "nitrogen", icon: "N", color: "bg-primary", min: 0, max: 140, unit: "kg/ha" },
  { key: "phosphorus", icon: "P", color: "bg-secondary", min: 0, max: 140, unit: "kg/ha" },
  { key: "potassium", icon: "K", color: "bg-accent", min: 0, max: 200, unit: "kg/ha" },
] as const;

const CropAdvisor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [nitrogen, setNitrogen] = useState([50]);
  const [phosphorus, setPhosphorus] = useState([40]);
  const [potassium, setPotassium] = useState([45]);
  const [ph, setPh] = useState([6.5]);
  const [temp, setTemp] = useState([28]);
  const [rainfall, setRainfall] = useState([200]);
  const [location, setLocation] = useState("");
  const { t } = useLanguage();

  const nutrientValues = { nitrogen, phosphorus, potassium };
  const nutrientSetters = { nitrogen: setNitrogen, phosphorus: setPhosphorus, potassium: setPotassium };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("crop-advisor", {
        body: {
          nitrogen: nitrogen[0],
          phosphorus: phosphorus[0],
          potassium: potassium[0],
          ph: ph[0],
          temperature: temp[0],
          rainfall: rainfall[0],
          location: location || undefined,
        },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResults(data.crops || []);
    } catch (err: any) {
      console.error("Crop advisor error:", err);
      setError(err.message || "Failed to get crop recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const waterNeedIcon = (level: string) => {
    const l = level.toLowerCase();
    if (l === "high") return "💧💧💧";
    if (l === "medium") return "💧💧";
    return "💧";
  };

  const medalColors = [
    "from-primary to-leaf text-primary-foreground",
    "from-secondary to-harvest text-secondary-foreground",
    "from-earth to-accent text-accent-foreground",
  ];

  return (
    <div className="container py-4 pb-24 space-y-5 max-w-2xl mx-auto">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl gradient-hero p-5 pb-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Sprout className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-extrabold font-display text-primary-foreground">
              {t.cropAdvisor}
            </h1>
          </div>
          <p className="text-sm text-primary-foreground/80 ml-10">{t.enterSoilData}</p>
        </div>
      </motion.div>

      {/* NPK Quick Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="h-4 w-4 text-primary" />
          <h2 className="font-display font-bold text-sm text-foreground">{t.soilNutrients}</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {nutrientConfig.map((n) => {
            const val = nutrientValues[n.key][0];
            const pct = ((val - n.min) / (n.max - n.min)) * 100;
            return (
              <div key={n.key} className="glass-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`h-7 w-7 rounded-lg ${n.color} flex items-center justify-center`}>
                    <span className="text-xs font-extrabold text-primary-foreground">{n.icon}</span>
                  </div>
                  <span className="text-lg font-extrabold font-display text-foreground">{val}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {t[n.key]} ({n.unit})
                </p>
                <Slider
                  value={nutrientValues[n.key]}
                  onValueChange={nutrientSetters[n.key]}
                  min={n.min}
                  max={n.max}
                  step={1}
                  className="mt-1"
                />
                <Progress value={pct} className="h-1" />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Environment Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="h-4 w-4 text-accent" />
          <h2 className="font-display font-bold text-sm text-foreground">Environment & Location</h2>
        </div>
        <div className="glass-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* pH */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className="h-3.5 w-3.5 text-sky" /> {t.soilPh}
                </Label>
                <span className="text-sm font-bold font-display text-foreground">{ph[0]}</span>
              </div>
              <Slider value={ph} onValueChange={setPh} min={3} max={10} step={0.1} />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>Acidic</span>
                <span>Neutral</span>
                <span>Alkaline</span>
              </div>
            </div>
            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
                  <Thermometer className="h-3.5 w-3.5 text-accent" /> {t.temperature}
                </Label>
                <span className="text-sm font-bold font-display text-foreground">{temp[0]}°C</span>
              </div>
              <Slider value={temp} onValueChange={setTemp} min={5} max={50} step={1} />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>5°C</span>
                <span>50°C</span>
              </div>
            </div>
            {/* Rainfall */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
                  <CloudRain className="h-3.5 w-3.5 text-sky" /> {t.rainfall}
                </Label>
                <span className="text-sm font-bold font-display text-foreground">{rainfall[0]}mm</span>
              </div>
              <Slider value={rainfall} onValueChange={setRainfall} min={0} max={500} step={10} />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>0mm</span>
                <span>500mm</span>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <Label className="text-xs flex items-center gap-1.5 mb-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-earth" /> {t.location}
            </Label>
            <Input
              placeholder={t.enterLocation}
              className="bg-background/60 border-border/60 h-9 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="w-full gradient-hero text-primary-foreground font-display font-extrabold h-12 text-base rounded-xl shadow-elevated active:scale-[0.98] transition-transform"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing soil data...
            </span>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-1" />
              {t.getCropRecommendations}
            </>
          )}
        </Button>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ResultCardSkeleton count={3} />
        </motion.div>
      )}

      {/* Error State */}
      {error && <AIErrorCard message={error} onRetry={handleGetRecommendations} />}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-extrabold font-display text-foreground">{t.topRecommendedCrops}</h2>
            </div>

            {results.map((crop, i) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="glass-card overflow-hidden"
              >
                {/* Card Header with rank gradient strip */}
                <div className={`h-1.5 bg-gradient-to-r ${medalColors[i] || medalColors[2]}`} />
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${medalColors[i] || medalColors[2]} flex items-center justify-center shadow-card`}>
                        <span className="text-sm font-extrabold">#{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-foreground text-base">{crop.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                            {crop.season}
                          </span>
                          <span className="text-[10px]">{waterNeedIcon(crop.waterNeed)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-lg font-extrabold font-display text-primary">{crop.confidence}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{t.match}</p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="space-y-1">
                    <Progress value={crop.confidence} className="h-2" />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{t.yield}: {crop.yield}</span>
                      <span>{t.waterNeed}: {crop.waterNeed}</span>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t.cultivationTips}</p>
                    {crop.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CropAdvisor;
