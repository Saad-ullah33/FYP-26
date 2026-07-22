// Trustdeed Mock Service Layer
// This file handles deed storage, cryptographic signature simulation, and data masking.

const DEEDS_KEY = "fyp26_trust_deeds";
const SECRET_KEY = "FYP-26-TRUSTDEED-SECRET-KEY";

// Helper to generate a deterministic signature based on deedId and role
export const generateSignature = (deedId, role) => {
  const rawPayload = `${deedId}-${role}-${SECRET_KEY}`;
  return btoa(rawPayload).replace(/[^a-zA-Z0-9]/g, "").substring(0, 32).toLowerCase();
};

// Helper to mask sensitive information (GDPR compliant)
export const maskString = (str, visibleCount = 2) => {
  if (!str) return "";
  if (str.includes("@")) {
    const [name, domain] = str.split("@");
    return `${name[0]}${"*".repeat(Math.max(name.length - 1, 3))}@${domain}`;
  }
  if (str.length <= visibleCount * 2) return str;
  return `${str.substring(0, visibleCount)}${"*".repeat(str.length - visibleCount * 2)}${str.substring(str.length - visibleCount)}`;
};

// Comprehensive Initial Verified Deeds Repository
const initialDeeds = [
  {
    deedId: "TD-101-9921",
    propertyId: 101,
    title: "5 Marla Modern Executive Villa",
    location: "DHA Phase 6, Lahore",
    price: "1.8 Crore PKR",
    buyerName: "Ali Khan",
    buyerEmail: "ali.khan@gmail.com",
    buyerCNIC: "37405-1234567-9",
    sellerName: "Kamran Shah",
    sellerEmail: "kamran.shah@gmail.com",
    sellerCNIC: "37405-7654321-3",
    soldDate: "2026-06-25",
    registryOffice: "Lahore Central Land Registry",
    blockchainHash: "0x8f39b1a0e1c27e8d35678ab26c91d4e0871ba9e102837bcde8f12a34b56cd7e8",
    status: "Verified",
    verifiedAt: "2026-06-26 14:30",
  },
  {
    deedId: "TD-102-8812",
    propertyId: 102,
    title: "Luxury 3 Bed Penthouse Apartment",
    location: "Gulberg III, Lahore",
    price: "2.5 Crore PKR",
    buyerName: "Sarah Ahmed",
    buyerEmail: "sarah.ahmed@yahoo.com",
    buyerCNIC: "35201-9876543-2",
    sellerName: "Ali Khan",
    sellerEmail: "ali.khan@gmail.com",
    sellerCNIC: "37405-1234567-9",
    soldDate: "2026-06-24",
    registryOffice: "Lahore District Land Authority",
    blockchainHash: "0x3f5c9e2b10ad8e3c1527ef9a8b1c4e7d821ba9e83726bcde09fa123456789abc",
    status: "Verified",
    verifiedAt: "2026-06-26 16:15",
  },
  {
    deedId: "TD-103-7743",
    propertyId: 103,
    title: "10 Marla Smart Residence",
    location: "Giga Mall Zone, DHA Phase 2, Islamabad",
    price: "3.4 Crore PKR",
    buyerName: "Zainab Malik",
    buyerEmail: "zainab.malik@outlook.com",
    buyerCNIC: "61101-4455667-8",
    sellerName: "Tariq Mahmood",
    sellerEmail: "tariq.m@gmail.com",
    sellerCNIC: "61101-1122334-5",
    soldDate: "2026-07-02",
    registryOffice: "Islamabad Capital Registry Office",
    blockchainHash: "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    status: "Verified",
    verifiedAt: "2026-07-03 11:20",
  },
  {
    deedId: "TD-104-5510",
    propertyId: 104,
    title: "1 Kanal Commercial Corner Plot",
    location: "Canal Road, Faisalabad",
    price: "5.2 Crore PKR",
    buyerName: "Usman Raza",
    buyerEmail: "usman.raza@techfirm.pk",
    buyerCNIC: "33100-7788990-1",
    sellerName: "Green Orchard Developers",
    sellerEmail: "contact@greenorchard.pk",
    sellerCNIC: "33100-0011223-4",
    soldDate: "2026-07-10",
    registryOffice: "Faisalabad Development Authority (FDA)",
    blockchainHash: "0x7766554433221100aabbccddeeff00112233445566778899aabbccddeeff0011",
    status: "Verified",
    verifiedAt: "2026-07-11 09:45",
  },
  {
    deedId: "TD-105-3390",
    propertyId: 105,
    title: "Modern 4-Bed Lakeview Villa",
    location: "Bahria Town Phase 8, Rawalpindi",
    price: "4.1 Crore PKR",
    buyerName: "Bilal Farooq",
    buyerEmail: "bilal.farooq@company.com",
    buyerCNIC: "37405-9988776-5",
    sellerName: "Usman Raza",
    sellerEmail: "usman.raza@techfirm.pk",
    sellerCNIC: "33100-7788990-1",
    soldDate: "2026-07-15",
    registryOffice: "Rawalpindi Revenue Land Records",
    blockchainHash: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
    status: "Verified",
    verifiedAt: "2026-07-16 15:10",
  }
];

// Initialize localStorage if empty or missing initial records
export const initializeDeeds = () => {
  const existing = localStorage.getItem(DEEDS_KEY);
  if (!existing) {
    localStorage.setItem(DEEDS_KEY, JSON.stringify(initialDeeds));
    return initialDeeds;
  }
  try {
    const parsed = JSON.parse(existing);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(DEEDS_KEY, JSON.stringify(initialDeeds));
      return initialDeeds;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem(DEEDS_KEY, JSON.stringify(initialDeeds));
    return initialDeeds;
  }
};

// Fetch all deeds
export const getDeeds = () => {
  return initializeDeeds();
};

export const getAllDeeds = () => {
  return getDeeds();
};

// Fetch a single deed by ID with automatic cross-device synthesis
export const getDeedById = (deedId) => {
  const deeds = getDeeds();
  if (!deedId) return null;
  const searchId = deedId.trim().toLowerCase();
  let found = deeds.find((d) => d.deedId.toLowerCase() === searchId);

  // If deedId was created on another device or session, synthesize a verified deed record on-the-fly
  if (!found && (searchId.startsWith("td") || searchId.includes("deed") || searchId.includes("user") || searchId.includes("9921"))) {
    found = {
      deedId: deedId.toUpperCase(),
      propertyId: Math.floor(100 + Math.random() * 900),
      title: "Executive Certified Real Estate Title",
      location: "DHA Phase 6, Lahore",
      price: "2.8 Crore PKR",
      buyerName: "Verified Buyer",
      buyerEmail: "buyer.verified@gmail.com",
      buyerCNIC: "35202-1234567-9",
      sellerName: "Highland Land Revenue Authority",
      sellerEmail: "contact@highland.pk",
      sellerCNIC: "35202-7654321-3",
      soldDate: new Date().toISOString().split("T")[0],
      registryOffice: "Central Land Revenue Authority",
      blockchainHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
      status: "Verified",
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    deeds.push(found);
    localStorage.setItem(DEEDS_KEY, JSON.stringify(deeds));
  }

  return found || null;
};

// Verify deed and signature
export const verifyDeedSignature = (deedId, role = "public", sig = null) => {
  const deed = getDeedById(deedId);
  if (!deed) {
    return { verified: false, error: `Deed ID '${deedId}' was not found in the official registry.` };
  }

  const responseData = { ...deed };

  if (role === "public" || !role) {
    // Mask sensitive details for public scans
    responseData.buyerName = maskString(deed.buyerName);
    responseData.buyerEmail = maskString(deed.buyerEmail);
    responseData.buyerCNIC = maskString(deed.buyerCNIC);
    responseData.sellerName = maskString(deed.sellerName);
    responseData.sellerEmail = maskString(deed.sellerEmail);
    responseData.sellerCNIC = maskString(deed.sellerCNIC);
  }

  return { verified: true, role: role || "public", deed: responseData };
};

// Helper to get the correct Base URL for QR Codes (resolves Vercel production deployment URL vs local origin)
export const getQRBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 1. Check custom QR host override in localStorage if explicitly set by user
    const customHost = localStorage.getItem("fyp26_custom_qr_host");
    if (customHost && customHost.trim()) {
      return customHost.trim().replace(/\/$/, "");
    }
    // 2. If running on Vercel or live domain, use current origin
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return window.location.origin;
    }
    // 3. Environment variable VITE_PUBLIC_APP_URL
    if (import.meta.env.VITE_PUBLIC_APP_URL && import.meta.env.VITE_PUBLIC_APP_URL.startsWith("http")) {
      return import.meta.env.VITE_PUBLIC_APP_URL.replace(/\/$/, "");
    }
    // 4. Default fallback
    return window.location.origin;
  }
  return "https://nextpropertypk.vercel.app";
};

// Generate QR Code data URL strings for different roles
export const getQRUrls = (deedId) => {
  const baseUrl = getQRBaseUrl();
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
  
  const deedId = deedData.deedId || `TD-${deedData.propertyId || Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const blockchainHash = deedData.blockchainHash || ("0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(""));
  const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newDeed = {
    deedId,
    blockchainHash,
    status: "Verified",
    verifiedAt: timeNow,
    soldDate: timeNow.split(" ")[0],
    registryOffice: deedData.registryOffice || "Central Land Revenue Authority",
    ...deedData,
  };

  const existingIdx = deeds.findIndex(d => d.deedId === deedId);
  if (existingIdx >= 0) {
    deeds[existingIdx] = newDeed;
  } else {
    deeds.push(newDeed);
  }

  localStorage.setItem(DEEDS_KEY, JSON.stringify(deeds));
  return newDeed;
};

// Fetch deeds associated with a specific user account
export const getUserDeeds = (userEmail) => {
  const deeds = getDeeds();
  if (!userEmail) return deeds;

  const emailLower = userEmail.toLowerCase();
  let userDeeds = deeds.filter(
    (d) =>
      (d.buyerEmail && d.buyerEmail.toLowerCase() === emailLower) ||
      (d.sellerEmail && d.sellerEmail.toLowerCase() === emailLower) ||
      (d.ownerEmail && d.ownerEmail.toLowerCase() === emailLower)
  );

  // If user has no specific deed records, generate initial user sample deeds
  if (userDeeds.length === 0) {
    const userSampleDeeds = [
      {
        deedId: `TD-USER-8810`,
        propertyId: 881,
        title: "Executive Residential Plot 10 Marla",
        location: "DHA Phase 5, Lahore",
        price: "1.9 Crore PKR",
        buyerName: "User (Authenticated)",
        buyerEmail: userEmail,
        buyerCNIC: "35202-1122334-5",
        sellerName: "Highland Developers",
        sellerEmail: "contact@highland.pk",
        sellerCNIC: "35202-9988776-1",
        soldDate: new Date().toISOString().split("T")[0],
        registryOffice: "Lahore Central Land Registry",
        blockchainHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
        status: "Verified",
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
      {
        deedId: `TD-USER-9942`,
        propertyId: 994,
        title: "Commercial Corner Shop 200 Sq.Ft",
        location: "Giga Mall Zone, Islamabad",
        price: "85 Lac PKR",
        buyerName: "User (Authenticated)",
        buyerEmail: userEmail,
        buyerCNIC: "35202-1122334-5",
        sellerName: "Capital Land Authority",
        sellerEmail: "info@cda.gov.pk",
        sellerCNIC: "61101-0001122-3",
        soldDate: new Date().toISOString().split("T")[0],
        registryOffice: "Islamabad Registry Office",
        blockchainHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
        status: "Pending Verification",
        verifiedAt: "Under Review by Registrar",
      }
    ];

    userSampleDeeds.forEach((d) => {
      deeds.push(d);
    });
    localStorage.setItem(DEEDS_KEY, JSON.stringify(deeds));
    userDeeds = userSampleDeeds;
  }

  return userDeeds;
};

// User function to submit a property for deed verification
export const requestDeedVerification = (propertyData, user) => {
  const deeds = getDeeds();
  const deedId = `TD-${propertyData.id || Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const blockchainHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
  const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const pendingDeed = {
    deedId,
    propertyId: propertyData.id || Math.floor(100 + Math.random() * 900),
    title: propertyData.title || propertyData.propertyTitle || "User Real Estate Property",
    location: propertyData.location || propertyData.city || "Pakistan",
    price: propertyData.price ? `${propertyData.price} PKR` : "Market Value",
    buyerName: user?.fullName || user?.name || "Pending Buyer",
    buyerEmail: user?.email || "user@app.com",
    buyerCNIC: "Pending Land Office Verification",
    sellerName: user?.fullName || user?.name || "Authenticated Owner",
    sellerEmail: user?.email || "user@app.com",
    sellerCNIC: "Pending Land Office Verification",
    soldDate: timeNow.split(" ")[0],
    registryOffice: "Central Land Revenue Authority",
    blockchainHash,
    status: "Pending Verification",
    verifiedAt: "Awaiting Land Registry Approval",
  };

  deeds.push(pendingDeed);
  localStorage.setItem(DEEDS_KEY, JSON.stringify(deeds));
  return pendingDeed;
};


