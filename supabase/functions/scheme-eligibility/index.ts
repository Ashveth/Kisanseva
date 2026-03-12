import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { farmSize, state, crops, landOwnership, farmerType } = await req.json();

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
            content: `You are an expert on Indian government agricultural schemes. Based on the farmer's profile, recommend the most relevant central and state government schemes they are eligible for.

Return ONLY valid JSON array:
[
  {
    "scheme": "Scheme Name",
    "eligible": true/false,
    "relevance": "High/Medium/Low",
    "reason": "Brief reason why this scheme is relevant or not",
    "estimatedBenefit": "Estimated financial benefit amount"
  }
]

Include at least 5-8 schemes. Be specific about eligibility based on the farmer's details. Include both central and state-level schemes relevant to their state.`,
          },
          {
            role: "user",
            content: `Farmer Profile:
- Farm Size: ${farmSize || "Not specified"}
- State: ${state || "Not specified"}
- Crops Grown: ${crops || "Not specified"}
- Land Ownership: ${landOwnership || "Not specified"}
- Farmer Type: ${farmerType || "Not specified"}

Recommend eligible government schemes for this farmer.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown code fences if present
    const cleaned = content.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "").trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not parse AI response:", content.substring(0, 500));
      throw new Error("Invalid response format");
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Content:", jsonMatch[0].substring(0, 500));
      throw new Error("Invalid response format");
    }
    return new Response(JSON.stringify({ recommendations: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scheme-eligibility error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
