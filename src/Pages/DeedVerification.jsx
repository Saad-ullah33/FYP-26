import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyDeedSignature } from "../utils/deedService";
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
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const DeedVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationStep, setVerificationStep] = useState("");
  const [result, setResult] = useState(null);

  const deedId = searchParams.get("deedId");
  const role = searchParams.get("role") || "public";
  const sig = searchParams.get("sig");

  useEffect(() => {
    if (!deedId || !sig) {
      setResult({
        verified: false,
        error: "Missing verification parameters. Please scan a valid QR code.",
      });
      setLoading(false);
      return;
    }

    // Step-by-step verification simulation for premium UX
    const steps = [
      { progress: 20, text: "Reading cryptographic signature..." },
      { progress: 50, text: "Verifying signature validity with Central Secret..." },
      { progress: 85, text: "Querying secure registry database..." },
      { progress: 100, text: "Validating blockchain hash integrity..." },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setVerificationProgress(steps[currentStepIdx].progress);
        setVerificationStep(steps[currentStepIdx].text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        
        // Execute the verification
        const verifyRes = verifyDeedSignature(deedId, role, sig);
        setResult(verifyRes);
        setLoading(false);

        if (verifyRes.verified) {
          // Success confetti!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#d4af37", "#f3e5ab", "#4caf50", "#2196f3"],
          });
        }
      }
    }, 550);

    return () => clearInterval(interval);
  }, [deedId, role, sig]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <style>{`
        @media print {
          body, html, #root {
            background: #ffffff !important;
            color: #000000 !important;
            font-family: "Times New Roman", Times, serif !important;
          }
          .absolute {
            display: none !important;
          }
          .print\\:hidden, button, header, footer {
            display: none !important;
          }
          .print-container {
            background: #ffffff !important;
            border: 6px double #d4af37 !important;
            border-radius: 0px !important;
            box-shadow: none !important;
            padding: 40px !important;
            margin: 0 auto !important;
            width: 100% !important;
            color: #111111 !important;
          }
          .print-bg-light {
            background-color: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
          }
          .print-signatures {
            display: flex !important;
            justify-content: space-between !important;
            margin-top: 50px !important;
            padding-top: 20px !important;
          }
          .print-sig-line {
            width: 220px !important;
            border-top: 1.5px solid #000000 !important;
            text-align: center !important;
            font-size: 10px !important;
            color: #000000 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            margin-top: 40px !important;
          }
        }
      `}</style>
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.3)_0%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30" />

      <div className="w-full max-w-3xl z-10">
        <AnimatePresence mode="wait">
          {/* 1. LOADING SCREEN */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl max-w-md mx-auto"
            >
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                {/* Circular progress bar animation */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#1e293b"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#d4af37"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * verificationProgress) / 100}
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute text-sm font-semibold text-amber-400">
                  {verificationProgress}%
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-2 tracking-wide">
                Verifying Deed Authenticity
              </h3>
              <p className="text-sm text-slate-400 min-h-[40px] transition-all duration-200">
                {verificationStep}
              </p>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>End-to-End Cryptographic Validation</span>
              </div>
            </motion.div>
          )}

          {/* 2. VERIFIED CERTIFICATE */}
          {!loading && result && result.verified && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="print:bg-white print:text-slate-900 print:shadow-none print:border-none print:p-0"
            >
              {/* Back to Home Button (Hidden in print) */}
              <div className="mb-4 flex justify-between items-center print:hidden">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm bg-slate-900/50 hover:bg-slate-900 px-4 py-2 rounded-full border border-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Portal</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="capitalize">{role} Verification Mode</span>
                </div>
              </div>

              {/* The Certificate Card */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative print-container print:border-2 print:border-slate-300 print:rounded-none">
                {/* Visual accents for certificate layout */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 print:hidden" />
                <div className="absolute top-1.5 right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none print:hidden" />

                {/* Certificate Content */}
                <div className="p-6 md:p-10">
                  {/* Header Badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-6 print:border-slate-300"
                  >
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight print:text-slate-900">
                        TRUSTDEED RECORD
                      </h1>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 print:text-slate-500">
                        Official Land & Property Registry Certificate
                      </p>
                    </div>

                    {/* Status Gold Seal */}
                    <div className="flex items-center gap-3 mt-4 md:mt-0 bg-slate-950/60 px-4 py-2.5 rounded-2xl border border-amber-500/30 print:border-slate-400 print:bg-white">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30 animate-pulse">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Security Seal
                        </div>
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wide print:text-slate-900">
                          VERIFIED AUTHENTIC
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Transaction Metadata Grid */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                  >
                    {/* Left: Property Info */}
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 print:bg-slate-50 print:border-slate-200">
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        Property Specifications
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Deed ID / Registry ID</label>
                          <p className="text-sm font-semibold font-mono text-slate-200 print:text-slate-900">{result.deed.deedId}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Title</label>
                          <p className="text-base font-bold text-slate-100 print:text-slate-950">{result.deed.title}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Location</label>
                          <p className="text-sm text-slate-300 print:text-slate-700">{result.deed.location}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Total Valuation</label>
                          <p className="text-lg font-extrabold text-amber-400 print:text-slate-900 flex items-center gap-0.5">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            {result.deed.price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Registration & Ledger */}
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 print:bg-slate-50 print:border-slate-200">
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Ledger Verification
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Sale Date</label>
                          <div className="flex items-center gap-1.5 text-sm text-slate-300 print:text-slate-900 mt-0.5">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span>{result.deed.soldDate}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Registry Office</label>
                          <p className="text-sm text-slate-300 print:text-slate-900">{result.deed.registryOffice}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Ledger Verification At</label>
                          <p className="text-xs text-slate-300 print:text-slate-700 font-semibold">{result.deed.verifiedAt}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wide">Blockchain Transaction Hash</label>
                          <p className="text-[10px] font-mono text-slate-400 break-all select-all hover:text-amber-400 transition cursor-pointer print:text-slate-700 bg-slate-950/60 p-2 rounded-lg border border-slate-900 mt-1 print:border-none print:bg-transparent">
                            {result.deed.blockchainHash}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Parties Involved */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 mb-8 print:bg-slate-50 print:border-slate-200"
                  >
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Associated Parties
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Seller Info */}
                      <div className="space-y-2 border-r border-slate-800/50 pr-4 print:border-slate-300">
                        <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-extrabold">Seller details</span>
                        <div className="grid grid-cols-3 text-xs gap-y-1">
                          <span className="text-slate-500">Name:</span>
                          <span className="col-span-2 text-slate-200 font-semibold print:text-slate-900">{result.deed.sellerName}</span>
                          <span className="text-slate-500">Email:</span>
                          <span className="col-span-2 text-slate-300 font-mono print:text-slate-700">{result.deed.sellerEmail}</span>
                          <span className="text-slate-500">CNIC:</span>
                          <span className="col-span-2 text-slate-300 font-mono print:text-slate-700">{result.deed.sellerCNIC}</span>
                        </div>
                      </div>

                      {/* Buyer Info */}
                      <div className="space-y-2 pl-0 md:pl-2">
                        <span className="text-[10px] text-sky-400 uppercase tracking-wider font-extrabold">Buyer details</span>
                        <div className="grid grid-cols-3 text-xs gap-y-1">
                          <span className="text-slate-500">Name:</span>
                          <span className="col-span-2 text-slate-200 font-semibold print:text-slate-900">{result.deed.buyerName}</span>
                          <span className="text-slate-500">Email:</span>
                          <span className="col-span-2 text-slate-300 font-mono print:text-slate-700">{result.deed.buyerEmail}</span>
                          <span className="text-slate-500">CNIC:</span>
                          <span className="col-span-2 text-slate-300 font-mono print:text-slate-700">{result.deed.buyerCNIC}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Public Masking Note (If scanned by random public) */}
                  {role === "public" && (
                    <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 text-slate-400 p-3.5 rounded-2xl text-xs mb-4 print:hidden">
                      <Eye className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200 block mb-0.5">Privacy Shield Active</strong>
                        You are viewing this deed in Public Mode. Sensitive details (CNIC, Email, Phone Numbers) have been masked to safeguard buyer and seller privacy. Owners can authenticate to view their unmasked certificates.
                      </div>
                    </div>
                  )}

                  {/* Official Signatures Area (Only visible in print PDF) */}
                  <div className="hidden print-signatures mb-6">
                    <div className="print-sig-line">
                      <span className="font-bold">Registrar General</span>
                      <span className="text-[9px] text-slate-500 mt-8">Official Stamp & Signature</span>
                    </div>
                    <div className="print-sig-line">
                      <span className="font-bold">Blockchain Auditor</span>
                      <span className="text-[9px] text-slate-500 mt-8">Cryptographic Integrity Seal</span>
                    </div>
                  </div>

                  {/* Security Hash Footnote */}
                  <div className="border-t border-slate-800/80 pt-5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 gap-4 print:border-slate-300 print:text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-green-400" />
                      Secured with AES & HMAC Cryptographic Signatures
                    </span>
                    <span>© 2026 PROPSIGHT Registry Services</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Hidden in print) */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-6 flex justify-end gap-3 print:hidden"
              >
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Deed</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* 3. TAMPERED OR INVALID SCREEN */}
          {!loading && result && !result.verified && (
            <motion.div
              key="tampered"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-950/20 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 mx-auto mb-6">
                <ShieldAlert className="w-12 h-12" />
              </div>
              
              <h1 className="text-2xl font-extrabold text-red-400 mb-2 tracking-tight">
                VERIFICATION FAILED
              </h1>
              <p className="text-sm text-red-200 mb-4 uppercase tracking-widest font-semibold font-mono">
                [ {result.error || "TAMPERING DETECTED"} ]
              </p>
              
              <div className="bg-red-950/40 p-4 rounded-xl border border-red-950 text-slate-300 text-xs text-left mb-6 leading-relaxed">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    <strong>Security Alert:</strong> The signature parameter in the URL does not match the deed record details. This indicates the parameters (such as User Role, Deed ID, or Sale Price) have been manually altered, or this is a forged QR code.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl border border-slate-800 transition text-sm"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default DeedVerification;
