import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { apiFetch } from '../utils/api';
import { Link } from 'react-router-dom';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { Globe, Heart, Users, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

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
  const [filterType, setFilterType] = useState('all');
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
    <ImpactBridgeLayout title="Impact Map">
      {/* Top Filter Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Geospatial Transparency View
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live location pins of verified campaigns and volunteer drives across India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Pins
            </button>
            <button
              onClick={() => setFilterType('campaign')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'campaign'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setFilterType('volunteer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'volunteer'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Volunteer Drives
            </button>
          </div>
        </div>

        {/* Cause Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
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

      {/* Map Container inside clean rounded white card */}
      <div className="bg-white rounded-3xl p-3 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
        <div className="h-[600px] w-full rounded-2xl overflow-hidden z-0">
          <MapContainer
            center={[22.3511, 78.6677]}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full rounded-2xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPoints.map((point) => (
              <Marker
                key={point.id}
                position={[point.latitude, point.longitude]}
                icon={point.type === 'campaign' ? campaignIcon : volunteerIcon}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs text-xs">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        point.type === 'campaign'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {point.type === 'campaign' ? 'Active Project' : 'Volunteer Drive'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-1">
                      {point.title}
                    </h4>
                    <p className="text-slate-600 text-xs line-clamp-2">{point.description}</p>
                    {point.link && (
                      <Link
                        to={point.link}
                        className="inline-block mt-1 font-bold text-blue-600 hover:underline"
                      >
                        View Project Details →
                      </Link>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </ImpactBridgeLayout>
  );
};
