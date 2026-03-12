import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, Calendar, ArrowUpRight, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { marketPrices } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const crops = ["rice", "wheat", "maize", "cotton"] as const;
const cropColors: Record<string, string> = {
  rice: "hsl(142 50% 28%)",
  wheat: "hsl(36 70% 55%)",
  maize: "hsl(22 60% 50%)",
  cotton: "hsl(200 70% 50%)",
};

const MarketPage = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("rice");
  const { t } = useLanguage();

  const latestPrice = marketPrices[marketPrices.length - 1][selectedCrop as keyof typeof marketPrices[0]] as number;
  const prevPrice = marketPrices[marketPrices.length - 2][selectedCrop as keyof typeof marketPrices[0]] as number;
  const change = ((latestPrice - prevPrice) / prevPrice * 100).toFixed(1);
  const isUp = latestPrice >= prevPrice;

  const maxMonth = marketPrices.reduce((max, p) => {
    const val = p[selectedCrop as keyof typeof p] as number;
    return val > (max.val || 0) ? { month: p.month, val } : max;
  }, { month: "", val: 0 });

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-secondary" />
        {t.marketIntelligence}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {crops.map((crop) => (
          <button key={crop} onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold capitalize whitespace-nowrap transition-colors ${
              selectedCrop === crop ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {crop}
          </button>
        ))}
      </div>

      <motion.div key={selectedCrop} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-muted-foreground capitalize">{selectedCrop} {t.pricePerQuintal}</p>
          <span className={`flex items-center gap-1 text-sm font-bold ${isUp ? "text-primary" : "text-destructive"}`}>
            {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isUp ? "+" : ""}{change}%
          </span>
        </div>
        <p className="text-3xl font-bold font-display text-foreground">₹{latestPrice}</p>
      </motion.div>

      <div className="glass-card p-4">
        <h2 className="font-display font-bold text-foreground mb-4">{t.priceTrend12Months}</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketPrices}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 85%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150 10% 40%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(150 10% 40%)" }} />
              <Tooltip contentStyle={{ background: "hsl(40 30% 98%)", border: "1px solid hsl(40 20% 85%)", borderRadius: "8px", fontFamily: "Nunito" }} />
              <Line type="monotone" dataKey={selectedCrop} stroke={cropColors[selectedCrop]} strokeWidth={3} dot={{ r: 4, fill: cropColors[selectedCrop] }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-4 space-y-3">
        <h2 className="font-display font-bold text-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-secondary" /> {t.marketInsights}
        </h2>
        <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">{t.bestTimeToSell}</p>
            <p className="text-xs text-muted-foreground">{maxMonth.month} — {t.peakPrice} ₹{maxMonth.val}/quintal</p>
          </div>
        </div>
        <div className="bg-secondary/10 rounded-lg p-3 flex items-start gap-3">
          <ArrowUpRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">{t.priceForecast}</p>
            <p className="text-xs text-muted-foreground">Prices expected to {isUp ? t.continueRising : t.stabilize} in coming weeks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
