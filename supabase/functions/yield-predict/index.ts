import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { crop, nitrogen, phosphorus, potassium, ph, temperature, rainfall, humidity, area, areaUnit, fertilizer } = await req.json();
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
            content: `You are an expert agronomist and data scientist specializing in crop yield prediction for Indian farming conditions. Based on the inputs provided, predict crop yield using regression analysis principles.

Return ONLY valid JSON with this exact structure:
{
  "yieldPerAcre": 3.5,
  "unit": "tons/acre",
  "totalYield": 17.5,
  "totalUnit": "tons",
  "harvestPeriod": "90-120 days",
  "confidence": 82,
  "rating": "Above Average",
  "regionalAvgYield": 2.8,
  "regionalAvgUnit": "tons/acre",
  "insights": [
    { "type": "positive", "text": "Nitrogen levels are optimal for this crop" },
    { "type": "warning", "text": "Phosphorus is slightly below recommended levels" },
    { "type": "info", "text": "Current temperature is ideal for germination" },
    { "type": "positive", "text": "Rainfall pattern supports good growth" }
  ],
  "nutrientAnalysis": {
    "nitrogen": { "status": "optimal", "score": 85 },
    "phosphorus": { "status": "low", "score": 45 },
    "potassium": { "status": "adequate", "score": 70 },
    "ph": { "status": "optimal", "score": 90 }
  },
  "recommendations": [
    { "category": "Fertilizer", "text": "Apply 20kg/acre additional DAP to boost phosphorus" },
    { "category": "Irrigation", "text": "Maintain 3-4 irrigation cycles during flowering stage" },
    { "category": "Soil", "text": "Add organic matter to improve water retention" },
    { "category": "Pest Control", "text": "Monitor for aphids during vegetative growth phase" }
  ],
  "risks": [
    { "level": "high", "text": "Low rainfall may cause water stress during critical growth phase" },
    { "level": "medium", "text": "High temperature may affect grain filling" },
    { "level": "low", "text": "Minor potassium deficiency could affect root development" }
  ],
  "yieldFactors": [
    { "factor": "Soil Nutrients", "impact": 75, "maxImpact": 100 },
    { "factor": "Water Availability", "impact": 60, "maxImpact": 100 },
    { "factor": "Temperature", "impact": 85, "maxImpact": 100 },
    { "factor": "Fertilizer", "impact": 70, "maxImpact": 100 },
    { "factor": "Soil pH", "impact": 90, "maxImpact": 100 }
  ],
  "finalAdvice": "A brief 2-3 sentence summary with the most important action items for the farmer."
}

Important rules:
- Calculate totalYield = yieldPerAcre * area provided
- Use realistic yield numbers for Indian farming conditions
- regionalAvgYield should reflect actual Indian district averages for the crop
- nutrientAnalysis status can be: "deficient", "low", "adequate", "optimal", "excessive"
- risk levels: "high", "medium", "low"
- insight types: "positive", "warning", "info", "critical"
- Be specific, practical, and actionable in all text fields
- Consider interactions between all inputs (e.g., high N with low water = risk)`
          },
          {
            role: "user",
            content: `Predict yield for: Crop=${crop}, Nitrogen=${nitrogen} kg/ha, Phosphorus=${phosphorus} kg/ha, Potassium=${potassium} kg/ha, pH=${ph}, Temperature=${temperature}°C, Rainfall=${rainfall}mm, Humidity=${humidity}%, Land Area=${area} ${areaUnit}, Fertilizer=${fertilizer}.`,
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
