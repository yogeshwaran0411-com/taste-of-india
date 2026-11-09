import React, { useState, useMemo } from 'react';
import indiaMapData from '@svg-maps/india';
import { IndianState, Recipe } from '../types';
import { 
  MapPin, 
  Sparkles, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Utensils, 
  ChefHat, 
  ChevronRight, 
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

interface InteractiveIndiaMapProps {
  states: IndianState[];
  recipes: Recipe[];
  selectedStateId: string | null;
  onSelectState: (state: IndianState) => void;
  onStateCardClick?: (state: IndianState) => void;
  activeRegion: string;
  onSelectRegion: (region: string) => void;
}

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

// Region colors designed for authentic Indian culinary heritage
const REGION_COLOR_MAP: Record<string, { fill: string; hover: string; stroke: string; lightBg: string; text: string }> = {
  South: {
    fill: '#059669', // Emerald - Banana leaf, curry leaves
    hover: '#10b981',
    stroke: '#047857',
    lightBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    text: 'text-emerald-700'
  },
  North: {
    fill: '#ea580c', // Saffron / Tandoor
    hover: '#f97316',
    stroke: '#c2410c',
    lightBg: 'bg-orange-50 text-orange-800 border-orange-200',
    text: 'text-orange-700'
  },
  West: {
    fill: '#d97706', // Turmeric Ochre
    hover: '#f59e0b',
    stroke: '#b45309',
    lightBg: 'bg-amber-50 text-amber-800 border-amber-200',
    text: 'text-amber-700'
  },
  East: {
    fill: '#be123c', // Terracotta Rose
    hover: '#e11d48',
    stroke: '#9f1239',
    lightBg: 'bg-rose-50 text-rose-800 border-rose-200',
    text: 'text-rose-700'
  },
  Central: {
    fill: '#7c3aed', // Royal Amethyst
    hover: '#8b5cf6',
    stroke: '#6d28d9',
    lightBg: 'bg-purple-50 text-purple-800 border-purple-200',
    text: 'text-purple-700'
  },
  Northeast: {
    fill: '#0d9488', // Bamboo Jade / Teal
    hover: '#14b8a6',
    stroke: '#0f766e',
    lightBg: 'bg-teal-50 text-teal-800 border-teal-200',
    text: 'text-teal-700'
  }
};

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  states,
  recipes,
  selectedStateId,
  onSelectState,
  onStateCardClick,
  activeRegion,
  onSelectRegion
}) => {
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Quick lookup dictionary from map location name to IndianState
  const stateByMapName = useMemo(() => {
    const map = new Map<string, IndianState>();
    states.forEach(st => {
      map.set(st.name.toLowerCase(), st);
      map.set(st.id.toLowerCase(), st);
    });
    return map;
  }, [states]);

  // Helper to resolve map location item to our state
  const getStateFromLocation = (locName: string, locId: string): IndianState | undefined => {
    const cleanName = locName.toLowerCase();
    if (cleanName.includes('dadra') || cleanName.includes('daman')) {
      return states.find(s => s.id === 'dadra-and-nagar-haveli-and-daman-and-diu');
    }
    return (
      stateByMapName.get(cleanName) ||
      states.find(s => s.name.toLowerCase() === cleanName) ||
      states.find(s => cleanName.includes(s.name.toLowerCase()))
    );
  };

  // Recipe counts per state
  const recipeCountByStateName = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach(r => {
      const st = r.state.toLowerCase();
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [recipes]);

  // Hovered state details
  const hoveredState = useMemo(() => {
    if (!hoveredLocationId) return null;
    const loc = (indiaMapData.locations as MapLocation[]).find(l => l.id === hoveredLocationId);
    if (!loc) return null;
    return getStateFromLocation(loc.name, loc.id);
  }, [hoveredLocationId, states]);

  // Selected state details
  const activeSelectedState = useMemo(() => {
    if (!selectedStateId) return null;
    return states.find(s => s.id === selectedStateId);
  }, [selectedStateId, states]);

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, locId: string) => {
    setHoveredLocationId(locId);
    const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredLocationId(null);
    setTooltipPos(null);
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden transition-all">
      
      {/* Top Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-[#2B1B17] to-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#E8590C]/20 text-[#E8590C] border border-[#E8590C]/30">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
              Interactive Culinary Map of Bharat
            </span>
          </div>
          <h2 className="font-serif-title text-xl sm:text-2xl font-black tracking-tight">
            Click Any State to Filter Regional Recipes
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            Hover over the map to discover local flavors, and click to filter authentic recipes by region.
          </p>
        </div>

        {/* Search State Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search state (e.g. Punjab, Kerala)..."
            className="w-full pl-9 pr-8 py-2 bg-stone-800/80 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8590C]/50 focus:border-[#E8590C]"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Dropdown Suggestions */}
          {searchFilter.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-stone-900/95 backdrop-blur-md border border-stone-700 rounded-xl p-1.5 z-40 max-h-56 overflow-y-auto shadow-2xl">
              {states
                .filter(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()))
                .slice(0, 5)
                .map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectState(st);
                      setSearchFilter('');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-stone-800 flex items-center justify-between text-xs text-white transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-bold">{st.name}</span>
                      <span className="text-[10px] text-stone-400 block">{st.region} India · {st.capital}</span>
                    </div>
                    <span className="text-[10px] bg-[#E8590C] text-white px-2 py-0.5 rounded-full font-bold">
                      Select
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Region Selector Filter Bar */}
      <div className="p-3 sm:px-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Region:
          </span>
          {['All', 'South', 'North', 'West', 'East', 'Central', 'Northeast'].map(reg => {
            const isRegActive = activeRegion === reg;
            const style = reg === 'All' ? null : REGION_COLOR_MAP[reg];
            return (
              <button
                key={reg}
                onClick={() => onSelectRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isRegActive
                    ? 'bg-[#2B1B17] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {style && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: style.fill }}
                  />
                )}
                <span>{reg === 'All' ? 'All India (36)' : `${reg} India`}</span>
              </button>
            );
          })}
        </div>

        {/* Reset Selection Button if State Selected */}
        {selectedStateId && (
          <button
            onClick={() => onSelectRegion('All')}
            className="text-xs text-[#E8590C] hover:underline font-bold flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* Main Map View Area */}
      <div className="relative p-4 sm:p-8 bg-gradient-to-b from-stone-50/60 via-amber-50/20 to-white flex flex-col lg:flex-row items-center justify-center gap-8 min-h-[480px]">
        
        {/* Floating Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-stone-200 shadow-sm">
          <button
            title="Zoom In"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            title="Zoom Out"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            title="Reset Zoom"
            onClick={handleResetZoom}
            className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Left Side: SVG Map of India */}
        <div className="relative w-full max-w-[540px] flex items-center justify-center select-none overflow-hidden py-2">
          
          <svg
            viewBox={indiaMapData.viewBox}
            className="w-full h-auto max-h-[560px] drop-shadow-md transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center'
            }}
          >
            <defs>
              <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E8590C" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Render all state paths */}
            <g className="transition-all duration-200">
              {(indiaMapData.locations as MapLocation[]).map(loc => {
                const stateData = getStateFromLocation(loc.name, loc.id);
                const isSelected = selectedStateId && stateData && selectedStateId === stateData.id;
                const isHovered = hoveredLocationId === loc.id;
                
                // Check region match
                const matchesRegion = 
                  activeRegion === 'All' || 
                  (stateData && stateData.region.toLowerCase() === activeRegion.toLowerCase());

                const regionColors = stateData ? REGION_COLOR_MAP[stateData.region] : null;

                // Determine fill color
                let fillColor = regionColors ? regionColors.fill : '#cbd5e1';
                if (isSelected) {
                  fillColor = '#E8590C'; // Bright brand saffron for active selected state
                } else if (isHovered) {
                  fillColor = regionColors ? regionColors.hover : '#f59e0b';
                }

                // Opacity based on region filter
                const opacity = matchesRegion ? 1 : 0.28;

                return (
                  <path
                    key={loc.id}
                    id={loc.id}
                    d={loc.path}
                    fill={fillColor}
                    fillOpacity={isSelected ? 1 : opacity}
                    stroke={isSelected ? '#2B1B17' : isHovered ? '#ffffff' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 0.8}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-150 ease-out"
                    filter={isSelected ? 'url(#map-glow)' : undefined}
                    onMouseMove={(e) => handleMouseMove(e, loc.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      if (stateData) {
                        onSelectState(stateData);
                      }
                    }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Interactive Floating Hover Tooltip */}
          {hoveredState && tooltipPos && (
            <div
              className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`
              }}
            >
              <div className="bg-[#2B1B17]/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-amber-500/30 w-56 space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-serif-title font-bold text-xs text-amber-300">
                    {hoveredState.name}
                  </span>
                  <span className="text-[9px] uppercase font-bold bg-[#E8590C] text-white px-1.5 py-0.2 rounded">
                    {hoveredState.region}
                  </span>
                </div>

                <div className="text-[11px] text-stone-300 flex items-center justify-between">
                  <span>Capital: <strong className="text-white">{hoveredState.capital}</strong></span>
                  <span className="text-amber-400 font-bold">
                    {recipeCountByStateName[hoveredState.name.toLowerCase()] || 0} recipes
                  </span>
                </div>

                <div className="text-[10px] text-stone-400 line-clamp-1">
                  Famous: <span className="text-stone-200">{hoveredState.famousDishes.slice(0, 2).join(', ')}</span>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-amber-300/90 font-medium">
                  <span>Click to view dishes</span>
                  <ArrowRight className="w-3 h-3 text-[#E8590C]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active State Spotlight or Quick Region Guide */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          {activeSelectedState ? (
            /* Selected State Card Card */
            <div className="bg-white rounded-2xl border-2 border-[#E8590C] shadow-lg p-5 space-y-3.5 animate-fadeIn">
              <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E8590C] animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8590C]">
                      Filtered Region State
                    </span>
                  </div>
                  <h3 className="font-serif-title text-xl font-black text-[#2B1B17]">
                    {activeSelectedState.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {activeSelectedState.capital} · {activeSelectedState.region} India
                  </p>
                </div>
                
                <button
                  onClick={() => onSelectRegion('All')}
                  title="Clear Selection"
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* State Image Thumbnail */}
              <div className="relative h-28 rounded-xl overflow-hidden shadow-xs">
                <img
                  src={activeSelectedState.heroImage}
                  alt={activeSelectedState.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    {recipes.filter(r => r.state.toLowerCase() === activeSelectedState.name.toLowerCase()).length} Recipes Available
                  </span>
                  <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded font-medium">
                    {activeSelectedState.type === 'state' ? 'State' : 'UT'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                {activeSelectedState.description}
              </p>

              {/* Famous Dishes Preview */}
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Iconic Regional Dishes:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeSelectedState.famousDishes.slice(0, 4).map((dish, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-semibold"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Dive Action Button */}
              {onStateCardClick && (
                <button
                  type="button"
                  onClick={() => onStateCardClick(activeSelectedState)}
                  className="w-full py-2.5 px-3 bg-[#E8590C] hover:bg-[#D9480F] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>View Full {activeSelectedState.name} Food Heritage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            /* Prompt Card when no state selected */
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#E8590C]">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-serif-title text-sm font-bold uppercase tracking-wider">
                  How To Use Map Filter
                </h4>
              </div>

              <ul className="text-xs text-stone-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[#E8590C] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>Hover over any state:</strong> Inspect its capital, popular dishes, and recipe count.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[#E8590C] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Click on a state:</strong> Immediately filter recipes underneath the map matching that territory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[#E8590C] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>Use Region Tabs:</strong> Narrow down states in South, North, West, East, Central, or Northeast India.</span>
                </li>
              </ul>

              {/* Quick State Chips */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">
                  Popular State Cuisines:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Tamil Nadu', 'Punjab', 'Kerala', 'Rajasthan', 'West Bengal', 'Maharashtra', 'Gujarat'].map(name => {
                    const st = states.find(s => s.name.toLowerCase() === name.toLowerCase());
                    if (!st) return null;
                    return (
                      <button
                        key={st.id}
                        onClick={() => onSelectState(st)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-[#E8590C] hover:text-white text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        {st.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Map Color Legend */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Regional Color Legend
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-stone-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#059669] shrink-0" />
                <span>South India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#ea580c] shrink-0" />
                <span>North India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#d97706] shrink-0" />
                <span>West India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#be123c] shrink-0" />
                <span>East India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#7c3aed] shrink-0" />
                <span>Central India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#0d9488] shrink-0" />
                <span>Northeast India</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
