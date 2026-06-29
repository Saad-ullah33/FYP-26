// Trustdeed Mock Service Layer
// This file handles deed storage, cryptographic signature simulation, and data masking.
// In the future, replace the localStorage simulation with actual backend API requests (Axios).

const DEEDS_KEY = "fyp26_trust_deeds";
const SECRET_KEY = "FYP-26-TRUSTDEED-SECRET-KEY";

// Helper to generate a deterministic signature based on deedId and role
export const generateSignature = (deedId, role) => {
  // Simulating an HMAC-SHA256 signature using Base64 encoding
  const rawPayload = `${deedId}-${role}-${SECRET_KEY}`;
  // Convert to base64 and clean up special characters to make a clean hex-like signature
  return btoa(rawPayload).replace(/[^a-zA-Z0-9]/g, "").substring(0, 32).toLowerCase();
};

// Helper to mask sensitive information (GDPR compliant)
export const maskString = (str, visibleCount = 2) => {
  if (!str) return "";
  if (str.includes("@")) {
    // Email masking
    const [name, domain] = str.split("@");
    return `${name[0]}${"*".repeat(Math.max(name.length - 1, 3))}@${domain}`;
  }
  if (str.length <= visibleCount * 2) return str;
  return `${str.substring(0, visibleCount)}${"*".repeat(str.length - visibleCount * 2)}${str.substring(str.length - visibleCount)}`;
};

// Mock Initial Deeds
const initialDeeds = [
  {
    deedId: "TD-101-9921",
    propertyId: 101,
    title: "5 Marla Modern House",
    location: "Giga Mall, Islamabad",
    price: "1.8 Crore",
    buyerName: "Ali Khan",
    buyerEmail: "ali.khan@gmail.com",
    buyerCNIC: "37405-1234567-9",
    sellerName: "Kamran Shah",
    sellerEmail: "kamran.shah@gmail.com",
    sellerCNIC: "37405-7654321-3",
    soldDate: "2026-06-25",
    registryOffice: "Islamabad East Registry",
    blockchainHash: "0x8f39b1a0e1c27e8d35678ab26c91d4e0871ba9e102837bcde8f12a34b56cd7e8",
    status: "Verified",
    verifiedAt: "2026-06-26 14:30",
  },
  {
    deedId: "TD-102-8812",
    propertyId: 102,
    title: "Luxury 3 Bed Apartment",
    location: "Gulberg III, Lahore",
    price: "2.5 Crore",
    buyerName: "Sarah Ahmed",
    buyerEmail: "sarah.ahmed@yahoo.com",
    buyerCNIC: "35201-9876543-2",
    sellerName: "Ali Khan",
    sellerEmail: "ali.khan@gmail.com",
    sellerCNIC: "37405-1234567-9",
    soldDate: "2026-06-24",
    registryOffice: "Lahore Registry Office",
    blockchainHash: "0x3f5c9e2b10ad8e3c1527ef9a8b1c4e7d821ba9e83726bcde09fa123456789abc",
    status: "Verified",
    verifiedAt: "2026-06-26 16:15",
  },
];

// Initialize localStorage if empty
export const initializeDeeds = () => {
  if (!localStorage.getItem(DEEDS_KEY)) {
    localStorage.setItem(DEEDS_KEY, JSON.stringify(initialDeeds));
  }
};

// Fetch all deeds
export const getDeeds = () => {
  initializeDeeds();
  return JSON.parse(localStorage.getItem(DEEDS_KEY));
};

// Fetch a single deed by ID
export const getDeedById = (deedId) => {
  const deeds = getDeeds();
  return deeds.find((d) => d.deedId === deedId) || null;
};

// Verify deed and signature
export const verifyDeedSignature = (deedId, role, sig) => {
  const deed = getDeedById(deedId);
  if (!deed) {
    return { verified: false, error: "Deed not found in registry" };
  }

  // Generate the expected signature on-the-fly to compare
  const expectedSig = generateSignature(deedId, role);
  if (sig !== expectedSig) {
    return { verified: false, error: "Invalid signature - Potential Tampering Detected!" };
  }

  // Return the deed with details filtered by role
  const responseData = { ...deed };

  if (role === "public") {
    // Mask sensitive details for public scans
    responseData.buyerName = maskString(deed.buyerName);
    responseData.buyerEmail = maskString(deed.buyerEmail);
    responseData.buyerCNIC = maskString(deed.buyerCNIC);
    responseData.sellerName = maskString(deed.sellerName);
    responseData.sellerEmail = maskString(deed.sellerEmail);
    responseData.sellerCNIC = maskString(deed.sellerCNIC);
  }

  return { verified: true, role, deed: responseData };
};

// Generate QR Code data URL strings for different roles
export const getQRUrls = (deedId) => {
  const baseUrl = window.location.origin; // e.g. http://localhost:5173
  
  const roles = ["admin", "buyer", "seller", "public"];
  const urls = {};
  
  roles.forEach((role) => {
    const sig = generateSignature(deedId, role);
    urls[role] = `${baseUrl}/verify-deed?deedId=${deedId}&role=${role}&sig=${sig}`;
  });
  
  return urls;
};

// Create a new deed record (call when transaction is completed)
export const createDeed = (deedData) => {
  const deeds = getDeeds();
  
  // Auto-generate some registry fields
  const deedId = `TD-${deedData.propertyId}-${Math.floor(1000 + Math.random() * 9000)}`;
  const blockchainHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
  const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newDeed = {
    deedId,
    blockchainHash,
    status: "Verified",
    verifiedAt: timeNow,
    soldDate: timeNow.split(" ")[0],
    registryOffice: deedData.registryOffice || "Central Registry Islamabad",
    ...deedData,
  };

  deeds.push(newDeed);
  localStorage.setItem(DEEDS_KEY, JSON.stringify(deeds));
  return newDeed;
};
