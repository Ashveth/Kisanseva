import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { YieldSkeleton } from "@/components/ui/ai-loading";
import { AIErrorCard } from "@/components/ui/ai-loading";
import YieldInputForm from "@/components/yield/YieldInputForm";
import YieldResultsDashboard, { type YieldResult } from "@/components/yield/YieldResultsDashboard";

const YieldPredictor = () => {
  const [crop, setCrop] = useState("");
  const [nitrogen, setNitrogen] = useState([60]);
  const [phosphorus, setPhosphorus] = useState([40]);
  const [potassium, setPotassium] = useState([50]);
  const [ph, setPh] = useState([6.5]);
  const [temp, setTemp] = useState([28]);
  const [rainfall, setRainfall] = useState([200]);
  const [humidity, setHumidity] = useState([65]);
  const [area, setArea] = useState("5");
  const [areaUnit, setAreaUnit] = useState("acres");
  const [fertilizer, setFertilizer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<YieldResult | null>(null);
  const { t } = useLanguage();

  const handlePredict = async () => {
    if (!crop) { toast.error("Please select a crop"); return; }
    if (!area || parseFloat(area) <= 0) { toast.error("Please enter land area"); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("yield-predict", {
        body: {
          crop,
          nitrogen: nitrogen[0],
          phosphorus: phosphorus[0],
          potassium: potassium[0],
          ph: ph[0],
          temperature: temp[0],
          rainfall: rainfall[0],
          humidity: humidity[0],
          area: parseFloat(area),
          areaUnit,
          fertilizer: fertilizer || "None",
        },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      console.error("Yield predict error:", err);
      setError(err.message || "Failed to predict yield. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-secondary" />
          {t.yieldPredictor}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t.predictYieldDesc}</p>
      </div>

      <YieldInputForm
        crop={crop} setCrop={setCrop}
        nitrogen={nitrogen} setNitrogen={setNitrogen}
        phosphorus={phosphorus} setPhosphorus={setPhosphorus}
        potassium={potassium} setPotassium={setPotassium}
        ph={ph} setPh={setPh}
        temp={temp} setTemp={setTemp}
        rainfall={rainfall} setRainfall={setRainfall}
        humidity={humidity} setHumidity={setHumidity}
        area={area} setArea={setArea}
        areaUnit={areaUnit} setAreaUnit={setAreaUnit}
        fertilizer={fertilizer} setFertilizer={setFertilizer}
        loading={loading}
        onPredict={handlePredict}
      />

      {loading && <YieldSkeleton />}
      {error && <AIErrorCard message={error} onRetry={handlePredict} />}
      {result && <YieldResultsDashboard result={result} />}
    </div>
  );
};

export default YieldPredictor;
