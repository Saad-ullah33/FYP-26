export const MOCK_AUCTIONS = [
  {
    id: 1,
    title: "Ultra-Modern 1 Kanal Smart Villa",
    location: "Canal Road",
    address: "Block B, Canal Road Premium Enclave, Faisalabad",
    description: "Experience luxury living in this fully automated smart villa. Featuring state-of-the-art voice-controlled automation, solar-grid integration, Italian tiled flooring, a private landscape garden, and custom woodwork. Positioned in the most premium locality on Canal Road.",
    startPrice: 65000000,
    currentBid: 72500000,
    bidIncrement: 500000,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    ],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 2.5).toISOString(), // Ends in 2.5 hours (Ending Soon!)
    status: "ACTIVE",
    propertyType: "HOUSE",
    area: "1 Kanal",
    bedrooms: 5,
    bathrooms: 6,
    features: ["Smart Home Automation", "10kW Solar System", "Double Kitchen", "Basement Theater", "2 Car Garage", "24/7 Security"],
    owner: {
      name: "Chaudhary Muhammad Asif",
      phone: "+92 300 8654321",
      email: "asif.properties@gmail.com",
      rating: 4.9,
      verified: true
    },
    bids: [
      { id: 1, bidderName: "Zain Ul Abidin", amount: 72500000, time: "10 mins ago" },
      { id: 2, bidderName: "Hamza Malik", amount: 71500000, time: "45 mins ago" },
      { id: 3, bidderName: "Mian Shahbaz", amount: 70000000, time: "2 hours ago" },
      { id: 4, bidderName: "Ali Raza", amount: 68000000, time: "4 hours ago" }
    ],
    aiValuation: {
      estimatedValue: 74500000,
      confidenceScore: 94,
      marketTrend: "Bullish (+4.2% quarterly)",
      lowRange: 71000000,
      highRange: 77000000
    }
  },
  {
    id: 2,
    title: "Luxury Penthouse with Rooftop Terrace",
    location: "D Ground",
    address: "Kohinoor Heights, D Ground Commercial Area, Faisalabad",
    description: "Stunning 3-bedroom penthouse offering panoramic views of Faisalabad skyline. Equipped with high-ceilings, built-in German appliances, private elevator access, and a massive 1,200 sq.ft private rooftop terrace perfect for entertaining guest list.",
    startPrice: 42000000,
    currentBid: 44500000,
    bidIncrement: 250000,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1.5).toISOString(), // Ends in 1.5 Days
    status: "ACTIVE",
    propertyType: "APARTMENT",
    area: "10 Marla",
    bedrooms: 3,
    bathrooms: 4,
    features: ["Rooftop Terrace", "Infinity Pool Access", "Concierge Service", "Underground Parking", "AI Climate Control"],
    owner: {
      name: "Mian Haroon Enterprises",
      phone: "+92 321 7776655",
      email: "info@haroonenterprises.com",
      rating: 4.8,
      verified: true
    },
    bids: [
      { id: 1, bidderName: "Kamran Khan", amount: 44500000, time: "1 hour ago" },
      { id: 2, bidderName: "Sarmad Butt", amount: 44000000, time: "3 hours ago" },
      { id: 3, bidderName: "Usman Ghani", amount: 43000000, time: "1 day ago" }
    ],
    aiValuation: {
      estimatedValue: 46200000,
      confidenceScore: 91,
      marketTrend: "Stable (+1.1% quarterly)",
      lowRange: 43500000,
      highRange: 48000000
    }
  },
  {
    id: 3,
    title: "10 Marla Luxury Double Story House",
    location: "Wapda City",
    address: "Block J-1, Wapda City Main Boulevard, Faisalabad",
    description: "Brand new double-story house built with premier quality material. A rated brick structure, solid Ash-wood doors, branded bath fittings, and double glazed windows. Located in a secure gated community with active utilities.",
    startPrice: 29000000,
    currentBid: 29000000,
    bidIncrement: 200000,
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3.5).toISOString(), // Ends in 3.5 Days
    status: "ACTIVE",
    propertyType: "HOUSE",
    area: "10 Marla",
    bedrooms: 4,
    bathrooms: 5,
    features: ["Corner Plot", "Gated Security", "Ash-wood Doors", "Green Lawn", "UPS Wiring Completed"],
    owner: {
      name: "Sardar Ali Dogar",
      phone: "+92 300 6609988",
      email: "ali.dogar786@outlook.com",
      rating: 4.7,
      verified: false
    },
    bids: [], // No bids placed yet
    aiValuation: {
      estimatedValue: 31000000,
      confidenceScore: 89,
      marketTrend: "Highly Bullish (+6.5% quarterly)",
      lowRange: 29500000,
      highRange: 32500000
    }
  },
  {
    id: 4,
    title: "Commercial Triple-Storey Plaza",
    location: "Susan Road",
    address: "Main Boulevard Commercial Lane, Susan Road, Faisalabad",
    description: "Highly profitable commercial plaza located in the heart of Susan Road's bustling market. Currently fully rented out to corporate brand franchises, generating strong monthly cashflow. Built with modern glass facade and central air conditioning ducts.",
    startPrice: 120000000,
    currentBid: 124000000,
    bidIncrement: 1000000,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
    ],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // Ends in 7 Days
    status: "ACTIVE",
    propertyType: "COMMERCIAL",
    area: "1.2 Kanal",
    bedrooms: 0,
    bathrooms: 6,
    features: ["Central Location", "Pre-Rented Corporate Tenants", "Elevator Access", "Fire Hydrant System", "Commercial Electricity Meter"],
    owner: {
      name: "Faisalabad Commercial Group",
      phone: "+92 41 8765432",
      email: "acquisitions@fsdcommercial.com",
      rating: 5.0,
      verified: true
    },
    bids: [
      { id: 1, bidderName: "Sheikh Abdul Majid", amount: 124000000, time: "2 days ago" },
      { id: 2, bidderName: "Wapda Developers Co.", amount: 122000000, time: "3 days ago" },
      { id: 3, bidderName: "Haji Muhammad Boota", amount: 120000000, time: "5 days ago" }
    ],
    aiValuation: {
      estimatedValue: 128500000,
      confidenceScore: 96,
      marketTrend: "Stable Growth (+2.3% yearly)",
      lowRange: 122000000,
      highRange: 135000000
    }
  },
  {
    id: 5,
    title: "Premium Residential Plot (Upcoming)",
    location: "City Housing",
    address: "Phase 1, Executive Block, City Housing, Faisalabad",
    description: "An exceptional opportunity to bid on a premium 1 Kanal plot in the Executive Block of City Housing. Fully developed block with underground electrification, theme parks, high-end schools, and international dining nearby. Auction starts next week.",
    startPrice: 38000000,
    currentBid: 38000000,
    bidIncrement: 500000,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
    ],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // Starts in 10 Days
    status: "UPCOMING",
    propertyType: "PLOT",
    area: "1 Kanal",
    bedrooms: 0,
    bathrooms: 0,
    features: ["Underground Electrification", "Corner Lot Option", "Sewerage Completed", "Park Facing", "Immediate Possession"],
    owner: {
      name: "City Land Developers",
      phone: "+92 315 5556677",
      email: "info@citydevelopers.com",
      rating: 4.9,
      verified: true
    },
    bids: [],
    aiValuation: {
      estimatedValue: 40000000,
      confidenceScore: 92,
      marketTrend: "Highly Bullish (+8.1% quarterly)",
      lowRange: 38500000,
      highRange: 42000000
    }
  },
  {
    id: 6,
    title: "Beautiful 5 Marla House in Eden Valley (Sold)",
    location: "Eden Valley",
    address: "Block A, Eden Valley Premium Villas, Faisalabad",
    description: "A beautifully styled 5 Marla double story house with modern facade and high quality woodwork. Sold out in last month's auction after a highly competitive bidding session with 18 active participants.",
    startPrice: 14500000,
    currentBid: 16200000,
    bidIncrement: 100000,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // Ended 5 Days ago
    status: "CLOSED",
    propertyType: "HOUSE",
    area: "5 Marla",
    bedrooms: 3,
    bathrooms: 4,
    features: ["High Quality Woodwork", "Gated Security Enclave", "Sui Gas Connected", "Modern Kitchen Fitting"],
    owner: {
      name: "Rana Waseem Akhtar",
      phone: "+92 300 4567890",
      email: "waseem.ranas@yahoo.com",
      rating: 4.6,
      verified: true
    },
    bids: [
      { id: 1, bidderName: "Fahad Jamil", amount: 16200000, time: "5 days ago" },
      { id: 2, bidderName: "Dr. Salman Sheikh", amount: 16100000, time: "5 days ago" },
      { id: 3, bidderName: "Hassan Raza", amount: 16000000, time: "5 days ago" },
      { id: 4, bidderName: "Umer Siddique", amount: 15500000, time: "6 days ago" }
    ],
    aiValuation: {
      estimatedValue: 16000000,
      confidenceScore: 90,
      marketTrend: "Stable (+1.8% quarterly)",
      lowRange: 15000000,
      highRange: 17000000
    }
  }
];
