import { Link, useLocation } from "react-router-dom";
import { Home, Leaf, Camera, CloudSun, TrendingUp, BookOpen, MessageCircle } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/crop-advisor", icon: Leaf, label: "Crops" },
  { path: "/disease-detect", icon: Camera, label: "Detect" },
  { path: "/weather", icon: CloudSun, label: "Weather" },
  { path: "/market", icon: TrendingUp, label: "Market" },
  { path: "/knowledge", icon: BookOpen, label: "Guide" },
  { path: "/chat", icon: MessageCircle, label: "Ask AI" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium font-display">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
