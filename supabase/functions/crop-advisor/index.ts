import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { nitrogen, phosphorus, potassium, ph, temperature, rainfall, location } = await req.json();
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
            content: `You are an expert agricultural advisor. Given soil and climate data, recommend the top 3 most suitable crops. Return ONLY valid JSON with this exact structure:
{
  "crops": [
    {
      "name": "Crop Name",
      "yield": "X.X tons/acre",
      "confidence": 85,
      "season": "Kharif/Rabi/Zaid",
      "waterNeed": "High/Medium/Low",
      "tips": ["tip1", "tip2", "tip3"]
    }
  ]
}
Confidence should reflect how well the soil/climate matches. Give practical, actionable tips specific to the conditions provided.`,
          },
          {
            role: "user",
            content: `Soil data: Nitrogen=${nitrogen} kg/ha, Phosphorus=${phosphorus} kg/ha, Potassium=${potassium} kg/ha, pH=${ph}, Temperature=${temperature}°C, Rainfall=${rainfall}mm${location ? `, Location: ${location}` : ""}. Recommend the best 3 crops.`,
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
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    const result = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crop-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
