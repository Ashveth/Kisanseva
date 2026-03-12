import { useMemo } from "react";
import { format, parseISO, startOfMonth } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";

interface DiaryEntry {
  date: string;
  expense_amount: number | null;
  activity_type: string;
}

interface MonthlyExpenseChartProps {
  entries: DiaryEntry[];
}

const ACTIVITY_COLORS: Record<string, string> = {
  planting: "hsl(142, 55%, 40%)",
  fertilizing: "hsl(199, 70%, 50%)",
  harvesting: "hsl(38, 80%, 50%)",
  expense: "hsl(25, 60%, 45%)",
  irrigation: "hsl(210, 65%, 55%)",
  pest_control: "hsl(0, 65%, 50%)",
  general: "hsl(220, 10%, 55%)",
};

const ACTIVITY_LABELS: Record<string, string> = {
  planting: "🌱 Planting",
  fertilizing: "💧 Fertilizing",
  harvesting: "✂️ Harvesting",
  expense: "💰 Expense",
  irrigation: "🚿 Irrigation",
  pest_control: "🛡️ Pest Control",
  general: "📝 General",
};

const MonthlyExpenseChart = ({ entries }: MonthlyExpenseChartProps) => {
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, number>();
    entries.forEach((entry) => {
      if (entry.expense_amount && entry.expense_amount > 0) {
        const monthKey = format(startOfMonth(parseISO(entry.date)), "yyyy-MM");
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + entry.expense_amount);
      }
    });
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, total]) => ({
        month: format(parseISO(`${month}-01`), "MMM yy"),
        total,
      }));
  }, [entries]);

  const pieData = useMemo(() => {
    const typeMap = new Map<string, number>();
    entries.forEach((entry) => {
      if (entry.expense_amount && entry.expense_amount > 0) {
        const type = entry.activity_type;
        typeMap.set(type, (typeMap.get(type) || 0) + entry.expense_amount);
      }
    });
    return Array.from(typeMap.entries())
      .map(([type, value]) => ({
        name: ACTIVITY_LABELS[type] || type,
        value,
        type,
      }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  if (monthlyData.length === 0 && pieData.length === 0) return null;

  const avgExpense = monthlyData.length
    ? Math.round(monthlyData.reduce((s, d) => s + d.total, 0) / monthlyData.length)
    : 0;
  const totalByType = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Monthly Bar Chart */}
      {monthlyData.length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-foreground text-sm">Monthly Expenses</h3>
            </div>
            <span className="text-xs text-muted-foreground font-display">
              Avg: ₹{avgExpense.toLocaleString()}/mo
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                        <p className="text-xs font-display font-bold text-foreground">{payload[0].payload.month}</p>
                        <p className="text-sm font-bold text-primary">₹{(payload[0].value as number).toLocaleString()}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} className="fill-primary" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Activity Breakdown Pie Chart */}
      {pieData.length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-foreground text-sm">Expense Breakdown</h3>
            </div>
            <span className="text-xs text-muted-foreground font-display">
              Total: ₹{totalByType.toLocaleString()}
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.type} fill={ACTIVITY_COLORS[entry.type] || "hsl(220, 10%, 55%)"} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const pct = ((d.value / totalByType) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                        <p className="text-xs font-display font-bold text-foreground">{d.name}</p>
                        <p className="text-sm font-bold text-primary">₹{d.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{pct}% of total</p>
                      </div>
                    );
                  }}
                />
                <Legend
                  formatter={(value: string) => <span className="text-xs text-foreground">{value}</span>}
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyExpenseChart;
