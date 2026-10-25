import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MapContainer } from './components/MapContainer';
import { LayerControlPanel } from './components/LayerControlPanel';
import { TemporalSlider } from './components/TemporalSlider';
import { AnomalyFeed } from './components/AnomalyFeed';
import { FieldSurveyView } from './components/FieldSurveyView';
import { FieldSurveyModal } from './components/FieldSurveyModal';
import { AssetDetailDrawer } from './components/AssetDetailDrawer';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { EnterprisePricingModal } from './components/EnterprisePricingModal';
import {
  INITIAL_PROJECTS,
  INITIAL_LAYERS,
  MOCK_FEATURES,
  MOCK_SURVEYS,
  MOCK_ANOMALIES
} from './data/mockGeoData';
import {
  IndustryDomain,
  BaseMapType,
  GISFeature,
  FieldSurvey,
  SpatialAnomaly,
  GISLayer
} from './types/geo';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'map' | 'anomalies' | 'surveys' | 'pricing'>('map');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryDomain>('infrastructure');
  const [baseMap, setBaseMap] = useState<BaseMapType>('satellite');
  const [temporalYear, setTemporalYear] = useState<string>('2026');
  const [isDiffModeActive, setIsDiffModeActive] = useState<boolean>(false);

  // Data states
  const [features, setFeatures] = useState<GISFeature[]>(MOCK_FEATURES);
  const [surveys, setSurveys] = useState<FieldSurvey[]>(MOCK_SURVEYS);
  const [anomalies, setAnomalies] = useState<SpatialAnomaly[]>(MOCK_ANOMALIES);
  const [layers, setLayers] = useState<GISLayer[]>(INITIAL_LAYERS);

  // Selection states
  const [selectedItem, setSelectedItem] = useState<{
    data: GISFeature | FieldSurvey | SpatialAnomaly;
    type: 'feature' | 'survey' | 'anomaly';
  } | null>(null);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isNewSurveyModalOpen, setIsNewSurveyModalOpen] = useState<boolean>(false);

  // Active Project for selected industry
  const currentProject = INITIAL_PROJECTS.find(p => p.industry === selectedIndustry) || INITIAL_PROJECTS[0];

  // Layer toggling
  const handleToggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l));
  };

  const handleChangeOpacity = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, opacity } : l));
  };

  // Anomaly actions
  const handleDispatchAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status: 'dispatched' } : a));
  };

  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status: 'remediated' } : a));
  };

  // Add new field survey
  const handleAddNewSurvey = (newSurveyData: Omit<FieldSurvey, 'id' | 'timestamp'>) => {
    const newSurvey: FieldSurvey = {
      ...newSurveyData,
      id: `srv-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
    };
    setSurveys(prev => [newSurvey, ...prev]);
    // Also select and view on map
    setSelectedItem({ data: newSurvey, type: 'survey' });
    setCurrentTab('map');
  };

  const openAnomalyCount = anomalies.filter(a => a.status === 'open' && a.industry === selectedIndustry).length;

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation & Domain Selector */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={(ind) => {
          setSelectedIndustry(ind);
          setSelectedItem(null);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        openAnomalyCount={openAnomalyCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentTab === 'map' && (
          <div className="relative w-full h-[calc(100vh-105px)]">
            {/* Interactive Leaflet Map */}
            <MapContainer
              features={features.filter(f => f.industry === selectedIndustry)}
              surveys={surveys.filter(s => s.industry === selectedIndustry)}
              anomalies={anomalies.filter(a => a.industry === selectedIndustry)}
              layers={layers}
              currentProjectCenter={currentProject.center}
              currentZoom={currentProject.zoom}
              baseMap={baseMap}
              setBaseMap={setBaseMap}
              selectedIndustry={selectedIndustry}
              onSelectFeature={(data, type) => setSelectedItem({ data, type })}
              isDiffModeActive={isDiffModeActive}
              temporalYear={temporalYear}
            />

            {/* Floating Layer Stack Controller */}
            <LayerControlPanel
              layers={layers}
              onToggleLayer={handleToggleLayer}
              onChangeOpacity={handleChangeOpacity}
              selectedIndustry={selectedIndustry}
            />

            {/* Bi-Temporal Change Detection Slider */}
            <TemporalSlider
              temporalYear={temporalYear}
              setTemporalYear={setTemporalYear}
              isDiffModeActive={isDiffModeActive}
              setIsDiffModeActive={setIsDiffModeActive}
            />

            {/* Quick Action to log Field Ground Truth from map */}
            <div className="absolute top-16 right-4 z-10 hidden sm:block">
              {!selectedItem && (
                <button
                  onClick={() => setIsNewSurveyModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>Log Ground Truth Pin</span>
                </button>
              )}
            </div>

            {/* Selected Feature / Survey / Anomaly Drawer */}
            <AssetDetailDrawer
              selectedItem={selectedItem}
              onClose={() => setSelectedItem(null)}
              onScheduleDispatch={(id) => {
                handleDispatchAnomaly(id);
                setSelectedItem(prev => prev ? { ...prev, data: { ...prev.data, status: 'dispatched' } as any } : null);
              }}
            />
          </div>
        )}

        {currentTab === 'anomalies' && (
          <AnomalyFeed
            anomalies={anomalies}
            onSelectAnomaly={(anom) => {
              setSelectedItem({ data: anom, type: 'anomaly' });
              setCurrentTab('map');
            }}
            onDispatchAnomaly={handleDispatchAnomaly}
            onResolveAnomaly={handleResolveAnomaly}
            selectedIndustry={selectedIndustry}
          />
        )}

        {currentTab === 'surveys' && (
          <FieldSurveyView
            surveys={surveys}
            onSelectSurvey={(srv) => {
              setSelectedItem({ data: srv, type: 'survey' });
              setCurrentTab('map');
            }}
            onOpenNewSurveyModal={() => setIsNewSurveyModalOpen(true)}
            selectedIndustry={selectedIndustry}
          />
        )}

        {currentTab === 'pricing' && (
          <EnterprisePricingModal />
        )}
      </main>

      {/* Evidence-Backed Report Exporter Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        project={currentProject}
        features={features}
        surveys={surveys}
        anomalies={anomalies}
        selectedIndustry={selectedIndustry}
      />

      {/* Field Survey Ground Truth Logger Modal */}
      <FieldSurveyModal
        isOpen={isNewSurveyModalOpen}
        onClose={() => setIsNewSurveyModalOpen(false)}
        onSubmit={handleAddNewSurvey}
        defaultCoords={currentProject.center}
        selectedIndustry={selectedIndustry}
      />
    </div>
  );
}
