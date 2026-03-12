import { Link, useLocation } from "react-router-dom";
import { Home, Leaf, Camera, CloudSun, TrendingUp, BookOpen, MessageCircle, Sprout, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TopBar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", icon: Home, label: t.navDashboard },
    { path: "/crop-advisor", icon: Leaf, label: t.navCropAdvisor },
    { path: "/disease-detect", icon: Camera, label: t.navDiseaseDetect },
    { path: "/weather", icon: CloudSun, label: t.navWeather },
    { path: "/market", icon: TrendingUp, label: t.navMarket },
    { path: "/knowledge", icon: BookOpen, label: t.navKnowledge },
    { path: "/chat", icon: MessageCircle, label: t.navAIAssistant },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-hero flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">{t.appName}</span>
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
        <Link
          to="/profile"
          className={`p-2 rounded-lg transition-colors ${
            location.pathname === "/profile"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
