export type IndustryDomain = 'infrastructure' | 'agriculture' | 'development';

export type BaseMapType = 'satellite' | 'dark' | 'topo';

export type AnomalySeverity = 'critical' | 'warning' | 'nominal';

export type SurveyStatus = 'verified' | 'investigating' | 'resolved' | 'pending';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface GISLayer {
  id: string;
  name: string;
  category: 'satellite' | 'infrastructure' | 'agriculture' | 'surveys' | 'socioeconomic';
  description: string;
  visible: boolean;
  opacity: number;
  count?: number;
  color: string;
  supportedIndustries: IndustryDomain[];
}

export interface FieldSurvey {
  id: string;
  title: string;
  surveyorName: string;
  surveyorRole: string;
  coordinates: GeoCoordinate;
  sector: string;
  industry: IndustryDomain;
  status: SurveyStatus;
  severity: AnomalySeverity;
  timestamp: string;
  notes: string;
  imageUrl?: string;
  metrics: {
    label: string;
    value: string;
    unit?: string;
  }[];
  recommendedAction: string;
}

export interface GISFeature {
  id: string;
  name: string;
  industry: IndustryDomain;
  type: 'corridor' | 'pivot' | 'facility' | 'community';
  coordinates: GeoCoordinate;
  bounds?: [number, number][]; // Polygon coordinates
  status: 'nominal' | 'alert' | 'maintenance' | 'underserved';
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  metric3: { label: string; value: string };
  lastSatellitePass: string;
  changeRate: string; // e.g., "+4.2% vegetation" or "12m encroachment"
  description: string;
  details: {
    coverageAreaKm2: number;
    elevationMeters: number;
    beneficiariesOrCapacity: string;
    riskScore: number;
  };
}

export interface SpatialAnomaly {
  id: string;
  title: string;
  industry: IndustryDomain;
  coordinates: GeoCoordinate;
  severity: AnomalySeverity;
  category: 'Encroachment' | 'Vegetation Stress' | 'Coverage Deficit' | 'Infrastructure Defect';
  detectedDate: string;
  confidenceScore: number; // e.g. 94.2%
  deltaDescription: string;
  baselinePeriod: string;
  currentPeriod: string;
  affectedKm2: number;
  status: 'open' | 'dispatched' | 'remediated';
}

export interface ProjectSummary {
  id: string;
  name: string;
  industry: IndustryDomain;
  region: string;
  center: GeoCoordinate;
  zoom: number;
  totalAssets: number;
  monitoredAreaKm2: number;
  activeSurveys: number;
  openAnomalies: number;
  description: string;
}
