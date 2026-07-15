import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, ImageOverlay, Tooltip, Popup, useMap, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { colonies } from "./coloniesData";
import { 
  Search, 
  MapPin, 
  Eye, 
  EyeOff, 
  Layers, 
  Info, 
  Grid, 
  Image as ImageIcon, 
  Sliders, 
  ChevronRight, 
  Crosshair,
  Building,
  CheckCircle,
  HelpCircle,
  Coins,
  ArrowLeft,
  Loader2,
  Sparkles
} from "lucide-react";
import { geminiService } from "../../services/geminiService";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// ==========================================
// MAP EVENT TRACKER & CONTROLLER COMPONENT
// ==========================================
const MapController = ({ activeColonyCenter, activeColonyZoom, onZoomChange }) => {
  const map = useMap();

  // Track zoom level shifts dynamically
  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });

  // Smoothly fly to center coordinates when a colony is activated
  useEffect(() => {
    if (activeColonyCenter) {
      map.flyTo(activeColonyCenter, activeColonyZoom || 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [activeColonyCenter, activeColonyZoom, map]);

  return null;
};

const Map = () => {
  const navigate = useNavigate();
  // Faisalabad center coord (Clock Tower)
  const faisalabadCenter = [31.418715, 73.079109];

  // State
  // Programmatic toggles setup for all colonies (Senior Developer Best Practice)
  const [toggledColonies, setToggledColonies] = useState(() => {
    const toggles = {};
    colonies.forEach((c) => {
      toggles[c.id] = true;
    });
    return toggles;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'developed', 'under-development'
  const [selectedColony, setSelectedColony] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Advanced GIS plot status filter
  const [plotFilter, setPlotFilter] = useState("all"); // 'all', 'available', 'sold', 'reserved'

  // Global Layer Controls
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showPlots, setShowPlots] = useState(true);
  const [showBlueprint, setShowBlueprint] = useState(true);
  const [blueprintOpacity, setBlueprintOpacity] = useState(0.4);

  // Focus properties
  const [focusCenter, setFocusCenter] = useState(null);
  const [focusZoom, setFocusZoom] = useState(null);

  // AI-powered plot analysis states
  const [plotAiLoading, setPlotAiLoading] = useState(false);
  const [plotAiAnalysis, setPlotAiAnalysis] = useState("");

  useEffect(() => {
    if (selectedPlot && selectedColony) {
      setPlotAiLoading(true);
      setPlotAiAnalysis("");
      geminiService.generatePlotAnalysis({
        plotNumber: selectedPlot.number,
        block: selectedPlot.block,
        size: selectedPlot.size,
        price: selectedPlot.price,
        status: selectedPlot.status,
        colonyName: selectedColony.name
      }).then((analysis) => {
        setPlotAiAnalysis(analysis);
        setPlotAiLoading(false);
      }).catch((err) => {
        console.error(err);
        setPlotAiLoading(false);
      });
    }
  }, [selectedPlot, selectedColony]);

  // Filtered Colonies list
  const filteredColonies = colonies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "developed" && c.developmentStatus === "Fully Developed") ||
      (filterStatus === "under-development" && c.developmentStatus === "Under Development");
    return matchesSearch && matchesFilter;
  });

  // Toggle single colony visibility
  const toggleColony = (id) => {
    setToggledColonies((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle all colonies on/off (Show All / Hide All Switch)
  const toggleAllColonies = () => {
    const allToggled = Object.values(toggledColonies).every((v) => v === true);
    const nextToggles = {};
    colonies.forEach((c) => {
      nextToggles[c.id] = !allToggled;
    });
    setToggledColonies(nextToggles);
  };

  // Fly to colony center
  const focusColony = (colony) => {
    setSelectedColony(colony);
    setSelectedPlot(null); // Clear selected plot when switching colonies
    setFocusCenter(colony.center);
    setFocusZoom(colony.zoom);
    setIsSidebarExpanded(false);
  };

  // Live Inventory Statistics Scanner (Helper)
  const getColonyStats = (colony) => {
    if (!colony || !colony.plots) return null;
    const stats = { total: colony.plots.length, available: 0, sold: 0, reserved: 0 };
    colony.plots.forEach((p) => {
      if (p.status === "available") stats.available++;
      else if (p.status === "sold") stats.sold++;
      else if (p.status === "reserved") stats.reserved++;
    });
    return stats;
  };

  // Color helper for plots based on availability status (Adjusted for Light Theme Map)
  const getPlotStyle = (status, isHovered, isSelected) => {
    let baseColor = "#4b5563"; // Dark gray border for light theme
    let baseFill = "#9ca3af";
    let opacity = 0.4;
    let weight = 1.0;

    if (status === "available") {
      baseColor = "#047857"; // Forest green border
      baseFill = "#10b981"; // Emerald fill
      opacity = 0.45;
    } else if (status === "sold") {
      baseColor = "#b91c1c"; // Dark red border
      baseFill = "#f87171"; // Rose fill
      opacity = 0.55;
    } else if (status === "reserved") {
      baseColor = "#b45309"; // Dark amber border
      baseFill = "#fbbf24"; // Amber fill
      opacity = 0.5;
    }

    if (isHovered) {
      opacity = 0.8;
      weight = 1.8;
    }

    if (isSelected) {
      baseColor = "#2563eb"; // Bold Blue border for selected plot on light map
      weight = 2.5;
      opacity = 0.85;
    }

    return {
      color: baseColor,
      fillColor: baseFill,
      fillOpacity: opacity,
      weight: weight,
      dashArray: isSelected ? "3" : null
    };
  };

  return (
    <div className="relative w-full h-[calc(100dvh-64px)] md:h-[calc(100vh-80px)] overflow-hidden bg-slate-50 font-sans">
      
      {/* 1. MAP CANVAS (LIGHT THEME VOYAGER OVERLAY) */}
      <MapContainer
        center={faisalabadCenter}
        zoom={13}
        minZoom={11}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />

        <MapController 
          activeColonyCenter={focusCenter}
          activeColonyZoom={focusZoom}
          onZoomChange={(zoom) => setMapZoom(zoom)}
        />

        {/* COLONY BOUNDARY POLYGONS */}
        {showBoundaries && colonies.map((colony) => {
          if (!toggledColonies[colony.id]) return null;

          const isSelected = selectedColony?.id === colony.id;

          return (
            <Polygon
              key={`boundary-${colony.id}`}
              positions={colony.boundary}
              pathOptions={{
                color: colony.color,
                fillColor: colony.color,
                fillOpacity: isSelected ? 0.08 : 0.03,
                weight: isSelected ? 3.0 : 1.8,
                dashArray: isSelected ? "4, 6" : "2, 4"
              }}
              eventHandlers={{
                click: () => focusColony(colony)
              }}
            >
              <Tooltip sticky>
                <div className="font-semibold text-slate-800">{colony.name}</div>
                <div className="text-xs text-slate-500">{colony.developmentStatus}</div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* BLUEPRINT IMAGE OVERLAYS */}
        {showBlueprint && colonies.map((colony) => {
          if (!toggledColonies[colony.id] || !colony.blueprint) return null;
          
          return (
            <ImageOverlay
              key={`blueprint-${colony.id}`}
              url={colony.blueprint.url}
              bounds={colony.blueprint.bounds}
              opacity={blueprintOpacity}
            />
          );
        })}

        {/* PLOT CUTTING GRID OVERLAYS */}
        {showPlots && mapZoom >= 14 && colonies.map((colony) => {
          if (!toggledColonies[colony.id] || !colony.plots) return null;

          // Render all plots to map both Available (Green) and Sold/Reserved (Red/Amber) statuses
          const filteredPlots = colony.plots;

          return filteredPlots.map((plot) => {
            const isHovered = hoveredPlot?.id === plot.id;
            const isSelected = selectedPlot?.id === plot.id;

            return (
              <Polygon
                key={plot.id}
                positions={plot.boundary}
                pathOptions={getPlotStyle(plot.status, isHovered, isSelected)}
                eventHandlers={{
                  mouseover: () => setHoveredPlot(plot),
                  mouseout: () => setHoveredPlot(null),
                  click: (e) => {
                    setSelectedPlot(plot);
                    setSelectedColony(colony);
                    setIsSidebarExpanded(false);
                    L.DomEvent.stopPropagation(e);
                  }
                }}
              >
                <Tooltip sticky>
                  <div className="p-1 text-slate-850">
                    <p className="font-bold text-xs">{plot.block} | {plot.number}</p>
                    <p className="text-xs">Status: <span className="capitalize font-semibold">{plot.status}</span></p>
                    <p className="text-xs font-bold text-blue-600">{plot.price}</p>
                  </div>
                </Tooltip>
              </Polygon>
            );
          });
        })}
      </MapContainer>

      {/* 2. LIGHT GLASSMORPHIC SIDEBAR PANEL */}
      <div 
        className={`fixed lg:absolute bottom-0 lg:top-4 lg:bottom-4 left-0 lg:left-4 right-0 lg:right-auto w-full lg:w-96 z-[1000] flex flex-col bg-white/95 backdrop-blur-md border-t lg:border border-slate-200/80 rounded-t-2xl lg:rounded-2xl p-5 text-slate-800 shadow-xl transition-all duration-300 ${
          isSidebarExpanded ? "h-[75vh]" : "h-[70px] lg:h-auto"
        }`}
      >
        {/* Drag Handle for Mobile */}
        <div 
          className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-3 lg:hidden cursor-pointer shrink-0" 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
        
        {/* Sidebar Header */}
        <div className="flex flex-col gap-2.5 pb-3 border-b border-slate-200 shrink-0">
          <button 
            onClick={() => navigate(-1)} 
            className="group inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition font-extrabold text-xs self-start"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-slate-400 group-hover:text-blue-600" />
            Go Back
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div 
                className="cursor-pointer lg:cursor-default" 
                onClick={() => { if (window.innerWidth < 1024) setIsSidebarExpanded(!isSidebarExpanded); }}
              >
                <h1 className="text-base font-extrabold tracking-tight text-slate-900">Faisalabad GIS Map</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  {!isSidebarExpanded ? "Tap to expand list & filters" : "Interactive Plot Locator"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar scrollable contents */}
        <div className={`flex-1 flex flex-col gap-3.5 overflow-hidden mt-3.5 ${isSidebarExpanded ? "block" : "hidden lg:flex"}`}>

        {/* Layer Controls Console */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-blue-600" /> Layer Overlays</span>
            <span className="text-[10px] bg-white border px-2 py-0.5 rounded-full text-slate-500">Zoom: {mapZoom}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setShowBoundaries(!showBoundaries)} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                showBoundaries 
                  ? "bg-blue-50 border-blue-200 text-blue-650 font-bold shadow-sm" 
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              }`}
            >
              <Eye className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-sans">Boundaries</span>
            </button>

            <button 
              onClick={() => setShowPlots(!showPlots)} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                showPlots 
                  ? "bg-blue-50 border-blue-200 text-blue-650 font-bold shadow-sm" 
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              }`}
            >
              <Grid className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-sans">Plot Grid</span>
            </button>

            <button 
              onClick={() => setShowBlueprint(!showBlueprint)} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                showBlueprint 
                  ? "bg-blue-50 border-blue-200 text-blue-650 font-bold shadow-sm" 
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              }`}
            >
              <ImageIcon className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-sans">Blueprints</span>
            </button>
          </div>

          {/* Blueprint Opacity Control */}
          {showBlueprint && (
            <div className="pt-2 border-t border-slate-200/50 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-medium"><Sliders className="w-3 h-3 text-slate-400" /> Layout Opacity</span>
                <span>{Math.round(blueprintOpacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="0.9" 
                step="0.05" 
                value={blueprintOpacity} 
                onChange={(e) => setBlueprintOpacity(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          {mapZoom < 14 && showPlots && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-blue-700 leading-tight">
                <strong>Plot grid is currently hidden.</strong> Please zoom in closer (Zoom 14+) to view detailed vector plots.
              </p>
            </div>
          )}
        </div>

        {/* GIS Legend & Plot Filters */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span className="flex items-center gap-1.5"><Grid className="w-3.5 h-3.5 text-blue-600" /> Plot Grid Legend</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[9px] font-extrabold text-slate-700">
            <div className="flex items-center gap-1 justify-center py-1.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-150 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available
            </div>
            <div className="flex items-center gap-1 justify-center py-1.5 bg-rose-50 text-rose-800 rounded border border-rose-150 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Sold
            </div>
            <div className="flex items-center gap-1 justify-center py-1.5 bg-amber-50 text-amber-800 rounded border border-amber-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Reserved
            </div>
          </div>
        </div>

        {/* Search Input and Filter */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search colonies (e.g. FDA, City, Wapda)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Development Status Filter */}
          <div className="flex gap-1.5 p-1 bg-slate-100/80 border border-slate-200 rounded-xl text-[10px]">
            <button 
              onClick={() => setFilterStatus("all")}
              className={`flex-1 py-1 rounded-lg transition-all cursor-pointer font-bold ${filterStatus === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus("developed")}
              className={`flex-1 py-1 rounded-lg transition-all cursor-pointer font-bold ${filterStatus === "developed" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Developed
            </button>
            <button 
              onClick={() => setFilterStatus("under-development")}
              className={`flex-1 py-1 rounded-lg transition-all cursor-pointer font-bold ${filterStatus === "under-development" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Under Dev.
            </button>
          </div>
        </div>

        {/* Colonies Header Switch */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1 mt-1 shrink-0">
          <span>Colonies List ({filteredColonies.length})</span>
          <button
            onClick={toggleAllColonies}
            className="text-[10px] text-blue-650 hover:text-blue-700 font-black cursor-pointer"
          >
            {Object.values(toggledColonies).every((v) => v === true) ? "Hide All Boundaries" : "Show All Boundaries"}
          </button>
        </div>

        {/* Scroll list with layout overflow protection */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {filteredColonies.length > 0 ? (
            filteredColonies.map((colony) => {
              const isToggled = toggledColonies[colony.id];
              const isSelected = selectedColony?.id === colony.id;

              return (
                <div 
                  key={colony.id}
                  onClick={() => focusColony(colony)}
                  className={`group relative flex flex-col p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-blue-50/40 border-blue-500/40 shadow-sm" 
                      : "bg-slate-50/60 hover:bg-slate-100/50 border-slate-200/60 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: colony.color }}
                      />
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-650 transition-colors">{colony.name}</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{colony.approvalStatus}</p>
                      </div>
                    </div>

                    {/* Boundary Toggle Eye Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleColony(colony.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isToggled 
                          ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100/80" 
                          : "bg-white border-slate-200 text-slate-450 hover:text-slate-600"
                      }`}
                    >
                      {isToggled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                      colony.developmentStatus === "Fully Developed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {colony.developmentStatus}
                    </span>
                    {colony.blueprint && (
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-0.5">
                        <ImageIcon className="w-2 h-2" /> Layout Plan
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No colonies match search criteria.
            </div>
          )}
        </div>

        {/* GIS Instructions help banner at bottom of sidebar (integrated cleanly) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-start gap-2 shrink-0">
          <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-[9px] text-slate-500 leading-tight">
            Click on any boundary or list item to center the camera. Zoom in past level 14 to display specific plots and availability details.
          </p>
        </div>
        </div> {/* Close the collapsible contents div */}
      </div>

      {/* 3. LIGHT DETAILED INFORMATION TILES (BOTTOM RIGHT) */}
      <div className="fixed lg:absolute bottom-0 lg:bottom-4 left-0 lg:left-auto right-0 lg:right-4 z-[1000] w-full lg:w-96 flex flex-col gap-3 px-4 pb-4 lg:px-0 lg:pb-0 pointer-events-none">
        
        {/* Plot Details overlay Card */}
        {selectedPlot && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-t-2xl lg:rounded-2xl p-5 text-slate-800 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto max-h-[75vh] overflow-y-auto w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">{selectedPlot.number}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedPlot.block}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedPlot(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 text-xs">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-455 block font-semibold">Plot Size</span>
                <span className="font-extrabold text-slate-800 mt-0.5 block">{selectedPlot.size}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-455 block font-semibold">Est. Market Value</span>
                <span className="font-black text-blue-600 mt-0.5 block flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-yellow-600" /> {selectedPlot.price}
                </span>
              </div>
            </div>

            {/* AI-powered Plot Evaluation Popup Analysis */}
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-xl p-3 mb-3.5">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-550" />
                AI Real-Time GIS Assessment
              </div>
              {plotAiLoading ? (
                <div className="flex items-center gap-2 text-[10px] text-slate-550 font-semibold py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-650" />
                  Generating plot assessment...
                </div>
              ) : (
                <p className="text-[10.5px] text-slate-650 font-semibold leading-relaxed">
                  {plotAiAnalysis}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  selectedPlot.status === "available" 
                    ? "bg-emerald-500 animate-pulse" 
                    : selectedPlot.status === "sold" 
                    ? "bg-rose-500" 
                    : "bg-amber-500"
                }`} />
                <span className="text-[11px] font-bold text-slate-600 capitalize">
                  {selectedPlot.status === "available" ? "Ready to Purchase" : selectedPlot.status === "sold" ? "Sold / Registered" : "Reserved / Token Paid"}
                </span>
              </div>

              {selectedPlot.status === "available" && (
                <button 
                  onClick={() => {
                    const checkoutPayload = {
                      plot_id: selectedPlot.id,
                      owner_id: "dev_faisalabad_gis",
                      secure_checkout_url: `https://api.propsight.com/checkout?plot_id=${selectedPlot.id}&colony_id=${selectedColony.id}`
                    };
                    console.log("Redirecting with secure transactional payload:", checkoutPayload);
                    navigate(`/plot-detail/${selectedColony.id}/${selectedPlot.id}`, { state: { transaction_payload: checkoutPayload } });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Buy Now <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedPlot.status === "sold" && (
                <button 
                  onClick={() => navigate(`/plot-detail/${selectedColony.id}/${selectedPlot.id}`)}
                  className="bg-slate-850 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Verify Deed <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedPlot.status === "reserved" && (
                <button 
                  onClick={() => navigate(`/plot-detail/${selectedColony.id}/${selectedPlot.id}`)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Colony Details overlay Card with dynamic Stats Scanner */}
        {selectedColony && !selectedPlot && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-t-2xl lg:rounded-2xl p-5 text-slate-800 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto max-h-[75vh] overflow-y-auto w-full">
            
            {/* Colony Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedColony.color }}
                />
                <h2 className="text-sm font-extrabold text-slate-900">{selectedColony.name} Details</h2>
              </div>

              <button 
                onClick={() => setSelectedColony(null)}
                className="text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div className="py-3 text-[11px] leading-relaxed text-slate-600 border-b border-slate-100 mb-3">
              <p>{selectedColony.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 text-[10px] font-bold">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="text-slate-450 block font-semibold text-[8px] uppercase tracking-wider">Status</span>
                  <span className="font-extrabold text-slate-700 mt-0.5 block">{selectedColony.developmentStatus}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-slate-450 block font-semibold text-[8px] uppercase tracking-wider">Approval</span>
                  <span className="font-extrabold text-slate-700 mt-0.5 block">{selectedColony.approvalStatus}</span>
                </div>
              </div>
            </div>

            {/* GIS Inventory Stats Card */}
            {selectedColony.plots && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2 mb-3">
                <span className="text-[9px] text-slate-450 uppercase font-black block tracking-wider">Plot Inventory Stats</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 text-emerald-650 font-black shadow-sm">
                    <span className="block text-sm font-black">{getColonyStats(selectedColony)?.available}</span>
                    <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Available</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 text-rose-650 font-black shadow-sm">
                    <span className="block text-sm font-black">{getColonyStats(selectedColony)?.sold}</span>
                    <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Sold</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 text-amber-650 font-black shadow-sm">
                    <span className="block text-sm font-black">{getColonyStats(selectedColony)?.reserved}</span>
                    <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Reserved</span>
                  </div>
                </div>
              </div>
            )}

            {selectedColony.plots && (
              <div className="pt-2 text-[10px] text-slate-500 font-medium flex items-center justify-between">
                <span>Total Plots Modeled: <strong>{selectedColony.plots.length}</strong></span>
                <span className="text-blue-600 font-bold">Zoom in to view plot grid</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. ZOOM UTILITIES: RESET BUTTON (TOP RIGHT) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
        <button 
          onClick={() => {
            // Reset map viewport to Faisalabad Clock Tower center
            setFocusCenter(faisalabadCenter);
            setFocusZoom(13);
            setSelectedColony(null);
            setSelectedPlot(null);
          }}
          title="Reset to Faisalabad Center"
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default Map;