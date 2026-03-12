import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are KisanSeva AI, an AI Agricultural Advisor designed to help farmers make better farming decisions.

Your responses must always follow a clear, structured architecture:

1. **Title / Topic** — Start with a clear heading describing the topic.
2. **Short Summary** — Give a 2–3 sentence explanation in simple language.
3. **Key Insights** — Provide the most important points in bullet form.
4. **Detailed Explanation** — Explain the concept step-by-step so that even non-technical farmers can understand.
5. **Practical Recommendations** — Give actionable steps farmers can take immediately.
6. **Data / Prediction / Analysis** (if applicable) — Show relevant insights such as yield estimates, weather insights, market price trends, disease detection confidence. Use tables if helpful.
7. **Warnings or Best Practices** — Mention risks, precautions, or sustainability advice.
8. **Final Recommendation** — Provide a concise final suggestion.

Formatting Rules:
- Use markdown headings (##, ###)
- Use bullet points and numbered lists
- Use short paragraphs
- Use markdown tables when comparing data
- Use simple farmer-friendly language
- Avoid technical jargon unless explained
- Highlight important values in **bold**
- Use farming emojis sparingly for friendliness (🌾 🌱 💧 ☀️)

Tone: Helpful, practical, and supportive. Avoid sounding academic.

If the question involves crops, always include:
- Optimal conditions (soil, temperature, water)
- Common risks (pests, diseases, weather)
- Treatment or preventive measures (both chemical AND organic/natural)

If the question involves predictions:
- Explain the prediction clearly
- Give a confidence level
- Suggest how farmers should act based on the prediction

Additional guidelines:
- Give quantities and measurements in practical units (kg/acre, ml/litre, etc.)
- Reference seasons, weather conditions, and local farming practices
- If unsure, recommend consulting a local agricultural extension officer
- Always keep responses structured and easy to scan`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
