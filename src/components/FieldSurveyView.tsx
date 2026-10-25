import React, { useState } from 'react';
import { FieldSurvey, IndustryDomain } from '../types/geo';
import { ShieldCheck, Plus, Download, Search, CheckCircle, ExternalLink, MapPin } from 'lucide-react';

interface FieldSurveyViewProps {
  surveys: FieldSurvey[];
  onSelectSurvey: (survey: FieldSurvey) => void;
  onOpenNewSurveyModal: () => void;
  selectedIndustry: IndustryDomain;
}

export const FieldSurveyView: React.FC<FieldSurveyViewProps> = ({
  surveys,
  onSelectSurvey,
  onOpenNewSurveyModal,
  selectedIndustry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = surveys.filter(s => {
    const matchesIndustry = s.industry === selectedIndustry;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.surveyorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Surveyor', 'Role', 'Latitude', 'Longitude', 'Sector', 'Status', 'Severity', 'Timestamp', 'Notes'];
    const rows = filtered.map(s => [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.surveyorName}"`,
      `"${s.surveyorRole}"`,
      s.coordinates.lat,
      s.coordinates.lng,
      `"${s.sector}"`,
      s.status,
      s.severity,
      `"${s.timestamp}"`,
      `"${s.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vantix_field_surveys_${selectedIndustry}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Operational Ground Truth Calibration
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Mobile Field Surveys & GPS Records
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Correlating on-site surveyor verifications, mobile photogrammetry, and telemetry sensors directly with high-resolution satellite passes to eliminate false positives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={onOpenNewSurveyModal}
            className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Field Observation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Records ({filtered.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                statusFilter === 'verified' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setStatusFilter('investigating')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                statusFilter === 'investigating' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Investigating
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                statusFilter === 'resolved' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search surveyor, sector, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* High-Density Tabular Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-850 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Observation / Sector</th>
                <th className="py-3 px-4">Surveyor</th>
                <th className="py-3 px-4">GPS Coordinates</th>
                <th className="py-3 px-4">Key Telemetry</th>
                <th className="py-3 px-4">Status & Severity</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map(survey => {
                return (
                  <tr
                    key={survey.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onSelectSurvey(survey)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{survey.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{survey.sector}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{survey.surveyorName}</div>
                      <div className="text-[11px] text-slate-400">{survey.surveyorRole}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 tabular-nums">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{survey.coordinates.lat.toFixed(4)}°, {survey.coordinates.lng.toFixed(4)}°</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {survey.metrics.length > 0 ? (
                        <div className="font-mono text-slate-200 tabular-nums">
                          <span className="text-slate-400">{survey.metrics[0].label}:</span> {survey.metrics[0].value} {survey.metrics[0].unit || ''}
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold capitalize ${
                          survey.severity === 'critical' ? 'text-red-400' : survey.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {survey.severity}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400 uppercase text-[11px]">{survey.status}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 tabular-nums">
                      {survey.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSurvey(survey);
                        }}
                        className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
