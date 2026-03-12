import { motion } from "framer-motion";
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, Sun, MapPin, RefreshCw, Clock } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const WeatherPage = () => {
  const { data, isLoading, isError, geoError, refetch } = useWeather();
  const { t } = useLanguage();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
          <CloudSun className="h-7 w-7 text-sky" />
          {t.weatherIntelligence}
        </h1>
        <button onClick={() => refetch()} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Refresh">
          <RefreshCw className={`h-5 w-5 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {geoError && (
        <div className="glass-card p-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {t.locationDenied}
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}

      {isError && (
        <div className="glass-card p-6 text-center">
          <p className="text-destructive font-medium">{t.failedLoadWeather}</p>
          <button onClick={() => refetch()} className="mt-2 text-sm text-primary underline">{t.tryAgain}</button>
        </div>
      )}

      {data && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 gradient-sky text-sky-foreground rounded-xl">
            <p className="text-sm opacity-80">{t.currentConditions} • {t.live}</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-5xl font-bold font-display">{data.current.temp}°C</p>
                <p className="text-lg mt-1">{data.current.condition}</p>
              </div>
              <div className="text-6xl">
                {data.current.temp > 35 ? "☀️" : data.current.rainChance > 60 ? "🌧️" : "⛅"}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-sky-foreground/20">
              <div className="text-center">
                <Droplets className="h-5 w-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm font-bold">{data.current.humidity}%</p>
                <p className="text-xs opacity-70">{t.humidity}</p>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm font-bold">{data.current.windSpeed} km/h</p>
                <p className="text-xs opacity-70">{t.wind}</p>
              </div>
              <div className="text-center">
                <CloudSun className="h-5 w-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm font-bold">{data.current.rainChance}%</p>
                <p className="text-xs opacity-70">{t.rain}</p>
              </div>
              <div className="text-center">
                <Sun className="h-5 w-5 mx-auto mb-1 opacity-80" />
                <p className="text-sm font-bold">{data.current.uv}</p>
                <p className="text-xs opacity-70">{t.uvIndex}</p>
              </div>
            </div>
          </motion.div>

          {data.alerts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold font-display text-foreground">{t.weatherAlerts}</h2>
              {data.alerts.map((alert, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className={`glass-card p-3 flex items-center gap-3 border-l-4 ${alert.severity === "warning" ? "border-l-harvest" : "border-l-sky"}`}>
                  <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${alert.severity === "warning" ? "text-harvest" : "text-sky"}`} />
                  <p className="text-sm text-foreground">{alert.message}</p>
                </motion.div>
              ))}
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold font-display text-foreground mb-3">{t.fiveDayForecast}</h2>
            <div className="space-y-2">
              {data.forecast.map((day, i) => (
                <motion.div key={day.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 w-24">
                    <span className="text-2xl">{day.icon}</span>
                    <span className="font-display font-bold text-foreground text-sm">{day.day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-3.5 w-3.5 text-sky" />
                    <span className="text-sm text-sky font-medium">{day.rain}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{day.high}°</span>
                    <span className="text-muted-foreground text-sm">{day.low}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h2 className="font-display font-bold text-foreground mb-2">{t.farmingAdvisory}</h2>
            <div className="space-y-2 text-sm text-foreground">
              {data.current.rainChance > 50 ? (
                <p>• <strong>{t.humidity}:</strong> {t.irrigationReduceRain}</p>
              ) : (
                <p>• <strong>{t.humidity}:</strong> {t.irrigationNormal}</p>
              )}
              {data.forecast.some(d => d.rain > 60) ? (
                <p>• <strong>{t.rain}:</strong> {t.sprayingBeforeRain}</p>
              ) : (
                <p>• <strong>{t.rain}:</strong> {t.sprayingGood}</p>
              )}
              {data.current.temp > 35 ? (
                <p>• <strong>{t.temperature}:</strong> {t.heatProtect}</p>
              ) : data.current.temp < 10 ? (
                <p>• <strong>{t.temperature}:</strong> {t.coldCover}</p>
              ) : (
                <p>• <strong>{t.temperature}:</strong> {t.tempFavorable}</p>
              )}
              {data.current.windSpeed > 30 ? (
                <p>• <strong>{t.wind}:</strong> {t.windSecure}</p>
              ) : (
                <p>• <strong>{t.wind}:</strong> {t.sowingGood}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPage;
