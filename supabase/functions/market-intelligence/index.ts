import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { crop } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    const currentDate = new Date().toISOString().split("T")[0];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert Indian agricultural market analyst. Provide current market intelligence for crops in India. Today's date is ${currentDate}. Return ONLY valid JSON:
{
  "currentPrice": 2200,
  "unit": "₹/quintal",
  "msp": 2183,
  "priceRange": { "low": 1900, "high": 2500 },
  "trend": "rising/falling/stable",
  "changePercent": 3.5,
  "bestMonthToSell": "November",
  "bestMandi": "Suggested mandi/market",
  "monthlyTrend": [
    { "month": "Jan", "price": 2100 },
    { "month": "Feb", "price": 2050 },
    { "month": "Mar", "price": 2200 },
    { "month": "Apr", "price": 2300 },
    { "month": "May", "price": 2250 },
    { "month": "Jun", "price": 2400 },
    { "month": "Jul", "price": 2500 },
    { "month": "Aug", "price": 2450 },
    { "month": "Sep", "price": 2350 },
    { "month": "Oct", "price": 2300 },
    { "month": "Nov", "price": 2200 },
    { "month": "Dec", "price": 2150 }
  ],
  "insights": [
    "Market insight 1",
    "Market insight 2",
    "Market insight 3"
  ],
  "forecast": "Price forecast for next few weeks"
}
Use realistic current MSP and market prices for Indian crops. Monthly trend should reflect typical seasonal patterns for this crop.`,
          },
          {
            role: "user",
            content: `Provide current market intelligence for ${crop} in India.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    const result = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-intelligence error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
