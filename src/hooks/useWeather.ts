import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke("get-weather", {
    body: { lat, lon },
  });
  if (error) throw error;
  return data as WeatherData;
}

export function useWeather() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Default to New Delhi
      setCoords({ lat: 28.6139, lon: 77.209 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setGeoError("Location access denied — using default location");
        setCoords({ lat: 28.6139, lon: 77.209 });
      },
      { timeout: 10000 }
    );
  }, []);

  const query = useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon],
    queryFn: () => fetchWeather(coords!.lat, coords!.lon),
    enabled: !!coords,
    staleTime: 10 * 60 * 1000, // 10 min
    refetchInterval: 15 * 60 * 1000, // 15 min
  });

  return { ...query, geoError };
}
