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
  income_amount: number | null;
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
    const monthMap = new Map<string, { expense: number; income: number }>();
    entries.forEach((entry) => {
      const monthKey = format(startOfMonth(parseISO(entry.date)), "yyyy-MM");
      const current = monthMap.get(monthKey) || { expense: 0, income: 0 };
      if (entry.expense_amount && entry.expense_amount > 0) current.expense += entry.expense_amount;
      if (entry.income_amount && entry.income_amount > 0) current.income += entry.income_amount;
      if (current.expense > 0 || current.income > 0) monthMap.set(monthKey, current);
    });
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, { expense, income }]) => ({
        month: format(parseISO(`${month}-01`), "MMM yy"),
        expense,
        income,
        profit: income - expense,
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
      .map(([type, value]) => ({ name: ACTIVITY_LABELS[type] || type, value, type }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  const hasData = monthlyData.length > 0 || pieData.length > 0;
  if (!hasData) return null;

  const totalExpenseByType = pieData.reduce((s, d) => s + d.value, 0);
  const hasIncome = monthlyData.some((d) => d.income > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Monthly Income vs Expense Bar Chart */}
      {monthlyData.length > 0 && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-foreground text-sm">
                {hasIncome ? "Income vs Expenses" : "Monthly Expenses"}
              </h3>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground font-display">
              {hasIncome && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Income
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Expense
              </span>
            </div>
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
                    const d = payload[0]?.payload;
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl space-y-1">
                        <p className="text-xs font-display font-bold text-foreground">{d.month}</p>
                        {d.income > 0 && <p className="text-sm font-bold text-primary">Income: ₹{d.income.toLocaleString()}</p>}
                        {d.expense > 0 && <p className="text-sm font-bold text-destructive">Expense: ₹{d.expense.toLocaleString()}</p>}
                        <p className={`text-xs font-semibold ${d.profit >= 0 ? "text-primary" : "text-destructive"}`}>
                          {d.profit >= 0 ? "Profit" : "Loss"}: ₹{Math.abs(d.profit).toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                />
                {hasIncome && <Bar dataKey="income" radius={[6, 6, 0, 0]} className="fill-primary" maxBarSize={35} />}
                <Bar dataKey="expense" radius={[6, 6, 0, 0]} className="fill-destructive" maxBarSize={35} />
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
              Total: ₹{totalExpenseByType.toLocaleString()}
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry) => (
                    <Cell key={entry.type} fill={ACTIVITY_COLORS[entry.type] || "hsl(220, 10%, 55%)"} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const pct = ((d.value / totalExpenseByType) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                        <p className="text-xs font-display font-bold text-foreground">{d.name}</p>
                        <p className="text-sm font-bold text-primary">₹{d.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{pct}% of total</p>
                      </div>
                    );
                  }}
                />
                <Legend formatter={(value: string) => <span className="text-xs text-foreground">{value}</span>} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyExpenseChart;
