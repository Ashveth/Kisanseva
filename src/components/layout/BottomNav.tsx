import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Leaf, CloudSun, TrendingUp, Bell, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Language } from "@/i18n/translations";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "ta", label: "த" },
  { code: "mr", label: "म" },
  { code: "te", label: "తె" },
  { code: "ml", label: "മ" },
  { code: "kn", label: "ಕ" },
];

const LANG_FULL: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்",
  mr: "मराठी",
  te: "తెలుగు",
  ml: "മലയാളം",
  kn: "ಕನ್ನಡ",
};

const BottomNav = () => {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { unreadCount } = useNotifications();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: t.navHome },
    { path: "/crop-advisor", icon: Leaf, label: t.navCrops },
    { path: "/weather", icon: CloudSun, label: t.navWeather },
    { path: "/market", icon: TrendingUp, label: t.navMarket },
    { path: "/notifications", icon: Bell, label: t.navNotifications, badge: unreadCount },
  ];

  return (
    <>
      {/* Language picker overlay */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm" onClick={() => setShowLangPicker(false)}>
          <div className="absolute bottom-16 left-0 right-0 p-3 bg-card border-t border-border rounded-t-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-display font-bold text-muted-foreground mb-2 px-1">{t.preferredLanguage}</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(LANG_FULL) as Language[]).map((code) => (
                <button
                  key={code}
                  onClick={() => { setLanguage(code); setShowLangPicker(false); }}
                  className={`px-2 py-2 rounded-lg text-xs font-display font-medium transition-colors ${
                    language === code
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {LANG_FULL[code]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
          {/* Language button */}
          <button
            onClick={() => setShowLangPicker(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-5 w-5" />
            <span className="text-[10px] font-medium font-display">
              {LANGUAGES.find((l) => l.code === language)?.label || "EN"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
