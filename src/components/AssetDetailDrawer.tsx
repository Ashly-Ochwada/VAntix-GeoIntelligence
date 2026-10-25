import React from 'react';
import { GISFeature, FieldSurvey, SpatialAnomaly } from '../types/geo';
import { X, MapPin, Calendar, Activity, AlertTriangle, ShieldCheck, Download, CheckCircle, Navigation } from 'lucide-react';

interface AssetDetailDrawerProps {
  selectedItem: {
    data: GISFeature | FieldSurvey | SpatialAnomaly;
    type: 'feature' | 'survey' | 'anomaly';
  } | null;
  onClose: () => void;
  onScheduleDispatch?: (id: string) => void;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  selectedItem,
  onClose,
  onScheduleDispatch
}) => {
  if (!selectedItem) return null;

  const { data, type } = selectedItem;

  // Determine Title, Coordinates, Image, Description
  let title = '';
  let coords = { lat: 0, lng: 0 };
  let statusBadge = '';
  let statusClass = '';
  let imageUrl: string | undefined = undefined;
  let description = '';
  let lastPass = '2026-10-24';
  let riskScore = 0;

  if (type === 'feature') {
    const feat = data as GISFeature;
    title = feat.name;
    coords = feat.coordinates;
    statusBadge = feat.status.toUpperCase();
    description = feat.description;
    lastPass = feat.lastSatellitePass;
    riskScore = feat.details.riskScore;
    if (feat.industry === 'infrastructure') {
      imageUrl = '/src/assets/images/infrastructure_corridor_1792880896650.jpg';
    } else if (feat.industry === 'agriculture') {
      imageUrl = '/src/assets/images/satellite_crop_health_1792880897540.jpg';
    }

    if (feat.status === 'nominal') statusClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    else if (feat.status === 'alert') statusClass = 'text-red-400 bg-red-500/10 border-red-500/20';
    else if (feat.status === 'maintenance') statusClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    else statusClass = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  } else if (type === 'survey') {
    const srv = data as FieldSurvey;
    title = srv.title;
    coords = srv.coordinates;
    statusBadge = `FIELD: ${srv.status.toUpperCase()}`;
    description = srv.notes;
    lastPass = srv.timestamp;
    imageUrl = srv.imageUrl;
    statusClass = srv.severity === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  } else {
    const anom = data as SpatialAnomaly;
    title = anom.title;
    coords = anom.coordinates;
    statusBadge = `ANOMALY: ${anom.severity.toUpperCase()}`;
    description = anom.deltaDescription;
    lastPass = anom.detectedDate;
    statusClass = 'text-red-400 bg-red-500/10 border-red-500/20';
  }

  const exportGeoJSON = () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coords.lng, coords.lat]
      },
      properties: {
        title,
        type,
        timestamp: new Date().toISOString(),
        details: data
      }
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_geojson.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute top-16 right-4 z-20 w-96 max-w-[90vw] bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-120px)] animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-850">
        <div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${statusClass}`}>
            {statusBadge}
          </span>
          <h2 className="text-base font-bold text-white mt-1.5 leading-snug">{title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body content */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
        {/* Imagery Preview if available */}
        {imageUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-800 relative group">
            <img
              src={imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-center justify-between text-[11px] text-slate-300">
              <span>Sensor Orthorectified Pass</span>
              <span className="font-mono text-sky-400">0.5m GSD</span>
            </div>
          </div>
        )}

        {/* Spatial Coordinates & Metadata */}
        <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Spatial Coordinates</span>
            </span>
            <span className="font-mono text-slate-200 tabular-nums">
              {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Observation Time</span>
            </span>
            <span className="font-mono text-slate-200">{lastPass}</span>
          </div>
        </div>

        {/* Description / Findings */}
        <div>
          <h3 className="text-slate-400 font-semibold mb-1">Geospatial Observations</h3>
          <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-2.5 rounded-lg border border-slate-800">
            {description}
          </p>
        </div>

        {/* Feature specific metrics */}
        {type === 'feature' && (
          <div>
            <h3 className="text-slate-400 font-semibold mb-2">Key Operational Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <div className="text-[10px] text-slate-400">{(data as GISFeature).metric1.label}</div>
                <div className="font-bold text-sm text-slate-100 font-mono tabular-nums mt-0.5">
                  {(data as GISFeature).metric1.value}
                </div>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60">
                <div className="text-[10px] text-slate-400">{(data as GISFeature).metric2.label}</div>
                <div className="font-bold text-sm text-slate-100 font-mono tabular-nums mt-0.5">
                  {(data as GISFeature).metric2.value}
                </div>
              </div>
            </div>
            <div className="mt-2 p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60 flex items-center justify-between">
              <span className="text-slate-400">Risk Assessment Index</span>
              <span className={`font-mono font-bold ${riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                {riskScore} / 100
              </span>
            </div>
          </div>
        )}

        {/* Survey specific ground measurements */}
        {type === 'survey' && (
          <div>
            <h3 className="text-slate-400 font-semibold mb-2">Ground Validation Telemetry</h3>
            <div className="space-y-1.5">
              {(data as FieldSurvey).metrics.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-800">
                  <span className="text-slate-400">{m.label}</span>
                  <span className="font-mono text-slate-100 font-semibold tabular-nums">
                    {m.value} {m.unit || ''}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2.5 bg-sky-950/40 border border-sky-800/50 rounded-lg">
              <div className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
                Recommended Action
              </div>
              <div className="text-slate-200 mt-1">
                {(data as FieldSurvey).recommendedAction}
              </div>
            </div>
          </div>
        )}

        {/* Anomaly specific delta comparison */}
        {type === 'anomaly' && (
          <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-red-300">
              <span>Detection Confidence</span>
              <span className="font-mono font-bold tabular-nums">
                {(data as SpatialAnomaly).confidenceScore}%
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Affected Area</span>
              <span className="font-mono text-slate-200">
                {(data as SpatialAnomaly).affectedKm2} km²
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Baseline Compared</span>
              <span className="text-slate-200">{(data as SpatialAnomaly).baselinePeriod}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
          {type === 'anomaly' && (
            <button
              onClick={() => onScheduleDispatch && onScheduleDispatch(data.id)}
              className="w-full py-2 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Dispatch Field Inspection Unit</span>
            </button>
          )}

          <button
            onClick={exportGeoJSON}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export Verified GeoJSON Feature</span>
          </button>
        </div>
      </div>
    </div>
  );
};
