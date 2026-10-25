import React, { useState } from 'react';
import { ENTERPRISE_PLANS } from '../data/mockGeoData';
import { Check, DollarSign, Calculator, Layers, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface EnterprisePricingModalProps {
  onClose?: () => void;
}

export const EnterprisePricingModal: React.FC<EnterprisePricingModalProps> = ({ onClose }) => {
  const [coverageArea, setCoverageArea] = useState<number>(2500);
  const [updateCadence, setUpdateCadence] = useState<'weekly' | 'biweekly' | 'daily'>('weekly');
  const [includeFieldLicenses, setIncludeFieldLicenses] = useState<boolean>(true);
  const [includeDronePhotogrammetry, setIncludeDronePhotogrammetry] = useState<boolean>(false);
  const [submittedLead, setSubmittedLead] = useState<boolean>(false);
  const [contactEmail, setContactEmail] = useState<string>('');

  // Calculate estimated investment
  const baseCost = Math.round((coverageArea / 1000) * 12000);
  const cadenceMultiplier = updateCadence === 'daily' ? 1.8 : updateCadence === 'weekly' ? 1.0 : 0.75;
  const fieldCost = includeFieldLicenses ? 4800 : 0;
  const droneCost = includeDronePhotogrammetry ? 9500 : 0;
  const totalEstimate = Math.round(baseCost * cadenceMultiplier + fieldCost + droneCost);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;
    setSubmittedLead(true);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-sky-400 uppercase tracking-wider">
            Commercial Architecture & Enterprise Deployment
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Implementation Projects & Platform Licensing
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A reusable geospatial platform built for infrastructure operators, agricultural agribusinesses, and multilateral development missions.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer self-start"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3 Core Tiers as specified in business model */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {ENTERPRISE_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              plan.recommended
                ? 'bg-slate-900/90 border-sky-500/50 shadow-xl shadow-sky-950/20 ring-1 ring-sky-500/30'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-sky-400 font-mono uppercase tracking-wider">
                  {plan.name}
                </span>
                {plan.recommended && (
                  <span className="text-[11px] font-mono text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                  {plan.price}
                </span>
                <span className="text-xs text-slate-400 ml-2">/ {plan.cadence}</span>
              </div>

              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                {plan.tagline}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Target Organization
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                  {plan.targetAudience}
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Deliverables & Features
                </div>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  const targetInput = document.getElementById('calc-email');
                  if (targetInput) targetInput.focus();
                }}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  plan.recommended
                    ? 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>Select & Configure Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Scope & Implementation Budget Estimator */}
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl mt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Interactive Enterprise Scope & Budget Estimator</h2>
            <p className="text-xs text-slate-400">Model custom project deployment parameters and annual platform licensing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6 text-xs text-slate-300">
            {/* Coverage Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-200">Monitored Geographical Extent</span>
                <span className="font-mono text-sky-400 font-bold tabular-nums text-sm">
                  {coverageArea.toLocaleString()} km²
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={coverageArea}
                onChange={(e) => setCoverageArea(parseInt(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>500 km² (Corridor Pilot)</span>
                <span>10,000 km² (Basin Scale)</span>
                <span>25,000 km² (National Scale)</span>
              </div>
            </div>

            {/* Satellite Cadence */}
            <div>
              <span className="font-semibold text-slate-200 block mb-2">Satellite Pass Cadence</span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUpdateCadence('biweekly')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    updateCadence === 'biweekly'
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="font-bold">Bi-Weekly (14 Days)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Forestry & macro-infrastructure</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateCadence('weekly')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    updateCadence === 'weekly'
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="font-bold">Weekly (5-7 Days)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Standard crop cycle & rights-of-way</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateCadence('daily')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    updateCadence === 'daily'
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="font-bold">Daily Revisit (Planet)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Critical asset security & flood alerts</div>
                </button>
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFieldLicenses}
                  onChange={(e) => setIncludeFieldLicenses(e.target.checked)}
                  className="rounded accent-sky-400 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">Mobile Field Survey Sync Package (15 Devices)</div>
                  <div className="text-[11px] text-slate-400">Offline geocaching, RTK GPS camera tagging & surveyor telemetry sync</div>
                </div>
                <span className="font-mono text-slate-300 font-semibold">+$4,800/yr</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDronePhotogrammetry}
                  onChange={(e) => setIncludeDronePhotogrammetry(e.target.checked)}
                  className="rounded accent-sky-400 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">High-Resolution Drone Orthomosaic Baseline Pass</div>
                  <div className="text-[11px] text-slate-400">Centimeter-level 3D point cloud & digital elevation model generation</div>
                </div>
                <span className="font-mono text-slate-300 font-semibold">+$9,500</span>
              </label>
            </div>
          </div>

          {/* Estimate Display & Inquiry Form */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Estimated Project Package
              </div>
              <div className="text-3xl font-extrabold text-sky-400 font-mono tabular-nums mt-2">
                ${totalEstimate.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Includes deployment, calibration, satellite licensing, and dedicated support
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Coverage Scope</span>
                  <span className="font-mono text-slate-200">{coverageArea.toLocaleString()} km²</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Revisit Frequency</span>
                  <span className="font-mono text-slate-200 capitalize">{updateCadence}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Field Survey Sync</span>
                  <span className="font-mono text-slate-200">{includeFieldLicenses ? 'Included' : 'Excluded'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Drone Photogrammetry</span>
                  <span className="font-mono text-slate-200">{includeDronePhotogrammetry ? 'Included' : 'Excluded'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              {submittedLead ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs text-center font-medium">
                  Proposal request received! Our Lead Solutions Engineer will contact {contactEmail} with a customized Statement of Work.
                </div>
              ) : (
                <form onSubmit={handleSubmitProposal} className="space-y-2">
                  <label className="block text-[11px] text-slate-400">Official Work Email</label>
                  <input
                    id="calc-email"
                    type="email"
                    required
                    placeholder="director@organization.org"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer mt-2"
                  >
                    Request Formal Statement of Work
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
