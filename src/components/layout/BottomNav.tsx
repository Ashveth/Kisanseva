import { Link, useLocation } from "react-router-dom";
import { Home, Leaf, Camera, CloudSun, TrendingUp, BookOpen, MessageCircle, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/hooks/useNotifications";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: "/", icon: Home, label: t.navHome },
    { path: "/crop-advisor", icon: Leaf, label: t.navCrops },
    { path: "/weather", icon: CloudSun, label: t.navWeather },
    { path: "/market", icon: TrendingUp, label: t.navMarket },
    { path: "/notifications", icon: Bell, label: t.navNotifications, badge: unreadCount },
    { path: "/chat", icon: MessageCircle, label: t.navAskAI },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-colors relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {"badge" in item && (item as any).badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {(item as any).badge > 9 ? "9+" : (item as any).badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium font-display">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
