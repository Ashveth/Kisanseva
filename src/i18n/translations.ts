export type Language = "en" | "hi" | "ta";

export interface Translations {
  // Common
  appName: string;
  loading: string;
  save: string;
  saving: string;
  cancel: string;
  tryAgain: string;
  signIn: string;
  signUp: string;
  signOut: string;
  email: string;
  password: string;
  fullName: string;
  pleaseWait: string;

  // Auth
  welcomeBack: string;
  joinFarmers: string;
  createAccount: string;
  noAccount: string;
  haveAccount: string;

  // Nav
  navHome: string;
  navCrops: string;
  navDetect: string;
  navWeather: string;
  navMarket: string;
  navGuide: string;
  navAskAI: string;
  navDashboard: string;
  navCropAdvisor: string;
  navDiseaseDetect: string;
  navKnowledge: string;
  navAIAssistant: string;

  // Dashboard
  heroSubtitle: string;
  temperature: string;
  humidity: string;
  wind: string;
  rainChance: string;
  quickActions: string;
  fiveDayForecast: string;
  cropAdvisorDesc: string;
  scanPlantDesc: string;
  weatherDesc: string;
  marketPricesDesc: string;
  pestGuideDesc: string;
  askAIDesc: string;
  cropAdvisor: string;
  scanPlant: string;
  weather: string;
  marketPrices: string;
  pestGuide: string;
  askAI: string;

  // Weather
  weatherIntelligence: string;
  currentConditions: string;
  live: string;
  uvIndex: string;
  rain: string;
  weatherAlerts: string;
  farmingAdvisory: string;
  irrigationReduceRain: string;
  irrigationNormal: string;
  sprayingBeforeRain: string;
  sprayingGood: string;
  heatProtect: string;
  coldCover: string;
  tempFavorable: string;
  windSecure: string;
  sowingGood: string;
  locationDenied: string;
  failedLoadWeather: string;

  // Crop Advisor
  enterSoilData: string;
  soilNutrients: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  soilPh: string;
  rainfall: string;
  location: string;
  enterLocation: string;
  getCropRecommendations: string;
  topRecommendedCrops: string;
  cultivationTips: string;
  match: string;
  yield: string;
  season: string;
  waterNeed: string;

  // Disease Detection
  plantDiseaseDetection: string;
  uploadLeafImage: string;
  captureOrUpload: string;
  takePhotoLeaf: string;
  tipsTitle: string;
  tipFocus: string;
  tipLighting: string;
  tipSteady: string;
  tipBothParts: string;
  analyzeImage: string;
  analyzing: string;
  detected: string;
  severity: string;
  crop: string;
  confidence: string;
  treatment: string;
  chemicalTreatment: string;
  organicAlternative: string;
  preventionTips: string;
  scanAnother: string;

  // Market
  marketIntelligence: string;
  pricePerQuintal: string;
  priceTrend12Months: string;
  marketInsights: string;
  bestTimeToSell: string;
  peakPrice: string;
  priceForecast: string;
  continueRising: string;
  stabilize: string;

  // Knowledge Base
  pestTreatmentGuide: string;
  searchPestsGuide: string;
  searchPestsCrops: string;
  symptoms: string;
  prevention: string;

  // Yield Predictor
  yieldPredictor: string;
  predictYieldDesc: string;
  cropType: string;
  selectCrop: string;
  fertilizerUsed: string;
  selectFertilizer: string;
  predictYield: string;
  estimatedYield: string;
  tonsPerAcre: string;
  harvestPeriod: string;
  productivityInsights: string;

  // AI Chat
  aiFarmingAssistant: string;
  askAnythingFarming: string;
  poweredByAI: string;
  chatPlaceholder: string;
  tryAsking: string;
  quickQ1: string;
  quickQ2: string;
  quickQ3: string;
  quickQ4: string;
  quickQ5: string;
  chatWelcome: string;
  chatError: string;

  // Profile
  myProfile: string;
  basicInfo: string;
  phone: string;
  farmDetails: string;
  farmSize: string;
  farmSizePlaceholder: string;
  soilType: string;
  cropsGrown: string;
  cropsGrownPlaceholder: string;
  irrigationMethod: string;
  preferredLanguage: string;
  farmingExperience: string;
  saveProfile: string;
  profileSaved: string;
  profileSaveFailed: string;

  // Language names
  langEnglish: string;
  langHindi: string;
  langTamil: string;

  // Notifications
  notifications: string;
  unreadNotifications: string;
  markAllRead: string;
  allNotifications: string;
  noNotifications: string;
  noNotificationsDesc: string;
  generateSampleAlerts: string;
  navNotifications: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "FarmWise AI",
    loading: "Loading...",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    tryAgain: "Try again",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    pleaseWait: "Please wait...",

    welcomeBack: "Welcome back, farmer!",
    joinFarmers: "Join thousands of smart farmers",
    createAccount: "Create Account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",

    navHome: "Home",
    navCrops: "Crops",
    navDetect: "Detect",
    navWeather: "Weather",
    navMarket: "Market",
    navGuide: "Guide",
    navAskAI: "Ask AI",
    navDashboard: "Dashboard",
    navCropAdvisor: "Crop Advisor",
    navDiseaseDetect: "Disease Detect",
    navKnowledge: "Knowledge Base",
    navAIAssistant: "AI Assistant",

    heroSubtitle: "Smart farming decisions powered by AI. Get crop recommendations, detect diseases, and track market prices.",
    temperature: "Temperature",
    humidity: "Humidity",
    wind: "Wind",
    rainChance: "Rain Chance",
    quickActions: "Quick Actions",
    fiveDayForecast: "5-Day Forecast",
    cropAdvisorDesc: "Get crop recommendations",
    scanPlantDesc: "Detect diseases instantly",
    weatherDesc: "Check forecasts",
    marketPricesDesc: "Price trends & forecasts",
    pestGuideDesc: "Treatment knowledge",
    askAIDesc: "Chat with farming AI",
    cropAdvisor: "Crop Advisor",
    scanPlant: "Scan Plant",
    weather: "Weather",
    marketPrices: "Market Prices",
    pestGuide: "Pest Guide",
    askAI: "Ask AI",

    weatherIntelligence: "Weather Intelligence",
    currentConditions: "Current Conditions",
    live: "Live",
    uvIndex: "UV Index",
    rain: "Rain",
    weatherAlerts: "⚠️ Weather Alerts",
    farmingAdvisory: "🌾 Farming Advisory",
    irrigationReduceRain: "Reduce watering — rain expected soon",
    irrigationNormal: "Normal watering schedule recommended",
    sprayingBeforeRain: "Complete pesticide application before rain arrives",
    sprayingGood: "Good conditions for pesticide application",
    heatProtect: "Provide shade for sensitive crops and increase watering",
    coldCover: "Cover frost-sensitive crops overnight",
    tempFavorable: "Favorable growing conditions",
    windSecure: "Secure structures and avoid spraying",
    sowingGood: "Good conditions for field activities",
    locationDenied: "Location access denied — using default location",
    failedLoadWeather: "Failed to load weather data",

    enterSoilData: "Enter your soil and weather data to get crop recommendations",
    soilNutrients: "Soil Nutrients",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    soilPh: "Soil pH",
    rainfall: "Rainfall",
    location: "Location",
    enterLocation: "Enter your location...",
    getCropRecommendations: "Get Crop Recommendations",
    topRecommendedCrops: "🌾 Top Recommended Crops",
    cultivationTips: "Cultivation Tips:",
    match: "match",
    yield: "Yield",
    season: "Season",
    waterNeed: "Water",

    plantDiseaseDetection: "Plant Disease Detection",
    uploadLeafImage: "Upload or capture a leaf image to detect diseases",
    captureOrUpload: "Capture or Upload Photo",
    takePhotoLeaf: "Take a photo of the affected leaf",
    tipsTitle: "📌 Tips for best results:",
    tipFocus: "Focus on the affected area of the leaf",
    tipLighting: "Use good lighting, avoid shadows",
    tipSteady: "Keep the camera steady and close",
    tipBothParts: "Include both healthy and affected parts",
    analyzeImage: "Analyze Image",
    analyzing: "Analyzing...",
    detected: "Detected",
    severity: "Severity",
    crop: "Crop",
    confidence: "Confidence",
    treatment: "💊 Treatment",
    chemicalTreatment: "Chemical Treatment",
    organicAlternative: "Organic Alternative",
    preventionTips: "Prevention Tips",
    scanAnother: "Scan Another Image",

    marketIntelligence: "Market Intelligence",
    pricePerQuintal: "Price (₹/quintal)",
    priceTrend12Months: "📈 Price Trend (12 Months)",
    marketInsights: "Market Insights",
    bestTimeToSell: "Best Time to Sell",
    peakPrice: "Peak price of",
    priceForecast: "Price Forecast",
    continueRising: "continue rising",
    stabilize: "stabilize",

    pestTreatmentGuide: "Pest & Treatment Guide",
    searchPestsGuide: "Search for common pests and treatment methods",
    searchPestsCrops: "Search pests, crops...",
    symptoms: "Symptoms",
    prevention: "Prevention",

    yieldPredictor: "Yield Predictor",
    predictYieldDesc: "Predict expected crop yield based on soil and weather conditions",
    cropType: "Crop Type",
    selectCrop: "Select crop",
    fertilizerUsed: "Fertilizer Used",
    selectFertilizer: "Select fertilizer",
    predictYield: "Predict Yield",
    estimatedYield: "Estimated Yield",
    tonsPerAcre: "tons/acre",
    harvestPeriod: "Harvest Period",
    productivityInsights: "📊 Productivity Insights",

    aiFarmingAssistant: "AI Farming Assistant",
    askAnythingFarming: "Ask anything about farming",
    poweredByAI: "Powered by AI • Ask anything about farming",
    chatPlaceholder: "Ask about crops, weather, diseases...",
    tryAsking: "Try asking:",
    quickQ1: "Which crop should I grow this season?",
    quickQ2: "How to treat leaf spots?",
    quickQ3: "Will it rain tomorrow?",
    quickQ4: "Best fertilizer for wheat?",
    quickQ5: "When to harvest rice?",
    chatWelcome: "Hello! 👋 I'm your AI Farming Assistant. Ask me anything about crops, diseases, weather, or farming tips! 🌾",
    chatError: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🌾",

    myProfile: "My Profile",
    basicInfo: "👤 Basic Information",
    phone: "Phone",
    farmDetails: "🌾 Farm Details",
    farmSize: "Farm Size",
    farmSizePlaceholder: "Farm Size (e.g., 5 acres)",
    soilType: "Soil Type",
    cropsGrown: "Crops grown",
    cropsGrownPlaceholder: "Crops grown (comma separated)",
    irrigationMethod: "Irrigation Method",
    preferredLanguage: "Language",
    farmingExperience: "Farming Experience",
    saveProfile: "Save Profile",
    profileSaved: "Profile saved! 🌾",
    profileSaveFailed: "Failed to save profile",

    langEnglish: "English",
    langHindi: "हिंदी (Hindi)",
    langTamil: "தமிழ் (Tamil)",

    notifications: "Notifications",
    unreadNotifications: "unread",
    markAllRead: "Mark all read",
    allNotifications: "All",
    noNotifications: "No notifications yet",
    noNotificationsDesc: "You'll receive weather alerts, market updates, and disease warnings here.",
    generateSampleAlerts: "Generate Sample Alerts",
    navNotifications: "Alerts",
  },

  hi: {
    appName: "FarmWise AI",
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    saving: "सहेज रहे हैं...",
    cancel: "रद्द करें",
    tryAgain: "पुनः प्रयास करें",
    signIn: "साइन इन करें",
    signUp: "साइन अप करें",
    signOut: "साइन आउट",
    email: "ईमेल",
    password: "पासवर्ड",
    fullName: "पूरा नाम",
    pleaseWait: "कृपया प्रतीक्षा करें...",

    welcomeBack: "वापस आपका स्वागत है, किसान!",
    joinFarmers: "हज़ारों स्मार्ट किसानों से जुड़ें",
    createAccount: "खाता बनाएं",
    noAccount: "खाता नहीं है?",
    haveAccount: "पहले से खाता है?",

    navHome: "होम",
    navCrops: "फसलें",
    navDetect: "पहचान",
    navWeather: "मौसम",
    navMarket: "बाज़ार",
    navGuide: "गाइड",
    navAskAI: "AI से पूछें",
    navDashboard: "डैशबोर्ड",
    navCropAdvisor: "फसल सलाहकार",
    navDiseaseDetect: "रोग पहचान",
    navKnowledge: "ज्ञान कोश",
    navAIAssistant: "AI सहायक",

    heroSubtitle: "AI द्वारा संचालित स्मार्ट खेती के निर्णय। फसल सिफारिशें, रोग पहचान और बाज़ार मूल्य ट्रैक करें।",
    temperature: "तापमान",
    humidity: "नमी",
    wind: "हवा",
    rainChance: "बारिश की संभावना",
    quickActions: "त्वरित कार्य",
    fiveDayForecast: "5-दिन का पूर्वानुमान",
    cropAdvisorDesc: "फसल सिफारिशें पाएं",
    scanPlantDesc: "तुरंत रोग पहचानें",
    weatherDesc: "पूर्वानुमान देखें",
    marketPricesDesc: "मूल्य रुझान और पूर्वानुमान",
    pestGuideDesc: "उपचार ज्ञान",
    askAIDesc: "खेती AI से बातचीत",
    cropAdvisor: "फसल सलाहकार",
    scanPlant: "पौधा स्कैन",
    weather: "मौसम",
    marketPrices: "बाज़ार मूल्य",
    pestGuide: "कीट गाइड",
    askAI: "AI से पूछें",

    weatherIntelligence: "मौसम बुद्धिमत्ता",
    currentConditions: "वर्तमान स्थिति",
    live: "लाइव",
    uvIndex: "UV सूचकांक",
    rain: "बारिश",
    weatherAlerts: "⚠️ मौसम चेतावनी",
    farmingAdvisory: "🌾 खेती सलाह",
    irrigationReduceRain: "सिंचाई कम करें — जल्द बारिश की उम्मीद",
    irrigationNormal: "सामान्य सिंचाई अनुसूची अनुशंसित",
    sprayingBeforeRain: "बारिश से पहले कीटनाशक छिड़काव पूरा करें",
    sprayingGood: "कीटनाशक छिड़काव के लिए अच्छी स्थिति",
    heatProtect: "संवेदनशील फसलों को छाया दें और सिंचाई बढ़ाएं",
    coldCover: "ठंड-संवेदनशील फसलों को रात में ढकें",
    tempFavorable: "विकास के लिए अनुकूल स्थिति",
    windSecure: "संरचनाएं सुरक्षित करें और छिड़काव से बचें",
    sowingGood: "खेत के कार्यों के लिए अच्छी स्थिति",
    locationDenied: "स्थान पहुंच अस्वीकृत — डिफ़ॉल्ट स्थान का उपयोग",
    failedLoadWeather: "मौसम डेटा लोड करने में विफल",

    enterSoilData: "फसल सिफारिशें पाने के लिए मिट्टी और मौसम डेटा दर्ज करें",
    soilNutrients: "मिट्टी के पोषक तत्व",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फॉस्फोरस (P)",
    potassium: "पोटैशियम (K)",
    soilPh: "मिट्टी pH",
    rainfall: "वर्षा",
    location: "स्थान",
    enterLocation: "अपना स्थान दर्ज करें...",
    getCropRecommendations: "फसल सिफारिशें पाएं",
    topRecommendedCrops: "🌾 शीर्ष अनुशंसित फसलें",
    cultivationTips: "खेती के सुझाव:",
    match: "मिलान",
    yield: "उपज",
    season: "मौसम",
    waterNeed: "पानी",

    plantDiseaseDetection: "पौधा रोग पहचान",
    uploadLeafImage: "रोग पहचान के लिए पत्ती की तस्वीर अपलोड या कैप्चर करें",
    captureOrUpload: "फोटो कैप्चर या अपलोड करें",
    takePhotoLeaf: "प्रभावित पत्ती की तस्वीर लें",
    tipsTitle: "📌 सर्वोत्तम परिणाम के लिए सुझाव:",
    tipFocus: "पत्ती के प्रभावित क्षेत्र पर ध्यान दें",
    tipLighting: "अच्छी रोशनी का उपयोग करें, छाया से बचें",
    tipSteady: "कैमरा स्थिर और पास रखें",
    tipBothParts: "स्वस्थ और प्रभावित दोनों भागों को शामिल करें",
    analyzeImage: "छवि का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    detected: "पहचाना गया",
    severity: "गंभीरता",
    crop: "फसल",
    confidence: "विश्वास",
    treatment: "💊 उपचार",
    chemicalTreatment: "रासायनिक उपचार",
    organicAlternative: "जैविक विकल्प",
    preventionTips: "रोकथाम सुझाव",
    scanAnother: "दूसरी तस्वीर स्कैन करें",

    marketIntelligence: "बाज़ार बुद्धिमत्ता",
    pricePerQuintal: "मूल्य (₹/क्विंटल)",
    priceTrend12Months: "📈 मूल्य रुझान (12 महीने)",
    marketInsights: "बाज़ार अंतर्दृष्टि",
    bestTimeToSell: "बेचने का सबसे अच्छा समय",
    peakPrice: "उच्चतम मूल्य",
    priceForecast: "मूल्य पूर्वानुमान",
    continueRising: "बढ़ना जारी",
    stabilize: "स्थिर होना",

    pestTreatmentGuide: "कीट और उपचार गाइड",
    searchPestsGuide: "सामान्य कीटों और उपचार विधियों को खोजें",
    searchPestsCrops: "कीट, फसलें खोजें...",
    symptoms: "लक्षण",
    prevention: "रोकथाम",

    yieldPredictor: "उपज भविष्यवक्ता",
    predictYieldDesc: "मिट्टी और मौसम स्थितियों के आधार पर अपेक्षित फसल उपज की भविष्यवाणी करें",
    cropType: "फसल का प्रकार",
    selectCrop: "फसल चुनें",
    fertilizerUsed: "उपयोग किया गया उर्वरक",
    selectFertilizer: "उर्वरक चुनें",
    predictYield: "उपज की भविष्यवाणी करें",
    estimatedYield: "अनुमानित उपज",
    tonsPerAcre: "टन/एकड़",
    harvestPeriod: "कटाई अवधि",
    productivityInsights: "📊 उत्पादकता अंतर्दृष्टि",

    aiFarmingAssistant: "AI खेती सहायक",
    askAnythingFarming: "खेती के बारे में कुछ भी पूछें",
    poweredByAI: "AI संचालित • खेती के बारे में कुछ भी पूछें",
    chatPlaceholder: "फसलों, मौसम, रोगों के बारे में पूछें...",
    tryAsking: "ये पूछें:",
    quickQ1: "इस मौसम में कौन सी फसल उगाऊं?",
    quickQ2: "पत्ती के धब्बों का इलाज कैसे करें?",
    quickQ3: "क्या कल बारिश होगी?",
    quickQ4: "गेहूं के लिए सबसे अच्छा उर्वरक?",
    quickQ5: "धान की कटाई कब करें?",
    chatWelcome: "नमस्ते! 👋 मैं आपका AI खेती सहायक हूं। फसलों, रोगों, मौसम या खेती के बारे में कुछ भी पूछें! 🌾",
    chatError: "क्षमा करें, अभी कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद पुनः प्रयास करें! 🌾",

    myProfile: "मेरी प्रोफ़ाइल",
    basicInfo: "👤 बुनियादी जानकारी",
    phone: "फ़ोन",
    farmDetails: "🌾 खेत का विवरण",
    farmSize: "खेत का आकार",
    farmSizePlaceholder: "खेत का आकार (जैसे, 5 एकड़)",
    soilType: "मिट्टी का प्रकार",
    cropsGrown: "उगाई जाने वाली फसलें",
    cropsGrownPlaceholder: "उगाई जाने वाली फसलें (अल्पविराम से अलग)",
    irrigationMethod: "सिंचाई विधि",
    preferredLanguage: "भाषा",
    farmingExperience: "खेती का अनुभव",
    saveProfile: "प्रोफ़ाइल सहेजें",
    profileSaved: "प्रोफ़ाइल सहेजी गई! 🌾",
    profileSaveFailed: "प्रोफ़ाइल सहेजने में विफल",

    langEnglish: "English",
    langHindi: "हिंदी (Hindi)",
    langTamil: "தமிழ் (Tamil)",

    notifications: "सूचनाएं",
    unreadNotifications: "अपठित",
    markAllRead: "सभी पढ़ें",
    allNotifications: "सभी",
    noNotifications: "अभी कोई सूचना नहीं",
    noNotificationsDesc: "आपको यहां मौसम अलर्ट, बाज़ार अपडेट और रोग चेतावनियां मिलेंगी।",
    generateSampleAlerts: "नमूना अलर्ट बनाएं",
    navNotifications: "अलर्ट",
  },

  ta: {
    appName: "FarmWise AI",
    loading: "ஏற்றுகிறது...",
    save: "சேமி",
    saving: "சேமிக்கிறது...",
    cancel: "ரத்து",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    signIn: "உள்நுழைக",
    signUp: "பதிவு செய்க",
    signOut: "வெளியேறு",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    fullName: "முழு பெயர்",
    pleaseWait: "காத்திருக்கவும்...",

    welcomeBack: "மீண்டும் வரவேற்கிறோம், விவசாயி!",
    joinFarmers: "ஆயிரக்கணக்கான ஸ்மார்ட் விவசாயிகளுடன் இணையுங்கள்",
    createAccount: "கணக்கை உருவாக்கு",
    noAccount: "கணக்கு இல்லையா?",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",

    navHome: "முகப்பு",
    navCrops: "பயிர்கள்",
    navDetect: "கண்டறிதல்",
    navWeather: "வானிலை",
    navMarket: "சந்தை",
    navGuide: "வழிகாட்டி",
    navAskAI: "AI கேளுங்கள்",
    navDashboard: "டாஷ்போர்டு",
    navCropAdvisor: "பயிர் ஆலோசகர்",
    navDiseaseDetect: "நோய் கண்டறிதல்",
    navKnowledge: "அறிவுத் தளம்",
    navAIAssistant: "AI உதவியாளர்",

    heroSubtitle: "AI மூலம் ஸ்மார்ட் விவசாய முடிவுகள். பயிர் பரிந்துரைகள், நோய் கண்டறிதல் மற்றும் சந்தை விலைகளை கண்காணிக்கவும்.",
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    wind: "காற்று",
    rainChance: "மழை வாய்ப்பு",
    quickActions: "விரைவு செயல்கள்",
    fiveDayForecast: "5-நாள் முன்னறிவிப்பு",
    cropAdvisorDesc: "பயிர் பரிந்துரைகள் பெறுங்கள்",
    scanPlantDesc: "உடனடியாக நோய்களைக் கண்டறியுங்கள்",
    weatherDesc: "முன்னறிவிப்புகளைப் பாருங்கள்",
    marketPricesDesc: "விலை போக்குகள் & முன்னறிவிப்புகள்",
    pestGuideDesc: "சிகிச்சை அறிவு",
    askAIDesc: "விவசாய AI உடன் அரட்டை",
    cropAdvisor: "பயிர் ஆலோசகர்",
    scanPlant: "செடி ஸ்கேன்",
    weather: "வானிலை",
    marketPrices: "சந்தை விலைகள்",
    pestGuide: "பூச்சி வழிகாட்டி",
    askAI: "AI கேளுங்கள்",

    weatherIntelligence: "வானிலை புத்திசாலித்தனம்",
    currentConditions: "தற்போதைய நிலை",
    live: "நேரடி",
    uvIndex: "UV குறியீடு",
    rain: "மழை",
    weatherAlerts: "⚠️ வானிலை எச்சரிக்கைகள்",
    farmingAdvisory: "🌾 விவசாய ஆலோசனை",
    irrigationReduceRain: "நீர்ப்பாசனம் குறைக்கவும் — விரைவில் மழை எதிர்பார்க்கப்படுகிறது",
    irrigationNormal: "வழக்கமான நீர்ப்பாசன அட்டவணை பரிந்துரைக்கப்படுகிறது",
    sprayingBeforeRain: "மழை வருவதற்கு முன் பூச்சிக்கொல்லி தெளிப்பை முடிக்கவும்",
    sprayingGood: "பூச்சிக்கொல்லி தெளிப்புக்கு நல்ல நிலை",
    heatProtect: "உணர்திறன் பயிர்களுக்கு நிழல் கொடுங்கள் மற்றும் நீர்ப்பாசனம் அதிகரிக்கவும்",
    coldCover: "குளிர்-உணர்திறன் பயிர்களை இரவில் மூடவும்",
    tempFavorable: "வளர்ச்சிக்கு சாதகமான நிலை",
    windSecure: "கட்டமைப்புகளை பாதுகாக்கவும் மற்றும் தெளிப்பு தவிர்க்கவும்",
    sowingGood: "வயல் வேலைகளுக்கு நல்ல நிலை",
    locationDenied: "இருப்பிட அணுகல் மறுக்கப்பட்டது — இயல்புநிலை இருப்பிடத்தைப் பயன்படுத்துகிறது",
    failedLoadWeather: "வானிலை தரவை ஏற்ற இயலவில்லை",

    enterSoilData: "பயிர் பரிந்துரைகள் பெற மண் மற்றும் வானிலை தரவை உள்ளிடவும்",
    soilNutrients: "மண் ஊட்டச்சத்துக்கள்",
    nitrogen: "நைட்ரஜன் (N)",
    phosphorus: "பாஸ்பரஸ் (P)",
    potassium: "பொட்டாசியம் (K)",
    soilPh: "மண் pH",
    rainfall: "மழைப்பொழிவு",
    location: "இருப்பிடம்",
    enterLocation: "உங்கள் இருப்பிடத்தை உள்ளிடவும்...",
    getCropRecommendations: "பயிர் பரிந்துரைகள் பெறுங்கள்",
    topRecommendedCrops: "🌾 சிறந்த பரிந்துரைக்கப்பட்ட பயிர்கள்",
    cultivationTips: "விவசாய உதவிக்குறிப்புகள்:",
    match: "பொருத்தம்",
    yield: "மகசூல்",
    season: "பருவம்",
    waterNeed: "நீர்",

    plantDiseaseDetection: "செடி நோய் கண்டறிதல்",
    uploadLeafImage: "நோய்களைக் கண்டறிய இலை படத்தை பதிவேற்றவும் அல்லது எடுக்கவும்",
    captureOrUpload: "புகைப்படம் எடுக்கவும் அல்லது பதிவேற்றவும்",
    takePhotoLeaf: "பாதிக்கப்பட்ட இலையின் புகைப்படம் எடுக்கவும்",
    tipsTitle: "📌 சிறந்த முடிவுகளுக்கான உதவிக்குறிப்புகள்:",
    tipFocus: "இலையின் பாதிக்கப்பட்ட பகுதியில் கவனம் செலுத்துங்கள்",
    tipLighting: "நல்ல ஒளியைப் பயன்படுத்துங்கள், நிழல்களைத் தவிர்க்கவும்",
    tipSteady: "கேமராவை நிலையாகவும் அருகிலும் வைக்கவும்",
    tipBothParts: "ஆரோக்கியமான மற்றும் பாதிக்கப்பட்ட இரு பகுதிகளையும் சேர்க்கவும்",
    analyzeImage: "படத்தை பகுப்பாய்வு செய்",
    analyzing: "பகுப்பாய்வு செய்கிறது...",
    detected: "கண்டறியப்பட்டது",
    severity: "தீவிரம்",
    crop: "பயிர்",
    confidence: "நம்பிக்கை",
    treatment: "💊 சிகிச்சை",
    chemicalTreatment: "இரசாயன சிகிச்சை",
    organicAlternative: "இயற்கை மாற்று",
    preventionTips: "தடுப்பு குறிப்புகள்",
    scanAnother: "மற்றொரு படத்தை ஸ்கேன் செய்",

    marketIntelligence: "சந்தை புத்திசாலித்தனம்",
    pricePerQuintal: "விலை (₹/குவிண்டால்)",
    priceTrend12Months: "📈 விலை போக்கு (12 மாதங்கள்)",
    marketInsights: "சந்தை நுண்ணறிவு",
    bestTimeToSell: "விற்க சிறந்த நேரம்",
    peakPrice: "உச்ச விலை",
    priceForecast: "விலை முன்னறிவிப்பு",
    continueRising: "தொடர்ந்து உயரும்",
    stabilize: "நிலைப்படும்",

    pestTreatmentGuide: "பூச்சி & சிகிச்சை வழிகாட்டி",
    searchPestsGuide: "பொதுவான பூச்சிகள் மற்றும் சிகிச்சை முறைகளைத் தேடுங்கள்",
    searchPestsCrops: "பூச்சிகள், பயிர்களைத் தேடுங்கள்...",
    symptoms: "அறிகுறிகள்",
    prevention: "தடுப்பு",

    yieldPredictor: "மகசூல் கணிப்பான்",
    predictYieldDesc: "மண் மற்றும் வானிலை நிலைமைகளின் அடிப்படையில் எதிர்பார்க்கப்படும் பயிர் மகசூலை கணிக்கவும்",
    cropType: "பயிர் வகை",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    fertilizerUsed: "பயன்படுத்திய உரம்",
    selectFertilizer: "உரத்தைத் தேர்ந்தெடுக்கவும்",
    predictYield: "மகசூலை கணிக்கவும்",
    estimatedYield: "மதிப்பிடப்பட்ட மகசூல்",
    tonsPerAcre: "டன்/ஏக்கர்",
    harvestPeriod: "அறுவடை காலம்",
    productivityInsights: "📊 உற்பத்தித்திறன் நுண்ணறிவு",

    aiFarmingAssistant: "AI விவசாய உதவியாளர்",
    askAnythingFarming: "விவசாயம் பற்றி எதையும் கேளுங்கள்",
    poweredByAI: "AI இயக்கம் • விவசாயம் பற்றி எதையும் கேளுங்கள்",
    chatPlaceholder: "பயிர்கள், வானிலை, நோய்கள் பற்றி கேளுங்கள்...",
    tryAsking: "இவற்றைக் கேளுங்கள்:",
    quickQ1: "இந்த பருவத்தில் என்ன பயிர் வளர்க்க வேண்டும்?",
    quickQ2: "இலை புள்ளிகளுக்கு சிகிச்சை எப்படி?",
    quickQ3: "நாளை மழை பெய்யுமா?",
    quickQ4: "கோதுமைக்கு சிறந்த உரம்?",
    quickQ5: "நெல் எப்போது அறுவடை செய்ய வேண்டும்?",
    chatWelcome: "வணக்கம்! 👋 நான் உங்கள் AI விவசாய உதவியாளர். பயிர்கள், நோய்கள், வானிலை அல்லது விவசாய குறிப்புகள் பற்றி எதையும் கேளுங்கள்! 🌾",
    chatError: "மன்னிக்கவும், தற்போது இணைப்பதில் சிக்கல் உள்ளது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்! 🌾",

    myProfile: "எனது சுயவிவரம்",
    basicInfo: "👤 அடிப்படை தகவல்",
    phone: "தொலைபேசி",
    farmDetails: "🌾 பண்ணை விவரங்கள்",
    farmSize: "பண்ணை அளவு",
    farmSizePlaceholder: "பண்ணை அளவு (எ.கா., 5 ஏக்கர்)",
    soilType: "மண் வகை",
    cropsGrown: "வளர்க்கும் பயிர்கள்",
    cropsGrownPlaceholder: "வளர்க்கும் பயிர்கள் (கமாவால் பிரிக்கவும்)",
    irrigationMethod: "நீர்ப்பாசன முறை",
    preferredLanguage: "மொழி",
    farmingExperience: "விவசாய அனுபவம்",
    saveProfile: "சுயவிவரத்தை சேமி",
    profileSaved: "சுயவிவரம் சேமிக்கப்பட்டது! 🌾",
    profileSaveFailed: "சுயவிவரத்தை சேமிக்க இயலவில்லை",

    langEnglish: "English",
    langHindi: "हिंदी (Hindi)",
    langTamil: "தமிழ் (Tamil)",

    notifications: "அறிவிப்புகள்",
    unreadNotifications: "படிக்காதவை",
    markAllRead: "அனைத்தையும் படி",
    allNotifications: "அனைத்தும்",
    noNotifications: "இன்னும் அறிவிப்புகள் இல்லை",
    noNotificationsDesc: "வானிலை எச்சரிக்கைகள், சந்தை புதுப்பிப்புகள் மற்றும் நோய் எச்சரிக்கைகள் இங்கே கிடைக்கும்.",
    generateSampleAlerts: "மாதிரி அலர்ட்கள் உருவாக்கு",
    navNotifications: "அலர்ட்",
  },
};
