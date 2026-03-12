export const weatherData = {
  current: {
    temp: 31,
    humidity: 72,
    windSpeed: 14,
    rainChance: 35,
    condition: "Partly Cloudy",
    uv: 7,
  },
  alerts: [
    { type: "rain", message: "Moderate rainfall expected in next 24 hours — plan irrigation accordingly", severity: "warning" as const },
    { type: "heat", message: "UV index may reach 9 this afternoon — avoid midday fieldwork", severity: "info" as const },
  ],
  forecast: [
    { day: "Today", high: 34, low: 25, rain: 35, icon: "⛅" },
    { day: "Tomorrow", high: 32, low: 24, rain: 55, icon: "🌦️" },
    { day: "Wed", high: 30, low: 23, rain: 70, icon: "🌧️" },
    { day: "Thu", high: 33, low: 25, rain: 15, icon: "☀️" },
    { day: "Fri", high: 35, low: 26, rain: 10, icon: "☀️" },
  ],
};

export const pests = [
  {
    name: "Stem Borer",
    crops: ["Rice", "Maize"],
    symptoms: ["Dead heart in young plants", "White ear heads", "Bore holes in stem"],
    treatment: "Apply Cartap Hydrochloride 4G @ 25kg/ha",
    organic: "Release Trichogramma parasitoids @ 1 lakh/ha at weekly intervals",
    prevention: ["Remove stubbles after harvest", "Use light traps (1 per acre)", "Maintain field hygiene"],
    image: "🐛",
  },
  {
    name: "Aphids",
    crops: ["Wheat", "Mustard", "Vegetables"],
    symptoms: ["Curling of leaves", "Honeydew on leaves", "Stunted growth"],
    treatment: "Spray Imidacloprid 17.8 SL @ 0.5ml/litre",
    organic: "Spray neem seed kernel extract (5%) at 10-day intervals",
    prevention: ["Encourage ladybird beetles", "Avoid excess nitrogen", "Use yellow sticky traps (20 per acre)"],
    image: "🪲",
  },
  {
    name: "Bollworm",
    crops: ["Cotton", "Chickpea", "Tomato"],
    symptoms: ["Bore holes in bolls/fruits", "Frass on plant surface", "Shedding of squares"],
    treatment: "Spray Emamectin Benzoate 5% SG @ 0.4g/litre",
    organic: "Use NPV (Nuclear Polyhedrosis Virus) spray @ 250 LE/ha",
    prevention: ["Install pheromone traps (5 per acre)", "Grow trap crops like marigold", "Destroy crop residues after harvest"],
    image: "🦗",
  },
  {
    name: "Whitefly",
    crops: ["Cotton", "Vegetables", "Soybean"],
    symptoms: ["Yellowing of leaves", "Sooty mold", "Leaf curling"],
    treatment: "Spray Spiromesifen 22.9 SC @ 0.5ml/litre",
    organic: "Yellow sticky traps (20/acre) + neem oil spray (3ml/litre)",
    prevention: ["Remove weed hosts", "Avoid continuous cropping", "Use reflective silver mulch"],
    image: "🪰",
  },
];
