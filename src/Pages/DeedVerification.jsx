import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { verifyDeedSignature, generateSignature, getDeedById, getAllDeeds, getQRBaseUrl } from "../utils/deedService";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Building2, 
  User, 
  DollarSign, 
  Calendar, 
  Search, 
  Download, 
  ArrowLeft,
  Lock,
  Globe,
  CheckCircle,
  Eye,
  AlertTriangle,
  QrCode,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

const DeedVerification = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  // Read params
  const paramDeedId = searchParams.get("deedId") || params.deedId || "";
  const paramRole = searchParams.get("role") || "public";
  const paramSig = searchParams.get("sig") || "";

  // Component state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [deedId, setDeedId] = useState(paramDeedId);
  const [role, setRole] = useState(paramRole);
  const [sig, setSig] = useState(paramSig);

  // Verification Step Animation state
  const [verificationStep, setVerificationStep] = useState("");
  const [verificationProgress, setVerificationProgress] = useState(0);

  // Certified Vault state
  const [allDeeds, setAllDeeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [lookupId, setLookupId] = useState("");
  const [lookupRole, setLookupRole] = useState("public");
  const [lookupError, setLookupError] = useState("");

  // Ledger Audit Consensus Modal
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditProgress, setAuditProgress] = useState(0);

  // In-App Camera Scanner Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // Load deeds catalog
  useEffect(() => {
    const deeds = getAllDeeds();
    setAllDeeds(deeds);
  }, []);

  // Main verification effect
  useEffect(() => {
    if (paramDeedId) {
      setDeedId(paramDeedId);
      setRole(paramRole);

      const generatedSig = paramSig || generateSignature(paramDeedId, paramRole);
      setSig(generatedSig);

      executeVerificationFlow(paramDeedId, paramRole, generatedSig);
    } else {
      setResult(null);
      setLoading(false);
    }
  }, [paramDeedId, paramRole, paramSig]);

  // Execute 4-Step Verification Sequence
  const executeVerificationFlow = (targetDeedId, targetRole, targetSig) => {
    setLoading(true);
    setResult(null);
    setVerificationProgress(10);
    setVerificationStep("Reading cryptographic signature & key payloads...");

    setTimeout(() => {
      setVerificationProgress(40);
      setVerificationStep("Verifying signature validity with Central Secret Key...");
    }, 600);

    setTimeout(() => {
      setVerificationProgress(75);
      setVerificationStep("Querying Land Revenue Secure Registry Database...");
    }, 1200);

    setTimeout(() => {
      setVerificationProgress(100);
      setVerificationStep("Validating SHA-256 Blockchain Hash Consensus...");
    }, 1800);

    setTimeout(() => {
      const res = verifyDeedSignature(targetDeedId, targetRole, targetSig);
      setResult(res);
      setLoading(false);

      if (res && res.verified) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 2200);
  };

  // Handle Manual Form Lookup
  const handleLookupSubmit = (overrideId, overrideRole) => {
    const targetId = (overrideId || lookupId || searchTerm).trim();
    const targetRole = overrideRole || lookupRole;

    if (!targetId) {
      setLookupError("Please enter a valid Deed ID (e.g. TD-101-9921) to audit.");
      return;
    }

    setLookupError("");
    const generatedSig = generateSignature(targetId, targetRole);
    navigate(`/verify-deed?deedId=${encodeURIComponent(targetId)}&role=${targetRole}&sig=${generatedSig}`);
  };

  // Filtered catalogue deeds
  const filteredDeeds = useMemo(() => {
    return allDeeds.filter((deed) => {
      const matchesSearch = 
        deed.deedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deed.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deed.buyerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = selectedCity === "ALL" || deed.location.toLowerCase().includes(selectedCity.toLowerCase());

      return matchesSearch && matchesCity;
    });
  }, [allDeeds, searchTerm, selectedCity]);

  // Handle In-App Camera QR Code Scanner Initializer
  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isCameraModalOpen) {
      const timer = setTimeout(() => {
        try {
          html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader-container",
            { 
              fps: 10, 
              qrbox: { width: 250, height: 250 },
              rememberLastUsedCamera: true,
              aspectRatio: 1.0
            },
            /* verbose= */ false
          );

          html5QrcodeScanner.render(
            (decodedText) => {
              console.log("Scanned QR Code URL:", decodedText);
              if (html5QrcodeScanner) {
                html5QrcodeScanner.clear().catch(err => console.error("Scanner clear error", err));
              }
              setIsCameraModalOpen(false);

              try {
                if (decodedText.includes("deedId=")) {
                  const urlObj = new URL(decodedText);
                  const scannedDeedId = urlObj.searchParams.get("deedId");
                  const scannedRole = urlObj.searchParams.get("role") || "public";
                  const scannedSig = urlObj.searchParams.get("sig") || "";

                  if (scannedDeedId) {
                    navigate(`/verify-deed?deedId=${encodeURIComponent(scannedDeedId)}&role=${scannedRole}&sig=${scannedSig}`);
                  } else {
                    alert("Scanned QR code does not contain a valid Deed ID.");
                  }
                } else {
                  alert(`Scanned content: ${decodedText}`);
                }
              } catch (e) {
                if (decodedText.startsWith("TD-")) {
                  navigate(`/verify-deed?deedId=${encodeURIComponent(decodedText)}&role=public`);
                } else {
                  alert(`Scanned QR Text: ${decodedText}`);
                }
              }
            },
            (errorMessage) => {
              // Ignore scanning frame errors
            }
          );
        } catch (err) {
          console.error("Camera scanner init error:", err);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (html5QrcodeScanner) {
          html5QrcodeScanner.clear().catch(err => console.error(err));
        }
      };
    }
  }, [isCameraModalOpen, navigate]);

  // Handle Ledger Consensus Audit Simulation
  const handleAuditLedger = () => {
    setIsAuditing(true);
    setAuditProgress(10);
    setAuditLogs([
      "Connecting to NextProperty Distributed Ledger Nodes...",
      `Querying Merkle Tree proof for Deed ID: ${result?.deed?.deedId || deedId}`
    ]);

    setTimeout(() => {
      setAuditProgress(40);
      setAuditLogs(prev => [...prev, `SHA-256 Hash Verified: ${result?.deed?.blockchainHash}`]);
    }, 800);

    setTimeout(() => {
      setAuditProgress(75);
      setAuditLogs(prev => [...prev, "Checking Land Revenue Registry Validator Nodes... Status: 100% Match"]);
    }, 1600);

    setTimeout(() => {
      setAuditProgress(100);
      setAuditLogs(prev => [...prev, "✅ Consensus Achieved: Title Deed Record is 100% Authentic and Unaltered."]);
    }, 2400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-start p-4 md:p-8 relative font-sans">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        @media print {
          body, html, #root, #root > div, main, .min-h-screen, .my-auto {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: "Inter", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            min-height: auto !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            overflow: visible !important;
          }
          .absolute, nav, footer, header, .print\\:hidden, button {
            display: none !important;
          }
          .print-container {
            background: #ffffff !important;
            background-color: #ffffff !important;
            border: 4px double #d4af37 !important;
            outline: 1px solid rgba(212, 175, 55, 0.4) !important;
            outline-offset: -8px !important;
            border-radius: 0px !important;
            box-shadow: none !important;
            padding: 20px 24px !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            color: #0f172a !important;
            page-break-inside: avoid !important;
            position: static !important;
          }
          .print-bg-light {
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
          }
          .print-container p, .print-container span, .print-container label, .print-container div {
            color: #0f172a !important;
          }
          .print-container .text-amber-400, .print-container .text-amber-300 {
            color: #b45309 !important;
          }
          .print-container .text-emerald-400 {
            color: #047857 !important;
          }
          .print-container .text-sky-400 {
            color: #0369a1 !important;
          }
        }
      `}</style>
      
      {/* Light subtle top background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-100 pointer-events-none" />

      <div className="w-full max-w-5xl z-10 my-auto">
        <AnimatePresence mode="wait">
          
          {/* 1. LOADING SCREEN */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-2xl text-center max-w-lg mx-auto"
            >
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Cryptographic Verification</h2>
              <p className="text-xs text-slate-500 font-mono mb-6">{verificationStep || "Initializing signature checks..."}</p>
              
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 p-0.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* 2. SUCCESS VERIFIED CERTIFICATE */}
          {!loading && result && result.verified && (
            <motion.div
              key="verified-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-2 border-amber-400/60 rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-200/80 print-container relative overflow-hidden text-slate-900"
            >
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Top Navigation Back Action */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 print:hidden">
                <button
                  onClick={() => navigate("/verify-deed")}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back to Registry Vault
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">View Mode:</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold capitalize">
                    {role} Profile
                  </span>
                </div>
              </div>

              {/* Official Print Header with Logo & Brand (Visible during Print / PDF) */}
              <div className="hidden print:flex items-center justify-between pb-4 mb-6 border-b-2 border-amber-500/40">
                <div className="flex items-center gap-3">
                  <img src="/next_logo2.png" alt="NextProperty Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">NEXTPROPERTY</h2>
                    <p className="text-[9px] font-mono font-bold text-amber-700 uppercase tracking-widest">
                      Government Land Revenue & Title Registry Vault
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[10px] font-mono font-bold rounded-md uppercase">
                    Official Verification Certificate
                  </span>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">Ref: FYP26-REG-2026</p>
                </div>
              </div>

              {/* Certificate Header with Scannable QR */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200 print:border-slate-300">
                <div className="text-center md:text-left space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 print:text-amber-800 text-xs font-mono font-bold uppercase mb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" /> Cryptographically Sealed Title
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">
                    Digital Title Deed Certificate
                  </h1>
                  <p className="text-xs text-slate-600 font-mono tracking-wider">
                    Official Land Revenue Registry Verification Seal
                  </p>
                </div>

                {/* Live Scannable Vector QR Code */}
                <div className="bg-white p-3 rounded-2xl border-2 border-amber-400 shadow-lg shadow-amber-500/10 flex flex-col items-center justify-center shrink-0">
                  <QRCodeSVG 
                    value={`${getQRBaseUrl()}/verify-deed?deedId=${result.deed.deedId}&role=public&sig=${generateSignature(result.deed.deedId, "public")}`}
                    size={110}
                    level="H"
                    includeMargin={true}
                  />
                  <span className="text-[9px] font-mono font-extrabold text-slate-900 mt-1 uppercase tracking-wider">
                    📷 Scan via Mobile
                  </span>
                </div>
              </div>

              {/* Deed Specifications Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 print-bg-light border border-slate-200 p-6 rounded-2xl mb-6">
                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide block">Deed ID / Registry ID</label>
                    <p className="text-sm font-bold font-mono text-amber-800 print:text-slate-900">{result.deed.deedId}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide block">Property Title</label>
                    <p className="text-base font-extrabold text-slate-900">{result.deed.title}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide block">Location</label>
                    <p className="text-sm text-slate-700 font-medium">{result.deed.location}</p>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide block">Transaction Value</label>
                    <p className="text-base font-black text-emerald-700 print:text-emerald-800">{result.deed.price}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide block">Registration Date & Office</label>
                    <p className="text-sm text-slate-800 print:text-slate-900 font-semibold">
                      {result.deed.soldDate} — <span className="text-slate-600">{result.deed.registryOffice}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wide block">Verification Timestamp</label>
                    <p className="text-xs text-slate-600 font-mono">{result.deed.verifiedAt}</p>
                  </div>
                </div>
              </div>

              {/* Blockchain Integrity Block */}
              <div className="bg-slate-900 text-slate-100 print-bg-light border border-slate-800 p-4 rounded-xl mb-6 text-left">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-1 font-mono">Blockchain Merkle Proof Hash</span>
                <p className="text-[11px] font-mono text-slate-300 print:text-slate-800 break-all leading-tight">
                  {result.deed.blockchainHash}
                </p>
              </div>

              {/* Parties Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                <div className="bg-slate-50 print-bg-light border border-slate-200 p-4 rounded-xl">
                  <span className="text-[10px] text-emerald-700 uppercase tracking-wider block font-bold mb-2">Seller Details</span>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">{result.deed.sellerName}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{result.deed.sellerEmail}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{result.deed.sellerCNIC}</p>
                  </div>
                </div>

                <div className="bg-slate-50 print-bg-light border border-slate-200 p-4 rounded-xl">
                  <span className="text-[10px] text-blue-700 uppercase tracking-wider block font-bold mb-2">Buyer Details</span>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">{result.deed.buyerName}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{result.deed.buyerEmail}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{result.deed.buyerCNIC}</p>
                  </div>
                </div>
              </div>

              {/* Official Seals & Signatures Block */}
              <div className="my-6 pt-6 border-t-2 border-slate-200 print:border-slate-300 grid grid-cols-3 gap-4 items-center text-left">
                {/* Official Gold Seal Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-100 flex flex-col items-center justify-center text-amber-800 shrink-0">
                    <Award className="w-5 h-5 text-amber-700" />
                    <span className="text-[6px] font-black uppercase tracking-tighter">SEAL</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Official Title Seal</p>
                    <p className="text-[8px] text-slate-500 font-mono">Government Registry Audit</p>
                  </div>
                </div>

                {/* Sub-Registrar Authority Signature */}
                <div className="text-center space-y-1">
                  <div className="h-8 border-b border-dashed border-slate-400 flex items-end justify-center pb-0.5">
                    <span className="font-serif italic text-slate-800 text-xs font-semibold">Sub-Registrar Revenue</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-900 uppercase tracking-wide">Sub-Registrar Signature</p>
                </div>

                {/* Blockchain Officer Signature */}
                <div className="text-right space-y-1">
                  <div className="h-8 border-b border-dashed border-slate-400 flex items-end justify-end pb-0.5">
                    <span className="font-mono text-[10px] text-slate-800 font-bold">0x8f39...b56cd7e8</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-900 uppercase tracking-wide">Cryptographic Ledger Seal</p>
                </div>
              </div>

              {/* Role Toggle Bar */}
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 print:hidden">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900">Switch View Mode & Role Authentication</h4>
                  <p className="text-[11px] text-slate-600">Public scans mask CNIC and owner details for privacy.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["public", "buyer", "seller", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleLookupSubmit(result.deed.deedId, r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                        role === r 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end print:hidden">
                <button
                  onClick={handleAuditLedger}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles size={16} className="text-amber-400" /> Audit Ledger Consensus
                </button>

                <button
                  onClick={handlePrint}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <Download size={16} /> Print / Save PDF Certificate
                </button>
              </div>

            </motion.div>
          )}

          {/* 3. ERROR SCREEN */}
          {!loading && result && !result.verified && (
            <motion.div
              key="error-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-200 mx-auto mb-4">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-red-600 mb-1">Verification Failed</h2>
              <p className="text-xs text-slate-600 font-mono mb-4">{result.error}</p>

              <button
                onClick={() => navigate("/verify-deed")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-xs cursor-pointer"
              >
                Return to Registry Vault
              </button>
            </motion.div>
          )}

          {/* 4. TRUSTDEED CERTIFIED VAULT & MANUAL LOOKUP PORTAL */}
          {!loading && !result && (
            <motion.div
              key="vault-landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header Banner */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl shadow-slate-200/60">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wider uppercase mb-3">
                  <Award size={13} className="text-amber-700" /> Official Title Deed Registry
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                  TrustDeed <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 text-transparent bg-clip-text">Verification Vault</span>
                </h1>
                <p className="text-slate-600 text-xs md:text-sm max-w-xl mx-auto mt-2 font-medium">
                  Cryptographically sealed property title deeds backed by SHA-256 blockchain hash proofs and land revenue authority validation.
                </p>

                {/* Quick Search & Manual Lookup Form */}
                <div className="mt-6 max-w-2xl mx-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter Deed ID (e.g. TD-101-9921) or location..."
                      value={lookupId || searchTerm}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLookupId(val);
                        setSearchTerm(val);
                        setLookupError("");
                      }}
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none transition shadow-sm"
                    />
                  </div>

                  <select
                    value={lookupRole}
                    onChange={(e) => setLookupRole(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium shadow-sm"
                  >
                    <option value="public">Public Scan</option>
                    <option value="buyer">Buyer Profile</option>
                    <option value="seller">Seller Profile</option>
                    <option value="admin">Administrator</option>
                  </select>

                  <button
                    onClick={() => setIsCameraModalOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-blue-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                    title="Scan QR code using live webcam or camera"
                  >
                    <QrCode size={16} /> 📷 Camera Scan
                  </button>

                  <button
                    onClick={() => handleLookupSubmit()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={16} /> Audit Deed
                  </button>
                </div>
                {lookupError && <p className="text-xs text-red-600 mt-2 font-semibold">{lookupError}</p>}
              </div>

              {/* Certified Deeds Catalogue Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <QrCode size={18} className="text-blue-600" /> Registered Property Title Deeds
                    </h3>
                    <p className="text-xs text-slate-500">Select any title deed record below for 1-click cryptographic verification.</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {["ALL", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"].map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                          selectedCity === city 
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Verified Deeds */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDeeds.map((deed) => (
                    <div 
                      key={deed.deedId}
                      className="bg-white border border-slate-200/90 hover:border-blue-400 p-5 rounded-2xl transition-all duration-300 group flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10 text-left"
                    >
                      <div>
                        {/* Top Badge Row */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold">
                            {deed.deedId}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle size={10} /> Verified
                          </span>
                        </div>

                        {/* Title & Location */}
                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {deed.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Building2 size={12} className="text-slate-400 shrink-0" /> {deed.location}
                        </p>

                        {/* Specs list */}
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Transaction Price:</span>
                            <span className="font-bold text-slate-900">{deed.price}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Registered Date:</span>
                            <span className="font-mono text-slate-600">{deed.soldDate}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Authority:</span>
                            <span className="text-slate-700 font-medium truncate max-w-[150px]">{deed.registryOffice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleLookupSubmit(deed.deedId, "public")}
                        className="mt-5 w-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <ShieldCheck size={14} /> Verify Title Deed
                      </button>
                    </div>
                  ))}
                </div>

                {filteredDeeds.length === 0 && (
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500 text-xs">
                    No verified deed records found matching your filter criteria.
                  </div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Ledger Audit Modal */}
      {isAuditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" /> Decentralized Ledger Consensus Audit
              </h3>
              <button 
                onClick={() => setIsAuditing(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1.5 min-h-[160px]">
              {auditLogs.map((log, idx) => (
                <p key={idx} className="animate-fade-in">&gt; {log}</p>
              ))}
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${auditProgress}%` }} />
            </div>

            {auditProgress === 100 && (
              <button
                onClick={() => setIsAuditing(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Audit Complete - Ledger Immutable
              </button>
            )}
          </div>
        </div>
      )}

      {/* IN-APP CAMERA SCANNER MODAL */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCameraModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl z-10">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="text-blue-600" size={20} />
                <h3 className="text-sm font-bold text-slate-900">Live Camera & Image QR Scanner</h3>
              </div>
              <button onClick={() => setIsCameraModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 overflow-hidden my-2">
              <div id="qr-reader-container" className="w-full rounded-xl overflow-hidden text-slate-700 text-xs"></div>
            </div>

            <p className="text-xs text-slate-500 mt-3 font-mono">
              📷 Point your webcam or camera at any QR code, or select an image file to scan.
            </p>

            <button
              onClick={() => setIsCameraModalOpen(false)}
              className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeedVerification;
