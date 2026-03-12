import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, Calendar, ArrowUpRight, Info, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const cropList = ["Rice", "Wheat", "Maize", "Cotton", "Soybean", "Groundnut", "Sugarcane", "Mustard"];

const cropColors: Record<string, string> = {
  Rice: "hsl(142 50% 28%)",
  Wheat: "hsl(36 70% 55%)",
  Maize: "hsl(22 60% 50%)",
  Cotton: "hsl(200 70% 50%)",
  Soybean: "hsl(80 50% 40%)",
  Groundnut: "hsl(30 60% 45%)",
  Sugarcane: "hsl(120 40% 35%)",
  Mustard: "hsl(50 70% 50%)",
};

interface MarketData {
  currentPrice: number;
  unit: string;
  msp: number;
  priceRange: { low: number; high: number };
  trend: string;
  changePercent: number;
  bestMonthToSell: string;
  bestMandi?: string;
  monthlyTrend: { month: string; price: number }[];
  insights: string[];
  forecast: string;
}

const MarketPage = () => {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketData | null>(null);
  const { t } = useLanguage();

  const fetchMarketData = async (crop: string) => {
    setSelectedCrop(crop);
    setLoading(true);
    setData(null);
    try {
      const { data: result, error } = await supabase.functions.invoke("market-intelligence", {
        body: { crop },
      });
      if (error) throw error;
      setData(result);
    } catch (err: any) {
      console.error("Market error:", err);
      toast.error(err.message || "Failed to fetch market data");
    } finally {
      setLoading(false);
    }
  };

  const isUp = data ? data.trend !== "falling" : true;

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-secondary" />
        {t.marketIntelligence}
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {cropList.map((crop) => (
          <button key={crop} onClick={() => fetchMarketData(crop)}
            className={`px-4 py-2 rounded-xl text-sm font-display font-bold whitespace-nowrap transition-colors ${
              selectedCrop === crop && data ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {crop}
          </button>
        ))}
      </div>

      {!data && !loading && (
        <div className="glass-card p-8 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-display font-bold text-foreground">Select a crop to get AI-powered market intelligence</p>
          <p className="text-sm text-muted-foreground mt-1">Get current prices, trends, and selling recommendations</p>
        </div>
      )}

      {loading && (
        <div className="glass-card p-8 flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Fetching market intelligence for {selectedCrop}...</p>
        </div>
      )}

      {data && (
        <motion.div key={selectedCrop} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-muted-foreground">{selectedCrop} {t.pricePerQuintal}</p>
              <span className={`flex items-center gap-1 text-sm font-bold ${isUp ? "text-primary" : "text-destructive"}`}>
                {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {isUp ? "+" : ""}{data.changePercent}%
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-foreground">{data.unit?.startsWith("₹") ? "" : "₹"}{data.currentPrice}</p>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>MSP: ₹{data.msp}</span>
              <span>Range: ₹{data.priceRange.low} - ₹{data.priceRange.high}</span>
            </div>
          </div>

          {data.monthlyTrend?.length > 0 && (
            <div className="glass-card p-4">
              <h2 className="font-display font-bold text-foreground mb-4">{t.priceTrend12Months}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 85%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(150 10% 40%)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(150 10% 40%)" }} />
                    <Tooltip contentStyle={{ background: "hsl(40 30% 98%)", border: "1px solid hsl(40 20% 85%)", borderRadius: "8px", fontFamily: "Nunito" }} />
                    <Line type="monotone" dataKey="price" stroke={cropColors[selectedCrop] || "hsl(142 50% 28%)"} strokeWidth={3} dot={{ r: 4, fill: cropColors[selectedCrop] || "hsl(142 50% 28%)" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="glass-card p-4 space-y-3">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-secondary" /> {t.marketInsights}
            </h2>
            <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">{t.bestTimeToSell}</p>
                <p className="text-xs text-muted-foreground">{data.bestMonthToSell}{data.bestMandi ? ` — ${data.bestMandi}` : ""}</p>
              </div>
            </div>
            <div className="bg-secondary/10 rounded-lg p-3 flex items-start gap-3">
              <ArrowUpRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">{t.priceForecast}</p>
                <p className="text-xs text-muted-foreground">{data.forecast}</p>
              </div>
            </div>
            {data.insights?.map((insight, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MarketPage;
