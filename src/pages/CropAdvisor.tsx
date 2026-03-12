import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Droplets, Thermometer, CloudRain, MapPin, Sprout, ChevronRight, Loader2, Zap, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIErrorCard, ResultCardSkeleton } from "@/components/ui/ai-loading";
import { Progress } from "@/components/ui/progress";
import { useWeather } from "@/hooks/useWeather";

interface CropRecommendation {
  name: string;
  yield: string;
  confidence: number;
  season: string;
  waterNeed: string;
  tips: string[];
}

const soilPresets = [
  { emoji: "🌾", key: "soilAlluvial" as const, nitrogen: 80, phosphorus: 60, potassium: 70, ph: 7.0 },
  { emoji: "🏜️", key: "soilSandy" as const, nitrogen: 30, phosphorus: 20, potassium: 25, ph: 6.0 },
  { emoji: "🧱", key: "soilClay" as const, nitrogen: 60, phosphorus: 50, potassium: 55, ph: 7.5 },
  { emoji: "🌿", key: "soilLoamy" as const, nitrogen: 70, phosphorus: 55, potassium: 60, ph: 6.8 },
  { emoji: "⬛", key: "soilBlack" as const, nitrogen: 50, phosphorus: 40, potassium: 80, ph: 8.0 },
  { emoji: "🔴", key: "soilRed" as const, nitrogen: 35, phosphorus: 30, potassium: 35, ph: 5.5 },
];

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
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [weatherPrefilled, setWeatherPrefilled] = useState(false);
  const { t } = useLanguage();
  const { data: weatherData, isLoading: weatherLoading } = useWeather();

  // Auto-fill temperature and rainfall from live weather
  useEffect(() => {
    if (weatherData && !weatherPrefilled) {
      setTemp([Math.round(weatherData.current.temp)]);
      // Use rain chance as approximate monthly rainfall indicator (scaled)
      const estimatedRainfall = Math.round(weatherData.current.rainChance * 5);
      setRainfall([Math.min(500, Math.max(0, estimatedRainfall))]);
      setWeatherPrefilled(true);
    }
  }, [weatherData, weatherPrefilled]);

  const applyPreset = (preset: typeof soilPresets[0]) => {
    setActivePreset(preset.key);
    setNitrogen([preset.nitrogen]);
    setPhosphorus([preset.phosphorus]);
    setPotassium([preset.potassium]);
    setPh([preset.ph]);
  };

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

  const waterNeedEmoji = (level: string) => {
    const l = level.toLowerCase();
    return l === "high" ? "💧💧💧" : l === "medium" ? "💧💧" : "💧";
  };

  const rankEmoji = ["🥇", "🥈", "🥉"];

  const medalColors = [
    "from-primary to-leaf",
    "from-secondary to-harvest",
    "from-earth to-accent",
  ];

  return (
    <div className="container py-4 pb-28 space-y-4 max-w-2xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-hero p-5 relative overflow-hidden"
      >
        <div className="absolute -right-4 -bottom-4 text-6xl opacity-15 select-none">🌱</div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-xl">
            🌾
          </div>
          <div>
            <h1 className="text-lg font-extrabold font-display text-primary-foreground">
              {t.cropAdvisor}
            </h1>
            <p className="text-xs text-primary-foreground/75">{t.enterSoilData}</p>
          </div>
        </div>
      </motion.div>

      {/* Step 1: Quick Soil Type Selection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <p className="text-xs font-bold font-display text-foreground mb-2 flex items-center gap-1.5">
          <span className="h-5 w-5 rounded-full gradient-hero text-primary-foreground flex items-center justify-center text-[10px] font-extrabold">1</span>
          {t.selectSoilType}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {soilPresets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${
                activePreset === preset.key
                  ? "border-primary bg-primary/10 shadow-card"
                  : "border-border bg-card/80 hover:border-primary/40"
              }`}
            >
              <span className="text-2xl block mb-1">{preset.emoji}</span>
              <span className="text-[11px] font-bold font-display text-foreground block">{t[preset.key]}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Step 2: Fine-tune NPK */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-xs font-bold font-display text-foreground mb-2 flex items-center gap-1.5">
          <span className="h-5 w-5 rounded-full gradient-harvest text-harvest-foreground flex items-center justify-center text-[10px] font-extrabold">2</span>
          {t.soilNutrients}
        </p>
        <div className="glass-card p-4 space-y-4">
          {/* Nitrogen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-[10px] font-extrabold text-primary-foreground">N</span>
                <span className="text-xs font-medium text-foreground">{t.nitrogen}</span>
              </div>
              <span className="text-sm font-extrabold font-display text-primary tabular-nums">{nitrogen[0]} <span className="text-[9px] font-normal text-muted-foreground">kg/ha</span></span>
            </div>
            <Slider value={nitrogen} onValueChange={(v) => { setNitrogen(v); setActivePreset(null); }} min={0} max={140} step={1} />
          </div>

          {/* Phosphorus */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center text-[10px] font-extrabold text-secondary-foreground">P</span>
                <span className="text-xs font-medium text-foreground">{t.phosphorus}</span>
              </div>
              <span className="text-sm font-extrabold font-display text-secondary tabular-nums">{phosphorus[0]} <span className="text-[9px] font-normal text-muted-foreground">kg/ha</span></span>
            </div>
            <Slider value={phosphorus} onValueChange={(v) => { setPhosphorus(v); setActivePreset(null); }} min={0} max={140} step={1} />
          </div>

          {/* Potassium */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-accent flex items-center justify-center text-[10px] font-extrabold text-accent-foreground">K</span>
                <span className="text-xs font-medium text-foreground">{t.potassium}</span>
              </div>
              <span className="text-sm font-extrabold font-display text-accent tabular-nums">{potassium[0]} <span className="text-[9px] font-normal text-muted-foreground">kg/ha</span></span>
            </div>
            <Slider value={potassium} onValueChange={(v) => { setPotassium(v); setActivePreset(null); }} min={0} max={200} step={1} />
          </div>

          {/* pH */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-sky" />
                <span className="text-xs font-medium text-foreground">{t.soilPh}</span>
              </div>
              <span className="text-sm font-extrabold font-display text-sky tabular-nums">{ph[0]}</span>
            </div>
            <Slider value={ph} onValueChange={(v) => { setPh(v); setActivePreset(null); }} min={3} max={10} step={0.1} />
            <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
              <span>🟡 {t.acidic}</span>
              <span>🟢 {t.neutral}</span>
              <span>🔵 {t.alkaline}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step 3: Weather & Location */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold font-display text-foreground flex items-center gap-1.5">
            <span className="h-5 w-5 rounded-full gradient-sky text-sky-foreground flex items-center justify-center text-[10px] font-extrabold">3</span>
            {t.weatherAndLocation}
          </p>
          {weatherPrefilled && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
              <LocateFixed className="h-3 w-3" /> {t.autoDetected}
            </span>
          )}
          {weatherLoading && !weatherPrefilled && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> {t.detectingLocation}
            </span>
          )}
        </div>
        <div className="glass-card p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-accent" />
                  <span className="text-xs font-medium text-foreground">{t.temperature}</span>
                </div>
                <span className="text-sm font-extrabold font-display text-foreground tabular-nums">{temp[0]}°C</span>
              </div>
              <Slider value={temp} onValueChange={setTemp} min={5} max={50} step={1} />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>❄️ 5°</span>
                <span>🔥 50°</span>
              </div>
            </div>

            {/* Rainfall */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CloudRain className="h-4 w-4 text-sky" />
                  <span className="text-xs font-medium text-foreground">{t.rainfall}</span>
                </div>
                <span className="text-sm font-extrabold font-display text-foreground tabular-nums">{rainfall[0]}mm</span>
              </div>
              <Slider value={rainfall} onValueChange={setRainfall} min={0} max={500} step={10} />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>🏜️ Dry</span>
                <span>🌧️ Heavy</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPin className="h-4 w-4 text-earth" />
              <span className="text-xs font-medium text-foreground">{t.location}</span>
            </div>
            <Input
              placeholder={t.enterLocation}
              className="bg-background/60 h-11 text-sm rounded-xl"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Big CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="w-full gradient-hero text-primary-foreground font-display font-extrabold h-14 text-base rounded-2xl shadow-elevated active:scale-[0.97] transition-transform"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t.getCropRecommendations}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ResultCardSkeleton count={3} />
        </motion.div>
      )}

      {/* Error */}
      {error && <AIErrorCard message={error} onRetry={handleGetRecommendations} />}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 pt-2">
              <Sprout className="h-5 w-5 text-primary" />
              <h2 className="text-base font-extrabold font-display text-foreground">{t.topRecommendedCrops}</h2>
            </div>

            {results.map((crop, i) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <div className={`h-1.5 bg-gradient-to-r ${medalColors[i] || medalColors[2]}`} />
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rankEmoji[i] || "🌱"}</span>
                      <div>
                        <h3 className="font-display font-extrabold text-foreground text-base leading-tight">{crop.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                            📅 {crop.season}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                            {waterNeedEmoji(crop.waterNeed)} {crop.waterNeed}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xl font-extrabold font-display text-primary">{crop.confidence}%</span>
                      <p className="text-[10px] text-muted-foreground">{t.match}</p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <Progress value={crop.confidence} className="h-2.5 rounded-full" />

                  {/* Yield info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📊 {t.yield}: <strong className="text-foreground">{crop.yield}</strong></span>
                  </div>

                  {/* Tips */}
                  <div className="bg-muted/40 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      💡 {t.cultivationTips}
                    </p>
                    {crop.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
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
