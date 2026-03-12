import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Leaf, Thermometer, CloudRain, Droplets, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { yieldFactors } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const YieldPredictor = () => {
  const [crop, setCrop] = useState("");
  const [nitrogen, setNitrogen] = useState([60]);
  const [phosphorus, setPhosphorus] = useState([40]);
  const [potassium, setPotassium] = useState([50]);
  const [temp, setTemp] = useState([28]);
  const [rainfall, setRainfall] = useState([200]);
  const [fertilizer, setFertilizer] = useState("");
  const [result, setResult] = useState<null | { yield: number; harvestPeriod: string; insights: string[] }>(null);
  const { t } = useLanguage();

  const handlePredict = () => {
    const baseYield = 2.5 + Math.random() * 3;
    const adjustedYield = (baseYield * (1 + nitrogen[0] / 200) * (1 + phosphorus[0] / 300)).toFixed(1);
    setResult({
      yield: parseFloat(adjustedYield),
      harvestPeriod: "90-120 days",
      insights: [
        `Optimal nitrogen level for ${crop || "your crop"} is 80-100 kg/ha`,
        "Consider split application of fertilizers for better absorption",
        "Current rainfall is adequate — reduce irrigation frequency",
        "Expected productivity is above district average",
      ],
    });
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
                {yieldFactors.crops.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm mb-2 block">{t.fertilizerUsed}</Label>
            <Select value={fertilizer} onValueChange={setFertilizer}>
              <SelectTrigger className="bg-background"><SelectValue placeholder={t.selectFertilizer} /></SelectTrigger>
              <SelectContent>
                {yieldFactors.fertilizers.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
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

        <Button onClick={handlePredict} className="w-full gradient-harvest text-harvest-foreground font-display font-bold h-12">
          <BarChart3 className="h-5 w-5 mr-2" />
          {t.predictYield}
        </Button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5 text-center">
            <p className="text-sm text-muted-foreground">{t.estimatedYield}</p>
            <p className="text-4xl font-bold font-display text-primary mt-1">{result.yield} {t.tonsPerAcre}</p>
            <p className="text-sm text-muted-foreground mt-2">{t.harvestPeriod}: {result.harvestPeriod}</p>
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
        </motion.div>
      )}
    </div>
  );
};

export default YieldPredictor;
