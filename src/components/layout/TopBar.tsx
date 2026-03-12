import { Link, useLocation } from "react-router-dom";
import { Home, Leaf, Camera, CloudSun, TrendingUp, BookOpen, MessageCircle, Sprout, Bell } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/crop-advisor", icon: Leaf, label: "Crop Advisor" },
  { path: "/disease-detect", icon: Camera, label: "Disease Detect" },
  { path: "/weather", icon: CloudSun, label: "Weather" },
  { path: "/market", icon: TrendingUp, label: "Market" },
  { path: "/knowledge", icon: BookOpen, label: "Knowledge Base" },
  { path: "/chat", icon: MessageCircle, label: "AI Assistant" },
];

const TopBar = () => {
  const location = useLocation();

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-hero flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">FarmWise AI</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse-gentle" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
