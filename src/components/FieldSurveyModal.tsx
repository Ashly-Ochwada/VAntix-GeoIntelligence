import React, { useState } from 'react';
import { FieldSurvey, IndustryDomain, AnomalySeverity } from '../types/geo';
import { X, MapPin, Upload, ShieldCheck, Check } from 'lucide-react';

interface FieldSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (survey: Omit<FieldSurvey, 'id' | 'timestamp'>) => void;
  defaultCoords: { lat: number; lng: number };
  selectedIndustry: IndustryDomain;
}

export const FieldSurveyModal: React.FC<FieldSurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultCoords,
  selectedIndustry
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [surveyorName, setSurveyorName] = useState('Eng. David Kiprono');
  const [surveyorRole, setSurveyorRole] = useState('Senior Geodesist & GIS Officer');
  const [lat, setLat] = useState(defaultCoords.lat.toString());
  const [lng, setLng] = useState(defaultCoords.lng.toString());
  const [sector, setSector] = useState('Quadrant 3 Corridor');
  const [severity, setSeverity] = useState<AnomalySeverity>('warning');
  const [notes, setNotes] = useState('');
  const [metricLabel, setMetricLabel] = useState('Soil Moisture');
  const [metricValue, setMetricValue] = useState('14.2');
  const [metricUnit, setMetricUnit] = useState('%');
  const [recommendedAction, setRecommendedAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title || 'Field Ground Truth Observation',
      surveyorName,
      surveyorRole,
      coordinates: {
        lat: parseFloat(lat) || defaultCoords.lat,
        lng: parseFloat(lng) || defaultCoords.lng
      },
      sector,
      industry: selectedIndustry,
      status: 'verified',
      severity,
      notes: notes || 'Ground inspection verified coordinates and environmental status.',
      metrics: [
        {
          label: metricLabel,
          value: metricValue,
          unit: metricUnit
        }
      ],
      recommendedAction: recommendedAction || 'Log into quarterly GIS audit.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Log Field Ground Truth Survey</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Survey Observation Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Substation Geotechnical Anchor Survey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Lead Surveyor Name</label>
              <input
                type="text"
                required
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Surveyor Title / Sector</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>GPS Geocode Reference</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Latitude</label>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Longitude</label>
                <input
                  type="text"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Severity & Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Risk Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AnomalySeverity)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="nominal">Nominal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Key Metric Label</label>
              <input
                type="text"
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Value & Unit</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className="w-2/3 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                />
                <input
                  type="text"
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value)}
                  className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-2 text-slate-100 text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Ground Observations & Evidence</label>
            <textarea
              rows={3}
              required
              placeholder="Describe physical condition observed on-site..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Recommended Action</label>
            <input
              type="text"
              placeholder="e.g. Schedule drone thermal pass or dispatch contractor"
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Record & Sync to GIS Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
