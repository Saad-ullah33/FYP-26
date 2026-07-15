import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Building2,
  Percent,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
  User,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award
} from "lucide-react";
import { DATABASE_PROJECTS } from "../ExploreTools/AllProjects";
import { BorderBeam } from "../components/BorderBeam";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const found = DATABASE_PROJECTS.find((p) => p.id === parseInt(id));
    if (found) {
      setProject(found);
      setMessage(
        `Hi ${found.developer || "Developer"}, I am interested in your project "${found.title}" located in ${found.area}, ${found.city}. Please send me layout plans, price lists, and payment schedules. Thanks!`
      );
    } else {
      setProject(null);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
        <Building2 className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black mb-2 tracking-tight">Project Not Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          The mega project you are searching for is not registered or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate("/property-finder")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/20"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const getProgressColor = (percent) => {
    if (percent === 100) return "bg-emerald-500 text-emerald-400 border-emerald-500/20";
    if (percent > 60) return "bg-blue-500 text-blue-400 border-blue-500/20";
    if (percent > 30) return "bg-amber-500 text-amber-400 border-amber-500/20";
    return "bg-orange-500 text-orange-400 border-orange-500/20";
  };

  const getProgressLabel = (percent) => {
    if (percent === 100) return "Completed";
    if (percent >= 75) return "Finishing Stage";
    if (percent >= 30) return "Under Construction";
    return "Launching Soon";
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setPhone("");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative pb-20 select-none overflow-x-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
        <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-8 relative z-10">
        
        {/* Back navigation banner */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-4 py-2.5 rounded-full transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="font-semibold tracking-wide">Back to Ventures</span>
          </button>
          
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">
              Project ID: {project.id}
            </span>
          </div>
        </div>

        {/* Hero Info Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-md shadow-blue-500/10">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" /> Featured Venture
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-100 tracking-tight">
              {project.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{project.area}, {project.city}</span>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Invest From</span>
            <span className="text-2xl md:text-3xl font-black text-blue-400 tracking-tight">
              {project.price}
            </span>
          </div>
        </div>

        {/* Detail layout columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Middle: Media, specifications, description */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project Image Panel */}
            <div className="bg-slate-900/60 border border-slate-800/40 rounded-3xl overflow-hidden relative shadow-2xl group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              </div>

              {/* Shimmer/border effect */}
              <BorderBeam size={200} duration={12} borderWidth={1.5} borderRadius={24} />
            </div>

            {/* Core Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Construction status card */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Progress status</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block">
                    {getProgressLabel(project.progress)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-extrabold">
                    <span>Active Work</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${project.progress === 100 ? "bg-emerald-500" : "bg-blue-500"} rounded-full transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Developer stats card */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-32">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Promoter / Builder</span>
                  <span className="text-sm font-black text-slate-200 mt-1 block leading-snug line-clamp-2">
                    {project.developer || "Exclusive Developer"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-extrabold uppercase">
                  <Award className="w-3.5 h-3.5 text-yellow-500" /> Premium Developer
                </div>
              </div>

              {/* Investment class card */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-32">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Appreciation Class</span>
                  <span className="text-sm font-black text-teal-400 mt-1 block">
                    High Yield (L1)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-extrabold uppercase">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-500" /> +15-20% Projection
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-200 tracking-wide uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" /> Project Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Available Units</span>
                  <span className="font-bold text-slate-200">{project.specs}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Category Class</span>
                  <span className="font-bold text-slate-200 uppercase">{project.category}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Structure Town</span>
                  <span className="font-bold text-slate-200">{project.area}, {project.city}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Developer Rating</span>
                  <span className="font-bold text-slate-200 flex items-center gap-0.5">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>

            {/* Project Overview / Description Card */}
            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-200 tracking-wide uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Project Overview
              </h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Welcome to <strong>{project.title}</strong>, a state-of-the-art venture launched by <strong>{project.developer}</strong>. 
                Situated on the premium corridor of <strong>{project.area}, {project.city}</strong>, this development is specifically designed to meet standard modern investment parameters.
              </p>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                The layout integrates advanced security systems, ample dedicated resident parking spaces, high-speed lift mechanisms, and continuous generator backups. With construction completion currently standing at <strong>{project.progress}%</strong>, units are selling out swiftly. Secure your investment today to capitalize on early launch schedules and high projected rental yields.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Panel */}
          <div className="space-y-6">
            
            {/* Developer Card Contact */}
            <div className="bg-slate-900/65 border border-slate-800/80 p-6 rounded-3xl relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg shadow-inner">
                    {project.developer?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 leading-none">{project.developer || "Developer Agent"}</h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Project Builder</span>
                  </div>
                </div>

                {submitted ? (
                  <div className="space-y-4 py-8 text-center animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-200">Inquiry Received</h4>
                      <p className="text-xs text-slate-400 leading-relaxed px-4">
                        Success! The developer <strong>{project.developer}</strong> has been notified and will contact you shortly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-500 uppercase tracking-wider pl-1 font-bold">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#0a0d16] border border-slate-800 focus:border-blue-500 text-xs rounded-xl pl-10 pr-3.5 py-3 outline-none text-slate-200 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-500 uppercase tracking-wider pl-1 font-bold">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#0a0d16] border border-slate-800 focus:border-blue-500 text-xs rounded-xl pl-10 pr-3.5 py-3 outline-none text-slate-200 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-500 uppercase tracking-wider pl-1 font-bold">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                          type="tel"
                          required
                          placeholder="+92 300 1234567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#0a0d16] border border-slate-800 focus:border-blue-500 text-xs rounded-xl pl-10 pr-3.5 py-3 outline-none text-slate-200 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-500 uppercase tracking-wider pl-1 font-bold">Message Details</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                        <textarea
                          rows="4"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-[#0a0d16] border border-slate-800 focus:border-blue-500 text-xs rounded-xl pl-10 pr-3.5 py-3 outline-none text-slate-200 transition resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending Inquiry...
                        </>
                      ) : (
                        "Submit Venture Inquiry"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Quick security trust card */}
            <div className="bg-slate-900/30 border border-slate-800/40 p-5 rounded-2xl text-[11px] text-slate-500 space-y-2">
              <span className="text-slate-400 font-extrabold uppercase block tracking-wider">Trusted Venture Program</span>
              <p className="leading-relaxed">
                This project is verified by NextProperty Legal Framework. Project layout approvals, land registries, and structural engineering certifications have been checked.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;
