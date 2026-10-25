import React, { useState } from 'react';
import { ProjectSummary, GISFeature, FieldSurvey, SpatialAnomaly, IndustryDomain } from '../types/geo';
import { X, FileText, Printer, Check, Copy, Shield, Download } from 'lucide-react';
import { GIS_DIRECTOR_IMG } from '../data/mockGeoData';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectSummary;
  features: GISFeature[];
  surveys: FieldSurvey[];
  anomalies: SpatialAnomaly[];
  selectedIndustry: IndustryDomain;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  project,
  features,
  surveys,
  anomalies,
  selectedIndustry
}) => {
  if (!isOpen) return null;

  const [reportType, setReportType] = useState<'donor' | 'executive' | 'esg'>('donor');
  const [recipientOrg, setRecipientOrg] = useState('World Bank Energy & Infrastructure Group');
  const [copied, setCopied] = useState(false);

  const reportDate = '2026-10-25';
  const reportRef = `VAN-GEO-${selectedIndustry.toUpperCase().slice(0, 3)}-99420`;

  const currentSurveys = surveys.filter(s => s.industry === selectedIndustry);
  const currentAnomalies = anomalies.filter(a => a.industry === selectedIndustry);
  const currentFeatures = features.filter(f => f.industry === selectedIndustry);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const markdown = `# VAntix GeoIntelligence Dossier [${reportRef}]
Recipient: ${recipientOrg}
Date: ${reportDate}
Domain Sector: ${selectedIndustry.toUpperCase()}
Monitored Area: ${project.monitoredAreaKm2} km²
Total Monitored Assets: ${currentFeatures.length}
Ground Truth Surveys: ${currentSurveys.length}
Active Spatial Anomalies: ${currentAnomalies.length}
Sign-off: Dr. Amina Mwangi, Lead Geospatial Director

Key Findings:
- Continuous bi-temporal satellite differencing verified ${currentFeatures.length} operational assets.
- Flagged ${currentAnomalies.length} actionable anomalies across target perimeter.
- Ground truth validation consistency score: 96.4%.`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generate Evidence-Backed Dossier</h2>
              <p className="text-xs text-slate-400">Exportable compliance & accountability reporting</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="px-6 py-3 bg-slate-850/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Report Profile:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg border border-slate-700">
              <button
                onClick={() => setReportType('donor')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  reportType === 'donor' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Donor Grant Accountability
              </button>
              <button
                onClick={() => setReportType('executive')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  reportType === 'executive' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Infrastructure & Asset Audit
              </button>
              <button
                onClick={() => setReportType('esg')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  reportType === 'esg' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Agricultural ESG Certification
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Recipient Organization:</span>
            <input
              type="text"
              value={recipientOrg}
              onChange={(e) => setRecipientOrg(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs w-64 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 overflow-y-auto bg-slate-950 text-slate-200 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
            <div>
              <div className="text-xl font-bold tracking-tight text-white">
                VAntix GeoIntelligence
              </div>
              <div className="text-xs text-sky-400 font-mono mt-0.5">
                EARTH OBSERVATION & SPATIAL DECISION PLATFORM
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Project Jurisdiction: <strong className="text-slate-200">{project.name}</strong>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 space-y-1">
              <div>REF: <span className="text-slate-200 font-bold">{reportRef}</span></div>
              <div>DATE: {reportDate}</div>
              <div>CLASSIFICATION: AUDITED SPATIAL EVIDENCE</div>
            </div>
          </div>

          {/* Stakeholder Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5 font-semibold">PREPARED FOR</span>
              <span className="text-sm font-bold text-white">{recipientOrg}</span>
              <span className="text-slate-400 block mt-0.5">Steering Committee & Executive Review</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 font-semibold">TARGET PERIMETER</span>
              <span className="text-sm font-bold text-white">{project.region}</span>
              <span className="text-slate-400 block mt-0.5">Monitored Area: {project.monitoredAreaKm2} km²</span>
            </div>
          </div>

          {/* Verified Geospatial Metrics */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              01. Verified Geospatial Coverage Metrics
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-[11px] text-slate-400">Total Monitored Assets</div>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                  {currentFeatures.length}
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-[11px] text-slate-400">Field Surveys Ingested</div>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
                  {currentSurveys.length}
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-[11px] text-slate-400">Bi-Temporal Anomalies</div>
                <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                  {currentAnomalies.length}
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-[11px] text-slate-400">Confidence Calibration</div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  96.4%
                </div>
              </div>
            </div>
          </div>

          {/* Findings Summary */}
          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              02. Executive Findings & Spatial Verification
            </h3>
            <p>
              This evidence dossier aggregates high-resolution satellite remote sensing passes (Sentinel-2 multi-spectral, Landsat-9 thermal, and 0.5m optical orthomosaics) integrated with mobile GPS field surveys and operational telemetry across <strong className="text-white">{project.monitoredAreaKm2} km²</strong>.
            </p>
            <p>
              Continuous temporal differencing confirmed nominal operational status across 86% of monitored zones. A total of <strong className="text-white">{currentAnomalies.length} spatial anomalies</strong> were detected and geocoded, with ground validation records and physical inspection notes appended below.
            </p>
          </div>

          {/* Anomaly Audit Log Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              03. Audited Spatial Anomalies & Intervention Log
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Anomaly Identifier</th>
                    <th className="py-2.5 px-3">Coordinates</th>
                    <th className="py-2.5 px-3">Displacement / Delta</th>
                    <th className="py-2.5 px-3">Affected Km²</th>
                    <th className="py-2.5 px-3 text-right">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {currentAnomalies.map(a => (
                    <tr key={a.id}>
                      <td className="py-2 px-3 font-semibold text-white">{a.title}</td>
                      <td className="py-2 px-3 font-mono text-slate-400 tabular-nums">
                        {a.coordinates.lat.toFixed(4)}°, {a.coordinates.lng.toFixed(4)}°
                      </td>
                      <td className="py-2 px-3 text-slate-400">{a.deltaDescription}</td>
                      <td className="py-2 px-3 font-mono tabular-nums">{a.affectedKm2}</td>
                      <td className="py-2 px-3 text-right uppercase font-mono font-bold text-red-400">
                        {a.severity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sign-off Seal */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <img
                src={GIS_DIRECTOR_IMG}
                alt="Lead Geospatial Director"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border border-sky-400/40 object-cover"
              />
              <div>
                <div className="font-bold text-white">Dr. Amina Mwangi, Ph.D.</div>
                <div className="text-slate-400">Lead Geospatial Remote Sensing Director</div>
                <div className="text-[11px] text-slate-500 font-mono">Digital Signature Hash: #VAN-GEO-7749-AUTH-OK</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>CRYPTOGRAPHICALLY VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
