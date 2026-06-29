// High-Fidelity Property Index Database for PropSight AI
// Tracks historical price index (Jan 2021 = 100), average pricing, rental yields, and demand index

export const CITIES = ["Faisalabad", "Lahore", "Islamabad", "Karachi"];

export const PROPERTY_TYPES = [
  { value: "HOUSE", label: "Houses" },
  { value: "PLOT", label: "Plots" },
  { value: "APARTMENT", label: "Apartments" },
];

export const SIZES = {
  HOUSE: ["5 Marla", "10 Marla", "1 Kanal"],
  PLOT: ["5 Marla", "10 Marla", "1 Kanal"],
  APARTMENT: ["1 Bed (1000 Sq. Ft.)", "2 Bed (1500 Sq. Ft.)", "3 Bed (2000 Sq. Ft.)"],
};

export const TIMEFRAMES = [
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "3Y", label: "3 Years" },
  { value: "5Y", label: "5 Years" },
];

// Historical timelines from Jan 2021 to Jun 2026 (Quarterly points for rich display)
export const TIMELINE_LABELS = [
  "Jan 2021", "Apr 2021", "Jul 2021", "Oct 2021",
  "Jan 2022", "Apr 2022", "Jul 2022", "Oct 2022",
  "Jan 2023", "Apr 2023", "Jul 2023", "Oct 2023",
  "Jan 2024", "Apr 2024", "Jul 2024", "Oct 2024",
  "Jan 2025", "Apr 2025", "Jul 2025", "Oct 2025",
  "Jan 2026", "Apr 2026", "Jun 2026"
];

export const propertyIndexData = {
  Faisalabad: {
    "Canal Road": {
      HOUSE: {
        "5 Marla": {
          avgPrice: 12500000, // PKR 1.25 Crore
          yoyGrowth: 12.4,
          rentalYield: 4.8,
          demandScore: 88,
          supplyScore: 65,
          marketHealth: "Highly Bullish",
          healthScore: 89,
          // Index starting at 100 in Jan 2021
          history: [100, 102, 105, 107, 111, 114, 117, 120, 124, 127, 131, 135, 140, 144, 148, 152, 158, 163, 168, 172, 178, 183, 186],
          prices: [6.7, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.3, 8.5, 8.8, 9.0, 9.4, 9.7, 10.0, 10.3, 10.7, 11.0, 11.4, 11.7, 12.1, 12.3, 12.5] // in Millions
        },
        "10 Marla": {
          avgPrice: 24000000,
          yoyGrowth: 14.2,
          rentalYield: 4.5,
          demandScore: 92,
          supplyScore: 50,
          marketHealth: "Highly Bullish",
          healthScore: 94,
          history: [100, 103, 107, 110, 115, 119, 122, 126, 131, 135, 140, 145, 151, 156, 162, 167, 174, 180, 187, 192, 199, 205, 209],
          prices: [11.5, 11.8, 12.3, 12.7, 13.2, 13.7, 14.0, 14.5, 15.1, 15.5, 16.1, 16.7, 17.4, 18.0, 18.6, 19.2, 20.0, 20.7, 21.5, 22.1, 22.9, 23.5, 24.0]
        },
        "1 Kanal": {
          avgPrice: 48000000,
          yoyGrowth: 11.5,
          rentalYield: 4.2,
          demandScore: 84,
          supplyScore: 55,
          marketHealth: "Bullish",
          healthScore: 85,
          history: [100, 101, 104, 106, 109, 112, 115, 118, 121, 124, 128, 132, 136, 140, 144, 148, 153, 158, 163, 167, 172, 176, 179],
          prices: [26.8, 27.1, 27.9, 28.4, 29.2, 30.0, 30.8, 31.6, 32.4, 33.2, 34.3, 35.4, 36.4, 37.5, 38.6, 39.7, 41.0, 42.3, 43.7, 44.8, 46.1, 47.2, 48.0]
        }
      },
      PLOT: {
        "5 Marla": {
          avgPrice: 5500000,
          yoyGrowth: 16.5,
          rentalYield: 0,
          demandScore: 95,
          supplyScore: 40,
          marketHealth: "Highly Bullish",
          healthScore: 96,
          history: [100, 105, 110, 115, 121, 127, 132, 138, 145, 152, 159, 166, 175, 183, 191, 200, 211, 222, 233, 243, 255, 265, 271],
          prices: [2.0, 2.1, 2.2, 2.3, 2.45, 2.57, 2.67, 2.79, 2.93, 3.07, 3.21, 3.35, 3.54, 3.7, 3.86, 4.04, 4.26, 4.48, 4.71, 4.91, 5.15, 5.35, 5.5]
        },
        "10 Marla": {
          avgPrice: 10500000,
          yoyGrowth: 15.1,
          rentalYield: 0,
          demandScore: 91,
          supplyScore: 45,
          marketHealth: "Highly Bullish",
          healthScore: 92,
          history: [100, 104, 108, 113, 118, 124, 129, 135, 141, 148, 155, 162, 170, 177, 185, 193, 203, 213, 223, 232, 243, 252, 258],
          prices: [4.1, 4.26, 4.43, 4.63, 4.84, 5.08, 5.29, 5.54, 5.78, 6.07, 6.36, 6.64, 6.97, 7.26, 7.59, 7.91, 8.32, 8.73, 9.14, 9.51, 9.96, 10.33, 10.5]
        },
        "1 Kanal": {
          avgPrice: 21000000,
          yoyGrowth: 13.8,
          rentalYield: 0,
          demandScore: 86,
          supplyScore: 50,
          marketHealth: "Bullish",
          healthScore: 87,
          history: [100, 103, 107, 111, 116, 121, 125, 130, 136, 142, 148, 154, 161, 168, 175, 182, 191, 199, 208, 216, 225, 233, 239],
          prices: [8.8, 9.06, 9.42, 9.77, 10.21, 10.65, 11.0, 11.44, 11.97, 12.5, 13.02, 13.55, 14.17, 14.78, 15.4, 16.02, 16.81, 17.51, 18.3, 19.01, 19.8, 20.5, 21.0]
        }
      },
      APARTMENT: {
        "1 Bed (1000 Sq. Ft.)": {
          avgPrice: 6500000,
          yoyGrowth: 9.8,
          rentalYield: 5.8,
          demandScore: 78,
          supplyScore: 70,
          marketHealth: "Stable",
          healthScore: 76,
          history: [100, 102, 103, 105, 107, 109, 111, 113, 116, 118, 121, 123, 126, 129, 132, 135, 138, 142, 145, 148, 152, 155, 157],
          prices: [4.14, 4.22, 4.26, 4.35, 4.43, 4.51, 4.6, 4.68, 4.8, 4.89, 5.01, 5.09, 5.22, 5.34, 5.47, 5.59, 5.71, 5.88, 6.0, 6.13, 6.29, 6.42, 6.5]
        },
        "2 Bed (1500 Sq. Ft.)": {
          avgPrice: 11000000,
          yoyGrowth: 10.5,
          rentalYield: 5.5,
          demandScore: 82,
          supplyScore: 68,
          marketHealth: "Stable",
          healthScore: 80,
          history: [100, 102, 104, 106, 108, 111, 113, 116, 119, 122, 125, 128, 131, 135, 138, 142, 146, 150, 154, 158, 162, 166, 168],
          prices: [6.55, 6.68, 6.81, 6.94, 7.07, 7.27, 7.4, 7.6, 7.8, 7.99, 8.19, 8.38, 8.58, 8.84, 9.04, 9.3, 9.56, 9.83, 10.09, 10.35, 10.61, 10.87, 11.0]
        },
        "3 Bed (2000 Sq. Ft.)": {
          avgPrice: 16500000,
          yoyGrowth: 11.0,
          rentalYield: 5.2,
          demandScore: 85,
          supplyScore: 60,
          marketHealth: "Bullish",
          healthScore: 83,
          history: [100, 102, 104, 106, 109, 112, 114, 117, 120, 123, 127, 130, 134, 138, 142, 146, 151, 156, 161, 165, 170, 174, 176],
          prices: [9.38, 9.56, 9.75, 9.94, 10.22, 10.5, 10.69, 10.97, 11.25, 11.53, 11.91, 12.19, 12.56, 12.94, 13.31, 13.69, 14.16, 14.63, 15.1, 15.47, 15.94, 16.32, 16.5]
        }
      }
    },
    "Wapda City": {
      HOUSE: {
        "5 Marla": {
          avgPrice: 11800000,
          yoyGrowth: 11.2,
          rentalYield: 4.6,
          demandScore: 82,
          supplyScore: 70,
          marketHealth: "Bullish",
          healthScore: 82,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 122, 125, 128, 132, 135, 139, 143, 148, 152, 157, 161, 166, 170, 172],
          prices: [6.86, 6.93, 7.07, 7.2, 7.41, 7.61, 7.75, 7.96, 8.16, 8.37, 8.58, 8.78, 9.06, 9.26, 9.54, 9.81, 10.15, 10.43, 10.77, 11.04, 11.39, 11.66, 11.8]
        },
        "10 Marla": {
          avgPrice: 22000000,
          yoyGrowth: 12.8,
          rentalYield: 4.4,
          demandScore: 88,
          supplyScore: 55,
          marketHealth: "Highly Bullish",
          healthScore: 88,
          history: [100, 102, 105, 108, 112, 115, 118, 121, 125, 129, 133, 137, 142, 146, 151, 156, 162, 167, 173, 178, 184, 189, 192],
          prices: [11.46, 11.69, 12.03, 12.38, 12.84, 13.18, 13.52, 13.87, 14.33, 14.78, 15.24, 15.7, 16.27, 16.73, 17.3, 17.88, 18.56, 19.14, 19.82, 20.4, 21.09, 21.66, 22.0]
        },
        "1 Kanal": {
          avgPrice: 42500000,
          yoyGrowth: 10.4,
          rentalYield: 4.0,
          demandScore: 80,
          supplyScore: 60,
          marketHealth: "Bullish",
          healthScore: 80,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 122, 125, 128, 132, 135, 138, 142, 146, 150, 155, 159, 164, 168, 171],
          prices: [24.85, 25.1, 25.6, 26.09, 26.84, 27.58, 28.08, 28.82, 29.57, 30.31, 31.06, 31.81, 32.8, 33.55, 34.29, 35.29, 36.28, 37.28, 38.52, 39.51, 40.75, 41.75, 42.5]
        }
      },
      PLOT: {
        "5 Marla": {
          avgPrice: 4900000,
          yoyGrowth: 14.5,
          rentalYield: 0,
          demandScore: 90,
          supplyScore: 45,
          marketHealth: "Highly Bullish",
          healthScore: 91,
          history: [100, 104, 108, 112, 117, 122, 126, 131, 137, 143, 149, 155, 162, 169, 176, 183, 192, 201, 210, 219, 229, 238, 244],
          prices: [2.01, 2.09, 2.17, 2.25, 2.35, 2.45, 2.53, 2.63, 2.75, 2.87, 2.99, 3.11, 3.25, 3.39, 3.53, 3.67, 3.85, 4.04, 4.22, 4.4, 4.6, 4.78, 4.9]
        },
        "10 Marla": {
          avgPrice: 9400000,
          yoyGrowth: 13.8,
          rentalYield: 0,
          demandScore: 87,
          supplyScore: 50,
          marketHealth: "Bullish",
          healthScore: 86,
          history: [100, 103, 107, 111, 116, 121, 125, 130, 135, 141, 147, 153, 159, 166, 172, 179, 187, 195, 204, 212, 221, 229, 234],
          prices: [4.02, 4.14, 4.3, 4.46, 4.66, 4.86, 5.02, 5.23, 5.43, 5.67, 5.91, 6.15, 6.39, 6.67, 6.91, 7.19, 7.51, 7.84, 8.2, 8.52, 8.88, 9.2, 9.4]
        },
        "1 Kanal": {
          avgPrice: 18500000,
          yoyGrowth: 12.2,
          rentalYield: 0,
          demandScore: 82,
          supplyScore: 55,
          marketHealth: "Bullish",
          healthScore: 83,
          history: [100, 102, 105, 109, 113, 117, 121, 125, 130, 135, 140, 145, 151, 157, 163, 169, 176, 183, 191, 198, 206, 213, 218],
          prices: [8.49, 8.66, 8.91, 9.25, 9.59, 9.93, 10.27, 10.61, 11.04, 11.46, 11.89, 12.31, 12.82, 13.33, 13.84, 14.35, 14.94, 15.54, 16.22, 16.81, 17.49, 18.08, 18.5]
        }
      },
      APARTMENT: {
        "1 Bed (1000 Sq. Ft.)": {
          avgPrice: 5800000,
          yoyGrowth: 8.5,
          rentalYield: 5.5,
          demandScore: 72,
          supplyScore: 75,
          marketHealth: "Stable",
          healthScore: 71,
          history: [100, 101, 102, 104, 106, 108, 110, 112, 114, 116, 119, 121, 123, 126, 128, 131, 134, 137, 140, 143, 146, 149, 151],
          prices: [3.84, 3.88, 3.92, 3.99, 4.07, 4.15, 4.22, 4.3, 4.38, 4.45, 4.57, 4.65, 4.72, 4.84, 4.92, 5.03, 5.15, 5.26, 5.38, 5.49, 5.61, 5.72, 5.8]
        },
        "2 Bed (1500 Sq. Ft.)": {
          avgPrice: 9800000,
          yoyGrowth: 9.0,
          rentalYield: 5.2,
          demandScore: 75,
          supplyScore: 70,
          marketHealth: "Stable",
          healthScore: 73,
          history: [100, 101, 103, 105, 107, 109, 111, 113, 116, 118, 121, 123, 126, 129, 132, 135, 138, 141, 144, 147, 151, 154, 156],
          prices: [6.28, 6.34, 6.47, 6.59, 6.72, 6.84, 6.97, 7.09, 7.28, 7.41, 7.6, 7.72, 7.91, 8.1, 8.29, 8.48, 8.67, 8.85, 9.04, 9.23, 9.48, 9.67, 9.8]
        },
        "3 Bed (2000 Sq. Ft.)": {
          avgPrice: 14800000,
          yoyGrowth: 9.5,
          rentalYield: 5.0,
          demandScore: 78,
          supplyScore: 65,
          marketHealth: "Stable",
          healthScore: 76,
          history: [100, 102, 104, 106, 108, 110, 112, 114, 117, 119, 122, 124, 127, 130, 133, 136, 140, 143, 147, 150, 154, 157, 159],
          prices: [9.31, 9.49, 9.68, 9.86, 10.05, 10.23, 10.42, 10.6, 10.88, 11.07, 11.35, 11.53, 11.81, 12.09, 12.37, 12.65, 13.02, 13.3, 13.67, 13.95, 14.32, 14.6, 14.8]
        }
      }
    },
    "Kohinoor City": {
      HOUSE: {
        "5 Marla": {
          avgPrice: 13500000,
          yoyGrowth: 10.5,
          rentalYield: 5.0,
          demandScore: 85,
          supplyScore: 50,
          marketHealth: "Bullish",
          healthScore: 84,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 121, 124, 127, 130, 133, 136, 140, 144, 148, 152, 156, 160, 164, 166],
          prices: [8.13, 8.21, 8.37, 8.54, 8.78, 9.02, 9.19, 9.43, 9.67, 9.84, 10.08, 10.32, 10.57, 10.81, 11.06, 11.38, 11.71, 12.03, 12.36, 12.68, 13.01, 13.33, 13.5]
        },
        "10 Marla": {
          avgPrice: 26000000,
          yoyGrowth: 11.2,
          rentalYield: 4.8,
          demandScore: 89,
          supplyScore: 40,
          marketHealth: "Highly Bullish",
          healthScore: 88,
          history: [100, 102, 104, 106, 110, 113, 115, 118, 121, 124, 127, 131, 134, 138, 141, 145, 149, 154, 158, 162, 167, 171, 173],
          prices: [15.03, 15.33, 15.63, 15.93, 16.53, 16.98, 17.28, 17.73, 18.18, 18.63, 19.08, 19.68, 20.13, 20.73, 21.18, 21.78, 22.38, 23.13, 23.73, 24.33, 25.08, 25.68, 26.0]
        },
        "1 Kanal": {
          avgPrice: 52000000,
          yoyGrowth: 9.8,
          rentalYield: 4.4,
          demandScore: 82,
          supplyScore: 45,
          marketHealth: "Bullish",
          healthScore: 81,
          history: [100, 101, 103, 105, 108, 111, 113, 115, 118, 121, 124, 127, 130, 133, 136, 139, 143, 147, 151, 155, 159, 163, 165],
          prices: [31.52, 31.83, 32.46, 33.09, 34.04, 34.98, 35.61, 36.24, 37.19, 38.13, 39.08, 40.02, 40.97, 41.91, 42.86, 43.8, 45.06, 46.32, 47.58, 48.84, 50.1, 51.36, 52.0]
        }
      },
      PLOT: {
        "5 Marla": {
          avgPrice: 7000000,
          yoyGrowth: 12.8,
          rentalYield: 0,
          demandScore: 92,
          supplyScore: 30,
          marketHealth: "Highly Bullish",
          healthScore: 93,
          history: [100, 103, 106, 110, 114, 118, 122, 126, 131, 136, 141, 146, 151, 157, 163, 169, 176, 183, 190, 197, 205, 212, 217],
          prices: [3.23, 3.32, 3.42, 3.55, 3.68, 3.81, 3.94, 4.07, 4.23, 4.39, 4.55, 4.71, 4.87, 5.07, 5.26, 5.45, 5.68, 5.91, 6.13, 6.36, 6.62, 6.84, 7.0]
        },
        "10 Marla": {
          avgPrice: 13000000,
          yoyGrowth: 12.0,
          rentalYield: 0,
          demandScore: 88,
          supplyScore: 35,
          marketHealth: "Bullish",
          healthScore: 87,
          history: [100, 102, 105, 108, 112, 116, 120, 124, 129, 134, 139, 144, 149, 154, 160, 166, 172, 179, 186, 193, 201, 208, 212],
          prices: [6.13, 6.25, 6.44, 6.62, 6.87, 7.11, 7.36, 7.6, 7.91, 8.21, 8.52, 8.83, 9.13, 9.44, 9.81, 10.18, 10.55, 10.98, 11.41, 11.84, 12.33, 12.76, 13.0]
        },
        "1 Kanal": {
          avgPrice: 25000000,
          yoyGrowth: 11.5,
          rentalYield: 0,
          demandScore: 84,
          supplyScore: 40,
          marketHealth: "Bullish",
          healthScore: 84,
          history: [100, 102, 104, 107, 111, 115, 119, 122, 127, 132, 136, 141, 146, 151, 156, 162, 168, 174, 181, 187, 194, 201, 205],
          prices: [12.2, 12.44, 12.69, 13.05, 13.54, 14.03, 14.51, 14.88, 15.49, 16.1, 16.59, 17.2, 17.81, 18.42, 19.03, 19.76, 20.49, 21.22, 22.08, 22.81, 23.66, 24.52, 25.0]
        }
      },
      APARTMENT: {
        "1 Bed (1000 Sq. Ft.)": {
          avgPrice: 7200000,
          yoyGrowth: 11.4,
          rentalYield: 6.2,
          demandScore: 84,
          supplyScore: 60,
          marketHealth: "Highly Bullish",
          healthScore: 87,
          history: [100, 102, 105, 107, 110, 113, 116, 119, 122, 125, 129, 132, 136, 140, 144, 148, 153, 158, 163, 168, 174, 179, 182],
          prices: [3.96, 4.04, 4.16, 4.24, 4.36, 4.47, 4.59, 4.71, 4.83, 4.95, 5.11, 5.23, 5.39, 5.54, 5.7, 5.86, 6.06, 6.26, 6.46, 6.65, 6.89, 7.09, 7.2]
        },
        "2 Bed (1500 Sq. Ft.)": {
          avgPrice: 12500000,
          yoyGrowth: 12.0,
          rentalYield: 6.0,
          demandScore: 86,
          supplyScore: 55,
          marketHealth: "Highly Bullish",
          healthScore: 89,
          history: [100, 102, 105, 108, 111, 114, 117, 120, 124, 127, 131, 134, 139, 143, 147, 151, 157, 162, 168, 173, 179, 184, 188],
          prices: [6.65, 6.78, 6.98, 7.18, 7.38, 7.58, 7.78, 7.98, 8.24, 8.44, 8.71, 8.91, 9.24, 9.51, 9.77, 10.04, 10.44, 10.77, 11.04, 11.5, 11.9, 12.23, 12.5]
        },
        "3 Bed (2000 Sq. Ft.)": {
          avgPrice: 18800000,
          yoyGrowth: 11.8,
          rentalYield: 5.6,
          demandScore: 88,
          supplyScore: 50,
          marketHealth: "Highly Bullish",
          healthScore: 88,
          history: [100, 102, 105, 107, 111, 114, 117, 120, 124, 127, 131, 134, 139, 143, 147, 151, 157, 162, 168, 173, 179, 184, 187],
          prices: [10.05, 10.25, 10.55, 10.75, 11.16, 11.46, 11.76, 12.06, 12.46, 12.76, 13.17, 13.47, 13.97, 14.37, 14.77, 15.17, 15.78, 16.28, 16.88, 17.38, 17.99, 18.49, 18.8]
        }
      }
    }
  },
  Lahore: {
    "DHA Phase 6": {
      HOUSE: {
        "5 Marla": {
          avgPrice: 19500000,
          yoyGrowth: 14.6,
          rentalYield: 4.5,
          demandScore: 92,
          supplyScore: 50,
          marketHealth: "Highly Bullish",
          healthScore: 93,
          history: [100, 103, 106, 109, 113, 117, 120, 124, 128, 133, 137, 142, 147, 152, 158, 163, 170, 176, 183, 189, 196, 203, 207],
          prices: [9.42, 9.7, 9.99, 10.27, 10.65, 11.02, 11.3, 11.68, 12.06, 12.53, 12.91, 13.38, 13.85, 14.32, 14.88, 15.35, 16.01, 16.58, 17.24, 17.81, 18.47, 19.12, 19.5]
        },
        "10 Marla": {
          avgPrice: 38000000,
          yoyGrowth: 15.2,
          rentalYield: 4.2,
          demandScore: 94,
          supplyScore: 40,
          marketHealth: "Highly Bullish",
          healthScore: 95,
          history: [100, 104, 108, 112, 116, 121, 124, 129, 134, 139, 144, 150, 156, 162, 168, 174, 182, 189, 197, 204, 212, 220, 224],
          prices: [16.96, 17.64, 18.32, 19.0, 19.68, 20.52, 21.03, 21.88, 22.73, 23.58, 24.43, 25.45, 26.47, 27.49, 28.5, 29.52, 30.88, 32.07, 33.42, 34.61, 35.97, 37.32, 38.0]
        },
        "1 Kanal": {
          avgPrice: 75000000,
          yoyGrowth: 13.5,
          rentalYield: 3.8,
          demandScore: 89,
          supplyScore: 45,
          marketHealth: "Highly Bullish",
          healthScore: 90,
          history: [100, 103, 106, 110, 114, 118, 121, 125, 130, 135, 140, 145, 151, 156, 162, 168, 175, 182, 189, 196, 204, 211, 215],
          prices: [34.88, 35.93, 36.98, 38.37, 39.77, 41.16, 42.21, 43.6, 45.35, 47.09, 48.84, 50.58, 52.68, 54.42, 56.51, 58.6, 61.05, 63.49, 65.93, 68.37, 71.16, 73.6, 75.0]
        }
      },
      PLOT: {
        "5 Marla": {
          avgPrice: 9500000,
          yoyGrowth: 18.2,
          rentalYield: 0,
          demandScore: 96,
          supplyScore: 35,
          marketHealth: "Highly Bullish",
          healthScore: 98,
          history: [100, 105, 111, 116, 123, 129, 135, 142, 149, 157, 165, 173, 183, 192, 202, 212, 224, 237, 250, 262, 276, 289, 296],
          prices: [3.21, 3.37, 3.56, 3.72, 3.95, 4.14, 4.33, 4.56, 4.78, 5.04, 5.3, 5.55, 5.87, 6.16, 6.48, 6.81, 7.19, 7.61, 8.03, 8.41, 8.86, 9.28, 9.5]
        },
        "10 Marla": {
          avgPrice: 17500000,
          yoyGrowth: 16.8,
          rentalYield: 0,
          demandScore: 93,
          supplyScore: 38,
          marketHealth: "Highly Bullish",
          healthScore: 96,
          history: [100, 104, 109, 114, 120, 126, 131, 138, 144, 151, 159, 166, 175, 184, 193, 202, 213, 225, 237, 248, 261, 274, 280],
          prices: [6.25, 6.5, 6.81, 7.13, 7.5, 7.88, 8.19, 8.63, 9.0, 9.44, 9.94, 10.38, 10.94, 11.5, 12.06, 12.63, 13.31, 14.06, 14.81, 15.5, 16.31, 17.13, 17.5]
        },
        "1 Kanal": {
          avgPrice: 34000000,
          yoyGrowth: 15.5,
          rentalYield: 0,
          demandScore: 91,
          supplyScore: 40,
          marketHealth: "Highly Bullish",
          healthScore: 94,
          history: [100, 103, 107, 112, 117, 123, 128, 133, 140, 146, 153, 160, 168, 176, 184, 192, 203, 213, 224, 234, 246, 257, 263],
          prices: [12.93, 13.32, 13.84, 14.48, 15.13, 15.9, 16.55, 17.2, 18.1, 18.88, 19.78, 20.69, 21.72, 22.76, 23.79, 24.83, 26.25, 27.54, 28.97, 30.26, 31.81, 33.23, 34.0]
        }
      },
      APARTMENT: {
        "1 Bed (1000 Sq. Ft.)": {
          avgPrice: 11500000,
          yoyGrowth: 11.8,
          rentalYield: 6.5,
          demandScore: 84,
          supplyScore: 65,
          marketHealth: "Highly Bullish",
          healthScore: 88,
          history: [100, 102, 104, 107, 110, 113, 116, 119, 122, 125, 129, 132, 136, 140, 144, 148, 153, 158, 163, 168, 174, 179, 182],
          prices: [6.32, 6.45, 6.57, 6.76, 6.95, 7.14, 7.33, 7.52, 7.71, 7.9, 8.15, 8.34, 8.59, 8.84, 9.1, 9.35, 9.67, 9.99, 10.3, 10.62, 11.0, 11.31, 11.5]
        },
        "2 Bed (1500 Sq. Ft.)": {
          avgPrice: 19500000,
          yoyGrowth: 12.2,
          rentalYield: 6.2,
          demandScore: 87,
          supplyScore: 60,
          marketHealth: "Highly Bullish",
          healthScore: 90,
          history: [100, 102, 105, 108, 111, 114, 117, 120, 124, 127, 131, 134, 139, 143, 147, 151, 157, 162, 168, 173, 179, 184, 188],
          prices: [10.37, 10.58, 10.89, 11.2, 11.51, 11.82, 12.13, 12.44, 12.86, 13.17, 13.58, 13.9, 14.41, 14.83, 15.24, 15.66, 16.28, 16.8, 17.42, 17.94, 18.56, 19.08, 19.5]
        },
        "3 Bed (2000 Sq. Ft.)": {
          avgPrice: 28500500,
          yoyGrowth: 12.5,
          rentalYield: 5.8,
          demandScore: 89,
          supplyScore: 55,
          marketHealth: "Highly Bullish",
          healthScore: 91,
          history: [100, 102, 105, 108, 111, 114, 117, 120, 124, 127, 131, 134, 139, 143, 147, 151, 157, 162, 168, 173, 179, 184, 188],
          prices: [15.16, 15.46, 15.92, 16.37, 16.83, 17.28, 17.73, 18.19, 18.79, 19.25, 19.85, 20.31, 21.06, 21.67, 22.28, 22.88, 23.79, 24.55, 25.46, 26.22, 27.13, 27.88, 28.5]
        }
      }
    }
  },
  Islamabad: {
    "DHA Phase 2": {
      HOUSE: {
        "5 Marla": {
          avgPrice: 17800000,
          yoyGrowth: 11.5,
          rentalYield: 4.8,
          demandScore: 88,
          supplyScore: 60,
          marketHealth: "Bullish",
          healthScore: 85,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 122, 125, 128, 132, 135, 139, 143, 148, 152, 157, 161, 166, 170, 172],
          prices: [10.35, 10.45, 10.66, 10.87, 11.18, 11.49, 11.7, 12.01, 12.32, 12.63, 12.94, 13.25, 13.66, 13.97, 14.39, 14.8, 15.32, 15.73, 16.25, 16.66, 17.18, 17.59, 17.8]
        },
        "10 Marla": {
          avgPrice: 34500000,
          yoyGrowth: 12.6,
          rentalYield: 4.5,
          demandScore: 90,
          supplyScore: 50,
          marketHealth: "Highly Bullish",
          healthScore: 89,
          history: [100, 102, 105, 108, 111, 114, 117, 120, 124, 127, 131, 134, 139, 143, 147, 151, 157, 162, 168, 173, 179, 184, 187],
          prices: [18.45, 18.82, 19.37, 19.92, 20.48, 21.03, 21.58, 22.14, 22.88, 23.43, 24.17, 24.72, 25.65, 26.38, 27.12, 27.86, 28.97, 29.89, 31.0, 31.92, 33.03, 33.95, 34.5]
        },
        "1 Kanal": {
          avgPrice: 65000000,
          yoyGrowth: 10.8,
          rentalYield: 4.1,
          demandScore: 84,
          supplyScore: 55,
          marketHealth: "Bullish",
          healthScore: 82,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 122, 125, 128, 132, 135, 138, 142, 146, 150, 155, 159, 164, 168, 171],
          prices: [38.01, 38.39, 39.15, 39.91, 41.05, 42.19, 42.95, 44.09, 45.23, 46.37, 47.51, 48.65, 50.17, 51.31, 52.45, 53.97, 55.49, 57.01, 58.91, 60.43, 62.33, 63.85, 65.0]
        }
      },
      PLOT: {
        "5 Marla": {
          avgPrice: 8500000,
          yoyGrowth: 15.8,
          rentalYield: 0,
          demandScore: 92,
          supplyScore: 40,
          marketHealth: "Highly Bullish",
          healthScore: 92,
          history: [100, 104, 108, 112, 117, 122, 126, 131, 137, 143, 149, 155, 162, 169, 176, 183, 192, 201, 210, 219, 229, 238, 244],
          prices: [3.48, 3.62, 3.76, 3.9, 4.07, 4.25, 4.38, 4.56, 4.77, 4.98, 5.19, 5.39, 5.64, 5.88, 6.12, 6.37, 6.68, 7.0, 7.31, 7.62, 7.97, 8.28, 8.5]
        },
        "10 Marla": {
          avgPrice: 15500000,
          yoyGrowth: 14.5,
          rentalYield: 0,
          demandScore: 89,
          supplyScore: 45,
          marketHealth: "Highly Bullish",
          healthScore: 90,
          history: [100, 103, 107, 111, 116, 121, 125, 130, 135, 141, 147, 153, 159, 166, 172, 179, 187, 195, 204, 212, 221, 229, 234],
          prices: [6.62, 6.82, 7.08, 7.35, 7.68, 8.01, 8.28, 8.61, 8.94, 9.34, 9.73, 10.13, 10.53, 10.99, 11.39, 11.85, 12.38, 12.91, 13.51, 14.04, 14.63, 15.16, 15.5]
        },
        "1 Kanal": {
          avgPrice: 29000000,
          yoyGrowth: 13.0,
          rentalYield: 0,
          demandScore: 85,
          supplyScore: 50,
          marketHealth: "Bullish",
          healthScore: 86,
          history: [100, 102, 105, 109, 113, 117, 121, 125, 130, 135, 140, 145, 151, 157, 163, 169, 176, 183, 191, 198, 206, 213, 218],
          prices: [13.3, 13.57, 13.97, 14.5, 15.03, 15.56, 16.09, 16.63, 17.29, 17.96, 18.62, 19.29, 20.08, 20.88, 21.68, 22.48, 23.41, 24.34, 25.4, 26.33, 27.4, 28.33, 29.0]
        }
      },
      APARTMENT: {
        "1 Bed (1000 Sq. Ft.)": {
          avgPrice: 9500000,
          yoyGrowth: 10.5,
          rentalYield: 6.0,
          demandScore: 80,
          supplyScore: 70,
          marketHealth: "Stable",
          healthScore: 81,
          history: [100, 101, 102, 104, 106, 108, 110, 112, 114, 116, 119, 121, 123, 126, 128, 131, 134, 137, 140, 143, 146, 149, 151],
          prices: [6.29, 6.35, 6.42, 6.54, 6.67, 6.79, 6.92, 7.05, 7.17, 7.3, 7.49, 7.61, 7.74, 7.93, 8.05, 8.24, 8.43, 8.62, 8.81, 8.99, 9.18, 9.37, 9.5]
        },
        "2 Bed (1500 Sq. Ft.)": {
          avgPrice: 16000000,
          yoyGrowth: 11.2,
          rentalYield: 5.8,
          demandScore: 83,
          supplyScore: 65,
          marketHealth: "Bullish",
          healthScore: 83,
          history: [100, 101, 103, 105, 107, 109, 111, 113, 116, 118, 121, 123, 126, 129, 132, 135, 138, 141, 144, 147, 151, 154, 156],
          prices: [10.25, 10.36, 10.56, 10.77, 10.97, 11.18, 11.38, 11.59, 11.9, 12.1, 12.41, 12.62, 12.92, 13.23, 13.54, 13.85, 14.15, 14.46, 14.77, 15.08, 15.49, 15.8, 16.0]
        },
        "3 Bed (2000 Sq. Ft.)": {
          avgPrice: 23500000,
          yoyGrowth: 11.8,
          rentalYield: 5.4,
          demandScore: 86,
          supplyScore: 60,
          marketHealth: "Bullish",
          healthScore: 85,
          history: [100, 102, 104, 106, 108, 110, 112, 114, 117, 119, 122, 124, 127, 130, 133, 136, 140, 143, 147, 150, 154, 157, 159],
          prices: [14.77, 15.07, 15.37, 15.66, 15.96, 16.25, 16.55, 16.84, 17.29, 17.58, 18.03, 18.32, 18.77, 19.21, 19.65, 20.1, 20.69, 21.13, 21.72, 22.16, 22.75, 23.2, 23.5]
        }
      }
    }
  },
  Karachi: {
    "DHA Phase 8": {
      HOUSE: {
        "5 Marla": {
          avgPrice: 28000000,
          yoyGrowth: 11.8,
          rentalYield: 4.6,
          demandScore: 89,
          supplyScore: 55,
          marketHealth: "Bullish",
          healthScore: 86,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 122, 125, 128, 132, 135, 139, 143, 148, 152, 157, 161, 166, 170, 172],
          prices: [16.27, 16.43, 16.76, 17.09, 17.58, 18.06, 18.39, 18.88, 19.37, 19.86, 20.35, 20.83, 21.49, 21.97, 22.63, 23.28, 24.1, 24.75, 25.56, 26.22, 27.03, 27.68, 28.0]
        },
        "10 Marla": {
          avgPrice: 52000000,
          yoyGrowth: 12.4,
          rentalYield: 4.4,
          demandScore: 91,
          supplyScore: 45,
          marketHealth: "Highly Bullish",
          healthScore: 90,
          history: [100, 102, 105, 108, 111, 114, 117, 120, 124, 127, 131, 134, 139, 143, 147, 151, 157, 162, 168, 173, 179, 184, 187],
          prices: [27.8, 28.36, 29.19, 30.02, 30.86, 31.69, 32.53, 33.36, 34.47, 35.31, 36.42, 37.25, 38.64, 39.76, 40.87, 41.98, 43.65, 45.04, 46.71, 48.1, 49.77, 51.16, 52.0]
        },
        "1 Kanal": {
          avgPrice: 98000000,
          yoyGrowth: 11.2,
          rentalYield: 4.0,
          demandScore: 86,
          supplyScore: 50,
          marketHealth: "Bullish",
          healthScore: 84,
          history: [100, 101, 103, 105, 108, 111, 113, 116, 119, 122, 125, 128, 132, 135, 138, 142, 146, 150, 155, 159, 164, 168, 171],
          prices: [57.3, 57.88, 59.03, 60.17, 61.89, 63.61, 64.76, 66.48, 68.2, 69.92, 71.64, 73.36, 75.65, 77.37, 79.1, 81.39, 83.69, 85.98, 88.85, 91.15, 94.02, 96.31, 98.0]
        }
      },
      PLOT: {
        "5 Marla": {
          avgPrice: 14500000,
          yoyGrowth: 14.8,
          rentalYield: 0,
          demandScore: 93,
          supplyScore: 35,
          marketHealth: "Highly Bullish",
          healthScore: 92,
          history: [100, 104, 108, 112, 117, 122, 126, 131, 137, 143, 149, 155, 162, 169, 176, 183, 192, 201, 210, 219, 229, 238, 244],
          prices: [5.94, 6.18, 6.42, 6.66, 6.95, 7.25, 7.49, 7.79, 8.14, 8.5, 8.85, 9.21, 9.63, 10.05, 10.46, 10.89, 11.42, 11.96, 12.49, 13.03, 13.62, 14.16, 14.5]
        },
        "10 Marla": {
          avgPrice: 26000000,
          yoyGrowth: 13.5,
          rentalYield: 0,
          demandScore: 89,
          supplyScore: 40,
          marketHealth: "Bullish",
          healthScore: 87,
          history: [100, 103, 107, 111, 116, 121, 125, 130, 135, 141, 147, 153, 159, 166, 172, 179, 187, 195, 204, 212, 221, 229, 234],
          prices: [11.11, 11.44, 11.89, 12.33, 12.89, 13.44, 13.89, 14.44, 15.0, 15.67, 16.33, 17.0, 17.67, 18.44, 19.11, 19.89, 20.78, 21.67, 22.67, 23.56, 24.56, 25.44, 26.0]
        },
        "1 Kanal": {
          avgPrice: 48000000,
          yoyGrowth: 12.0,
          rentalYield: 0,
          demandScore: 85,
          supplyScore: 45,
          marketHealth: "Bullish",
          healthScore: 85,
          history: [100, 102, 105, 109, 113, 117, 121, 125, 130, 135, 140, 145, 151, 157, 163, 169, 176, 183, 191, 198, 206, 213, 218],
          prices: [22.01, 22.45, 23.11, 23.99, 24.87, 25.75, 26.63, 27.52, 28.62, 29.72, 30.82, 31.92, 33.24, 34.56, 35.88, 37.2, 38.74, 40.29, 42.05, 43.59, 45.35, 46.89, 48.0]
        }
      },
      APARTMENT: {
        "1 Bed (1000 Sq. Ft.)": {
          avgPrice: 14500000,
          yoyGrowth: 11.2,
          rentalYield: 6.4,
          demandScore: 85,
          supplyScore: 60,
          marketHealth: "Highly Bullish",
          healthScore: 87,
          history: [100, 101, 102, 104, 106, 108, 110, 112, 114, 116, 119, 121, 123, 126, 128, 131, 134, 137, 140, 143, 146, 149, 151],
          prices: [9.6, 9.69, 9.79, 9.98, 10.17, 10.36, 10.55, 10.74, 10.94, 11.13, 11.42, 11.61, 11.8, 12.09, 12.28, 12.57, 12.86, 13.15, 13.44, 13.73, 14.02, 14.3, 14.5]
        },
        "2 Bed (1500 Sq. Ft.)": {
          avgPrice: 25000000,
          yoyGrowth: 11.8,
          rentalYield: 6.0,
          demandScore: 87,
          supplyScore: 55,
          marketHealth: "Highly Bullish",
          healthScore: 89,
          history: [100, 101, 103, 105, 107, 109, 111, 113, 116, 118, 121, 123, 126, 129, 132, 135, 138, 141, 144, 147, 151, 154, 156],
          prices: [16.02, 16.18, 16.5, 16.82, 17.14, 17.46, 17.78, 18.1, 18.58, 18.9, 19.38, 19.7, 20.18, 20.66, 21.14, 21.62, 22.1, 22.58, 23.06, 23.54, 24.18, 24.66, 25.0]
        },
        "3 Bed (2000 Sq. Ft.)": {
          avgPrice: 38000000,
          yoyGrowth: 12.2,
          rentalYield: 5.5,
          demandScore: 90,
          supplyScore: 50,
          marketHealth: "Highly Bullish",
          healthScore: 90,
          history: [100, 102, 104, 106, 108, 110, 112, 114, 117, 119, 122, 124, 127, 130, 133, 136, 140, 143, 147, 150, 154, 157, 159],
          prices: [23.89, 24.37, 24.85, 25.33, 25.81, 26.28, 26.76, 27.24, 27.96, 28.44, 29.16, 29.64, 30.36, 31.08, 31.8, 32.52, 33.47, 34.19, 35.15, 35.87, 36.82, 37.54, 38.0]
        }
      }
    }
  }
};

// Generates fallback data dynamically if a specific combination is missing
export const getPropertyIndexDetails = (city, locality, type, size) => {
  const cityData = propertyIndexData[city] || propertyIndexData["Faisalabad"];
  let localityData = cityData[locality];
  
  if (!localityData) {
    // Return first available locality in that city
    const firstLocality = Object.keys(cityData)[0];
    localityData = cityData[firstLocality];
  }
  
  let typeData = localityData[type];
  if (!typeData) {
    typeData = localityData["HOUSE"];
  }
  
  let sizeData = typeData[size];
  if (!sizeData) {
    const firstSize = Object.keys(typeData)[0];
    sizeData = typeData[firstSize];
  }
  
  return {
    ...sizeData,
    cityName: city,
    localityName: locality || Object.keys(cityData)[0],
    typeName: type,
    sizeName: size || Object.keys(typeData)[0]
  };
};

export const getLocalityList = (city) => {
  const cityData = propertyIndexData[city];
  if (!cityData) return [];
  return Object.keys(cityData);
};
