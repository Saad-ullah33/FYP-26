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
  BadgeAlert,
  Coins
} from "lucide-react";
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
  const [toggledColonies, setToggledColonies] = useState({
    "fda-city": true,
    "wapda-city": true,
    "eden-valley": true,
    "peoples-colony": true,
    "madina-town": true
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'developed', 'under-development'
  const [selectedColony, setSelectedColony] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);

  // Global Layer Controls
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showPlots, setShowPlots] = useState(true);
  const [showBlueprint, setShowBlueprint] = useState(true);
  const [blueprintOpacity, setBlueprintOpacity] = useState(0.55);

  // Focus properties
  const [focusCenter, setFocusCenter] = useState(null);
  const [focusZoom, setFocusZoom] = useState(null);

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

  // Fly to colony center
  const focusColony = (colony) => {
    setSelectedColony(colony);
    setSelectedPlot(null); // Clear selected plot when switching colonies
    setFocusCenter(colony.center);
    setFocusZoom(colony.zoom);
  };

  // Color helper for plots based on availability status
  const getPlotStyle = (status, isHovered, isSelected) => {
    let baseColor = "#9ca3af"; // Default gray
    let baseFill = "#9ca3af";
    let opacity = 0.35;
    let weight = 1.2;

    if (status === "available") {
      baseColor = "#10b981"; // Green
      baseFill = "#10b981";
      opacity = 0.4;
    } else if (status === "sold") {
      baseColor = "#ef4444"; // Red
      baseFill = "#ef4444";
      opacity = 0.5;
    } else if (status === "reserved") {
      baseColor = "#f59e0b"; // Yellow/Amber
      baseFill = "#f59e0b";
      opacity = 0.45;
    }

    if (isHovered) {
      opacity = 0.75;
      weight = 2;
    }

    if (isSelected) {
      baseColor = "#ffffff";
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
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans">
      
      {/* 1. MAP CANVAS (FULL BLEED) */}
      <MapContainer
        center={faisalabadCenter}
        zoom={13}
        minZoom={11}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false} // Disable default zoom controls to position them customly
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
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
                weight: isSelected ? 2.5 : 1.5,
                dashArray: isSelected ? "4, 6" : "2, 4"
              }}
              eventHandlers={{
                click: () => focusColony(colony)
              }}
            >
              <Tooltip sticky>
                <div className="font-semibold text-slate-900">{colony.name}</div>
                <div className="text-xs text-slate-600">{colony.developmentStatus}</div>
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

        {/* PLOT CUTTING GRID OVERLAYS (Vector) */}
        {/* Render plots ONLY if zoom level is high enough (>= 14) and toggled on */}
        {showPlots && mapZoom >= 14 && colonies.map((colony) => {
          if (!toggledColonies[colony.id] || !colony.plots) return null;

          return colony.plots.map((plot) => {
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
                    // Open a popup at click location
                    L.DomEvent.stopPropagation(e);
                  }
                }}
              >
                <Tooltip sticky>
                  <div className="p-1 text-slate-900">
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

      {/* 2. GLASSMORPHIC CONTROL SIDEBAR (TOP LEFT) */}
      <div className="absolute top-4 left-4 bottom-4 w-96 z-[1000] flex flex-col gap-4 bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20">
              <MapPin className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Faisalabad GIS Map</h1>
              <p className="text-[11px] text-slate-400 font-light">Interactive Property & Plot Locator</p>
            </div>
          </div>
        </div>

        {/* Global Layer Controls */}
        <div className="bg-slate-900/65 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-blue-400" /> Layer Overlays</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">Zoom: {mapZoom}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setShowBoundaries(!showBoundaries)} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                showBoundaries 
                  ? "bg-blue-600/10 border-blue-500/40 text-blue-300" 
                  : "bg-slate-950/50 border-slate-800/80 text-slate-500 hover:text-slate-300"
              }`}
            >
              <Eye className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-medium font-sans">Boundaries</span>
            </button>

            <button 
              onClick={() => setShowPlots(!showPlots)} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                showPlots 
                  ? "bg-blue-600/10 border-blue-500/40 text-blue-300" 
                  : "bg-slate-950/50 border-slate-800/80 text-slate-500 hover:text-slate-300"
              }`}
            >
              <Grid className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-medium font-sans">Plot Cutting</span>
            </button>

            <button 
              onClick={() => setShowBlueprint(!showBlueprint)} 
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                showBlueprint 
                  ? "bg-blue-600/10 border-blue-500/40 text-blue-300" 
                  : "bg-slate-950/50 border-slate-800/80 text-slate-500 hover:text-slate-300"
              }`}
            >
              <ImageIcon className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-medium font-sans">Blueprints</span>
            </button>
          </div>

          {/* Blueprint Opacity Control */}
          {showBlueprint && (
            <div className="pt-2 border-t border-slate-800/50 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> Blueprint Opacity</span>
                <span>{Math.round(blueprintOpacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="0.9" 
                step="0.05" 
                value={blueprintOpacity} 
                onChange={(e) => setBlueprintOpacity(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}

          {mapZoom < 14 && showPlots && (
            <div className="bg-blue-950/30 border border-blue-900/30 rounded-lg p-2 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-blue-300 leading-tight">
                <strong>Plot Cuttings hidden.</strong> Zoom in closer (Zoom level 14+) to view detailed vector plot maps.
              </p>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search colonies (e.g. FDA, Wapda)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 p-1 bg-slate-900/60 border border-slate-800/80 rounded-xl text-[10px]">
            <button 
              onClick={() => setFilterStatus("all")}
              className={`flex-1 py-1 rounded-lg transition-all ${filterStatus === "all" ? "bg-blue-600 text-white font-medium shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus("developed")}
              className={`flex-1 py-1 rounded-lg transition-all ${filterStatus === "developed" ? "bg-blue-600 text-white font-medium shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              Developed
            </button>
            <button 
              onClick={() => setFilterStatus("under-development")}
              className={`flex-1 py-1 rounded-lg transition-all ${filterStatus === "under-development" ? "bg-blue-600 text-white font-medium shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              Under Dev.
            </button>
          </div>
        </div>

        {/* Colonies Scroll List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
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
                      ? "bg-slate-900 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                      : "bg-slate-950/40 hover:bg-slate-900/40 border-slate-800/60 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: colony.color }}
                      />
                      <div>
                        <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{colony.name}</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">{colony.approvalStatus}</p>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleColony(colony.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isToggled 
                          ? "bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20" 
                          : "bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400"
                      }`}
                    >
                      {isToggled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full ${
                      colony.developmentStatus === "Fully Developed"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40"
                        : "bg-amber-950/60 text-amber-400 border border-amber-900/40"
                    }`}>
                      {colony.developmentStatus}
                    </span>
                    {colony.blueprint && (
                      <span className="text-[8px] font-semibold px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-900/40 flex items-center gap-0.5">
                        <ImageIcon className="w-2 h-2" /> Layout Plan
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No colonies match search criteria.
            </div>
          )}
        </div>
      </div>

      {/* 3. FLOATING DETAIL CARDS (BOTTOM RIGHT) */}
      <div className="absolute bottom-4 right-4 z-[1000] w-96 flex flex-col gap-3">
        
        {/* Plot Detail Card */}
        {selectedPlot && (
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 text-slate-100 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">{selectedPlot.number}</h2>
                  <p className="text-[10px] text-slate-400">{selectedPlot.block}</p>
                </div>
              </div>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlot(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 text-xs">
              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 block">Plot Size</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{selectedPlot.size}</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 block">Est. Market Price</span>
                <span className="font-semibold text-blue-400 mt-0.5 block flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {selectedPlot.price}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  selectedPlot.status === "available" 
                    ? "bg-emerald-500 animate-pulse" 
                    : selectedPlot.status === "sold" 
                    ? "bg-red-500" 
                    : "bg-amber-500"
                }`} />
                <span className="text-xs capitalize font-medium text-slate-300">
                  {selectedPlot.status === "available" ? "Available for Purchase" : selectedPlot.status === "sold" ? "Sold / Occupied" : "Reserved / Token Paid"}
                </span>
              </div>

              {selectedPlot.status === "available" && (
                <button 
                  onClick={() => navigate(`/plot-detail/${selectedColony.id}/${selectedPlot.id}`)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-blue-600/10"
                >
                  Buy Now / Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedPlot.status === "sold" && (
                <button 
                  onClick={() => navigate(`/plot-detail/${selectedColony.id}/${selectedPlot.id}`)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-lg"
                >
                  Verify Deed <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedPlot.status === "reserved" && (
                <button 
                  onClick={() => navigate(`/plot-detail/${selectedColony.id}/${selectedPlot.id}`)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-slate-700"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Colony Overview Card */}
        {selectedColony && !selectedPlot && (
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 text-slate-100 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedColony.color }}
                />
                <h2 className="text-sm font-bold text-slate-100">{selectedColony.name} Details</h2>
              </div>

              <button 
                onClick={() => setSelectedColony(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs leading-relaxed text-slate-300">
              <p>{selectedColony.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 text-[10px]">
              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-2.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{selectedColony.developmentStatus}</span>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-2.5 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-500 block">Approval</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{selectedColony.approvalStatus}</span>
                </div>
              </div>
            </div>

            {selectedColony.plots && (
              <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Total Plots Modeled: <strong>{selectedColony.plots.length}</strong></span>
                <span className="text-blue-400 font-medium">Zoom in to view plot grid</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. MAP UTILITIES: ZOOM CONTROLS (TOP RIGHT) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
        <button 
          onClick={() => {
            // Reset to Center
            setFocusCenter(faisalabadCenter);
            setFocusZoom(13);
            setSelectedColony(null);
            setSelectedPlot(null);
          }}
          title="Reset to Faisalabad Center"
          className="p-2.5 bg-slate-950/85 backdrop-blur-xl border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl shadow-lg transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Map instructions help banner */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-950/70 backdrop-blur-md border border-slate-800/50 rounded-lg text-[10px] text-slate-400 shadow-lg">
        <Info className="w-3.5 h-3.5 text-blue-400" />
        <span>Click on any colony name or boundary to focus. Zoom in closer to view plot numbers and availability.</span>
      </div>

    </div>
  );
};

export default Map;