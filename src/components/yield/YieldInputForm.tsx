import { Leaf, Thermometer, CloudRain, Droplets, BarChart3, Loader2, FlaskConical, Ruler, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const crops = ["Rice", "Wheat", "Maize", "Cotton", "Soybean", "Groundnut", "Sugarcane", "Mustard", "Barley", "Millet"];
const fertilizers = ["Urea", "DAP", "MOP", "NPK Complex", "Organic Compost", "Vermicompost", "None"];

interface YieldInputFormProps {
  crop: string;
  setCrop: (v: string) => void;
  nitrogen: number[];
  setNitrogen: (v: number[]) => void;
  phosphorus: number[];
  setPhosphorus: (v: number[]) => void;
  potassium: number[];
  setPotassium: (v: number[]) => void;
  ph: number[];
  setPh: (v: number[]) => void;
  temp: number[];
  setTemp: (v: number[]) => void;
  rainfall: number[];
  setRainfall: (v: number[]) => void;
  humidity: number[];
  setHumidity: (v: number[]) => void;
  area: string;
  setArea: (v: string) => void;
  areaUnit: string;
  setAreaUnit: (v: string) => void;
  fertilizer: string;
  setFertilizer: (v: string) => void;
  loading: boolean;
  onPredict: () => void;
}

const YieldInputForm = ({
  crop, setCrop, nitrogen, setNitrogen, phosphorus, setPhosphorus,
  potassium, setPotassium, ph, setPh, temp, setTemp, rainfall, setRainfall,
  humidity, setHumidity, area, setArea, areaUnit, setAreaUnit,
  fertilizer, setFertilizer, loading, onPredict
}: YieldInputFormProps) => {
  const { t } = useLanguage();

  return (
    <div className="glass-card p-5 space-y-5">
      {/* Crop & Fertilizer */}
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

      {/* Area */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Label className="text-sm flex items-center gap-1.5 mb-2">
            <Ruler className="h-3.5 w-3.5 text-primary" /> Land Area
          </Label>
          <Input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter area"
            min="0.1"
            step="0.1"
            className="bg-background"
          />
        </div>
        <div>
          <Label className="text-sm mb-2 block">Unit</Label>
          <Select value={areaUnit} onValueChange={setAreaUnit}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="acres">Acres</SelectItem>
              <SelectItem value="hectares">Hectares</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Soil Nutrients */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Soil Nutrients</p>
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
        <div>
          <Label className="text-sm flex items-center gap-1.5 mb-2">
            <FlaskConical className="h-3.5 w-3.5 text-harvest" /> Soil pH: {ph[0].toFixed(1)}
          </Label>
          <Slider value={ph} onValueChange={setPh} min={3} max={10} step={0.1} />
        </div>
      </div>

      {/* Climate */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Climate Conditions</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <Label className="text-sm flex items-center gap-1.5 mb-2">
              <Wind className="h-3.5 w-3.5 text-muted-foreground" /> Humidity: {humidity[0]}%
            </Label>
            <Slider value={humidity} onValueChange={setHumidity} min={10} max={100} />
          </div>
        </div>
      </div>

      <Button onClick={onPredict} disabled={loading} className="w-full gradient-harvest text-harvest-foreground font-display font-bold h-12">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            AI is analyzing yield...
          </span>
        ) : (
          <>
            <BarChart3 className="h-5 w-5 mr-2" />
            {t.predictYield}
          </>
        )}
      </Button>
    </div>
  );
};

export default YieldInputForm;
