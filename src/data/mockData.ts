export const cropRecommendations = [
  {
    name: "Rice",
    yield: "4.5 tons/acre",
    confidence: 92,
    tips: ["Maintain water level at 5-7cm during growing", "Apply nitrogen fertilizer in 3 splits", "Best sowing: June-July"],
    season: "Kharif",
    waterNeed: "High",
  },
  {
    name: "Wheat",
    yield: "3.2 tons/acre",
    confidence: 87,
    tips: ["Sow in rows 20cm apart", "First irrigation at 21 days", "Harvest when grain is hard"],
    season: "Rabi",
    waterNeed: "Medium",
  },
  {
    name: "Maize",
    yield: "3.8 tons/acre",
    confidence: 81,
    tips: ["Plant spacing: 60x20cm", "Apply zinc sulfate if deficient", "Harvest at 20-25% moisture"],
    season: "Kharif/Rabi",
    waterNeed: "Medium",
  },
];

export const diseases = [
  {
    name: "Leaf Blight",
    crop: "Rice",
    confidence: 94,
    severity: "High",
    treatment: "Apply Mancozeb 75% WP @ 2.5g/litre",
    organic: "Spray neem oil solution (5ml/litre)",
    prevention: ["Use resistant varieties", "Avoid excess nitrogen", "Ensure proper spacing"],
  },
  {
    name: "Powdery Mildew",
    crop: "Wheat",
    confidence: 89,
    severity: "Medium",
    treatment: "Spray Karathane 40EC @ 1ml/litre",
    organic: "Apply milk spray (1:9 ratio with water)",
    prevention: ["Improve air circulation", "Avoid overhead irrigation", "Remove infected leaves"],
  },
];

export const marketPrices = [
  { month: "Jan", rice: 2100, wheat: 2200, maize: 1800, cotton: 5500 },
  { month: "Feb", rice: 2050, wheat: 2250, maize: 1750, cotton: 5600 },
  { month: "Mar", rice: 2200, wheat: 2100, maize: 1900, cotton: 5400 },
  { month: "Apr", rice: 2300, wheat: 2000, maize: 2000, cotton: 5300 },
  { month: "May", rice: 2250, wheat: 1950, maize: 1850, cotton: 5700 },
  { month: "Jun", rice: 2400, wheat: 2050, maize: 1950, cotton: 5800 },
  { month: "Jul", rice: 2500, wheat: 2100, maize: 2050, cotton: 5900 },
  { month: "Aug", rice: 2450, wheat: 2150, maize: 2100, cotton: 6000 },
  { month: "Sep", rice: 2350, wheat: 2200, maize: 1900, cotton: 6100 },
  { month: "Oct", rice: 2300, wheat: 2300, maize: 1850, cotton: 6200 },
  { month: "Nov", rice: 2200, wheat: 2400, maize: 1800, cotton: 6000 },
  { month: "Dec", rice: 2150, wheat: 2350, maize: 1750, cotton: 5800 },
];

export const weatherData = {
  current: {
    temp: 28,
    humidity: 65,
    windSpeed: 12,
    rainChance: 40,
    condition: "Partly Cloudy",
    uv: 6,
  },
  alerts: [
    { type: "rain", message: "Heavy rainfall expected in next 48 hours", severity: "warning" as const },
    { type: "heat", message: "Temperature may rise above 38°C this weekend", severity: "info" as const },
  ],
  forecast: [
    { day: "Today", high: 32, low: 24, rain: 40, icon: "⛅" },
    { day: "Tomorrow", high: 30, low: 23, rain: 70, icon: "🌧️" },
    { day: "Wed", high: 28, low: 22, rain: 80, icon: "🌧️" },
    { day: "Thu", high: 31, low: 24, rain: 20, icon: "☀️" },
    { day: "Fri", high: 33, low: 25, rain: 10, icon: "☀️" },
  ],
};

export const pests = [
  {
    name: "Stem Borer",
    crops: ["Rice", "Maize"],
    symptoms: ["Dead heart in young plants", "White ear heads", "Bore holes in stem"],
    treatment: "Apply Cartap Hydrochloride 4G @ 25kg/ha",
    organic: "Release Trichogramma parasitoids",
    prevention: ["Remove stubbles after harvest", "Use light traps", "Maintain field hygiene"],
    image: "🐛",
  },
  {
    name: "Aphids",
    crops: ["Wheat", "Mustard", "Vegetables"],
    symptoms: ["Curling of leaves", "Honeydew on leaves", "Stunted growth"],
    treatment: "Spray Imidacloprid 17.8 SL @ 0.5ml/litre",
    organic: "Spray neem seed kernel extract (5%)",
    prevention: ["Encourage ladybird beetles", "Avoid excess nitrogen", "Use yellow sticky traps"],
    image: "🪲",
  },
  {
    name: "Bollworm",
    crops: ["Cotton", "Chickpea", "Tomato"],
    symptoms: ["Bore holes in bolls/fruits", "Frass on plant surface", "Shedding of squares"],
    treatment: "Spray Emamectin Benzoate 5% SG @ 0.4g/litre",
    organic: "Use NPV (Nuclear Polyhedrosis Virus) spray",
    prevention: ["Install pheromone traps", "Grow trap crops like marigold", "Destroy crop residues"],
    image: "🦗",
  },
  {
    name: "Whitefly",
    crops: ["Cotton", "Vegetables", "Soybean"],
    symptoms: ["Yellowing of leaves", "Sooty mold", "Leaf curling"],
    treatment: "Spray Spiromesifen 22.9 SC @ 0.5ml/litre",
    organic: "Yellow sticky traps + neem oil spray",
    prevention: ["Remove weed hosts", "Avoid continuous cropping", "Use reflective mulch"],
    image: "🪰",
  },
];

export const yieldFactors = {
  crops: ["Rice", "Wheat", "Maize", "Cotton", "Soybean", "Groundnut", "Sugarcane"],
  fertilizers: ["Urea", "DAP", "MOP", "NPK Complex", "Organic Compost"],
};
