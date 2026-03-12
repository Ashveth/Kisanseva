import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Plus, Calendar as CalendarIcon, Sprout, Droplets, Scissors, DollarSign, Tag, Trash2, Pencil, X, Loader2, Download, FileText, FileSpreadsheet, CalendarRange, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportCSV, exportPDF } from "@/utils/diaryExport";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import MonthlyExpenseChart from "@/components/diary/MonthlyExpenseChart";

interface DiaryEntry {
  id: string;
  title: string;
  activity_type: string;
  description: string | null;
  date: string;
  expense_amount: number | null;
  income_amount: number | null;
  expense_currency: string;
  tags: string[];
  created_at: string;
}

const ACTIVITY_TYPES = [
  { value: "planting", label: "🌱 Planting", icon: Sprout, color: "text-primary" },
  { value: "fertilizing", label: "💧 Fertilizing", icon: Droplets, color: "text-sky" },
  { value: "harvesting", label: "✂️ Harvesting", icon: Scissors, color: "text-harvest" },
  { value: "expense", label: "💰 Expense", icon: DollarSign, color: "text-earth" },
  { value: "irrigation", label: "🚿 Irrigation", icon: Droplets, color: "text-sky" },
  { value: "pest_control", label: "🛡️ Pest Control", icon: Tag, color: "text-destructive" },
  { value: "general", label: "📝 General", icon: BookMarked, color: "text-muted-foreground" },
];

const FarmDiaryPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Form state
  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState("general");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");

  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("farm_diary")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load diary entries");
      console.error(error);
    } else {
      setEntries((data as unknown as DiaryEntry[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const resetForm = () => {
    setTitle("");
    setActivityType("general");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setExpenseAmount("");
    setIncomeAmount("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error(t.titleRequired); return; }
    if (!user) return;
    setSaving(true);

    const payload = {
      user_id: user.id,
      title: title.trim(),
      activity_type: activityType,
      description: description.trim() || null,
      date,
      expense_amount: expenseAmount ? parseFloat(expenseAmount) : null,
      income_amount: incomeAmount ? parseFloat(incomeAmount) : null,
    };

    if (editingId) {
      const { error } = await supabase.from("farm_diary").update(payload).eq("id", editingId);
      if (error) { toast.error("Failed to update entry"); console.error(error); }
      else { toast.success("Entry updated"); }
    } else {
      const { error } = await supabase.from("farm_diary").insert(payload);
      if (error) { toast.error("Failed to save entry"); console.error(error); }
      else { toast.success("Entry saved! 🌾"); }
    }

    setSaving(false);
    resetForm();
    fetchEntries();
  };

  const handleEdit = (entry: DiaryEntry) => {
    setTitle(entry.title);
    setActivityType(entry.activity_type);
    setDescription(entry.description || "");
    setDate(entry.date);
    setExpenseAmount(entry.expense_amount?.toString() || "");
    setIncomeAmount(entry.income_amount?.toString() || "");
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("farm_diary").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); console.error(error); }
    else { toast.success("Entry deleted"); fetchEntries(); }
  };

  const filtered = useMemo(() => {
    let result = filterType === "all" ? entries : entries.filter((e) => e.activity_type === filterType);
    if (dateFrom) {
      const fromStr = format(dateFrom, "yyyy-MM-dd");
      result = result.filter((e) => e.date >= fromStr);
    }
    if (dateTo) {
      const toStr = format(dateTo, "yyyy-MM-dd");
      result = result.filter((e) => e.date <= toStr);
    }
    return result;
  }, [entries, filterType, dateFrom, dateTo]);

  const getActivityInfo = (type: string) => ACTIVITY_TYPES.find((a) => a.value === type) || ACTIVITY_TYPES[6];

  const totalExpenses = entries.filter((e) => e.expense_amount).reduce((sum, e) => sum + (e.expense_amount || 0), 0);
  const totalIncome = entries.filter((e) => e.income_amount).reduce((sum, e) => sum + (e.income_amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  const filteredExpenses = filtered.filter((e) => e.expense_amount).reduce((sum, e) => sum + (e.expense_amount || 0), 0);
  const filteredIncome = filtered.filter((e) => e.income_amount).reduce((sum, e) => sum + (e.income_amount || 0), 0);

  const hasDateFilter = dateFrom || dateTo;
  const clearDateFilter = () => { setDateFrom(undefined); setDateTo(undefined); };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            <BookMarked className="h-7 w-7 text-primary" />
            Farm Diary
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Log your daily farming activities</p>
        </div>
        <div className="flex gap-2">
          {entries.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="font-display">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { exportCSV(filtered); toast.success("CSV downloaded! 📊"); }}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  let farmerName: string | undefined;
                  try {
                    const { data } = await supabase.from("profiles").select("full_name").eq("id", user!.id).single();
                    farmerName = data?.full_name || undefined;
                  } catch {}
                  exportPDF(filtered, filteredExpenses, filteredIncome, {
                    farmerName,
                    dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
                    dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
                  });
                  toast.success("PDF downloaded! 📄");
                }}>
                  <FileText className="h-4 w-4 mr-2" /> Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="gradient-hero text-primary-foreground font-display">
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{entries.length}</p>
          <p className="text-xs text-muted-foreground font-display">Total Entries</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-destructive flex items-center justify-center gap-1">
            <TrendingDown className="h-4 w-4" />
            ₹{totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground font-display">Expenses</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4" />
            ₹{totalIncome.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground font-display">Income</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
            <ArrowUpDown className="h-4 w-4" />
            {netProfit >= 0 ? "+" : "-"}₹{Math.abs(netProfit).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground font-display">{netProfit >= 0 ? "Profit" : "Loss"}</p>
        </div>
      </div>

      {/* Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-foreground">{editingId ? "Edit Entry" : "New Entry"}</h2>
              <button onClick={resetForm} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="What did you do? e.g., Planted rice seedlings" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background" />
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-background" />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Expense ₹" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} className="bg-background" />
                <Input type="number" placeholder="Income ₹" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} className="bg-background" />
              </div>
            </div>
            <Textarea placeholder="Add details... (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background min-h-[80px]" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="gradient-hero text-primary-foreground">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                {editingId ? "Update" : "Save Entry"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Expense Chart */}
      <MonthlyExpenseChart entries={entries} />

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("text-xs font-display gap-1.5", dateFrom && "border-primary text-primary")}>
                <CalendarRange className="h-3.5 w-3.5" />
                {dateFrom ? format(dateFrom, "dd MMM yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">→</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("text-xs font-display gap-1.5", dateTo && "border-primary text-primary")}>
                <CalendarRange className="h-3.5 w-3.5" />
                {dateTo ? format(dateTo, "dd MMM yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} disabled={(d) => dateFrom ? d < dateFrom : false} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          {hasDateFilter && (
            <Button variant="ghost" size="sm" onClick={clearDateFilter} className="text-xs text-muted-foreground hover:text-foreground h-7 px-2">
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>
        {hasDateFilter && (
          <span className="text-xs text-muted-foreground font-display">
            Showing {filtered.length} entries • ₹{filteredExpenses.toLocaleString()} expenses • ₹{filteredIncome.toLocaleString()} income
          </span>
        )}
      </div>

      {/* Activity Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium font-display whitespace-nowrap transition-colors ${filterType === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
          All
        </button>
        {ACTIVITY_TYPES.map((a) => (
          <button key={a.value} onClick={() => setFilterType(a.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium font-display whitespace-nowrap transition-colors ${filterType === a.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-8 text-center space-y-2">
          <BookMarked className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-display font-bold text-foreground">No entries yet</p>
          <p className="text-sm text-muted-foreground">Start logging your daily farming activities!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry, i) => {
            const info = getActivityInfo(entry.activity_type);
            const Icon = info.icon;
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 ${info.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display font-bold text-foreground text-sm">{entry.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          <span className="mx-1">•</span>
                          {info.label}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleEdit(entry)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-foreground/80 mt-2">{entry.description}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      {entry.expense_amount != null && entry.expense_amount > 0 && (
                        <p className="text-sm font-bold text-destructive flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" /> ₹{entry.expense_amount.toLocaleString()}
                        </p>
                      )}
                      {entry.income_amount != null && entry.income_amount > 0 && (
                        <p className="text-sm font-bold text-primary flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> ₹{entry.income_amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmDiaryPage;
