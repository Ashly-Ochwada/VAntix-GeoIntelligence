import React from 'react';
import { Layers, FileText, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { IndustryDomain } from '../types/geo';

interface NavbarProps {
  currentTab: 'map' | 'anomalies' | 'surveys' | 'pricing';
  setCurrentTab: (tab: 'map' | 'anomalies' | 'surveys' | 'pricing') => void;
  selectedIndustry: IndustryDomain;
  setSelectedIndustry: (ind: IndustryDomain) => void;
  onOpenReportModal: () => void;
  openAnomalyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedIndustry,
  setSelectedIndustry,
  onOpenReportModal,
  openAnomalyCount
}) => {
  return (
    <header className="bg-[#0b1322] border-b border-slate-800/80 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-8 px-6 py-3.5 max-w-[1600px] mx-auto">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            VAntix GeoIntelligence
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('map')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 ${
              currentTab === 'map' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Map Workspace</span>
          </button>

          <button
            onClick={() => setCurrentTab('anomalies')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 ${
              currentTab === 'anomalies' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Change & Anomalies</span>
            {openAnomalyCount > 0 && (
              <span className="text-xs bg-red-500/20 text-red-300 font-mono px-1.5 py-0.2 rounded border border-red-500/30 tabular-nums">
                {openAnomalyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('surveys')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 ${
              currentTab === 'surveys' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Field Ground Truth</span>
          </button>

          <button
            onClick={() => setCurrentTab('pricing')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 ${
              currentTab === 'pricing' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Enterprise Licensing</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-900" />
            <span>Generate Evidence Report</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar for domain context switching (strictly in workspace toolbar, not top-level header lockup) */}
      <div className="bg-[#0e172a] border-t border-slate-800/60 px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Domain Sector:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedIndustry('infrastructure')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedIndustry === 'infrastructure'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Linear Infrastructure & Energy
              </button>
              <button
                onClick={() => setSelectedIndustry('agriculture')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedIndustry === 'agriculture'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agriculture & Crop Health
              </button>
              <button
                onClick={() => setSelectedIndustry('development')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedIndustry === 'development'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Development & Aid Coverage
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span>Spatial Engine: Multi-sensor Bi-temporal</span>
            <span aria-hidden="true">·</span>
            <span>Cadence: 5-Day Sentinel Revisit</span>
            <span aria-hidden="true">·</span>
            <span>Projection: WGS84 / UTM 37N</span>
          </div>
        </div>
      </div>
    </header>
  );
};
