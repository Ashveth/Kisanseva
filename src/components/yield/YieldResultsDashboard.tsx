import { motion } from "framer-motion";
import { TrendingUp, ChevronRight, AlertTriangle, Leaf, ShieldAlert, Lightbulb, BarChart3, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

interface Insight {
  type: "positive" | "warning" | "info" | "critical";
  text: string;
}

interface NutrientStatus {
  status: string;
  score: number;
}

interface Recommendation {
  category: string;
  text: string;
}

interface Risk {
  level: "high" | "medium" | "low";
  text: string;
}

interface YieldFactor {
  factor: string;
  impact: number;
  maxImpact: number;
}

export interface YieldResult {
  yieldPerAcre: number;
  unit: string;
  totalYield: number;
  totalUnit: string;
  harvestPeriod: string;
  confidence: number;
  rating: string;
  regionalAvgYield: number;
  regionalAvgUnit: string;
  insights: Insight[];
  nutrientAnalysis: Record<string, NutrientStatus>;
  recommendations: Recommendation[];
  risks: Risk[];
  yieldFactors: YieldFactor[];
  finalAdvice: string;
}

const insightIconColor: Record<string, string> = {
  positive: "text-primary",
  warning: "text-harvest",
  info: "text-sky",
  critical: "text-destructive",
};

const riskColors: Record<string, string> = {
  high: "text-destructive",
  medium: "text-harvest",
  low: "text-muted-foreground",
};

const riskBg: Record<string, string> = {
  high: "bg-destructive/10",
  medium: "bg-harvest/10",
  low: "bg-muted/50",
};

const statusColors: Record<string, string> = {
  deficient: "bg-destructive",
  low: "bg-harvest",
  adequate: "bg-sky",
  optimal: "bg-primary",
  excessive: "bg-destructive",
};

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} >
    {children}
  </motion.div>
);

const YieldResultsDashboard = ({ result }: { result: YieldResult }) => {
  const { t } = useLanguage();

  const comparisonData = [
    { name: "Your Yield", value: result.yieldPerAcre, fill: "hsl(var(--primary))" },
    { name: "Regional Avg", value: result.regionalAvgYield, fill: "hsl(var(--muted-foreground))" },
  ];

  const yieldDiff = ((result.yieldPerAcre - result.regionalAvgYield) / result.regionalAvgYield * 100).toFixed(0);
  const isAboveAvg = result.yieldPerAcre >= result.regionalAvgYield;

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Section>
        <div className="glass-card p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Per Acre</p>
              <p className="text-2xl font-bold font-display text-primary">{result.yieldPerAcre}</p>
              <p className="text-xs text-muted-foreground">{result.unit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Production</p>
              <p className="text-2xl font-bold font-display text-foreground">{result.totalYield}</p>
              <p className="text-xs text-muted-foreground">{result.totalUnit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</p>
              <p className="text-2xl font-bold font-display text-secondary">{result.confidence}%</p>
              <p className="text-xs text-muted-foreground">{result.rating}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Harvest In</p>
              <p className="text-2xl font-bold font-display text-accent">{result.harvestPeriod.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Regional Comparison Chart */}
      <Section delay={0.1}>
        <div className="glass-card p-4">
          <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Yield vs Regional Average
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Your predicted yield is{" "}
            <span className={isAboveAvg ? "text-primary font-semibold" : "text-destructive font-semibold"}>
              {isAboveAvg ? "+" : ""}{yieldDiff}%
            </span>{" "}
            {isAboveAvg ? "above" : "below"} the regional average
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                <Tooltip formatter={(value: number) => [`${value} ${result.unit}`, "Yield"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Yield Factors */}
      {result.yieldFactors?.length > 0 && (
        <Section delay={0.15}>
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-secondary" /> Yield Impact Factors
            </h3>
            <div className="space-y-3">
              {result.yieldFactors.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{f.factor}</span>
                    <span className="text-muted-foreground">{f.impact}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.impact}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${f.impact >= 80 ? "bg-primary" : f.impact >= 60 ? "bg-secondary" : "bg-harvest"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Nutrient Analysis */}
      {result.nutrientAnalysis && (
        <Section delay={0.2}>
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" /> Soil Nutrient Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.nutrientAnalysis).map(([key, val]) => (
                <div key={key} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase">{key}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-2 w-2 rounded-full ${statusColors[val.status] || "bg-muted"}`} />
                    <span className="text-sm font-medium text-foreground capitalize">{val.status}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val.score}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${statusColors[val.status] || "bg-muted-foreground"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Smart Insights */}
      {result.insights?.length > 0 && (
        <Section delay={0.25}>
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-harvest" /> Smart Insights
            </h3>
            {result.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0">
                <ChevronRight className={`h-4 w-4 mt-0.5 flex-shrink-0 ${insightIconColor[insight.type] || "text-muted-foreground"}`} />
                <p className="text-sm text-foreground">{insight.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Risk Detection */}
      {result.risks?.length > 0 && (
        <Section delay={0.3}>
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" /> Risk Detection
            </h3>
            <div className="space-y-2">
              {result.risks.map((risk, i) => (
                <div key={i} className={`rounded-lg p-3 flex items-start gap-2.5 ${riskBg[risk.level]}`}>
                  <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${riskColors[risk.level]}`} />
                  <div>
                    <span className={`text-xs font-bold uppercase ${riskColors[risk.level]}`}>{risk.level} risk</span>
                    <p className="text-sm text-foreground mt-0.5">{risk.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <Section delay={0.35}>
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Farming Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 uppercase">
                    {rec.category}
                  </span>
                  <p className="text-sm text-foreground">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Final Advice */}
      {result.finalAdvice && (
        <Section delay={0.4}>
          <div className="glass-card p-4 border-l-4 border-primary">
            <h3 className="font-display font-bold text-foreground mb-2">Final Advice</h3>
            <p className="text-sm text-foreground leading-relaxed">{result.finalAdvice}</p>
          </div>
        </Section>
      )}
    </div>
  );
};

export default YieldResultsDashboard;
