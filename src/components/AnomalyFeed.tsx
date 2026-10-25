import React, { useState } from 'react';
import { SpatialAnomaly, AnomalySeverity, IndustryDomain } from '../types/geo';
import { AlertTriangle, Flame, CheckCircle, Navigation, Search, Filter } from 'lucide-react';

interface AnomalyFeedProps {
  anomalies: SpatialAnomaly[];
  onSelectAnomaly: (anomaly: SpatialAnomaly) => void;
  onDispatchAnomaly: (anomalyId: string) => void;
  onResolveAnomaly: (anomalyId: string) => void;
  selectedIndustry: IndustryDomain;
}

export const AnomalyFeed: React.FC<AnomalyFeedProps> = ({
  anomalies,
  onSelectAnomaly,
  onDispatchAnomaly,
  onResolveAnomaly,
  selectedIndustry
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = anomalies.filter(anom => {
    const matchesIndustry = anom.industry === selectedIndustry;
    const matchesSeverity = filterSeverity === 'all' || anom.severity === filterSeverity;
    const matchesSearch = anom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          anom.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          anom.deltaDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSeverity && matchesSearch;
  });

  const totalAffectedKm2 = filtered.reduce((acc, curr) => acc + curr.affectedKm2, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header and KPI strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-sky-400 uppercase tracking-wider">
            Automated Bi-Temporal Differencing
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Change & Spatial Anomaly Surveillance
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Continuous algorithmic comparison of multi-temporal satellite imagery passes against calibrated baselines to flag physical encroachments, vegetative loss, and critical service gaps.
          </p>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <div className="px-3 border-r border-slate-800">
            <div className="text-[11px] text-slate-400">Active Anomalies</div>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {filtered.filter(a => a.status !== 'remediated').length}
            </div>
          </div>
          <div className="px-3 border-r border-slate-800">
            <div className="text-[11px] text-slate-400">Affected Territory</div>
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              {totalAffectedKm2.toFixed(3)} km²
            </div>
          </div>
          <div className="px-3">
            <div className="text-[11px] text-slate-400">Mean Algorithm Confidence</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              94.8%
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Severity Filter:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Anomalies
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                filterSeverity === 'critical'
                  ? 'bg-red-500/20 text-red-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                filterSeverity === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warning
            </button>
          </div>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anomalies by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Anomalies Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="font-semibold text-slate-200">No anomalies matching current criteria</p>
          <p className="text-xs text-slate-400 mt-1">Satellite differential passes have detected no irregular changes in this quadrant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(anom => {
            const isResolved = anom.status === 'remediated';
            return (
              <div
                key={anom.id}
                className={`p-4 bg-slate-900 border rounded-xl transition-all ${
                  isResolved
                    ? 'border-slate-800/60 opacity-60'
                    : anom.severity === 'critical'
                    ? 'border-red-500/30 hover:border-red-500/50'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className={`font-semibold ${anom.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                        {anom.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{anom.detectedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>Confidence: <strong className="text-slate-200 font-mono">{anom.confidenceScore}%</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Status: <strong className="text-slate-200 uppercase">{anom.status}</strong></span>
                    </div>

                    <h2 className="text-base font-bold text-white">{anom.title}</h2>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{anom.deltaDescription}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                      <span>Baseline: {anom.baselinePeriod}</span>
                      <span aria-hidden="true">→</span>
                      <span>Current: {anom.currentPeriod}</span>
                      <span aria-hidden="true">·</span>
                      <span>Area: {anom.affectedKm2} km²</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectAnomaly(anom)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-400" />
                      <span>Locate on Map</span>
                    </button>

                    {anom.status === 'open' && (
                      <button
                        onClick={() => onDispatchAnomaly(anom.id)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-red-500/30 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Dispatch Field Inspector</span>
                      </button>
                    )}

                    {anom.status !== 'remediated' && (
                      <button
                        onClick={() => onResolveAnomaly(anom.id)}
                        className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Remediated</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
