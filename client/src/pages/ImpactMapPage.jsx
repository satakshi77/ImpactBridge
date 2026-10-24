import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { apiFetch } from '../utils/api';
import { Link } from 'react-router-dom';
import { Globe, Heart, Users, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

// Custom Map Marker icons
const campaignIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const volunteerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const ImpactMapPage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'campaign', 'volunteer'
  const [selectedCause, setSelectedCause] = useState('All');

  const causeList = [
    'All',
    'Clean Water & Sanitation',
    'Quality Education',
    'Healthcare & Medical',
    'Environment & Climate',
  ];

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const query = new URLSearchParams();
        if (selectedCause !== 'All') query.append('cause', selectedCause);
        const data = await apiFetch(`/stats/map?${query.toString()}`);
        if (data.success) {
          setPoints(data.points || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [selectedCause]);

  const filteredPoints = points.filter((p) => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Geospatial Impact Visualizer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Community Impact Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Explore active fundraising initiatives and local volunteering drives by location. Sensitive
            beneficiary data is anonymized.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Active Campaigns</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="font-semibold text-slate-700">Volunteer Drives</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Cause Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {causeList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCause(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCause === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Pin Type Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: 'All Points' },
            { id: 'campaign', label: 'Campaigns Only' },
            { id: 'volunteer', label: 'Volunteer Hubs' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterType === item.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden h-[540px] relative">
        <MapContainer
          center={[24.5, 76.5]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredPoints.map((point) => (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={point.type === 'campaign' ? campaignIcon : volunteerIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1 max-w-[240px] space-y-2 text-slate-800">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        point.type === 'campaign'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {point.type === 'campaign' ? 'Fundraising Campaign' : 'Volunteer Opportunity'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold font-heading line-clamp-2">{point.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    {point.orgName} • {point.city}
                  </p>

                  {point.type === 'campaign' && (
                    <div className="bg-slate-50 p-2 rounded-lg text-[11px] space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Raised:</span>
                        <span className="text-emerald-700">₹{Number(point.raised).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(point.percentFunded || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {point.type === 'volunteer' && (
                    <div className="text-[11px] text-purple-800 font-semibold bg-purple-50 p-1.5 rounded-lg">
                      {point.slotsLeft} slots remaining ({point.locationType})
                    </div>
                  )}

                  {point.type === 'campaign' ? (
                    <Link
                      to={`/campaigns/${point.id}`}
                      className="block text-center py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      View Impact Tracker
                    </Link>
                  ) : (
                    <Link
                      to="/volunteers"
                      className="block text-center py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition"
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
