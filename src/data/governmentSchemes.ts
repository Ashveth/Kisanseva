export interface SchemeStep {
  step: number;
  title: string;
  description: string;
}

export interface Scheme {
  id: string;
  name: string;
  hindiName?: string;
  ministry: string;
  category: string;
  level: "Central" | "State";
  state?: string;
  eligibility: string[];
  benefits: string[];
  description: string;
  website?: string;
  keyAmount?: string;
  icon: string;
  documents: string[];
  howToApply: SchemeStep[];
}

export const allSchemes: Scheme[] = [
  // ── Central Schemes ──
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    hindiName: "प्रधानमंत्री किसान सम्मान निधि",
    ministry: "Ministry of Agriculture",
    category: "Income Support",
    level: "Central",
    keyAmount: "₹6,000/year",
    icon: "💰",
    description: "Direct income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments of ₹2,000 every four months.",
    eligibility: [
      "All landholding farmer families",
      "Must have cultivable landholding",
      "Aadhaar card mandatory",
      "Bank account linked with Aadhaar",
    ],
    benefits: [
      "₹6,000 per year in 3 installments of ₹2,000",
      "Direct bank transfer (DBT)",
      "No middlemen involved",
      "Covers all crops and seasons",
    ],
    documents: ["Aadhaar Card", "Land ownership records", "Bank passbook (Aadhaar-linked)", "Mobile number"],
    howToApply: [
      { step: 1, title: "Visit Portal or CSC", description: "Go to pmkisan.gov.in or your nearest Common Service Centre (CSC)" },
      { step: 2, title: "New Registration", description: "Click 'New Farmer Registration' and enter Aadhaar number" },
      { step: 3, title: "Fill Details", description: "Enter personal, land, and bank details as per records" },
      { step: 4, title: "Submit & Verify", description: "Submit the form. Verification is done by state/district officials" },
    ],
    website: "https://pmkisan.gov.in",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana (PMFBY)",
    hindiName: "प्रधानमंत्री फसल बीमा योजना",
    ministry: "Ministry of Agriculture",
    category: "Crop Insurance",
    level: "Central",
    keyAmount: "1.5-5% premium",
    icon: "🛡️",
    description: "Comprehensive crop insurance providing financial support for crop loss due to natural calamities, pests, and diseases.",
    eligibility: [
      "All farmers including sharecroppers & tenant farmers",
      "Mandatory for loanee farmers",
      "Voluntary for non-loanee farmers",
      "Crops notified by state government",
    ],
    benefits: [
      "Premium: 2% Kharif, 1.5% Rabi, 5% commercial crops",
      "Full insured amount coverage",
      "Smart technology for faster claims",
      "Covers pre-sowing to post-harvest losses",
    ],
    documents: ["Aadhaar Card", "Land records / tenancy agreement", "Bank account details", "Sowing certificate from Patwari"],
    howToApply: [
      { step: 1, title: "Visit Bank or CSC", description: "Go to your bank branch, CSC, or pmfby.gov.in" },
      { step: 2, title: "Select Crop & Season", description: "Choose the crop and season you want insured" },
      { step: 3, title: "Submit Documents", description: "Provide land records, Aadhaar, and bank details" },
      { step: 4, title: "Pay Premium", description: "Pay the subsidized premium (2% Kharif / 1.5% Rabi)" },
    ],
    website: "https://pmfby.gov.in",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    hindiName: "किसान क्रेडिट कार्ड",
    ministry: "Ministry of Finance",
    category: "Credit & Loans",
    level: "Central",
    keyAmount: "Up to ₹3 lakh",
    icon: "💳",
    description: "Affordable short-term credit for cultivation, post-harvest expenses, and farm asset maintenance at subsidized interest rates.",
    eligibility: [
      "All farmers – individual or joint borrowers",
      "Tenant farmers, sharecroppers, oral lessees",
      "Self-help groups or joint liability groups",
      "Fishermen and animal husbandry farmers also eligible",
    ],
    benefits: [
      "Credit up to ₹3 lakh at 4% interest (with subsidy)",
      "Flexible repayment options",
      "Coverage for cultivation & allied activities",
      "Personal accident insurance up to ₹50,000",
    ],
    documents: ["Aadhaar Card", "Land ownership / tenancy proof", "Passport size photos", "Application form from bank"],
    howToApply: [
      { step: 1, title: "Visit Bank Branch", description: "Go to any nationalized bank, cooperative bank, or regional rural bank" },
      { step: 2, title: "Get Application Form", description: "Collect and fill the KCC application form" },
      { step: 3, title: "Submit Documents", description: "Attach land records, Aadhaar, photos, and other required documents" },
      { step: 4, title: "Bank Processing", description: "Bank verifies and issues the KCC within 14 days" },
    ],
    website: "https://www.pmkisan.gov.in",
  },
  {
    id: "soil-health",
    name: "Soil Health Card Scheme",
    hindiName: "मृदा स्वास्थ्य कार्ड योजना",
    ministry: "Ministry of Agriculture",
    category: "Soil & Fertilizer",
    level: "Central",
    keyAmount: "Free service",
    icon: "🧪",
    description: "Provides soil health cards with crop-wise nutrient and fertilizer recommendations to improve productivity.",
    eligibility: [
      "All farmers across India",
      "No minimum landholding required",
      "Available through local agriculture offices",
    ],
    benefits: [
      "Free soil testing every 2 years",
      "Crop-wise fertilizer recommendations",
      "Reduces input costs by 10-15%",
      "Improves soil health long-term",
    ],
    documents: ["Aadhaar Card", "Land details (survey number)", "Contact number"],
    howToApply: [
      { step: 1, title: "Contact Agriculture Office", description: "Visit your nearest Krishi Vigyan Kendra or agriculture office" },
      { step: 2, title: "Collect Soil Sample", description: "Officials collect soil samples from your farm (or you can submit)" },
      { step: 3, title: "Lab Testing", description: "Samples tested for 12 parameters (N, P, K, pH, etc.)" },
      { step: 4, title: "Receive Card", description: "Get your Soil Health Card with crop-wise recommendations" },
    ],
    website: "https://soilhealth.dac.gov.in",
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchai Yojana (PMKSY)",
    hindiName: "प्रधानमंत्री कृषि सिंचाई योजना",
    ministry: "Ministry of Agriculture & Jal Shakti",
    category: "Irrigation",
    level: "Central",
    keyAmount: "55-100% subsidy",
    icon: "💧",
    description: "Extends irrigation coverage and improves water use efficiency through micro irrigation like drip and sprinkler systems.",
    eligibility: [
      "All farmer categories",
      "Priority to drought-prone areas",
      "Small & marginal farmers get higher subsidy",
      "Available through state agriculture departments",
    ],
    benefits: [
      "55% subsidy for general farmers on micro irrigation",
      "100% subsidy for small & marginal farmers (some states)",
      "Drip irrigation, sprinkler systems coverage",
      "Watershed development support",
    ],
    documents: ["Aadhaar Card", "Land ownership proof", "Bank account details", "Quotation from authorized dealer"],
    howToApply: [
      { step: 1, title: "Contact Agriculture Dept", description: "Visit state agriculture department or district office" },
      { step: 2, title: "Select System", description: "Choose drip/sprinkler system and get dealer quotation" },
      { step: 3, title: "Apply Online/Offline", description: "Submit application through state portal or agriculture office" },
      { step: 4, title: "Installation & Subsidy", description: "After installation and inspection, subsidy is credited to bank" },
    ],
    website: "https://pmksy.gov.in",
  },
  {
    id: "enam",
    name: "e-NAM (National Agriculture Market)",
    hindiName: "राष्ट्रीय कृषि बाजार",
    ministry: "Ministry of Agriculture",
    category: "Market Access",
    level: "Central",
    keyAmount: "Free registration",
    icon: "🏪",
    description: "Online trading platform connecting APMC mandis across India for better price discovery through transparent bidding.",
    eligibility: [
      "All farmers with valid ID proof",
      "Traders, commission agents (FPOs)",
      "Available in e-NAM integrated mandis",
    ],
    benefits: [
      "Better price discovery through online bidding",
      "Reduced intermediaries and market fees",
      "Access to buyers across India",
      "Quality assaying at mandi level",
    ],
    documents: ["Aadhaar Card", "Bank account details", "Mobile number", "Commodity details"],
    howToApply: [
      { step: 1, title: "Visit e-NAM Portal", description: "Go to enam.gov.in and click 'Register'" },
      { step: 2, title: "Choose Mandi", description: "Select your nearest e-NAM integrated mandi" },
      { step: 3, title: "Fill Details", description: "Enter personal, bank, and commodity information" },
      { step: 4, title: "Start Trading", description: "Once approved, list your produce and accept bids" },
    ],
    website: "https://enam.gov.in",
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    hindiName: "परम्परागत कृषि विकास योजना",
    ministry: "Ministry of Agriculture",
    category: "Organic Farming",
    level: "Central",
    keyAmount: "₹50,000/ha",
    icon: "🌿",
    description: "Promotes organic farming through cluster approach with financial assistance for inputs, certification, and marketing over 3 years.",
    eligibility: [
      "Groups of 50+ farmers forming a cluster of 50 acres",
      "Farmers willing to adopt organic practices",
      "Available across all states",
    ],
    benefits: [
      "₹50,000 per hectare over 3 years",
      "Free organic certification (PGS)",
      "Training and capacity building",
      "Marketing and branding support",
    ],
    documents: ["Aadhaar Card", "Land records", "Group formation documents", "Bank account details"],
    howToApply: [
      { step: 1, title: "Form a Cluster", description: "Gather 50+ farmers with minimum 50 acres to form a cluster" },
      { step: 2, title: "Contact Agriculture Dept", description: "Approach district agriculture office or state organic mission" },
      { step: 3, title: "Submit Proposal", description: "File a cluster proposal with member details and land records" },
      { step: 4, title: "Get Certified", description: "Undergo PGS certification and receive financial support over 3 years" },
    ],
    website: "https://pgsindia-ncof.gov.in",
  },
  {
    id: "aif",
    name: "Agriculture Infrastructure Fund (AIF)",
    hindiName: "कृषि अवसंरचना कोष",
    ministry: "Ministry of Agriculture",
    category: "Infrastructure",
    level: "Central",
    keyAmount: "3% interest subvention",
    icon: "🏗️",
    description: "Medium to long-term financing for post-harvest management and community farming assets through interest subvention and credit guarantee.",
    eligibility: [
      "Farmers, FPOs, PACS, marketing cooperatives",
      "Startups, agri-entrepreneurs",
      "State agencies and APMCs",
      "Loan amount up to ₹2 crore",
    ],
    benefits: [
      "3% interest subvention on loans up to ₹2 crore",
      "Credit guarantee coverage up to ₹2 crore",
      "Moratorium period for repayment",
      "Covers warehouses, cold storage, processing units",
    ],
    documents: ["Aadhaar Card", "Business plan / project report", "Land / premises proof", "Bank account details", "Registration certificate (for FPOs)"],
    howToApply: [
      { step: 1, title: "Prepare Project Report", description: "Create a detailed project report for your infrastructure need" },
      { step: 2, title: "Apply Online", description: "Submit application on agriinfra.dac.gov.in portal" },
      { step: 3, title: "Bank Processing", description: "Nearest bank branch processes and sanctions the loan" },
      { step: 4, title: "Get Subvention", description: "3% interest subvention is applied automatically on the loan" },
    ],
    website: "https://agriinfra.dac.gov.in",
  },

  // ── State Schemes ──
  {
    id: "mh-shetkari",
    name: "Namo Shetkari Mahasanman Nidhi",
    hindiName: "नमो शेतकरी महासन्मान निधी",
    ministry: "Maharashtra Agriculture Dept",
    category: "Income Support",
    level: "State",
    state: "Maharashtra",
    keyAmount: "₹6,000/year",
    icon: "🏛️",
    description: "Maharashtra's state-level income support scheme providing additional ₹6,000/year on top of PM-KISAN, totaling ₹12,000/year for eligible farmers.",
    eligibility: ["PM-KISAN beneficiary farmers in Maharashtra", "Valid Aadhaar and land records", "Active bank account"],
    benefits: ["Additional ₹6,000/year (total ₹12,000 with PM-KISAN)", "Direct bank transfer", "No separate application needed for existing PM-KISAN beneficiaries"],
    documents: ["Aadhaar Card", "7/12 extract (land record)", "Bank passbook", "PM-KISAN registration"],
    howToApply: [
      { step: 1, title: "Ensure PM-KISAN Registration", description: "You must be a PM-KISAN beneficiary first" },
      { step: 2, title: "Verify Land Records", description: "Ensure your 7/12 extract is updated at Talathi office" },
      { step: 3, title: "Automatic Enrollment", description: "Eligible PM-KISAN farmers are auto-enrolled by the state" },
    ],
    website: "https://nsmny.mahait.org",
  },
  {
    id: "tn-uzhavar",
    name: "Tamil Nadu Uzhavar Padhukappu Thittam",
    ministry: "TN Agriculture Dept",
    category: "Crop Insurance",
    level: "State",
    state: "Tamil Nadu",
    keyAmount: "Free insurance",
    icon: "🌾",
    description: "Tamil Nadu's crop insurance scheme providing free insurance coverage to all farmers, with state government paying the full premium.",
    eligibility: ["All farmers in Tamil Nadu", "Registered with local agriculture office", "Growing notified crops"],
    benefits: ["100% premium paid by state government", "Coverage for natural calamities", "Quick claim settlement", "No cost to farmer"],
    documents: ["Aadhaar Card", "Patta / Chitta (land records)", "Bank account", "Adangal (crop sown certificate)"],
    howToApply: [
      { step: 1, title: "Visit Agriculture Office", description: "Go to your block-level agriculture office" },
      { step: 2, title: "Register Crops", description: "Register your crops and land details for the season" },
      { step: 3, title: "Automatic Coverage", description: "Insurance is applied automatically at zero cost" },
    ],
  },
  {
    id: "up-kisan-rin",
    name: "UP Kisan Rin Mochan Yojana",
    hindiName: "उत्तर प्रदेश किसान ऋण मोचन योजना",
    ministry: "UP Agriculture Dept",
    category: "Credit & Loans",
    level: "State",
    state: "Uttar Pradesh",
    keyAmount: "Up to ₹1 lakh waiver",
    icon: "📜",
    description: "Loan waiver scheme for small and marginal farmers in UP, waiving agricultural loans up to ₹1 lakh.",
    eligibility: ["Small & marginal farmers in UP", "Agricultural loan from bank/cooperative", "Loan amount up to ₹1 lakh", "Land holding up to 5 acres"],
    benefits: ["Complete loan waiver up to ₹1 lakh", "Fresh credit eligibility restored", "Relief from debt burden"],
    documents: ["Aadhaar Card", "Bank loan documents", "Khasra/Khatauni (land records)", "Bank passbook"],
    howToApply: [
      { step: 1, title: "Check Eligibility", description: "Visit upkisankarjrahat.upsdc.gov.in and check your status" },
      { step: 2, title: "Submit Application", description: "Apply online or through your bank branch" },
      { step: 3, title: "Verification", description: "District committee verifies eligibility and loan details" },
    ],
  },
  {
    id: "kar-raitha-siri",
    name: "Karnataka Raitha Siri Scheme",
    ministry: "Karnataka Agriculture Dept",
    category: "Income Support",
    level: "State",
    state: "Karnataka",
    keyAmount: "₹10,000/year",
    icon: "🌻",
    description: "Karnataka's farmer income support providing ₹10,000/year to small and marginal farmers in the state.",
    eligibility: ["Small & marginal farmers in Karnataka", "Landholding up to 5 acres", "Valid RTC (land record)", "Aadhaar-linked bank account"],
    benefits: ["₹10,000 per year direct transfer", "Covers all crop types", "Additional to PM-KISAN benefits"],
    documents: ["Aadhaar Card", "RTC (pahani) extract", "Bank passbook", "Caste certificate (if applicable)"],
    howToApply: [
      { step: 1, title: "Visit Raitha Samparka Kendra", description: "Go to your nearest farmer service centre" },
      { step: 2, title: "Submit Application", description: "Fill form with land and bank details" },
      { step: 3, title: "Verification & Payment", description: "After verification, amount is credited to bank account" },
    ],
  },
  {
    id: "ap-rytu-bharosa",
    name: "AP YSR Rythu Bharosa",
    ministry: "AP Agriculture Dept",
    category: "Income Support",
    level: "State",
    state: "Andhra Pradesh",
    keyAmount: "₹13,500/year",
    icon: "🌊",
    description: "Andhra Pradesh's comprehensive farmer support scheme providing ₹13,500/year including investment support before each crop season.",
    eligibility: ["All farmers in Andhra Pradesh", "Includes tenant farmers and landless tillers", "Aadhaar and bank account required"],
    benefits: ["₹13,500/year (₹7,500 Kharif + ₹4,000 Rabi + ₹2,000 bonus)", "Covers tenant farmers too", "Pre-season investment support"],
    documents: ["Aadhaar Card", "Land records / tenant agreement", "Bank passbook", "Webland registration"],
    howToApply: [
      { step: 1, title: "Register at Secretariat", description: "Visit your village/ward secretariat for registration" },
      { step: 2, title: "Verify at RBK", description: "Get verified at Rythu Bharosa Kendra" },
      { step: 3, title: "Receive Benefits", description: "Amount credited before each crop season automatically" },
    ],
  },
];

export const schemeCategories = ["All", ...Array.from(new Set(allSchemes.map(s => s.category)))];
export const schemeStates = ["All", ...Array.from(new Set(allSchemes.filter(s => s.state).map(s => s.state!)))];
export const schemeLevels = ["All", "Central", "State"] as const;
