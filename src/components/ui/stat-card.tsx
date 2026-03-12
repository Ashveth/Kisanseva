import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  gradient?: "hero" | "harvest" | "sky" | "earth";
}

const gradientMap = {
  hero: "gradient-hero",
  harvest: "gradient-harvest",
  sky: "gradient-sky",
  earth: "gradient-earth",
};

const StatCard = ({ icon: Icon, label, value, subtitle, gradient = "hero" }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex items-center gap-4"
    >
      <div className={`h-12 w-12 rounded-xl ${gradientMap[gradient]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold font-display text-foreground truncate">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
