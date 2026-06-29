import http from 'http';

const PORT = 8080;

const properties = [
  {
    id: 401,
    title: "1 Kanal Designer Luxury House",
    address: "Block G, Wapda City, Faisalabad",
    area: "1 Kanal",
    city: { name: "Faisalabad" },
    price: 68000000,
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 6,
    description: "Newly constructed luxury home on Wapda City main road, featuring high ceiling rooms, solid ash wood doors, premium Turkish bath fittings, and kitchen terrace.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Saad Ullah", phone: "+92 300 1234567" },
    featured: true,
    auctionEnabled: false
  },
  {
    id: 402,
    title: "10 Marla Corner Plot in Prime Locality",
    address: "Jasmine Block, Eden Valley, Faisalabad",
    area: "10 Marla",
    city: { name: "Faisalabad" },
    price: 14000000,
    propertyType: "PLOT",
    purpose: "Buy",
    bedrooms: 0,
    bathrooms: 0,
    description: "Double road corner plot in Eden Valley. Gas, water, electricity meters ready. Facing green community park. Highly secure society gated boundary.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Imran Ahmed", phone: "+92 321 9876543" },
    featured: false,
    auctionEnabled: false
  },
  {
    id: 403,
    title: "3 Bed Luxury Apartment in Kohinoor City",
    address: "Regency Heights, Kohinoor City, Faisalabad",
    area: "1800 Sq. Ft.",
    city: { name: "Faisalabad" },
    price: 9500000,
    propertyType: "APARTMENT",
    purpose: "Buy",
    bedrooms: 3,
    bathrooms: 3,
    description: "Executive semi-furnished apartment in Faisalabad's most prime location. Dedicated parking basement, standby generator, and 24/7 security surveillance.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Haris Jamil", phone: "+92 333 4567890" },
    featured: true,
    auctionEnabled: true
  },
  {
    id: 404,
    title: "2 Kanal Modern Mansion on Canal Road",
    address: "Canal Road Elite Enclave, Faisalabad",
    area: "2 Kanal",
    city: { name: "Faisalabad" },
    price: 125000000,
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 6,
    bathrooms: 7,
    description: "Spectacular canal-facing estate with high-end designer fittings, swimming pool, home theater room, and automated smart features throughout the house.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Saad Ullah", phone: "+92 300 1234567" },
    featured: true,
    auctionEnabled: false
  },
  {
    id: 101,
    title: "1 Kanal Ultra-Modern Luxury Villa",
    address: "Sector F, DHA Phase 2, Islamabad",
    area: "1 Kanal",
    city: { name: "Islamabad" },
    price: 85000000,
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 5,
    bathrooms: 6,
    description: "Designed by a renowned architect, this stunning smart home features a double-height lobby, Italian marble flooring, built-in kitchen appliances, and private cinema.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Kamran Shah", phone: "+92 312 3456789" },
    featured: true,
    auctionEnabled: false
  },
  {
    id: 201,
    title: "2 Kanal Spanish Styled Estate",
    address: "Phase 6, DHA, Lahore",
    area: "2 Kanal",
    city: { name: "Lahore" },
    price: 185000000,
    propertyType: "HOUSE",
    purpose: "Buy",
    bedrooms: 6,
    bathrooms: 7,
    description: "An architectural masterpiece in Spanish design, featuring a luxury swimming pool, sprawling lawns, dual basement, and automated security controls.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Zainab Ali", phone: "+92 300 7654321" },
    featured: true,
    auctionEnabled: false
  },
  {
    id: 301,
    title: "Sea-Facing Premium Apartment",
    address: "Emaar Oceanfront, DHA Phase 8, Karachi",
    area: "2800 Sq. Ft.",
    city: { name: "Karachi" },
    price: 98000000,
    propertyType: "APARTMENT",
    purpose: "Buy",
    bedrooms: 3,
    bathrooms: 4,
    description: "Spectacular uninterrupted Arabian sea views, temperature-controlled pools, state-of-the-art gym, and direct beach access. 24/7 security and concierge.",
    images: [{ cloudinary_src: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=600&q=80" }],
    owner: { name: "Tariq Malik", phone: "+92 345 8889990" },
    featured: true,
    auctionEnabled: true
  }
];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Handle Options preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse path
  const parsedUrl = req.url.split('?')[0];
  console.log(`[Mock Server] Received: ${req.method} ${parsedUrl}`);

  // Endpoint: GET /api/properties/getAllProperties
  if (parsedUrl === '/api/properties/getAllProperties' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(properties));
    return;
  }

  // Endpoint: GET /api/properties/id/:id
  const matchId = parsedUrl.match(/^\/api\/properties\/id\/([^\/]+)$/);
  if (matchId && req.method === 'GET') {
    const id = matchId[1];
    const property = properties.find(p => p.id.toString() === id);
    if (property) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(property));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Property not found' }));
    }
    return;
  }

  // Endpoint: GET /api/properties/type/:type
  const matchType = parsedUrl.match(/^\/api\/properties\/type\/([^\/]+)$/);
  if (matchType && req.method === 'GET') {
    const type = matchType[1].toUpperCase();
    const filtered = properties.filter(p => p.propertyType.toUpperCase() === type);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filtered));
    return;
  }

  // Endpoint: GET /api/properties/:id/score
  const matchScore = parsedUrl.match(/^\/api\/properties\/([^\/]+)\/score$/);
  if (matchScore && req.method === 'GET') {
    const id = matchScore[1];
    const scoreVal = (parseInt(id) % 15) + 80; // Scores between 80 and 94
    const scoreData = {
      score: scoreVal,
      label: scoreVal >= 90 ? "Excellent Match" : "Good Match",
      reason: `Located in a highly sought-after neighborhood with excellent potential appreciation rate and premium construction quality.`
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(scoreData));
    return;
  }

  // Endpoint: POST /api/auth/login
  if (parsedUrl === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      console.log(`[Mock Server] Login payload received`);
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vQGZ5cC5jb20iLCJyb2xlIjoiVVNFUiIsImV4cCI6OTk5OTk5OTk5OX0.mock-signature";
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ accessToken: mockToken }));
    });
    return;
  }

  // Default fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: `Route ${req.method} ${parsedUrl} not found in mock simulator` }));
});

server.listen(PORT, () => {
  console.log(`[Mock Server] Gated Simulator running at http://localhost:${PORT}`);
});
