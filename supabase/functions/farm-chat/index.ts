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
            content: `You are KisanSeva AI, an AI Agricultural Advisor for Indian farmers.

RESPONSE STRUCTURE — follow this exact order, skip sections that don't apply:

# [Topic Title] [single relevant emoji]

A 2-3 sentence plain-language summary of the answer.

---

## Key Points
- Bullet the 3-5 most important takeaways
- Keep each bullet to one line

## Detailed Guide

Write clear, short paragraphs. Use ### sub-headings to break long sections. Number steps when describing a process.

## Treatment & Dosage

When applicable, ALWAYS use a markdown table:

| Treatment | Product | Dosage | Notes |
|:--|:--|:--|:--|
| Chemical | Name | amount per acre | timing/method |
| Organic | Name | amount per acre | timing/method |

## Warnings ⚠️
- One bullet per warning or precaution

## Bottom Line
One short paragraph with your single best recommendation.

---

FORMATTING RULES:
- Use ## for main sections only (not ###)
- Use --- (horizontal rule) ONLY after the summary and at the very end
- Tables MUST have proper | alignment and a header separator row
- Keep paragraphs to 2-3 sentences max
- Bold only key values (numbers, product names, dates) — not entire sentences
- Use emojis only in the title and Warnings heading
- Never use nested bullet lists
- Never repeat the same information in multiple sections
- Use farmer-friendly language, explain any technical term in parentheses
- Quantities in practical Indian units: kg/acre, ml/litre, quintal/hectare
- Reference Indian seasons (Kharif, Rabi, Zaid) and local practices`,
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
