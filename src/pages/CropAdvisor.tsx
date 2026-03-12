import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Droplets, Thermometer, CloudRain, MapPin, Sprout, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cropRecommendations } from "@/data/mockData";

const CropAdvisor = () => {
  const [showResults, setShowResults] = useState(false);
  const [nitrogen, setNitrogen] = useState([50]);
  const [phosphorus, setPhosphorus] = useState([40]);
  const [potassium, setPotassium] = useState([45]);
  const [ph, setPh] = useState([6.5]);
  const [temp, setTemp] = useState([28]);
  const [rainfall, setRainfall] = useState([200]);

  const handleRecommend = () => {
    setShowResults(true);
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          Crop Advisor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your soil and weather data to get crop recommendations</p>
      </div>

      <div className="glass-card p-5 space-y-5">
        <h2 className="font-display font-bold text-foreground">Soil Nutrients</h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> Nitrogen (N): {nitrogen[0]} kg/ha
            </Label>
            <Slider value={nitrogen} onValueChange={setNitrogen} min={0} max={140} step={1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-secondary" /> Phosphorus (P): {phosphorus[0]} kg/ha
            </Label>
            <Slider value={phosphorus} onValueChange={setPhosphorus} min={0} max={140} step={1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-accent" /> Potassium (K): {potassium[0]} kg/ha
            </Label>
            <Slider value={potassium} onValueChange={setPotassium} min={0} max={200} step={1} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Droplets className="h-3.5 w-3.5 text-sky" /> Soil pH: {ph[0]}
            </Label>
            <Slider value={ph} onValueChange={setPh} min={3} max={10} step={0.1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Thermometer className="h-3.5 w-3.5 text-accent" /> Temperature: {temp[0]}°C
            </Label>
            <Slider value={temp} onValueChange={setTemp} min={5} max={50} step={1} />
          </div>
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <CloudRain className="h-3.5 w-3.5 text-sky" /> Rainfall: {rainfall[0]} mm
            </Label>
            <Slider value={rainfall} onValueChange={setRainfall} min={0} max={500} step={10} />
          </div>
        </div>

        <div>
          <Label className="text-sm flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5 text-earth" /> Location
          </Label>
          <Input placeholder="Enter your location..." className="bg-background" />
        </div>

        <Button onClick={handleRecommend} className="w-full gradient-hero text-primary-foreground font-display font-bold h-12 text-base">
          <Sprout className="h-5 w-5 mr-2" />
          Get Crop Recommendations
        </Button>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold font-display text-foreground">🌾 Top Recommended Crops</h2>
            {cropRecommendations.map((crop, i) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold font-display ${
                      i === 0 ? "gradient-hero text-primary-foreground" : i === 1 ? "gradient-harvest text-harvest-foreground" : "gradient-earth text-earth-foreground"
                    }`}>
                      #{i + 1}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{crop.name}</h3>
                      <p className="text-xs text-muted-foreground">{crop.season} · Water: {crop.waterNeed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{crop.confidence}% match</p>
                    <p className="text-xs text-muted-foreground">Yield: {crop.yield}</p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Cultivation Tips:</p>
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
