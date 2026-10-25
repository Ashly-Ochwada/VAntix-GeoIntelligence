import React from 'react';
import { History, Play, Pause, Flame, Sparkles } from 'lucide-react';

interface TemporalSliderProps {
  temporalYear: string;
  setTemporalYear: (year: string) => void;
  isDiffModeActive: boolean;
  setIsDiffModeActive: (active: boolean) => void;
}

export const TemporalSlider: React.FC<TemporalSliderProps> = ({
  temporalYear,
  setTemporalYear,
  isDiffModeActive,
  setIsDiffModeActive
}) => {
  const timeSteps = [
    { id: '2024', label: 'Oct 2024', sub: 'Baseline Survey' },
    { id: '2025', label: 'Oct 2025', sub: 'Intermediate Orbit' },
    { id: '2026', label: 'Oct 2026', sub: 'Current Active' }
  ];

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-6 text-xs max-w-xl w-[92%] sm:w-auto">
      {/* Label and Mode Indicator */}
      <div className="flex items-center gap-2 text-slate-300 shrink-0">
        <History className="w-4 h-4 text-sky-400" />
        <div>
          <div className="font-semibold text-slate-200">Temporal Comparison</div>
          <div className="text-[10px] text-slate-400">Sentinel-2 & High-Res Optical</div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
        {timeSteps.map((step) => {
          const isActive = temporalYear === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setTemporalYear(step.id)}
              className={`px-3 py-1.5 rounded-md transition-all text-left cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <div className="text-xs font-semibold">{step.label}</div>
            </button>
          );
        })}
      </div>

      {/* Anomaly Differencing Mask Toggle */}
      <div className="flex items-center gap-2 pl-4 border-l border-slate-800 shrink-0">
        <button
          onClick={() => setIsDiffModeActive(!isDiffModeActive)}
          className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDiffModeActive
              ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${isDiffModeActive ? 'text-red-400' : 'text-slate-500'}`} />
          <span>Bi-Temporal Change Mask</span>
        </button>
      </div>
    </div>
  );
};
