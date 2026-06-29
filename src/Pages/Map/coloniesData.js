// Geographic Data for Faisalabad Colonies, Boundaries, and Plots

// Helper function to generate a neat grid of plots inside a boundary
function generatePlotGrid(startLat, startLng, rows, cols, latStep, lngStep, blockName, basePrice, sizeStr) {
  const plots = [];
  let plotIdCounter = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Calculate plot boundary corners
      const minLat = startLat + r * latStep;
      const maxLat = minLat + latStep * 0.85; // Leave small gap for streets
      const minLng = startLng + c * lngStep;
      const maxLng = minLng + lngStep * 0.85;

      const statuses = ["available", "sold", "reserved"];
      // Distribute statuses: mostly sold and available, few reserved
      const rand = Math.random();
      const status = rand < 0.45 ? "available" : rand < 0.85 ? "sold" : "reserved";
      
      const plotNum = plotIdCounter++;
      const priceVal = status === "sold" ? "Sold" : `PKR ${((basePrice + (r * 2) - c) * 0.1).toFixed(1)} Crore`;

      plots.push({
        id: `${blockName.toLowerCase().replace(" ", "-")}-plot-${plotNum}`,
        number: `Plot #${plotNum}`,
        block: blockName,
        size: sizeStr,
        price: priceVal,
        status: status,
        boundary: [
          [minLat, minLng],
          [minLat, maxLng],
          [maxLat, maxLng],
          [maxLat, minLng]
        ]
      });
    }
  }
  return plots;
}

export const colonies = [
  {
    id: "fda-city",
    name: "FDA City",
    center: [31.4850, 73.0250],
    zoom: 14,
    color: "#3b82f6", // Blue
    developmentStatus: "Under Development",
    approvalStatus: "FDA Approved",
    description: "One of the largest government-backed housing schemes in Faisalabad, located on Sargodha Road. Known for modern planning, wide roads, and state-of-the-art facilities.",
    boundary: [
      [31.4980, 73.0100],
      [31.4980, 73.0450],
      [31.4720, 73.0450],
      [31.4720, 73.0100]
    ],
    // Generate detailed plot cutting dynamically for FDA City Blocks
    plots: [
      ...generatePlotGrid(31.4880, 73.0150, 6, 8, 0.0006, 0.0008, "Block A", 65, "10 Marla"),
      ...generatePlotGrid(31.4800, 73.0250, 8, 8, 0.0005, 0.0007, "Block B", 45, "5 Marla"),
      ...generatePlotGrid(31.4740, 73.0150, 5, 5, 0.0009, 0.0012, "Block C (Premium)", 120, "1 Kanal")
    ],
    blueprint: {
      url: "/fda_blueprint.png",
      bounds: [
        [31.4720, 73.0100],
        [31.4980, 73.0450]
      ]
    }
  },
  {
    id: "wapda-city",
    name: "Wapda City",
    center: [31.4480, 73.1950],
    zoom: 14,
    color: "#10b981", // Emerald Green
    developmentStatus: "Fully Developed",
    approvalStatus: "FDA Approved",
    description: "Wapda City is a premium, beautifully landscaped residential society situated near the Canal Expressway. Highly secure with rich amenities, parks, and schools.",
    boundary: [
      [31.4600, 73.1800],
      [31.4600, 73.2100],
      [31.4360, 73.2100],
      [31.4360, 73.1800]
    ],
    plots: [
      ...generatePlotGrid(31.4480, 73.1850, 7, 7, 0.0006, 0.0008, "Wapda Block G", 85, "10 Marla"),
      ...generatePlotGrid(31.4400, 73.1950, 6, 8, 0.0005, 0.0007, "Wapda Block H", 55, "7 Marla")
    ],
    blueprint: {
      url: "/wapda_blueprint.png",
      bounds: [
        [31.4360, 73.1800],
        [31.4600, 73.2100]
      ]
    }
  },
  {
    id: "eden-valley",
    name: "Eden Valley",
    center: [31.4320, 73.1420],
    zoom: 15,
    color: "#f59e0b", // Amber
    developmentStatus: "Fully Developed",
    approvalStatus: "FDA Approved",
    description: "Eden Valley is a premium, secure gated community situated on Canal Road, offering luxury living standard with commercial hubs and high architectural guidelines.",
    boundary: [
      [31.4380, 73.1350],
      [31.4380, 73.1500],
      [31.4250, 73.1500],
      [31.4250, 73.1350]
    ],
    plots: [
      ...generatePlotGrid(31.4320, 73.1380, 8, 6, 0.0005, 0.0007, "Jasmine Block", 95, "10 Marla"),
      ...generatePlotGrid(31.4270, 73.1410, 6, 6, 0.0006, 0.0009, "Tulip Block", 135, "1 Kanal")
    ],
    blueprint: {
      url: "/eden_valley_blueprint.png",
      bounds: [
        [31.4250, 73.1350],
        [31.4380, 73.1500]
      ]
    }
  },
  {
    id: "peoples-colony",
    name: "Peoples Colony No. 1",
    center: [31.4020, 73.0980],
    zoom: 14,
    color: "#ec4899", // Pink/Rose
    developmentStatus: "Fully Developed",
    approvalStatus: "Established Area",
    description: "One of Faisalabad's oldest and most prestigious central residential and commercial zones, featuring famous commercial markers like D-Ground.",
    boundary: [
      [31.4120, 73.0850],
      [31.4120, 73.1100],
      [31.3920, 73.1100],
      [31.3920, 73.0850]
    ],
    plots: [
      ...generatePlotGrid(31.4020, 73.0900, 5, 5, 0.0007, 0.0009, "D-Ground Commercial", 280, "1 Kanal")
    ],
    blueprint: {
      url: "/peoples_blueprint.png",
      bounds: [
        [31.3920, 73.0850],
        [31.4120, 73.1100]
      ]
    }
  },
  {
    id: "madina-town",
    name: "Madina Town",
    center: [31.4160, 73.1220],
    zoom: 14,
    color: "#8b5cf6", // Purple
    developmentStatus: "Fully Developed",
    approvalStatus: "Established Area",
    description: "A highly sought-after, densely populated upscale neighborhood in Faisalabad with well-known education and medical institutions close by.",
    boundary: [
      [31.4260, 73.1100],
      [31.4260, 73.1350],
      [31.4060, 73.1350],
      [31.4060, 73.1100]
    ],
    plots: [
      ...generatePlotGrid(31.4140, 73.1160, 6, 6, 0.0006, 0.0008, "Ghalib Block", 70, "10 Marla")
    ],
    blueprint: {
      url: "/madina_town_blueprint.png",
      bounds: [
        [31.4060, 73.1100],
        [31.4260, 73.1350]
      ]
    }
  },
  {
    id: "city-housing",
    name: "City Housing",
    center: [31.4680, 73.1650],
    zoom: 14,
    color: "#a855f7", // Purple
    developmentStatus: "Fully Developed",
    approvalStatus: "FDA Approved",
    description: "City Housing Faisalabad offers a gold standard living experience with international standard infrastructure, theme parks, modern secure gates, commercial zones, and green initiatives.",
    boundary: [
      [31.4780, 73.1500],
      [31.4780, 73.1800],
      [31.4580, 73.1800],
      [31.4580, 73.1500]
    ],
    plots: [
      // Block A (Executive) - Four sub-grids surrounding the central park loop to avoid overlaying it
      ...generatePlotGrid(31.4670, 73.1525, 11, 2, 0.0008, 0.0012, "Block A (Executive West)", 110, "1 Kanal"),
      ...generatePlotGrid(31.4670, 73.1590, 11, 2, 0.0008, 0.0012, "Block A (Executive East)", 110, "1 Kanal"),
      ...generatePlotGrid(31.4740, 73.1545, 2, 4, 0.0008, 0.0011, "Block A (Executive North)", 110, "1 Kanal"),
      ...generatePlotGrid(31.4665, 73.1545, 2, 4, 0.0008, 0.0011, "Block A (Executive South)", 110, "1 Kanal"),
      
      // Block A (Canal View) - Lower left section next to Canal Parkway
      ...generatePlotGrid(31.4595, 73.1520, 8, 2, 0.0008, 0.0012, "Block A (Canal View)", 95, "1 Kanal"),
      
      // Block B (Luxury) - Four sub-grids surrounding Block B central commercial/park area
      ...generatePlotGrid(31.4660, 73.1660, 12, 2, 0.0008, 0.0012, "Block B (West)", 75, "10 Marla"),
      ...generatePlotGrid(31.4660, 73.1740, 12, 2, 0.0008, 0.0012, "Block B (East)", 75, "10 Marla"),
      ...generatePlotGrid(31.4735, 73.1685, 3, 5, 0.0008, 0.0011, "Block B (North)", 75, "10 Marla"),
      ...generatePlotGrid(31.4660, 73.1685, 2, 5, 0.0008, 0.0011, "Block B (South)", 75, "10 Marla"),
      
      // Block C (Elite) - Lower right section, restricted to the residential area on the left of the golf course
      ...generatePlotGrid(31.4590, 73.1665, 7, 4, 0.0008, 0.0012, "Block C (Elite)", 130, "2 Kanal")
    ],
    blueprint: {
      url: "/city_blueprint.png",
      bounds: [
        [31.4580, 73.1500],
        [31.4780, 73.1800]
      ]
    }
  },
  {
    id: "eden-gardens",
    name: "Eden Gardens",
    center: [31.4280, 73.1650],
    zoom: 14,
    color: "#06b6d4", // Cyan/Teal
    developmentStatus: "Fully Developed",
    approvalStatus: "FDA Approved",
    description: "Eden Gardens on Jaranwala Road is known for high-quality villas, wide roads, family parks, and proximity to major commercial centers and schools.",
    boundary: [
      [31.4360, 73.1550],
      [31.4360, 73.1750],
      [31.4200, 73.1750],
      [31.4200, 73.1550]
    ],
    plots: [
      ...generatePlotGrid(31.4280, 73.1600, 6, 6, 0.0006, 0.0008, "Eden Block A", 90, "10 Marla")
    ],
    blueprint: {
      url: "/eden_gardens_blueprint.png",
      bounds: [
        [31.4200, 73.1550],
        [31.4360, 73.1750]
      ]
    }
  },
  {
    id: "officers-colony",
    name: "Officers Colony",
    center: [31.4280, 73.1080],
    zoom: 14,
    color: "#f43f5e", // Rose/Pink
    developmentStatus: "Fully Developed",
    approvalStatus: "Established Area",
    description: "Officers Colony is Faisalabad's most traditional upscale residential neighborhood. Highly secure, central, and home to elite business families and professionals.",
    boundary: [
      [31.4340, 73.1000],
      [31.4340, 73.1160],
      [31.4220, 73.1160],
      [31.4220, 73.1000]
    ],
    plots: [
      ...generatePlotGrid(31.4280, 73.1020, 5, 5, 0.0007, 0.0009, "Main Boulevard Plots", 260, "1 Kanal")
    ],
    blueprint: {
      url: "/officers_blueprint.png",
      bounds: [
        [31.4220, 73.1000],
        [31.4340, 73.1160]
      ]
    }
  },
  {
    id: "canal-estates",
    name: "Canal Road Estates",
    center: [31.4620, 73.2350],
    zoom: 14,
    color: "#eab308", // Yellow
    developmentStatus: "Under Development",
    approvalStatus: "FDA Approved",
    description: "A premium corridor of modern residences along the Canal Road Expressway. Rapidly appreciating land value with elite schools and medical projects nearby.",
    boundary: [
      [31.4700, 73.2200],
      [31.4700, 73.2500],
      [31.4540, 73.2500],
      [31.4540, 73.2200]
    ],
    plots: [
      ...generatePlotGrid(31.4620, 73.2250, 6, 6, 0.0006, 0.0008, "Canal Block C", 85, "10 Marla")
    ],
    blueprint: {
      url: "/canal_estates_blueprint.png",
      bounds: [
        [31.4540, 73.2200],
        [31.4700, 73.2500]
      ]
    }
  }
];
