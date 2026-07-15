export const PLANS = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: {
      unlimitedListings: false, // 5 max
      aiDescriptionGenerator: false, // 3/month
      aiChatbotAssistant: false, // 5 msgs/day
      aiPriceEstimation: false,
      advancedAnalytics: false,
      whatsappLeadIntegration: false,
      documentGenerator: false,
      multiUserTeam: false, // 0 seats
      customBranding: false,
    },
    limits: {
      listingsMax: 5,
      aiDescriptionsPerMonth: 3,
      chatbotMsgsPerDay: 5,
    },
    description: "Ideal for individual buyers and sellers testing the waters in Faisalabad.",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 2999,
    priceYearly: 29990,
    features: {
      unlimitedListings: true,
      aiDescriptionGenerator: true,
      aiChatbotAssistant: true,
      aiPriceEstimation: true,
      advancedAnalytics: true,
      whatsappLeadIntegration: true,
      documentGenerator: true,
      multiUserTeam: false,
      customBranding: false,
    },
    limits: {
      listingsMax: Infinity,
      aiDescriptionsPerMonth: Infinity,
      chatbotMsgsPerDay: Infinity,
    },
    description: "Perfect for active agents and developers seeking AI valuations and unlimited ads.",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 8999,
    priceYearly: 89990,
    features: {
      unlimitedListings: true,
      aiDescriptionGenerator: true,
      aiChatbotAssistant: true,
      aiPriceEstimation: true,
      advancedAnalytics: true,
      whatsappLeadIntegration: true,
      documentGenerator: true,
      multiUserTeam: true, // 5 seats
      customBranding: true,
    },
    limits: {
      listingsMax: Infinity,
      aiDescriptionsPerMonth: Infinity,
      chatbotMsgsPerDay: Infinity,
      teamSeats: 5,
    },
    description: "Designed for real estate agencies and construction teams needing branding and seats.",
  },
];
