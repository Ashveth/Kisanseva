const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: 'lat and lon are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch current weather + 5-day forecast from Open-Meteo (no API key needed)
    const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5&forecast_hours=24`;

    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`);
    }

    const data = await response.json();

    const weatherCodeToCondition = (code: number): { condition: string; icon: string } => {
      if (code <= 1) return { condition: "Clear Sky", icon: "☀️" };
      if (code <= 3) return { condition: "Partly Cloudy", icon: "⛅" };
      if (code <= 48) return { condition: "Foggy", icon: "🌫️" };
      if (code <= 57) return { condition: "Drizzle", icon: "🌦️" };
      if (code <= 67) return { condition: "Rain", icon: "🌧️" };
      if (code <= 77) return { condition: "Snow", icon: "❄️" };
      if (code <= 82) return { condition: "Rain Showers", icon: "🌧️" };
      if (code <= 86) return { condition: "Snow Showers", icon: "🌨️" };
      if (code >= 95) return { condition: "Thunderstorm", icon: "⛈️" };
      return { condition: "Unknown", icon: "🌡️" };
    };

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    const current = {
      temp: Math.round(data.current.temperature_2m),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      rainChance: data.daily.precipitation_probability_max[0] ?? 0,
      condition: weatherCodeToCondition(data.current.weather_code).condition,
      uv: Math.round(data.current.uv_index),
    };

    const forecast = data.daily.time.map((date: string, i: number) => {
      const d = new Date(date);
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()];
      const { icon } = weatherCodeToCondition(data.daily.weather_code[i]);
      return {
        day: label,
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        rain: data.daily.precipitation_probability_max[i] ?? 0,
        icon,
      };
    });

    // Generate alerts based on conditions
    const alerts: { type: string; message: string; severity: "warning" | "info" }[] = [];
    if (current.temp > 38) alerts.push({ type: "heat", message: `Extreme heat: ${current.temp}°C — protect crops and livestock`, severity: "warning" });
    if (current.temp < 5) alerts.push({ type: "frost", message: `Frost risk: ${current.temp}°C — cover sensitive crops`, severity: "warning" });
    if (forecast.some((d: any) => d.rain > 70)) alerts.push({ type: "rain", message: "Heavy rainfall expected in the coming days", severity: "warning" });
    if (current.windSpeed > 40) alerts.push({ type: "wind", message: `High winds: ${current.windSpeed} km/h — secure structures`, severity: "warning" });
    if (current.uv > 8) alerts.push({ type: "uv", message: `Very high UV index (${current.uv}) — limit outdoor exposure`, severity: "info" });

    return new Response(JSON.stringify({ current, forecast, alerts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
