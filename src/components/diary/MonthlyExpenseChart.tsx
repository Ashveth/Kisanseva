import { useMemo } from "react";
import { format, parseISO, startOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface DiaryEntry {
  date: string;
  expense_amount: number | null;
}

interface MonthlyExpenseChartProps {
  entries: DiaryEntry[];
}

const MonthlyExpenseChart = ({ entries }: MonthlyExpenseChartProps) => {
  const chartData = useMemo(() => {
    const monthMap = new Map<string, number>();

    entries.forEach((entry) => {
      if (entry.expense_amount && entry.expense_amount > 0) {
        const monthKey = format(startOfMonth(parseISO(entry.date)), "yyyy-MM");
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + entry.expense_amount);
      }
    });

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // last 6 months
      .map(([month, total]) => ({
        month: format(parseISO(`${month}-01`), "MMM yy"),
        total,
      }));
  }, [entries]);

  if (chartData.length === 0) return null;

  const maxExpense = Math.max(...chartData.map((d) => d.total));
  const avgExpense = Math.round(chartData.reduce((s, d) => s + d.total, 0) / chartData.length);

  return (
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
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              className="fill-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
                    <p className="text-xs font-display font-bold text-foreground">
                      {payload[0].payload.month}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      ₹{(payload[0].value as number).toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
              className="fill-primary"
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;
