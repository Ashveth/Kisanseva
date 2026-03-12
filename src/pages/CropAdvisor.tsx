import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Droplets, Thermometer, CloudRain, MapPin, Sprout, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface CropRecommendation {
  name: string;
  yield: string;
  confidence: number;
  season: string;
  waterNeed: string;
  tips: string[];
}

const CropAdvisor = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [nitrogen, setNitrogen] = useState([50]);
  const [phosphorus, setPhosphorus] = useState([40]);
  const [potassium, setPotassium] = useState([45]);
  const [ph, setPh] = useState([6.5]);
  const [temp, setTemp] = useState([28]);
  const [rainfall, setRainfall] = useState([200]);
  const [location, setLocation] = useState("");
  const { t } = useLanguage();

  const handleGetRecommendations = async () => {
    setLoading(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke("crop-advisor", {
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
      if (error) throw error;
      setResults(data.crops || []);
    } catch (err: any) {
      console.error("Crop advisor error:", err);
      toast.error(err.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          {t.cropAdvisor}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t.enterSoilData}</p>
      </div>

      <div className="glass-card p-5 space-y-5">
        <h2 className="font-display font-bold text-foreground">{t.soilNutrients}</h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> {t.nitrogen}: {nitrogen[0]} kg/ha
            </Label>
            <Slider value={nitrogen} onValueChange={setNitrogen} min={0} max={140} step={1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-secondary" /> {t.phosphorus}: {phosphorus[0]} kg/ha
            </Label>
            <Slider value={phosphorus} onValueChange={setPhosphorus} min={0} max={140} step={1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-accent" /> {t.potassium}: {potassium[0]} kg/ha
            </Label>
            <Slider value={potassium} onValueChange={setPotassium} min={0} max={200} step={1} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Droplets className="h-3.5 w-3.5 text-sky" /> {t.soilPh}: {ph[0]}
            </Label>
            <Slider value={ph} onValueChange={setPh} min={3} max={10} step={0.1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Thermometer className="h-3.5 w-3.5 text-accent" /> {t.temperature}: {temp[0]}°C
            </Label>
            <Slider value={temp} onValueChange={setTemp} min={5} max={50} step={1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <CloudRain className="h-3.5 w-3.5 text-sky" /> {t.rainfall}: {rainfall[0]} mm
            </Label>
            <Slider value={rainfall} onValueChange={setRainfall} min={0} max={500} step={10} />
          </div>
        </div>

        <div>
          <Label className="text-sm flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5 text-earth" /> {t.location}
          </Label>
          <Input placeholder={t.enterLocation} className="bg-background" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <Button onClick={handleGetRecommendations} disabled={loading} className="w-full gradient-hero text-primary-foreground font-display font-bold h-12 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing soil data...
            </span>
          ) : (
            <>
              <Sprout className="h-5 w-5 mr-2" />
              {t.getCropRecommendations}
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-lg font-bold font-display text-foreground">{t.topRecommendedCrops}</h2>
            {results.map((crop, i) => (
              <motion.div key={crop.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold font-display ${
                      i === 0 ? "gradient-hero text-primary-foreground" : i === 1 ? "gradient-harvest text-harvest-foreground" : "gradient-earth text-earth-foreground"
                    }`}>
                      #{i + 1}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{crop.name}</h3>
                      <p className="text-xs text-muted-foreground">{crop.season} · {t.waterNeed}: {crop.waterNeed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{crop.confidence}% {t.match}</p>
                    <p className="text-xs text-muted-foreground">{t.yield}: {crop.yield}</p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">{t.cultivationTips}</p>
                  {crop.tips.map((tip, j) => (
                    <p key={j} className="text-xs text-foreground flex items-start gap-1.5 mb-1">
                      <ChevronRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      {tip}
                    </p>
                  ))}
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
