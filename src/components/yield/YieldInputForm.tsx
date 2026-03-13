import { Leaf, Thermometer, CloudRain, Droplets, BarChart3, Loader2, FlaskConical, Ruler, Wind, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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

const SectionHeader = ({ icon: Icon, title, iconClass, isOpen }: { icon: any; title: string; iconClass: string; isOpen: boolean }) => (
  <div className="flex items-center justify-between w-full py-2">
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${iconClass}`} />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
  </div>
);

const SliderField = ({ icon: Icon, iconClass, label, value, onChange, min, max, step, unit }: {
  icon: any; iconClass: string; label: string; value: number[]; onChange: (v: number[]) => void;
  min: number; max: number; step?: number; unit: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
        <Icon className={`h-3 w-3 ${iconClass}`} /> {label}
      </Label>
      <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded-md">{step && step < 1 ? value[0].toFixed(1) : value[0]} {unit}</span>
    </div>
    <Slider value={value} onValueChange={onChange} min={min} max={max} step={step} />
  </div>
);

const YieldInputForm = ({
  crop, setCrop, nitrogen, setNitrogen, phosphorus, setPhosphorus,
  potassium, setPotassium, ph, setPh, temp, setTemp, rainfall, setRainfall,
  humidity, setHumidity, area, setArea, areaUnit, setAreaUnit,
  fertilizer, setFertilizer, loading, onPredict
}: YieldInputFormProps) => {
  const { t } = useLanguage();
  const [soilOpen, setSoilOpen] = useState(true);
  const [climateOpen, setClimateOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Step 1: Basic Info */}
      <div className="glass-card p-4 space-y-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step 1 — Basic Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">{t.cropType}</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="bg-background h-9 text-sm"><SelectValue placeholder={t.selectCrop} /></SelectTrigger>
              <SelectContent>
                {crops.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">{t.fertilizerUsed}</Label>
            <Select value={fertilizer} onValueChange={setFertilizer}>
              <SelectTrigger className="bg-background h-9 text-sm"><SelectValue placeholder={t.selectFertilizer} /></SelectTrigger>
              <SelectContent>
                {fertilizers.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3">
            <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Ruler className="h-3 w-3 text-primary" /> Land Area
            </Label>
            <Input
              type="number" value={area} onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. 5" min="0.1" step="0.1" className="bg-background h-9 text-sm"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground mb-1.5 block">Unit</Label>
            <Select value={areaUnit} onValueChange={setAreaUnit}>
              <SelectTrigger className="bg-background h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="acres">Acres</SelectItem>
                <SelectItem value="hectares">Hectares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Step 2: Soil Nutrients (collapsible) */}
      <Collapsible open={soilOpen} onOpenChange={setSoilOpen}>
        <div className="glass-card overflow-hidden">
          <CollapsibleTrigger className="w-full px-4 pt-3 pb-1 cursor-pointer hover:bg-muted/30 transition-colors">
            <SectionHeader icon={Leaf} title="Step 2 — Soil Nutrients" iconClass="text-primary" isOpen={soilOpen} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-2 space-y-4">
              <SliderField icon={Leaf} iconClass="text-primary" label={t.nitrogen} value={nitrogen} onChange={setNitrogen} min={0} max={140} unit="kg/ha" />
              <SliderField icon={Droplets} iconClass="text-secondary" label={t.phosphorus} value={phosphorus} onChange={setPhosphorus} min={0} max={140} unit="kg/ha" />
              <SliderField icon={Leaf} iconClass="text-accent" label={t.potassium} value={potassium} onChange={setPotassium} min={0} max={200} unit="kg/ha" />
              <SliderField icon={FlaskConical} iconClass="text-harvest" label="Soil pH" value={ph} onChange={setPh} min={3} max={10} step={0.1} unit="" />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Step 3: Climate (collapsible) */}
      <Collapsible open={climateOpen} onOpenChange={setClimateOpen}>
        <div className="glass-card overflow-hidden">
          <CollapsibleTrigger className="w-full px-4 pt-3 pb-1 cursor-pointer hover:bg-muted/30 transition-colors">
            <SectionHeader icon={Thermometer} title="Step 3 — Climate" iconClass="text-accent" isOpen={climateOpen} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-2 space-y-4">
              <SliderField icon={Thermometer} iconClass="text-accent" label={t.temperature} value={temp} onChange={setTemp} min={5} max={50} unit="°C" />
              <SliderField icon={CloudRain} iconClass="text-sky" label={t.rainfall} value={rainfall} onChange={setRainfall} min={0} max={500} step={10} unit="mm" />
              <SliderField icon={Wind} iconClass="text-muted-foreground" label="Humidity" value={humidity} onChange={setHumidity} min={10} max={100} unit="%" />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      <Button onClick={onPredict} disabled={loading} className="w-full gradient-harvest text-harvest-foreground font-display font-bold h-11 rounded-xl">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
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
