import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BaseMapType, GISFeature, FieldSurvey, SpatialAnomaly, GISLayer, IndustryDomain } from '../types/geo';
import { Layers, Crosshair, ZoomIn, ZoomOut, Compass, Info, Radio } from 'lucide-react';

interface MapContainerProps {
  features: GISFeature[];
  surveys: FieldSurvey[];
  anomalies: SpatialAnomaly[];
  layers: GISLayer[];
  currentProjectCenter: { lat: number; lng: number };
  currentZoom: number;
  baseMap: BaseMapType;
  setBaseMap: (type: BaseMapType) => void;
  selectedIndustry: IndustryDomain;
  onSelectFeature: (feature: GISFeature | FieldSurvey | SpatialAnomaly, type: 'feature' | 'survey' | 'anomaly') => void;
  isDiffModeActive: boolean;
  temporalYear: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  features,
  surveys,
  anomalies,
  layers,
  currentProjectCenter,
  currentZoom,
  baseMap,
  setBaseMap,
  selectedIndustry,
  onSelectFeature,
  isDiffModeActive,
  temporalYear
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const vectorLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerRef = useRef<L.Circle | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number }>({
    lat: currentProjectCenter.lat,
    lng: currentProjectCenter.lng
  });
  const [zoomLevel, setZoomLevel] = useState<number>(currentZoom);
  const [bufferRadiusMeters, setBufferRadiusMeters] = useState<number>(2000);
  const [bufferToolActive, setBufferToolActive] = useState<boolean>(false);
  const [bufferStats, setBufferStats] = useState<{ assetsCount: number; surveysCount: number } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentProjectCenter.lat, currentProjectCenter.lng],
        zoom: currentZoom,
        zoomControl: false,
        attributionControl: false
      });

      // Track coordinates
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setMouseCoords({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5))
        });
      });

      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

      // Click for buffer tool if active
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (bufferToolActive) {
          applyBufferAt(e.latlng.lat, e.latlng.lng, bufferRadiusMeters);
        }
      });

      vectorLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Center update when project changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [currentProjectCenter.lat, currentProjectCenter.lng],
        currentZoom,
        { duration: 1.2 }
      );
    }
  }, [currentProjectCenter, currentZoom]);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let maxZoom = 19;

    if (baseMap === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      maxZoom = 20;
    } else if (baseMap === 'topo') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    }

    const tileLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: baseMap === 'satellite' ? [] : ['a', 'b', 'c', 'd']
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = tileLayer;
  }, [baseMap]);

  // Handle Buffer Tool action
  const applyBufferAt = (lat: number, lng: number, radius: number) => {
    if (!mapInstanceRef.current) return;

    if (bufferLayerRef.current) {
      mapInstanceRef.current.removeLayer(bufferLayerRef.current);
      bufferLayerRef.current = null;
    }

    const circle = L.circle([lat, lng], {
      radius: radius,
      color: '#38bdf8',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#0284c7',
      fillOpacity: 0.15
    }).addTo(mapInstanceRef.current);

    bufferLayerRef.current = circle;

    // Calculate features within buffer
    const centerLatLng = L.latLng(lat, lng);
    const inBufferAssets = features.filter(f => {
      const dist = centerLatLng.distanceTo(L.latLng(f.coordinates.lat, f.coordinates.lng));
      return dist <= radius;
    }).length;

    const inBufferSurveys = surveys.filter(s => {
      const dist = centerLatLng.distanceTo(L.latLng(s.coordinates.lat, s.coordinates.lng));
      return dist <= radius;
    }).length;

    setBufferStats({ assetsCount: inBufferAssets, surveysCount: inBufferSurveys });
  };

  const clearBuffer = () => {
    if (bufferLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(bufferLayerRef.current);
      bufferLayerRef.current = null;
      setBufferStats(null);
    }
  };

  // Render Vector Layers & Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !vectorLayerGroupRef.current) return;

    vectorLayerGroupRef.current.clearLayers();

    const isLayerVisible = (id: string) => {
      const l = layers.find(layer => layer.id === id);
      return l ? l.visible : true;
    };

    // 1. Render Polygons for Features
    features.forEach(feat => {
      // Check industry filter or layer visibility
      const layerMatches = 
        (feat.type === 'corridor' && isLayerVisible('layer-infra-corridor')) ||
        (feat.type === 'pivot' && isLayerVisible('layer-ndvi-multispectral')) ||
        (feat.type === 'community' && isLayerVisible('layer-coverage-buffers')) ||
        feat.type === 'facility';

      if (layerMatches && feat.bounds) {
        const polyCoords = feat.bounds.map(b => [b[0], b[1]] as [number, number]);
        
        let polyColor = '#38bdf8';
        if (feat.industry === 'infrastructure') polyColor = feat.status === 'alert' ? '#ef4444' : '#f59e0b';
        if (feat.industry === 'agriculture') polyColor = feat.status === 'alert' ? '#f97316' : '#22c55e';
        if (feat.industry === 'development') polyColor = feat.status === 'underserved' ? '#a855f7' : '#06b6d4';

        const polygon = L.polygon(polyCoords, {
          color: polyColor,
          weight: 2,
          fillColor: polyColor,
          fillOpacity: isDiffModeActive && feat.status === 'alert' ? 0.45 : 0.22,
          dashArray: feat.status === 'underserved' ? '5, 5' : undefined
        });

        polygon.on('click', () => {
          onSelectFeature(feat, 'feature');
        });

        polygon.bindTooltip(`<strong>${feat.name}</strong><br/><span class="text-xs">${feat.metric1.label}: ${feat.metric1.value}</span>`, {
          className: 'bg-slate-900 text-slate-100 border border-slate-700 text-xs rounded shadow px-2 py-1',
          sticky: true
        });

        vectorLayerGroupRef.current?.addLayer(polygon);
      }

      // 2. Feature Center Point Marker
      let markerBorderColor = '#38bdf8';
      let statusColor = '#22c55e';
      if (feat.status === 'alert') statusColor = '#ef4444';
      if (feat.status === 'maintenance') statusColor = '#f59e0b';
      if (feat.status === 'underserved') statusColor = '#a855f7';

      const customIcon = L.divIcon({
        className: 'custom-geo-pin',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: ${statusColor}; opacity: 0.25; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background: ${statusColor}; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([feat.coordinates.lat, feat.coordinates.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectFeature(feat, 'feature');
      });

      vectorLayerGroupRef.current?.addLayer(marker);
    });

    // 3. Render Field Survey Ground Truth Pins
    if (isLayerVisible('layer-field-surveys')) {
      surveys.forEach(survey => {
        let pinColor = '#06b6d4';
        if (survey.severity === 'critical') pinColor = '#dc2626';
        if (survey.severity === 'warning') pinColor = '#f59e0b';

        const surveyIcon = L.divIcon({
          className: 'survey-pin',
          html: `
            <div style="width: 24px; height: 24px; background: #0f172a; border: 2px solid ${pinColor}; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.6); cursor: pointer;">
              <span style="color: ${pinColor}; font-size: 11px; font-weight: bold;">G</span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const surveyMarker = L.marker([survey.coordinates.lat, survey.coordinates.lng], { icon: surveyIcon });
        surveyMarker.on('click', () => {
          onSelectFeature(survey, 'survey');
        });

        surveyMarker.bindTooltip(`<strong>Field Survey: ${survey.title}</strong><br/>Surveyor: ${survey.surveyorName}`, {
          className: 'bg-slate-900 text-slate-100 border border-slate-700 text-xs rounded shadow px-2 py-1',
          sticky: true
        });

        vectorLayerGroupRef.current?.addLayer(surveyMarker);
      });
    }

    // 4. Render Spatial Anomalies
    if (isLayerVisible('layer-change-anomalies')) {
      anomalies.forEach(anomaly => {
        const anomalyIcon = L.divIcon({
          className: 'anomaly-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: #ef4444; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 18px; height: 18px; background: #ef4444; border: 2px solid #ffffff; transform: rotate(45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);">
                <div style="width: 4px; height: 4px; background: #ffffff; border-radius: 50%;"></div>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const anomalyMarker = L.marker([anomaly.coordinates.lat, anomaly.coordinates.lng], { icon: anomalyIcon });
        anomalyMarker.on('click', () => {
          onSelectFeature(anomaly, 'anomaly');
        });

        anomalyMarker.bindTooltip(`<strong>Anomaly: ${anomaly.title}</strong><br/><span class="text-xs text-red-300">Confidence: ${anomaly.confidenceScore}%</span>`, {
          className: 'bg-red-950 text-red-100 border border-red-700 text-xs rounded shadow px-2 py-1',
          sticky: true
        });

        vectorLayerGroupRef.current?.addLayer(anomalyMarker);
      });
    }

  }, [features, surveys, anomalies, layers, isDiffModeActive, temporalYear]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#080d17]">
      {/* Actual Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Base Map Switcher */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-lg text-xs">
        <button
          onClick={() => setBaseMap('satellite')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            baseMap === 'satellite'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Esri Satellite
        </button>
        <button
          onClick={() => setBaseMap('dark')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            baseMap === 'dark'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Carto Dark
        </button>
        <button
          onClick={() => setBaseMap('topo')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            baseMap === 'topo'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          OSM Topo
        </button>
      </div>

      {/* Top Right: Spatial Buffer Tool Widget */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 text-xs">
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-lg">
          <button
            onClick={() => {
              setBufferToolActive(!bufferToolActive);
              if (bufferToolActive) clearBuffer();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 cursor-pointer ${
              bufferToolActive
                ? 'bg-sky-500 text-slate-900 font-semibold'
                : 'text-slate-300 hover:text-white bg-slate-800/80'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{bufferToolActive ? 'Buffer Active (Click Map)' : 'Proximity Buffer Tool'}</span>
          </button>

          {bufferToolActive && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <button
                onClick={() => setBufferRadiusMeters(1000)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  bufferRadiusMeters === 1000 ? 'bg-sky-500/20 text-sky-300 font-mono' : 'text-slate-400'
                }`}
              >
                1 km
              </button>
              <button
                onClick={() => setBufferRadiusMeters(2500)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  bufferRadiusMeters === 2500 ? 'bg-sky-500/20 text-sky-300 font-mono' : 'text-slate-400'
                }`}
              >
                2.5 km
              </button>
              <button
                onClick={() => setBufferRadiusMeters(5000)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  bufferRadiusMeters === 5000 ? 'bg-sky-500/20 text-sky-300 font-mono' : 'text-slate-400'
                }`}
              >
                5 km
              </button>
              <button
                onClick={clearBuffer}
                className="px-2 py-1 text-slate-400 hover:text-red-400 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {bufferStats && (
          <div className="p-2.5 bg-slate-900/95 border border-sky-500/40 rounded-lg text-slate-200 shadow-xl max-w-xs text-left animate-in fade-in">
            <div className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>Buffer Reach ({bufferRadiusMeters / 1000} km)</span>
            </div>
            <div className="space-y-0.5 text-[11px] text-slate-300 font-mono tabular-nums">
              <div>Assets Contained: {bufferStats.assetsCount}</div>
              <div>Ground Surveys: {bufferStats.surveysCount}</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Center / Left HUD: Real-time Cursor Coordinates & Telemetry */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg text-xs font-mono text-slate-300 shadow-lg tabular-nums">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Crosshair className="w-3.5 h-3.5 text-sky-400" />
          <span>LAT: {mouseCoords.lat > 0 ? `+${mouseCoords.lat}` : mouseCoords.lat}°</span>
          <span className="text-slate-600">|</span>
          <span>LNG: {mouseCoords.lng > 0 ? `+${mouseCoords.lng}` : mouseCoords.lng}°</span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="flex items-center gap-1 text-slate-400">
          <span>ZOOM: {zoomLevel}</span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="text-slate-400">
          <span>ORBIT: {temporalYear}</span>
        </div>
      </div>

      {/* Bottom Right: Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          aria-label="Zoom in"
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg shadow-md cursor-pointer transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          aria-label="Zoom out"
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg shadow-md cursor-pointer transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
