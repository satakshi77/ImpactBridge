import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { apiFetch } from '../utils/api';
import { Link } from 'react-router-dom';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import {
  Globe,
  Heart,
  Users,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Filter,
  Navigation,
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

// Animated Pan & Zoom Controller
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom Marker DivIcon Factory
const createMarkerIcon = (point, isSelected) => {
  const isCampaign = point.type === 'campaign';
  let bgGradient = 'from-emerald-500 to-teal-600';
  let pingBg = 'bg-emerald-400';
  let emoji = '💧';

  if (point.cause?.includes('Education')) {
    bgGradient = 'from-blue-500 to-indigo-600';
    pingBg = 'bg-blue-400';
    emoji = '📚';
  } else if (point.cause?.includes('Health')) {
    bgGradient = 'from-rose-500 to-pink-600';
    pingBg = 'bg-rose-400';
    emoji = '🩺';
  } else if (point.cause?.includes('Environment')) {
    bgGradient = 'from-emerald-600 to-green-700';
    pingBg = 'bg-emerald-500';
    emoji = '🌱';
  } else if (!isCampaign) {
    bgGradient = 'from-purple-600 to-violet-700';
    pingBg = 'bg-purple-400';
    emoji = '🤝';
  }

  const ringStyle = isSelected
    ? 'ring-4 ring-offset-2 ring-blue-500 scale-125 z-50'
    : 'hover:scale-115 hover:shadow-xl';

  return L.divIcon({
    className: 'custom-impact-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;" class="${ringStyle}">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; opacity: 0.35;" class="${pingBg} animate-ping"></div>
        <div style="width: 32px; height: 32px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.25); font-size: 13px;" class="bg-gradient-to-tr ${bgGradient}">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

export const ImpactMapPage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'campaign' | 'volunteer'
  const [selectedCause, setSelectedCause] = useState('All');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.5, 78.5]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapTheme, setMapTheme] = useState('osm'); // 'osm' | 'esri' | 'hot' | 'satellite'

  // 100% Free Public Map Tile Providers (Zero API Key Required)
  const mapThemes = {
    osm: {
      name: 'OpenStreetMap',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    esri: {
      name: 'ESRI Streets',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ, USGS',
      maxZoom: 19,
    },
    hot: {
      name: 'Humanitarian',
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team',
      maxZoom: 19,
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 18,
    },
  };

  const causeList = [
    'All',
    'Clean Water & Sanitation',
    'Quality Education',
    'Healthcare & Medical',
    'Environment & Climate',
  ];

  const regionalJumps = [
    { label: '🇮🇳 All India', center: [22.5, 78.5], zoom: 5 },
    { label: '🏜️ Barmer (Thar)', center: [25.7532, 71.4181], zoom: 9 },
    { label: '🏔️ Ladakh (Himalayas)', center: [34.1526, 77.5771], zoom: 8 },
    { label: '🌿 Sundarbans', center: [21.9497, 89.1833], zoom: 9 },
    { label: '🏙️ Bengaluru', center: [12.9716, 77.5946], zoom: 11 },
    { label: '🌊 Mumbai', center: [19.076, 72.8777], zoom: 11 },
  ];

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const query = new URLSearchParams();
        if (selectedCause !== 'All') query.append('cause', selectedCause);
        const data = await apiFetch(`/stats/map?${query.toString()}`);
        if (data.success && data.points) {
          setPoints(data.points);
          if (data.points.length > 0 && !selectedPoint) {
            setSelectedPoint(data.points[0]);
          }
        }
      } catch (e) {
        console.error('Impact map fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [selectedCause]);

  const filteredPoints = points.filter((p) => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (selectedCause !== 'All' && p.cause !== selectedCause) return false;
    return true;
  });

  const handlePointSelect = (point) => {
    setSelectedPoint(point);
    const lat = point.lat || point.latitude;
    const lng = point.lng || point.longitude;
    if (lat && lng) {
      setMapCenter([lat, lng]);
      setMapZoom(9);
    }
  };

  return (
    <ImpactBridgeLayout title="Impact Map Dashboard">
      {/* 4 TOP TELEMETRY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition hover:shadow-lg">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            MONITORED FIELD SITES
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              {filteredPoints.length}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <MapPin className="w-5 h-5 text-[#2563eb]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live telemetry active
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition hover:shadow-lg">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-emerald-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            DIRECT BENEFICIARIES
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              48,200+
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Verified across 6 states in India
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition hover:shadow-lg">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-purple-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            COMMUNITY HARDWARE
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              27 Units
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Solar ROs & Smart STEM Hubs
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition hover:shadow-lg">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            ACTIVE MOBILIZATION
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              ₹18.05L
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Tracked on-ground fund escrow
          </p>
        </div>
      </div>

      {/* FILTER & REGION TOOLBAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-4">
        {/* Row 1: Type Filter & Theme Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              View Filter:
            </span>
            {[
              { id: 'all', label: `All Sites (${points.length})` },
              { id: 'campaign', label: 'Active Projects' },
              { id: 'volunteer', label: 'Volunteer Drives' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Style:
            </span>
            {Object.entries(mapThemes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setMapTheme(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  mapTheme === key
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Region Fast-Jump Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Quick Zoom:
          </span>
          {regionalJumps.map((reg) => (
            <button
              key={reg.label}
              onClick={() => {
                setMapCenter(reg.center);
                setMapZoom(reg.zoom);
              }}
              className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/80 transition whitespace-nowrap cursor-pointer shrink-0"
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Row 3: Cause Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Cause:
          </span>
          {causeList.map((cause) => (
            <button
              key={cause}
              onClick={() => setSelectedCause(cause)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedCause === cause
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cause}
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE SPLIT MAP & INSPECTOR DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAP CONTAINER (8 Columns on Large Screens) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-3 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative">
          <div className="h-[620px] w-full rounded-2xl overflow-hidden relative z-0">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              className="h-full w-full rounded-2xl"
            >
              <MapController center={mapCenter} zoom={mapZoom} />

              <TileLayer
                key={mapTheme}
                url={(mapThemes[mapTheme] || mapThemes.osm).url}
                attribution={(mapThemes[mapTheme] || mapThemes.osm).attribution}
                maxZoom={(mapThemes[mapTheme] || mapThemes.osm).maxZoom || 19}
              />

              {filteredPoints.map((point) => {
                const lat = point.lat || point.latitude;
                const lng = point.lng || point.longitude;
                if (!lat || !lng) return null;
                const isSelected = selectedPoint?.id === point.id;

                return (
                  <Marker
                    key={point.id}
                    position={[lat, lng]}
                    icon={createMarkerIcon(point, isSelected)}
                    eventHandlers={{
                      click: () => handlePointSelect(point),
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 space-y-2 max-w-xs text-xs font-sans">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              point.type === 'campaign'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {point.type === 'campaign' ? 'Active Project' : 'Volunteer Drive'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {point.city}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-1">
                          {point.title}
                        </h4>
                        <p className="text-slate-600 text-xs line-clamp-2">
                          {point.summary}
                        </p>
                        <button
                          onClick={() => handlePointSelect(point)}
                          className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#2563eb] text-white font-bold text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Inspect Field Site</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Floating Map Legend Indicator */}
          <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-3 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Water & Sanitation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Education
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Health
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Volunteer Hub
            </span>
          </div>
        </div>

        {/* FIELD SITE INSPECTOR PANEL (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPoint ? (
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-5">
              {/* Site Image & Badges */}
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-100">
                <img
                  src={selectedPoint.image}
                  alt={selectedPoint.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm text-white ${
                      selectedPoint.type === 'campaign' ? 'bg-emerald-600' : 'bg-purple-600'
                    }`}
                  >
                    {selectedPoint.type === 'campaign' ? 'Verified Project' : 'Volunteer Mobilization'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{selectedPoint.city}</span>
                </div>
              </div>

              {/* Title & Organization */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  {selectedPoint.cause}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug">
                  {selectedPoint.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Managed by {selectedPoint.orgName}</span>
                </p>
              </div>

              {/* Project Summary */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {selectedPoint.summary}
              </p>

              {/* Campaign Funding Progress (if campaign) */}
              {selectedPoint.type === 'campaign' && (
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Funded Progress</span>
                    <span className="text-slate-900 font-heading">
                      ₹{Number(selectedPoint.raised).toLocaleString('en-IN')} / ₹{Number(selectedPoint.target).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563eb] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(selectedPoint.percentFunded || 78, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{selectedPoint.percentFunded || 78}% Achieved</span>
                    <span>Direct Milestone Escrow</span>
                  </div>
                </div>
              )}

              {/* Volunteer Details (if volunteer) */}
              {selectedPoint.type === 'volunteer' && (
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Positions Available</span>
                    <span className="text-purple-600 font-heading">
                      {selectedPoint.slotsLeft || 5} Open Slots
                    </span>
                  </div>
                  <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-xs font-medium border border-purple-100">
                    Skill matching verified: Includes official service certificates & verified community hours.
                  </div>
                </div>
              )}

              {/* Key Metrics Pill Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ground Metric
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {selectedPoint.metrics || 'Active Monitoring'}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Beneficiaries
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {selectedPoint.beneficiaries || 'Local Community'}
                  </p>
                </div>
              </div>

              {/* Direct Action Link */}
              <Link
                to={selectedPoint.link || (selectedPoint.type === 'campaign' ? '/campaigns' : '/volunteers')}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>
                  {selectedPoint.type === 'campaign' ? 'Contribute to this Campaign' : 'Apply for this Volunteer Role'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7 text-[#2563eb]" />
              </div>
              <h3 className="text-base font-bold text-slate-800 font-heading">
                Select a Location Pin
              </h3>
              <p className="text-xs text-slate-400">
                Click any interactive pin on the map to inspect live ground telemetry, funding status, and photos.
              </p>
            </div>
          )}

          {/* Quick List Directory of all Sites */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              All Field Sites ({filteredPoints.length})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none pr-1">
              {filteredPoints.map((pt) => (
                <div
                  key={pt.id}
                  onClick={() => handlePointSelect(pt)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedPoint?.id === pt.id
                      ? 'bg-blue-50 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-100 border-slate-100'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {pt.title}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{pt.city}</span> • <span>{pt.cause}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ImpactBridgeLayout>
  );
};
