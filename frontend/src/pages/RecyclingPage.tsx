import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { LocateFixed, MapPin, Navigation, RefreshCw, AlertCircle } from "lucide-react";

import "leaflet/dist/leaflet.css";
import StarsBackground from "../components/StarsBackground";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

// Import Leaflet types
import type { Icon as LeafletIcon } from 'leaflet';
import L from 'leaflet';

interface RecyclingCenter {
  id: number;
  name: string;
  lat: number;
  lon: number;
  type: string;
  address?: string;
  distance?: number;
}

interface Props {
  onNavigate: (page: string) => void;
  currentPage: string;
}

// Fix Leaflet default icon issue
const DefaultIcon = L.Icon.Default as unknown as { prototype: { _getIconUrl?: () => void } };
delete DefaultIcon.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom green marker for recycling centers
const recycleIcon: LeafletIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="11" fill="#10b981" stroke="white" stroke-width="2"/>
      <path d="M7 13l3 3 7-7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to recenter map when location changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const RecyclingMapPage: React.FC<Props> = ({ onNavigate, currentPage }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchRadius, setSearchRadius] = useState(5); // km

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user location
  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setError("");
      },
      (err) => {
        console.error("Geolocation error:", err);
        // Fallback locations based on common cities
        setUserLocation([19.0760, 72.8777]); // Mumbai fallback
        setError("Using default location. Allow location access for accurate results.");
      }
    );
  }, []);

  // Fetch recycling centers using Overpass API
  useEffect(() => {
    if (!userLocation) return;

    const fetchCenters = async () => {
      setLoading(true);
      try {
        const [lat, lon] = userLocation;
        const radiusMeters = searchRadius * 1000;

        // Overpass API query for recycling-related amenities
        const query = `
          [out:json][timeout:25];
          (
            node["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
            way["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
            node["shop"="recycling"](around:${radiusMeters},${lat},${lon});
            node["amenity"="waste_disposal"](around:${radiusMeters},${lat},${lon});
            way["amenity"="waste_disposal"](around:${radiusMeters},${lat},${lon});
          );
          out center;
        `;

        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recycling centers");
        }

        const data = await response.json();
        
        interface OverpassElement {
          id: number;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: {
            name?: string;
            operator?: string;
            recycling_type?: string;
            amenity?: string;
            'addr:street'?: string;
            'addr:housenumber'?: string;
            'addr:city'?: string;
          };
        }

        const mappedCenters: RecyclingCenter[] = data.elements
          .map((item: OverpassElement) => {
            const itemLat = item.lat ?? item.center?.lat;
            const itemLon = item.lon ?? item.center?.lon;
          
            if (itemLat === undefined || itemLon === undefined) {
              return null;
            }
          
            const distance = calculateDistance(lat, lon, itemLat, itemLon);
          
            return {
              id: item.id,
              name: item.tags?.name || item.tags?.operator || "Recycling Point",
              lat: itemLat,
              lon: itemLon,
              type: item.tags?.recycling_type || item.tags?.amenity || "recycling",
              address: [
                item.tags?.["addr:street"],
                item.tags?.["addr:housenumber"],
                item.tags?.["addr:city"]
              ].filter(Boolean).join(", ") || "Address not available",
              distance: parseFloat(distance.toFixed(2))
            };
          })
        .filter((c: RecyclingCenter | null): c is RecyclingCenter => c !== null);


        // Sort by distance
        mappedCenters.sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setCenters(mappedCenters);
        setError("");
        
        if (mappedCenters.length === 0) {
          setError("No recycling centers found nearby. Try increasing search radius.");
        }
      } catch (e) {
        console.error("Failed to load recycling centers", e);
        setError("Failed to load recycling centers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [userLocation, searchRadius]);

  const handleRefresh = () => {
    if (userLocation) {
      setCenters([]);
      setLoading(true);
      // Trigger refetch by updating a dummy state
      setSearchRadius(prev => prev);
    }
  };

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      <StarsBackground />

      <div className="relative z-10 pb-20">
        <Header />

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-extrabold text-center text-white mt-4 mb-0.5 uppercase">Recycling Centers</h1>
            {/* Line Animation */}
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/40 to-white/20 rounded-full" />
              <span className="text-lg text-white font-light">✦</span>
              <div className="h-0.5 w-20 bg-gradient-to-r from-white/20 to-white/40 rounded-full" />
            </div>
            <p className="text-gray-400 text-sm text-center capitalize">
              Discover locations where you can recycle responsibly
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center space-x-2 bg-gray-900/60 backdrop-blur-lg rounded-xl px-4 py-2 border border-gray-800">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Search Radius:</span>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="bg-gray-800 text-white px-2 py-1 rounded-lg text-sm border border-gray-700 focus:outline-none focus:border-white"
              >
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
                <option value={20}>20 km</option>
                <option value={25}>25 km</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-900/60 backdrop-blur-lg rounded-xl px-4 py-2 border border-gray-800 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-sm capitalize">{error}</p>
            </motion.div>
          )}

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl mb-6"
            style={{ height: "500px" }}
          >
            {userLocation ? (
              <MapContainer
                center={userLocation}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <RecenterMap center={userLocation} />

                {/* Search radius circle */}
                <Circle
                  center={userLocation}
                  radius={searchRadius * 1000}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />

                {/* User location marker */}
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-black font-semibold">
                      📍 You are here
                    </div>
                  </Popup>
                </Marker>

                {/* Recycling centers */}
                {centers.map((center) => (
                  <Marker
                    key={center.id}
                    position={[center.lat, center.lon]}
                    icon={recycleIcon}
                  >
                    <Popup>
                      <div className="text-black min-w-[200px]">
                        <div className="font-bold text-base mb-1">♻️ {center.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{center.address}</div>
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mb-2 inline-block">
                          📍 {center.distance} km away
                        </div>
                        <br />
                        <a
                          className="text-blue-600 underline text-sm font-semibold inline-flex items-center space-x-1"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lon}`}
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Get Directions</span>
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black">
                <LocateFixed className="w-12 h-12 text-gray-600 animate-pulse mb-4" />
                <p className="text-gray-400">Locating you...</p>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 text-center mb-6"
          >
            <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl p-4 border border-gray-800">
              <div className="text-white font-bold text-2xl">{loading ? "..." : centers.length}</div>
              <div className="text-gray-400 text-xs mt-1">Centers Found</div>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl p-4 border border-gray-800">
              <div className="text-white font-bold text-2xl">{searchRadius} km</div>
              <div className="text-gray-400 text-xs mt-1">Search Radius</div>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl p-4 border border-gray-800">
              <div className="text-white font-bold text-2xl">♻️</div>
              <div className="text-gray-400 text-xs mt-1">Eco Friendly</div>
            </div>
          </motion.div>

          {/* Nearby Centers List */}
          {centers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-800 p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>Nearby Centers ({centers.length})</span>
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {centers.slice(0, 10).map((center) => (
                  <div
                    key={center.id}
                    className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">♻️ {center.name}</h4>
                        <p className="text-xs text-gray-400 mb-2">{center.address}</p>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">
                            📍 {center.distance} km
                          </span>
                          <span className="text-gray-500">{center.type}</span>
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && centers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Searching for recycling centers...</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default RecyclingMapPage;