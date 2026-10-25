import React, { useState } from 'react';
import { GISLayer, IndustryDomain } from '../types/geo';
import { Layers, Eye, EyeOff, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

interface LayerControlPanelProps {
  layers: GISLayer[];
  onToggleLayer: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  selectedIndustry: IndustryDomain;
}

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  layers,
  onToggleLayer,
  onChangeOpacity,
  selectedIndustry
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Filter layers relevant to selected industry or universal
  const relevantLayers = layers.filter(layer => 
    layer.supportedIndustries.includes(selectedIndustry)
  );

  return (
    <div className="absolute top-16 left-4 z-10 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl text-xs overflow-hidden transition-all">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-850 border-b border-slate-800/80 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>GIS Layers & Overlays</span>
          <span className="text-[10px] font-mono bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded">
            {relevantLayers.filter(l => l.visible).length}/{relevantLayers.length}
          </span>
        </div>
        <button 
          aria-label={isExpanded ? 'Collapse layer panel' : 'Expand layer panel'}
          className="text-slate-400 hover:text-white"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3 max-h-[360px] overflow-y-auto">
          {relevantLayers.map(layer => (
            <div 
              key={layer.id} 
              className={`p-2.5 rounded-lg border transition-all ${
                layer.visible 
                  ? 'bg-slate-800/60 border-slate-700/80' 
                  : 'bg-slate-900/40 border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full mt-0.5 shrink-0" 
                    style={{ backgroundColor: layer.color }}
                  />
                  <div>
                    <div className="font-medium text-slate-200 flex items-center gap-1.5">
                      <span>{layer.name}</span>
                      {layer.count !== undefined && (
                        <span className="text-[10px] font-mono text-slate-400">({layer.count})</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{layer.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleLayer(layer.id)}
                  aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    layer.visible ? 'text-sky-400 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              {layer.visible && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-slate-500" />
                    <span>Opacity</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={layer.opacity}
                      onChange={(e) => onChangeOpacity(layer.id, parseFloat(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer h-1 bg-slate-700 rounded-lg appearance-none"
                    />
                    <span className="font-mono text-[10px] w-7 text-right">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-800/80">
            Active Project Grid: Standard WGS84
          </div>
        </div>
      )}
    </div>
  );
};
