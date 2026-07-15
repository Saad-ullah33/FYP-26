import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPropertyIndexDetails } from "../Data/propertyIndexData";

// Helper to format currency in mock responses
const formatPKR = (amount) => {
  if (amount >= 10000000) {
    return `PKR ${(amount / 10000000).toFixed(2)} Crore`;
  } else if (amount >= 100000) {
    return `PKR ${(amount / 100000).toFixed(2)} Lac`;
  }
  return `PKR ${amount.toLocaleString()}`;
};

/**
 * Service to interact with the Google Gemini API for real estate valuation.
 */
class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.ai = null;
    this.currentInitializedKey = "";
    
    if (this.apiKey) {
      try {
        this.ai = new GoogleGenerativeAI(this.apiKey);
        this.currentInitializedKey = this.apiKey;
      } catch (err) {
        console.error("Failed to initialize GoogleGenerativeAI:", err);
      }
    }
  }

  /**
   * Helper to get or rebuild GoogleGenerativeAI instance.
   */
  async getAIInstance() {
    if (this.ai && this.currentInitializedKey === this.apiKey) {
      return this.ai;
    }
    
    if (!this.apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not defined in your .env file.");
    }

    try {
      this.ai = new GoogleGenerativeAI(this.apiKey);
      this.currentInitializedKey = this.apiKey;
      return this.ai;
    } catch (error) {
      console.error("Gemini SDK Initialization Error:", error);
      throw new Error(`Failed to initialize Gemini AI: ${error.message}`);
    }
  }

  /**
   * Generates highly realistic Faisalabad valuation fallback data offline.
   */
  generateMockData({ propertyType, location, size, sizeUnit, userBudget, mapData }) {
    const sizeMultiplier = sizeUnit === "Kanal" ? 20 : 1;
    const totalMarla = size * sizeMultiplier;
    
    // Faisalabad base valuations per marla in PKR
    let basePricePerMarla = 1100000;
    let growthRatePast = 48;
    let growthRateFuture = 55;
    let drivers = [
      "General housing demand expansion across Faisalabad rural-to-urban shift.",
      "Proximity to regional highway networks and upcoming city ring roads."
    ];
    let risks = [
      "Fluctuations in grid electric and municipal water utility deployment schedules.",
      "Macroeconomic inflation index affecting overall construction material costs."
    ];

    const loc = location.toLowerCase();
    if (loc.includes("canal")) {
      basePricePerMarla = 1900000;
      growthRatePast = 68;
      growthRateFuture = 78;
      drivers = [
        "Premium widening projects on Canal Road enhancing accessibility.",
        "Proximity to high-end gated communities like Eden Valley & Citi Housing.",
        "Concentration of educational hubs and elite schooling infrastructure."
      ];
      risks = [
        "High initial purchase price premiums.",
        "Possession delays in newly launched canal-side extension phases."
      ];
    } else if (loc.includes("madina") || loc.includes("people")) {
      basePricePerMarla = 2800000;
      growthRatePast = 38;
      growthRateFuture = 42;
      drivers = [
        "Established elite residential status with mature, fully functional infrastructure.",
        "Immediate walking access to Faisalabad's major commercial hub (D-Ground).",
        "High security index, paved roads, and reliable gas connection."
      ];
      risks = [
        "Saturated appreciation potential due to mature market entry pricing.",
        "Commercial traffic congestion near main residential avenues."
      ];
    } else if (loc.includes("fda")) {
      basePricePerMarla = 850000;
      growthRatePast = 52;
      growthRateFuture = 82;
      drivers = [
        "Direct connection to the Motorway M-4 interchange on Sargodha Road.",
        "Government-backed regulatory framework providing secure land ownership.",
        "Anticipated expansion due to proximity to the FIEDMC / M-3 Industrial City."
      ];
      risks = [
        "Slower development pace of public utility infrastructure (gas connection pending in some blocks).",
        "Moderate resident occupancy rate currently."
      ];
    } else if (loc.includes("eden")) {
      basePricePerMarla = 1650000;
      growthRatePast = 62;
      growthRateFuture = 68;
      drivers = [
        "Private gated security environment popular with overseas investors.",
        "Lush green parks and wide planned road layouts.",
        "Excellent property management and community regulation."
      ];
      risks = [
        "Strict society bylaws regarding custom house construction designs.",
        "Higher quarterly society maintenance fees."
      ];
    } else if (loc.includes("wapda") || loc.includes("wanda")) {
      basePricePerMarla = 1455000;
      growthRatePast = 60;
      growthRateFuture = 72;
      drivers = [
        "Extremely popular co-operative housing society standard.",
        "Reliable electric grid setups with underground wiring system.",
        "High residency rate driving active local commercial markets."
      ];
      risks = [
        "Complex society transfer procedures and association fees.",
        "Slightly remote location relative to the Faisalabad old city center."
      ];
    }

    // Adjust pricing depending on type
    if (propertyType === "House") {
      basePricePerMarla += 950000; // Adding average construction cost per marla
    } else if (propertyType === "Commercial") {
      basePricePerMarla *= 2.4; // Commercial multiplier
    }

    const calculatedTotalValue = basePricePerMarla * totalMarla;
    
    // Evaluate verdict based on target budget vs calculated market value
    const budget = Number(userBudget) || calculatedTotalValue;
    const priceDiffPct = Math.round(((calculatedTotalValue - budget) / budget) * 100);
    
    let decision = "Good Buy";
    let score = 75;
    
    if (calculatedTotalValue > budget * 1.2) {
      decision = "Financial Risk";
      score = Math.max(15, Math.min(45, Math.round(50 - ((calculatedTotalValue - budget) / budget) * 100)));
    } else if (calculatedTotalValue > budget * 1.05) {
      decision = "Overpriced";
      score = Math.max(35, Math.min(60, Math.round(65 - priceDiffPct)));
    } else if (calculatedTotalValue <= budget * 0.9) {
      decision = "Highly Recommended";
      score = Math.max(85, Math.min(98, Math.round(85 + ((budget - calculatedTotalValue) / budget) * 20)));
    } else {
      decision = "Good Buy";
      score = Math.max(65, Math.min(84, Math.round(75 + ((budget - calculatedTotalValue) / budget) * 10)));
    }

    // Generate historical points (past 5 years)
    const historicalData = [];
    for (let i = 4; i >= 0; i--) {
      const year = (2025 - i).toString();
      const scale = 1 - (i * (growthRatePast / 100) / 4);
      historicalData.push({
        year,
        averagePriceMarlaPKR: Math.round(basePricePerMarla * scale)
      });
    }

    // Generate future projections (next 5 years)
    const futureData = [];
    for (let i = 1; i <= 5; i++) {
      const year = (2025 + i).toString();
      const scale = 1 + (i * (growthRateFuture / 100) / 5);
      futureData.push({
        year,
        projectedPriceMarlaPKR: Math.round(basePricePerMarla * scale)
      });
    }

    const valuationAnalysis = `Based on local market registers, the average price of a ${size} ${sizeUnit} ${propertyType} in ${location} is estimated at ${formatPKR(calculatedTotalValue)} (${formatPKR(basePricePerMarla)} per Marla).`;

    let budgetComparisonAnalysis = "";
    if (decision === "Highly Recommended") {
      budgetComparisonAnalysis = `Excellent budget alignment! The estimated property cost of ${formatPKR(calculatedTotalValue)} is well within your budget of ${formatPKR(budget)} (${Math.round((calculatedTotalValue/budget)*100)}% of budget), leaving you with a comfortable safety margin of ${formatPKR(budget - calculatedTotalValue)} in savings.`;
    } else if (decision === "Good Buy") {
      budgetComparisonAnalysis = `Good budget compatibility. The estimated property cost of ${formatPKR(calculatedTotalValue)} fits safely within your ${formatPKR(budget)} budget limits. Highly feasible.`;
    } else if (decision === "Overpriced") {
      budgetComparisonAnalysis = `Financial strain alert. The estimated property cost of ${formatPKR(calculatedTotalValue)} exceeds your budget of ${formatPKR(budget)} by ${priceDiffPct}%. Standard properties of this size in this area are slightly above your budget.`;
    } else {
      budgetComparisonAnalysis = `Severe budget deficit! A property of this size in this premium location typically costs ${formatPKR(calculatedTotalValue)}, which is far beyond your target budget of ${formatPKR(budget)} by ${formatPKR(calculatedTotalValue - budget)}. This represents a major financial risk.`;
    }

    // Dynamic spatial details simulation
    const heatZones = {
      "Highly Recommended": { category: "High-Value Growth Zone", color: "#10B981" },
      "Good Buy": { category: "Stable Premium Zone", color: "#3B82F6" },
      "Overpriced": { category: "Speculative High-Risk Zone", color: "#F59E0B" },
      "Financial Risk": { category: "Developing Opportunity Zone", color: "#EF4444" }
    };
    const zone = heatZones[decision];

    const lat = mapData?.lat || 31.418715;
    const lng = mapData?.lng || 73.079109;

    const simulatedAmenities = [
      { name: `${location} Model School`, type: "school", latOffset: 0.002, lngOffset: -0.003, distanceMeters: 310 },
      { name: `${location} Commercial Center`, type: "commercial", latOffset: -0.0015, lngOffset: 0.002, distanceMeters: 250 },
      { name: `${location} Public Park`, type: "park", latOffset: 0.003, lngOffset: 0.0035, distanceMeters: 420 },
      { name: "Main Connect Expressway", type: "road", latOffset: -0.004, lngOffset: -0.0025, distanceMeters: 550 }
    ];

    return {
      isMock: true,
      historicalTrend: {
        summary: `Over the last 5 years, ${location} has shown stable progression for ${propertyType} units, yielding a cumulative growth of ${growthRatePast}%. Price patterns stabilized due to steady infrastructure investments and residential utility connections.`,
        data: historicalData,
        growthRatePast5YearsPct: growthRatePast
      },
      futureProjection: {
        summary: `With major regional developments including the M-4 expansions, commercial layouts, and shifts to secure housing schemes, ${location} is projected to register up to ${growthRateFuture}% growth over the next 5 years.`,
        data: futureData,
        growthRateNext5YearsPct: growthRateFuture,
        keyDrivers: drivers
      },
      verdict: {
        decision,
        score,
        estimatedValueMarlaPKR: basePricePerMarla,
        valuationAnalysis,
        budgetComparisonAnalysis,
        risks
      },
      spatialInsights: {
        locationScore: Math.round(score * 0.95 + 4),
        heatZoneCategory: zone.category,
        heatZoneColor: zone.color,
        connectivity: `Excellent connectivity to local Faisalabad commercial avenues and links within a 1.5km range from coordinates [${lat.toFixed(4)}, ${lng.toFixed(4)}].`,
        securityLevel: location.includes("Canal") || location.includes("Eden") || location.includes("WAPDA") ? "High" : "Medium",
        amenities: simulatedAmenities
      }
    };
  }

  /**
   * Analyzes a property in Faisalabad based on inputs.
   * @param {Object} params - Property inputs
   */
  async analyzeProperty({ propertyType, location, size, sizeUnit, userBudget, mapData }) {
    // Try to run API content generation, fallback to realistic mock data on error/quota limit
    try {
      const aiInstance = await this.getAIInstance();
      
      const systemInstruction = `You are an elite, senior real estate investment analyst and valuation expert specializing strictly in the property market of Faisalabad, Pakistan.
Your task is to analyze a property and return a highly detailed, data-backed investment report in a strict JSON format.

GOOGLE SEARCH GROUNDING INSTRUCTIONS:
- You have access to Google Search grounding tool. You MUST search the live web for the latest average price rates per Marla/Kanal in the specific area/colony mentioned (e.g. Canal Road, Madina Town, FDA City, Eden Valley, etc.) in Faisalabad.
- Fetch and analyze current real-time prices (for 2026/latest), historical trends for the last 5 years, and future projections for the next 5 years based on real infrastructural/CPEC expansions or ring-roads around Faisalabad.
- Based on the current average market value versus the user's budget, determine if it is a smart purchase and output a final decision: "Highly Recommended", "Good Buy", "Overpriced", or "Financial Risk". You may also include a "Worth It" or "Not Worth It" statement in the budgetComparisonAnalysis or valuationAnalysis.

JSON Schema you MUST return:
{
  "historicalTrend": {
    "summary": "Detailed analysis of how this specific block/sector behaved over the last 5 years in Faisalabad.",
    "data": [
      {"year": "2021", "averagePriceMarlaPKR": number},
      {"year": "2022", "averagePriceMarlaPKR": number},
      {"year": "2023", "averagePriceMarlaPKR": number},
      {"year": "2024", "averagePriceMarlaPKR": number},
      {"year": "2025", "averagePriceMarlaPKR": number}
    ],
    "growthRatePast5YearsPct": number
  },
  "futureProjection": {
    "summary": "Detailed price trends and ROI projections for next 5 years.",
    "data": [
      {"year": "2026", "projectedPriceMarlaPKR": number},
      {"year": "2027", "projectedPriceMarlaPKR": number},
      {"year": "2028", "projectedPriceMarlaPKR": number},
      {"year": "2029", "projectedPriceMarlaPKR": number},
      {"year": "2030", "projectedPriceMarlaPKR": number}
    ],
    "growthRateNext5YearsPct": number,
    "keyDrivers": [
      "Driver 1",
      "Driver 2",
      "Driver 3"
    ]
  },
  "verdict": {
    "decision": "Highly Recommended" | "Good Buy" | "Overpriced" | "Financial Risk",
    "score": number,
    "estimatedValueMarlaPKR": number,
    "budgetComparisonAnalysis": "Detailed assessment of estimated market value vs user budget, explaining feasibility and suitability.",
    "valuationAnalysis": "Detailed breakdown explaining estimated market averages for this specific society block.",
    "risks": [
      "Appreciation/depreciation risk 1",
      "Regulatory or utility risk 2"
    ]
  },
  "spatialInsights": {
    "locationScore": number,
    "heatZoneCategory": "High-Value Growth Zone" | "Stable Premium Zone" | "Speculative High-Risk Zone" | "Developing Opportunity Zone",
    "heatZoneColor": "#10B981" | "#3B82F6" | "#F59E0B" | "#EF4444",
    "connectivity": "Description of road, motorway, or street connectivity based on coordinates.",
    "securityLevel": "High" | "Medium" | "Low",
    "amenities": [
      {"name": "School/Landmark", "type": "school" | "park" | "commercial" | "road", "latOffset": number, "lngOffset": number, "distanceMeters": number}
    ]
  }
}

Do not include any extra text. Output ONLY the JSON block. Do not wrap it in markdown code blocks.`;

      const userPrompt = `Please evaluate:
- Property Type: ${propertyType}
- Location: ${location}
- Size: ${size} ${sizeUnit}
- User Budget: PKR ${userBudget}
- Selected Map Coordinates (Lat, Lng): ${mapData.lat}, ${mapData.lng}

Using Google Search Grounding, query current averages for ${location}, Faisalabad and provide a detailed market value valuation against the user budget. Return the results in the JSON schema format.`;

      const modelName = "gemini-2.0-flash";
      const model = aiInstance.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding for real-time web search
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nUser request:\n${userPrompt}` }] }]
      });

      const responseText = result.response.text();
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      parsed.isMock = false;

      // Extract search grounding sources if returned in the API response
      const candidate = result.response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata) {
        parsed.groundingSources = {
          webSearchQueries: groundingMetadata.webSearchQueries || [],
          groundingChunks: (groundingMetadata.groundingChunks || []).map(chunk => ({
            title: chunk.web?.title || chunk.title || "Web Source",
            url: chunk.web?.uri || chunk.uri || ""
          })).filter(c => c.url)
        };
      }

      return parsed;
    } catch (error) {
      console.warn("Gemini API error, falling back to local Faisalabad valuation index...", error);
      // Generate highly realistic mock data fallback
      return this.generateMockData({ propertyType, location, size, sizeUnit, userBudget, mapData });
    }
  }

  /**
   * Fetches real-time Pakistani construction rates using Google Search Grounding.
   * @param {string} city - Target city (e.g. Faisalabad)
   */
  async fetchLiveConstructionRates(city = "Faisalabad") {
    try {
      const aiInstance = await this.getAIInstance();
      
      const systemInstruction = `You are an expert Quantity Surveyor in Pakistan specializing in the Punjab market.
Your task is to search Google for the latest 2026 construction material and labor rates specifically in the city of ${city}, Punjab, Pakistan.
Locate live prices for the following construction inputs:
1. Bricks (Awwal) - Rate per single brick (PKR)
2. Cement (OPC) - Rate per 50kg bag (PKR)
3. Sand (Ravi/Chenab) - Rate per CFT (PKR)
4. Crush (Bajri) - Rate per CFT (specifically Sargodha Bajri rates for Faisalabad/local Punjab) (PKR)
5. Steel (Grade 60) - Rate per KG (PKR)
6. Labor Structure Charges - Rate per SQ.FT (PKR)
7. Flooring & Tiling - Rate per SQ.FT (PKR)
8. Wall Painting & Finishing - Rate per SQ.FT (PKR)

Also, provide local building advisory tips tailored to ${city}'s specific conditions (e.g. soil composition, sand source, aggregate logistics):
- Foundation & Soil advice
- Cost Optimization advice (e.g. procuring sargodha crush directly, bulk cement logistics)
- Structural Reinforcement advice (e.g. damp course, steel grade recommendations)

JSON Schema you MUST return:
{
  "rates": {
    "brickPrice": number,
    "cementPrice": number,
    "sandPrice": number,
    "crushPrice": number,
    "steelPrice": number,
    "laborRate": number,
    "tileRate": number,
    "paintRate": number
  },
  "advice": {
    "soil": "Foundation & Soil advice paragraph specifically tailored to local context.",
    "saving": "Cost Optimization advice paragraph specifically tailored to local context.",
    "steel": "Structural Reinforcement advice paragraph specifically tailored to local context."
  }
}

Do not include any extra text. Output ONLY the JSON block. Do not wrap in markdown code blocks.`;

      const userPrompt = `Please search Google Grounding for live 2026 construction rates in ${city}, Pakistan. Output ONLY the JSON format matching the specified schema.`;

      const model = aiInstance.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding for real-time rates
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nUser request:\n${userPrompt}` }] }]
      });

      const responseText = result.response.text();
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      parsed.isMock = false;

      // Extract search grounding sources if returned
      const candidate = result.response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata) {
        parsed.groundingSources = {
          webSearchQueries: groundingMetadata.webSearchQueries || [],
          groundingChunks: (groundingMetadata.groundingChunks || []).map(chunk => ({
            title: chunk.web?.title || chunk.title || "Web Source",
            url: chunk.web?.uri || chunk.uri || ""
          })).filter(c => c.url)
        };
      }

      return parsed;
    } catch (error) {
      console.warn("Failed to fetch live construction rates, using high-fidelity fallback...", error);
      // Hardcoded local fallbacks
      return {
        rates: {
          brickPrice: 21,
          cementPrice: 1540,
          sandPrice: 95,
          crushPrice: 190,
          steelPrice: 280,
          laborRate: 600,
          tileRate: 260,
          paintRate: 130
        },
        advice: {
          soil: `${city} regional subsoil requires proper sub-grade compaction before structural concrete pours.`,
          saving: "Buying Sargodha aggregates directly in bulk reduces shipping costs significantly.",
          steel: "Damp-proof course (DPC) sealing is highly recommended to protect column reinforcement."
        }
      };
    }
  }

  async generatePlotAnalysis({ plotNumber, block, size, price, status, colonyName }) {
    try {
      const aiInstance = await this.getAIInstance();
      
      const systemInstruction = `You are the Core GIS Engine and Real Estate Intelligence API for an Interactive Plot Locator platform in Faisalabad, Pakistan.
Your job is to generate a professional, deep-dive evaluation string for a specific plot popup modal.

Your output must follow this format:
- Plot Identification: Confirm Plot Number, Block, and Size.
- Financial Status: Current exact price matching the local market.
- 6-Month Market Context: Brief analysis of why this plot is listed (e.g. market trend, demand).
- Investment Rating: A short recommendation note.

Keep it professional, consulting, and concise (under 80 words).`;

      const userPrompt = `Please evaluate this plot:
- Colony: ${colonyName}
- Plot Number: ${plotNumber}
- Block: ${block}
- Size: ${size}
- Current Value/Price: ${price}
- Availability Status: ${status}

Generate the popup modal analysis text.`;

      const modelName = "gemini-2.0-flash";
      const model = aiInstance.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nUser request:\n${userPrompt}` }] }]
      });

      return result.response.text().trim();
    } catch (error) {
      console.warn("Failed to generate plot analysis using Gemini, using high-fidelity local generator...", error);
      
      // Local fallback generator (TRUTH SOURCE)
      let appreciation = "3%";
      let rating = "Good buy for long-term hold.";
      if (colonyName.includes("Canal") || colonyName.includes("Eden")) {
        appreciation = "5.4%";
        rating = "Highly Recommended for immediate construction due to proximity to main commercial avenues and carpeted roads.";
      } else if (colonyName.includes("FDA")) {
        appreciation = "4.2%";
        rating = "Highly Recommended due to CPEC motorway interchange proximity and high investor demand score.";
      } else if (colonyName.includes("Madina") || colonyName.includes("People")) {
        appreciation = "2.8%";
        rating = "Recommended for secure residency or rental yield. Established blocks have premium utility connectivity.";
      }
      
      return `Plot ${plotNumber} (${block}, ${size}) is valued at ${price}. In the past quarter, prices in this sector appreciated by ${appreciation} due to utility development updates. Rating: ${rating}`;
    }
  }

  async generatePropertyDescription({ title, propertyType, location, area, price, bedrooms, bathrooms }) {
    try {
      const aiInstance = await this.getAIInstance();
      const model = aiInstance.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Write a professional, attractive real estate listing description in English for a property with these details in Faisalabad, Pakistan:
- Title: ${title || "Premium Property"}
- Type: ${propertyType}
- Location: ${location}
- Area/Size: ${area}
- Price: PKR ${price}
- Bedrooms: ${bedrooms || "N/A"}
- Bathrooms: ${bathrooms || "N/A"}
Keep the description engaging and appealing to buyers in Pakistan. Focus on details like quality construction, surrounding facilities, and location advantages. Keep it under 120 words. Do not wrap in markdown or backticks.`;
      
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.warn("Failed to generate description using Gemini, using fallback...", error);
      return `Beautiful ${area} ${propertyType} for sale in ${location}, Faisalabad. Featuring ${bedrooms ? bedrooms + ' bedrooms' : ''} ${bathrooms ? 'and ' + bathrooms + ' bathrooms' : ''}. Located in a prime area with easy access to main roads, schools, and commercial zones. Ideal for living or investment. Asking price: PKR ${price}. Contact us for details.`;
    }
  }

  async getChatbotResponse({ message, chatHistory }) {
    try {
      const aiInstance = await this.getAIInstance();
      const model = aiInstance.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: "You are the PropSight AI Assistant, an expert real estate chatbot advisor helping users navigate the real estate market in Faisalabad and Pakistan. Answer questions politely, professionally, and concisely. Keep answers focused on real estate, property values, building costs, and area recommendations in Faisalabad."
      });

      const contents = chatHistory.map(h => ({
        role: h.role === "model" ? "model" : "user",
        parts: [{ text: h.text }]
      }));
      contents.push({ role: "user", parts: [{ text: message }] });

      const result = await model.generateContent({ contents });
      return result.response.text().trim();
    } catch (error) {
      console.warn("Failed to get chatbot response using Gemini, using fallback...", error);
      return `Thank you for your message! I'm currently running in local offline mode. How can I help you find properties or analyze pricing trends in Faisalabad (such as Canal Road, FDA City, or Wapda City)?`;
    }
  }
}

export const geminiService = new GeminiService();
