import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HourlyData {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    rainChance: number;
    condition: string;
    uv: number;
  };
  alerts: { type: string; message: string; severity: "warning" | "info" }[];
  forecast: { day: string; high: number; low: number; rain: number; icon: string }[];
  hourly: HourlyData[];
}

const CACHE_KEY = "farmwise-weather-cache-v2";
const COORDS_KEY = "farmwise-last-coords";

function getCachedWeather(): WeatherData | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const { data, ts } = JSON.parse(raw);
    // Cache valid for 30 min
    if (Date.now() - ts < 30 * 60 * 1000) return data as WeatherData;
  } catch {}
  return undefined;
}

function setCachedWeather(data: WeatherData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

function getCachedCoords(): { lat: number; lon: number } | null {
  try {
    const raw = localStorage.getItem(COORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {}
  return null;
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke("get-weather", {
    body: { lat, lon },
  });
  if (error) throw error;
  setCachedWeather(data as WeatherData);
  return data as WeatherData;
}

export function useWeather() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(getCachedCoords);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: 28.6139, lon: 77.209 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        try { localStorage.setItem(COORDS_KEY, JSON.stringify(c)); } catch {}
      },
      () => {
        setGeoError("Location access denied — using default location");
        if (!coords) setCoords({ lat: 28.6139, lon: 77.209 });
      },
      { timeout: 5000 }
    );
  }, []);

  const query = useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon],
    queryFn: () => fetchWeather(coords!.lat, coords!.lon),
    enabled: !!coords,
    initialData: getCachedWeather,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });

  return { ...query, geoError };
}
