import { motion } from "framer-motion";
import { CloudSun, Thermometer, Droplets, Wind, Eye, AlertTriangle, Sun } from "lucide-react";
import { weatherData } from "@/data/mockData";

const WeatherPage = () => {
  const { current, alerts, forecast } = weatherData;

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
        <CloudSun className="h-7 w-7 text-sky" />
        Weather Intelligence
      </h1>

      {/* Current Weather */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 gradient-sky text-sky-foreground rounded-xl">
        <p className="text-sm opacity-80">Current Conditions</p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-5xl font-bold font-display">{current.temp}°C</p>
            <p className="text-lg mt-1">{current.condition}</p>
          </div>
          <div className="text-6xl">⛅</div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-sky-foreground/20">
          <div className="text-center">
            <Droplets className="h-5 w-5 mx-auto mb-1 opacity-80" />
            <p className="text-sm font-bold">{current.humidity}%</p>
            <p className="text-xs opacity-70">Humidity</p>
          </div>
          <div className="text-center">
            <Wind className="h-5 w-5 mx-auto mb-1 opacity-80" />
            <p className="text-sm font-bold">{current.windSpeed} km/h</p>
            <p className="text-xs opacity-70">Wind</p>
          </div>
          <div className="text-center">
            <CloudSun className="h-5 w-5 mx-auto mb-1 opacity-80" />
            <p className="text-sm font-bold">{current.rainChance}%</p>
            <p className="text-xs opacity-70">Rain</p>
          </div>
          <div className="text-center">
            <Sun className="h-5 w-5 mx-auto mb-1 opacity-80" />
            <p className="text-sm font-bold">{current.uv}</p>
            <p className="text-xs opacity-70">UV Index</p>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-display text-foreground">⚠️ Weather Alerts</h2>
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-3 flex items-center gap-3 border-l-4 ${
                alert.severity === "warning" ? "border-l-harvest" : "border-l-sky"
              }`}
            >
              <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${
                alert.severity === "warning" ? "text-harvest" : "text-sky"
              }`} />
              <p className="text-sm text-foreground">{alert.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* 5-Day Forecast */}
      <div>
        <h2 className="text-lg font-bold font-display text-foreground mb-3">5-Day Forecast</h2>
        <div className="space-y-2">
          {forecast.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-3 flex items-center justify-between"
            >
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

      {/* Farming Advisory */}
      <div className="glass-card p-4">
        <h2 className="font-display font-bold text-foreground mb-2">🌾 Farming Advisory</h2>
        <div className="space-y-2 text-sm text-foreground">
          <p>• <strong>Irrigation:</strong> Reduce watering — rain expected in 48 hours</p>
          <p>• <strong>Spraying:</strong> Complete pesticide application today before rain</p>
          <p>• <strong>Harvesting:</strong> Harvest ripe crops before Wednesday</p>
          <p>• <strong>Sowing:</strong> Good conditions for sowing after Thursday</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
