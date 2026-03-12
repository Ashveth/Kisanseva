import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Camera, CloudSun, TrendingUp, BookOpen, MessageCircle, Sprout, BarChart3, AlertTriangle, Droplets, Thermometer, Wind, Download, X, BookMarked } from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import heroImage from "@/assets/hero-farm.jpg";
import { useWeather } from "@/hooks/useWeather";
import { weatherData as mockWeather } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { data: weather, isLoading } = useWeather();
  const { t } = useLanguage();
  const w = weather?.current ?? mockWeather.current;
  const alerts = weather?.alerts ?? mockWeather.alerts;
  const forecast = weather?.forecast ?? mockWeather.forecast;

  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("farmwise-install-dismissed");
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (dismissed || isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show fallback banner after 3s if no prompt event (iOS)
    const timer = setTimeout(() => {
      if (!isStandalone) setShowInstallBanner(true);
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setShowInstallBanner(false);
    } else {
      window.location.href = "/install";
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("farmwise-install-dismissed", "true");
  };

  const quickActions = [
    { path: "/crop-advisor", icon: Leaf, label: t.cropAdvisor, desc: t.cropAdvisorDesc, gradient: "gradient-hero" },
    { path: "/disease-detect", icon: Camera, label: t.scanPlant, desc: t.scanPlantDesc, gradient: "gradient-earth" },
    { path: "/weather", icon: CloudSun, label: t.weather, desc: t.weatherDesc, gradient: "gradient-sky" },
    { path: "/market", icon: TrendingUp, label: t.marketPrices, desc: t.marketPricesDesc, gradient: "gradient-harvest" },
    { path: "/diary", icon: BookMarked, label: "Farm Diary", desc: "Log daily activities & expenses", gradient: "gradient-earth" },
    { path: "/knowledge", icon: BookOpen, label: t.pestGuide, desc: t.pestGuideDesc, gradient: "gradient-hero" },
    { path: "/chat", icon: MessageCircle, label: t.askAI, desc: t.askAIDesc, gradient: "gradient-earth" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={heroImage} alt="Farm landscape" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container">
            <div className="flex items-center gap-2 mb-1">
              <Sprout className="h-6 w-6 text-harvest" />
              <h1 className="text-2xl md:text-3xl font-bold font-display text-primary-foreground">
                {t.appName}
              </h1>
            </div>
            <p className="text-sm text-primary-foreground/80 max-w-md">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="container space-y-6">
        {/* Install Banner */}
        <AnimatePresence>
          {showInstallBanner && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="glass-card p-3 flex items-center gap-3 border border-primary/20 bg-primary/5">
              <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-foreground text-sm">Install FarmWise</p>
                <p className="text-xs text-muted-foreground">Add to home screen for offline access & faster loading</p>
              </div>
              <button onClick={handleInstall}
                className="px-3 py-1.5 rounded-lg gradient-hero text-primary-foreground text-xs font-bold font-display flex-shrink-0">
                Install
              </button>
              <button onClick={dismissBanner} className="p-1 text-muted-foreground hover:text-foreground flex-shrink-0">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Thermometer} label={t.temperature} value={`${w.temp}°C`} gradient="earth" />
            <StatCard icon={Droplets} label={t.humidity} value={`${w.humidity}%`} gradient="sky" />
            <StatCard icon={Wind} label={t.wind} value={`${w.windSpeed} km/h`} gradient="hero" />
            <StatCard icon={BarChart3} label={t.rainChance} value={`${w.rainChance}%`} gradient="harvest" />
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className={`glass-card p-3 flex items-center gap-3 border-l-4 ${
                alert.severity === "warning" ? "border-l-harvest" : "border-l-sky"
              }`}>
                <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${
                  alert.severity === "warning" ? "text-harvest" : "text-sky"
                }`} />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold font-display text-foreground mb-3">{t.quickActions}</h2>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <motion.div key={action.path} variants={item}>
                <Link
                  to={action.path}
                  className="glass-card p-4 flex flex-col items-center text-center gap-3 hover:shadow-elevated transition-shadow group"
                >
                  <div className={`h-14 w-14 rounded-2xl ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 5-Day Forecast Mini */}
        <div>
          <h2 className="text-lg font-bold font-display text-foreground mb-3">{t.fiveDayForecast}</h2>
          <div className="glass-card p-4">
            <div className="flex justify-between">
              {forecast.map((day) => (
                <div key={day.day} className="text-center space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                  <p className="text-2xl">{day.icon}</p>
                  <p className="text-sm font-bold text-foreground">{day.high}°</p>
                  <p className="text-xs text-muted-foreground">{day.low}°</p>
                  <p className="text-xs text-sky">{day.rain}%💧</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
