import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { crop, nitrogen, phosphorus, potassium, temperature, rainfall, fertilizer } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

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
            content: `You are an expert agronomist specializing in yield prediction. Based on crop type, soil nutrients, climate, and fertilizer data, predict the expected yield. Return ONLY valid JSON:
{
  "yield": 3.5,
  "unit": "tons/acre",
  "harvestPeriod": "90-120 days",
  "confidence": 82,
  "rating": "Above Average",
  "insights": [
    "Specific actionable insight about the inputs",
    "Fertilizer optimization tip",
    "Irrigation recommendation",
    "Expected comparison to district average"
  ],
  "risks": ["potential risk 1", "potential risk 2"],
  "optimizations": ["optimization suggestion 1", "optimization suggestion 2"]
}
Give realistic yield numbers for Indian farming conditions. Be specific and practical.`,
          },
          {
            role: "user",
            content: `Predict yield for: Crop=${crop}, Nitrogen=${nitrogen} kg/ha, Phosphorus=${phosphorus} kg/ha, Potassium=${potassium} kg/ha, Temperature=${temperature}°C, Rainfall=${rainfall}mm, Fertilizer=${fertilizer}.`,
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
    console.error("yield-predict error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
