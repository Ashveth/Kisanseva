import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Leaf, Thermometer, CloudRain, Droplets, ChevronRight, Loader2, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const crops = ["Rice", "Wheat", "Maize", "Cotton", "Soybean", "Groundnut", "Sugarcane"];
const fertilizers = ["Urea", "DAP", "MOP", "NPK Complex", "Organic Compost"];

interface YieldResult {
  yield: number;
  unit: string;
  harvestPeriod: string;
  confidence: number;
  rating: string;
  insights: string[];
  risks: string[];
  optimizations: string[];
}

const YieldPredictor = () => {
  const [crop, setCrop] = useState("");
  const [nitrogen, setNitrogen] = useState([60]);
  const [phosphorus, setPhosphorus] = useState([40]);
  const [potassium, setPotassium] = useState([50]);
  const [temp, setTemp] = useState([28]);
  const [rainfall, setRainfall] = useState([200]);
  const [fertilizer, setFertilizer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YieldResult | null>(null);
  const { t } = useLanguage();

  const handlePredict = async () => {
    if (!crop) { toast.error("Please select a crop"); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("yield-predict", {
        body: {
          crop,
          nitrogen: nitrogen[0],
          phosphorus: phosphorus[0],
          potassium: potassium[0],
          temperature: temp[0],
          rainfall: rainfall[0],
          fertilizer: fertilizer || "None",
        },
      });
      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      console.error("Yield predict error:", err);
      toast.error(err.message || "Failed to predict yield");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-secondary" />
        {t.yieldPredictor}
      </h1>
      <p className="text-sm text-muted-foreground">{t.predictYieldDesc}</p>

      <div className="glass-card p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm mb-2 block">{t.cropType}</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="bg-background"><SelectValue placeholder={t.selectCrop} /></SelectTrigger>
              <SelectContent>
                {crops.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm mb-2 block">{t.fertilizerUsed}</Label>
            <Select value={fertilizer} onValueChange={setFertilizer}>
              <SelectTrigger className="bg-background"><SelectValue placeholder={t.selectFertilizer} /></SelectTrigger>
              <SelectContent>
                {fertilizers.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Leaf className="h-3.5 w-3.5 text-primary" /> {t.nitrogen}: {nitrogen[0]} kg/ha
            </Label>
            <Slider value={nitrogen} onValueChange={setNitrogen} min={0} max={140} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Droplets className="h-3.5 w-3.5 text-secondary" /> {t.phosphorus}: {phosphorus[0]} kg/ha
            </Label>
            <Slider value={phosphorus} onValueChange={setPhosphorus} min={0} max={140} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Leaf className="h-3.5 w-3.5 text-accent" /> {t.potassium}: {potassium[0]} kg/ha
            </Label>
            <Slider value={potassium} onValueChange={setPotassium} min={0} max={200} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm flex items-center gap-1.5 mb-2">
                <Thermometer className="h-3.5 w-3.5 text-accent" /> {t.temperature}: {temp[0]}°C
              </Label>
              <Slider value={temp} onValueChange={setTemp} min={5} max={50} />
            </div>
            <div>
              <Label className="text-sm flex items-center gap-1.5 mb-2">
                <CloudRain className="h-3.5 w-3.5 text-sky" /> {t.rainfall}: {rainfall[0]}mm
              </Label>
              <Slider value={rainfall} onValueChange={setRainfall} min={0} max={500} step={10} />
            </div>
          </div>
        </div>

        <Button onClick={handlePredict} disabled={loading} className="w-full gradient-harvest text-harvest-foreground font-display font-bold h-12">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              AI is predicting yield...
            </span>
          ) : (
            <>
              <BarChart3 className="h-5 w-5 mr-2" />
              {t.predictYield}
            </>
          )}
        </Button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5 text-center">
            <p className="text-sm text-muted-foreground">{t.estimatedYield}</p>
            <p className="text-4xl font-bold font-display text-primary mt-1">{result.yield} {result.unit || t.tonsPerAcre}</p>
            <p className="text-sm text-muted-foreground mt-2">{t.harvestPeriod}: {result.harvestPeriod}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{result.rating} ({result.confidence}% confidence)</span>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3">{t.productivityInsights}</h3>
            {result.insights.map((insight, i) => (
              <p key={i} className="text-sm text-foreground flex items-start gap-2 mb-2">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {insight}
              </p>
            ))}
          </div>

          {result.risks?.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-harvest" /> Potential Risks
              </h3>
              {result.risks.map((risk, i) => (
                <p key={i} className="text-sm text-foreground flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-harvest mt-0.5 flex-shrink-0" />
                  {risk}
                </p>
              ))}
            </div>
          )}

          {result.optimizations?.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" /> Optimization Tips
              </h3>
              {result.optimizations.map((opt, i) => (
                <p key={i} className="text-sm text-foreground flex items-start gap-2 mb-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {opt}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default YieldPredictor;
