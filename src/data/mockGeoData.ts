import { ProjectSummary, GISFeature, FieldSurvey, SpatialAnomaly, GISLayer } from '../types/geo';

export const SATELLITE_CROP_IMG = '/src/assets/images/satellite_crop_health_1792880897540.jpg';
export const INFRASTRUCTURE_IMG = '/src/assets/images/infrastructure_corridor_1792880896650.jpg';
export const GIS_DIRECTOR_IMG = '/src/assets/images/avatar_gis_director_1792880897560.jpg';

export const INITIAL_PROJECTS: ProjectSummary[] = [
  {
    id: 'proj-infra',
    name: 'Rift Valley Transmission & Energy Corridor',
    industry: 'infrastructure',
    region: 'Nakuru - Olkaria - Suswa Grid',
    center: { lat: -0.892, lng: 36.321 },
    zoom: 13,
    totalAssets: 148,
    monitoredAreaKm2: 420.5,
    activeSurveys: 34,
    openAnomalies: 5,
    description: 'High-voltage 220kV transmission corridor, geothermal pipeline rights-of-way, and access roads monitoring for geotechnical displacement and unauthorized structural encroachment.'
  },
  {
    id: 'proj-agri',
    name: 'Great Lakes Basin Precision Agro-Zone',
    industry: 'agriculture',
    region: 'Lake Naivasha Horticultural & Pivot Cluster',
    center: { lat: -0.735, lng: 36.425 },
    zoom: 13,
    totalAssets: 92,
    monitoredAreaKm2: 285.0,
    activeSurveys: 28,
    openAnomalies: 4,
    description: 'Multi-spectral satellite NDVI analytics, center-pivot irrigation telemetry, soil moisture stress indices, and yield forecasting across commercial and cooperative farm boundaries.'
  },
  {
    id: 'proj-dev',
    name: 'Turkana & Arid Lands Water & Health Access',
    industry: 'development',
    region: 'Northern Rift Community Infrastructure',
    center: { lat: -0.320, lng: 36.085 },
    zoom: 12,
    totalAssets: 116,
    monitoredAreaKm2: 640.2,
    activeSurveys: 42,
    openAnomalies: 7,
    description: 'Tracking solar water boreholes, off-grid maternal clinics, refugee integration hubs, and 5km walking radius service gaps for multilateral donor accountability.'
  }
];

export const INITIAL_LAYERS: GISLayer[] = [
  {
    id: 'layer-sat-rgb',
    name: 'High-Res Optical Satellite (0.5m)',
    category: 'satellite',
    description: 'Sub-meter optical true-color satellite imagery pass refreshed weekly',
    visible: true,
    opacity: 1.0,
    color: '#38bdf8',
    supportedIndustries: ['infrastructure', 'agriculture', 'development']
  },
  {
    id: 'layer-ndvi-multispectral',
    name: 'Multi-Spectral NDVI Canopy Index',
    category: 'agriculture',
    description: 'Normalized Difference Vegetation Index tracking photosynthetic vigor and stress',
    visible: true,
    opacity: 0.75,
    color: '#22c55e',
    supportedIndustries: ['agriculture']
  },
  {
    id: 'layer-infra-corridor',
    name: '220kV Transmission & Pipeline ROW',
    category: 'infrastructure',
    description: 'Linear infrastructure corridors, 30-meter statutory right-of-way clearance buffers',
    visible: true,
    opacity: 0.85,
    color: '#f59e0b',
    supportedIndustries: ['infrastructure']
  },
  {
    id: 'layer-field-surveys',
    name: 'Mobile Field Survey & GPS Ground Truth',
    category: 'surveys',
    description: 'Field officer geotagged inspections, drone orthomosaics, and hazard flags',
    visible: true,
    opacity: 0.95,
    count: 34,
    color: '#06b6d4',
    supportedIndustries: ['infrastructure', 'agriculture', 'development']
  },
  {
    id: 'layer-coverage-buffers',
    name: '5km Potable Water & Clinic Service Buffers',
    category: 'socioeconomic',
    description: 'Isochrone walking catchment boundaries highlighting underserved population enclaves',
    visible: true,
    opacity: 0.65,
    color: '#8b5cf6',
    supportedIndustries: ['development']
  },
  {
    id: 'layer-change-anomalies',
    name: 'Automated Change & Anomaly Masks',
    category: 'satellite',
    description: 'Temporal bi-temporal differencing highlighting structural and environmental shifts',
    visible: true,
    opacity: 0.9,
    count: 12,
    color: '#ef4444',
    supportedIndustries: ['infrastructure', 'agriculture', 'development']
  }
];

export const MOCK_FEATURES: GISFeature[] = [
  // Infrastructure Corridor
  {
    id: 'feat-infra-01',
    name: 'Olkaria Substation Alpha & 220kV Gateway',
    industry: 'infrastructure',
    type: 'facility',
    coordinates: { lat: -0.892, lng: 36.321 },
    bounds: [
      [-0.888, 36.315],
      [-0.888, 36.328],
      [-0.896, 36.328],
      [-0.896, 36.315]
    ],
    status: 'nominal',
    metric1: { label: 'Line Load', value: '88.4%' },
    metric2: { label: 'Thermal Anomaly', value: 'None' },
    metric3: { label: 'ROW Clearance', value: '42m (Valid)' },
    lastSatellitePass: '2026-10-22',
    changeRate: 'Stable (+0.1% baseline)',
    description: 'Primary step-up transformer node feeding central Rift industrial distribution with automated thermal surveillance.',
    details: {
      coverageAreaKm2: 0.85,
      elevationMeters: 1940,
      beneficiariesOrCapacity: '280 MW throughput',
      riskScore: 12
    }
  },
  {
    id: 'feat-infra-02',
    name: 'Pylon Corridor Sector 4B (Suspension Towers 40-52)',
    industry: 'infrastructure',
    type: 'corridor',
    coordinates: { lat: -0.882, lng: 36.345 },
    bounds: [
      [-0.875, 36.335],
      [-0.878, 36.358],
      [-0.892, 36.354],
      [-0.889, 36.331]
    ],
    status: 'alert',
    metric1: { label: 'ROW Infringement', value: '18m closer than code' },
    metric2: { label: 'Soil Creep', value: '4.8 mm/yr' },
    metric3: { label: 'Survey Verified', value: 'Yes (Drone)' },
    lastSatellitePass: '2026-10-23',
    changeRate: 'Alert: Encroachment Detected',
    description: 'High-voltage suspension segment crossing unstable volcanic scree slope with newly detected unauthorized aggregate quarry nearby.',
    details: {
      coverageAreaKm2: 3.2,
      elevationMeters: 2010,
      beneficiariesOrCapacity: '132kV redundancy link',
      riskScore: 78
    }
  },
  {
    id: 'feat-infra-03',
    name: 'Geothermal Main Feeder Pipeline Corridor C',
    industry: 'infrastructure',
    type: 'corridor',
    coordinates: { lat: -0.905, lng: 36.302 },
    status: 'maintenance',
    metric1: { label: 'Insulation Integrity', value: '94.2%' },
    metric2: { label: 'Expansion Joint Strain', value: 'Nominal' },
    metric3: { label: 'Access Road Grade', value: 'Passable' },
    lastSatellitePass: '2026-10-21',
    changeRate: 'Vegetation +12% on berm',
    description: 'Steam transport pipe bundle elevated 1.8m above terrain; scheduled quarterly drone thermal lidar inspection completed.',
    details: {
      coverageAreaKm2: 2.1,
      elevationMeters: 1880,
      beneficiariesOrCapacity: '65 tonnes/hr steam flow',
      riskScore: 28
    }
  },

  // Agriculture Features
  {
    id: 'feat-agri-01',
    name: 'Pivot Sector Alpha-4 (Commercial Maize & Alfalfa)',
    industry: 'agriculture',
    type: 'pivot',
    coordinates: { lat: -0.735, lng: 36.425 },
    bounds: [
      [-0.728, 36.418],
      [-0.728, 36.432],
      [-0.742, 36.432],
      [-0.742, 36.418]
    ],
    status: 'nominal',
    metric1: { label: 'Mean NDVI', value: '0.81' },
    metric2: { label: 'Soil Moisture', value: '28.4% vol' },
    metric3: { label: 'Forecast Yield', value: '9.4 t/ha' },
    lastSatellitePass: '2026-10-23',
    changeRate: '+6.1% biomass gain',
    description: '80-hectare automated central pivot with variable rate fertigation driven by Sentinel-2 weekly synthetic NDVI indices.',
    details: {
      coverageAreaKm2: 1.4,
      elevationMeters: 1895,
      beneficiariesOrCapacity: '1,200 metric tonnes harvest',
      riskScore: 8
    }
  },
  {
    id: 'feat-agri-02',
    name: 'Pivot Sector Gamma-2 (Export Brassica)',
    industry: 'agriculture',
    type: 'pivot',
    coordinates: { lat: -0.748, lng: 36.442 },
    status: 'alert',
    metric1: { label: 'Mean NDVI', value: '0.46' },
    metric2: { label: 'Moisture Stress', value: 'High deficit' },
    metric3: { label: 'Canopy Temp', value: '+3.8°C above avg' },
    lastSatellitePass: '2026-10-24',
    changeRate: '-28% vegetation anomaly',
    description: 'North-western arc showing severe water distribution blockage due to nozzle clogging at span #3.',
    details: {
      coverageAreaKm2: 1.1,
      elevationMeters: 1902,
      beneficiariesOrCapacity: 'Cooperative export crop',
      riskScore: 72
    }
  },
  {
    id: 'feat-agri-03',
    name: 'Lake Basin Cooperative Smallholder Micro-Catchment',
    industry: 'agriculture',
    type: 'facility',
    coordinates: { lat: -0.718, lng: 36.402 },
    status: 'nominal',
    metric1: { label: 'Horticulture Cover', value: '142 ha' },
    metric2: { label: 'Drip Adoption', value: '84%' },
    metric3: { label: 'Crop Water Index', value: 'Optimal' },
    lastSatellitePass: '2026-10-22',
    changeRate: '+14% acreage expanded',
    description: 'Aggregated smallholder farmer boundary with communal cold-chain collection depot and weather-station uplink.',
    details: {
      coverageAreaKm2: 4.8,
      elevationMeters: 1890,
      beneficiariesOrCapacity: '340 smallholder farming families',
      riskScore: 19
    }
  },

  // Development Features
  {
    id: 'feat-dev-01',
    name: 'Kaptembwa Solar Deep-Aquifer Borehole #04',
    industry: 'development',
    type: 'facility',
    coordinates: { lat: -0.320, lng: 36.085 },
    status: 'nominal',
    metric1: { label: 'Daily Yield', value: '145,000 L' },
    metric2: { label: 'Solar Uptime', value: '99.4%' },
    metric3: { label: 'Water Quality', value: 'WHO Standard 1' },
    lastSatellitePass: '2026-10-23',
    changeRate: '+1,800 new connections',
    description: 'Fully automated prepaid water kiosk powered by 18kW solar PV array with smart flow telemetry and chlorine dosing.',
    details: {
      coverageAreaKm2: 7.2,
      elevationMeters: 1850,
      beneficiariesOrCapacity: '12,500 daily residents',
      riskScore: 5
    }
  },
  {
    id: 'feat-dev-02',
    name: 'West Sub-County Underserved Settlement Perimeter',
    industry: 'development',
    type: 'community',
    coordinates: { lat: -0.345, lng: 36.052 },
    bounds: [
      [-0.338, 36.042],
      [-0.338, 36.065],
      [-0.354, 36.065],
      [-0.354, 36.042]
    ],
    status: 'underserved',
    metric1: { label: 'Walking Distance to Water', value: '4.6 km' },
    metric2: { label: 'Clinic Radius Gap', value: 'Beyond 5km' },
    metric3: { label: 'Estimated Pop', value: '18,400' },
    lastSatellitePass: '2026-10-20',
    changeRate: '+22% rapid unplanned sprawl',
    description: 'Identified geospatial coverage deficit outside municipal water main network; eligible for World Bank Phase 3 infrastructure grant.',
    details: {
      coverageAreaKm2: 5.4,
      elevationMeters: 1820,
      beneficiariesOrCapacity: '18,400 unserved citizens',
      riskScore: 84
    }
  },
  {
    id: 'feat-dev-03',
    name: 'Barut Community Health Post & Mini-Grid',
    industry: 'development',
    type: 'facility',
    coordinates: { lat: -0.302, lng: 36.071 },
    status: 'nominal',
    metric1: { label: 'Vaccine Cold-Chain', value: '3.4°C (Stable)' },
    metric2: { label: 'Maternal Catchment', value: '8,200 pop' },
    metric3: { label: 'Battery Storage', value: '92% SOC' },
    lastSatellitePass: '2026-10-22',
    changeRate: 'Nominal operational status',
    description: '24/7 electrified health post supporting emergency delivery room, vaccine preservation, and telemedicine uplink.',
    details: {
      coverageAreaKm2: 3.6,
      elevationMeters: 1860,
      beneficiariesOrCapacity: '8,200 catchment population',
      riskScore: 14
    }
  }
];

export const MOCK_SURVEYS: FieldSurvey[] = [
  {
    id: 'srv-101',
    title: 'Pylon 47 Foundation Geotechnical Inspection',
    surveyorName: 'Eng. David Kiprono',
    surveyorRole: 'Senior Structural Geodesist',
    coordinates: { lat: -0.884, lng: 36.342 },
    sector: 'Transmission Sector 4B',
    industry: 'infrastructure',
    status: 'investigating',
    severity: 'critical',
    timestamp: '2026-10-24 10:15 UTC',
    notes: 'Quarry excavation encroached within 22m of guy-wire anchor pad. Signs of surface tension crack (14mm width) observed after heavy rains.',
    imageUrl: INFRASTRUCTURE_IMG,
    metrics: [
      { label: 'Proximity to Quarry', value: '22', unit: 'meters' },
      { label: 'Pad Deflection', value: '1.2', unit: 'degrees' },
      { label: 'Corrosion Index', value: 'C2', unit: 'standard' }
    ],
    recommendedAction: 'Issue immediate stop-work enforcement notice to sub-county mining commissioner and deploy retaining gabion wall.'
  },
  {
    id: 'srv-102',
    title: 'Pivot 7 Canopy Thermal Anomaly Ground Truth',
    surveyorName: 'Dr. Amina Mwangi',
    surveyorRole: 'Field Agronomist & Remote Sensing Specialist',
    coordinates: { lat: -0.746, lng: 36.438 },
    sector: 'Agro Sector Gamma',
    industry: 'agriculture',
    status: 'verified',
    severity: 'warning',
    timestamp: '2026-10-23 14:30 UTC',
    notes: 'Ground validation confirmed satellite NDVI drop. Found pressure regulator malfunction on nozzles 18 through 24 leading to localized wilting.',
    imageUrl: SATELLITE_CROP_IMG,
    metrics: [
      { label: 'Ground Soil Moisture', value: '11.8', unit: '% vol' },
      { label: 'Leaf Water Potential', value: '-1.85', unit: 'MPa' },
      { label: 'Area Affected', value: '8.4', unit: 'hectares' }
    ],
    recommendedAction: 'Replace pressure regulators on span #3 and run emergency nighttime pulse irrigation cycle.'
  },
  {
    id: 'srv-103',
    title: 'Kaptembwa Solar Kiosk Water Metering Audit',
    surveyorName: 'Faith Chebet',
    surveyorRole: 'WASH Monitoring Officer',
    coordinates: { lat: -0.321, lng: 36.087 },
    sector: 'Zone 4 Water Scheme',
    industry: 'development',
    status: 'resolved',
    severity: 'nominal',
    timestamp: '2026-10-22 09:00 UTC',
    notes: 'Smart meter SIM card rebooted. Telemetry restored to central dashboard. Chlorine residual tested at 0.5 mg/L, clean potable standard.',
    metrics: [
      { label: 'Flow Rate', value: '18.2', unit: 'm³/hr' },
      { label: 'Free Chlorine', value: '0.52', unit: 'mg/L' },
      { label: 'Solar Inverter Eff', value: '97.4', unit: '%' }
    ],
    recommendedAction: 'Maintain routine bi-weekly solar panel dust cleansing cycle.'
  },
  {
    id: 'srv-104',
    title: 'West Sub-County Settlement Service Gap Mapping',
    surveyorName: 'Samuel Odhiambo',
    surveyorRole: 'Socioeconomic GIS Surveyor',
    coordinates: { lat: -0.347, lng: 36.055 },
    sector: 'Informal Urban Fringe',
    industry: 'development',
    status: 'investigating',
    severity: 'critical',
    timestamp: '2026-10-24 11:45 UTC',
    notes: 'Mapped 420 new households settled in past 8 months. Water trucking vendors charging 8x municipal rate ($2.40 per 200L drum). High enteric illness risk.',
    metrics: [
      { label: 'Average Roundtrip Walk', value: '95', unit: 'mins' },
      { label: 'Vendor Price Mark-up', value: '800', unit: '%' },
      { label: 'Identified Hotspots', value: '4', unit: 'clusters' }
    ],
    recommendedAction: 'Prioritize for emergency 2-inch HDPE pipeline branch extension from Main Barut feeder line.'
  }
];

export const MOCK_ANOMALIES: SpatialAnomaly[] = [
  {
    id: 'anom-01',
    title: 'Unauthorized Quarry Excavation inside Statutory Transmission ROW',
    industry: 'infrastructure',
    coordinates: { lat: -0.883, lng: 36.343 },
    severity: 'critical',
    category: 'Encroachment',
    detectedDate: '2026-10-21',
    confidenceScore: 96.4,
    deltaDescription: 'Satellite multi-temporal DEM differencing detected 4.2m depth cut within 30m corridor buffer of 220kV tower #47.',
    baselinePeriod: 'Oct 2024 (Baseline)',
    currentPeriod: 'Oct 2026 (Current)',
    affectedKm2: 0.045,
    status: 'open'
  },
  {
    id: 'anom-02',
    title: 'Severe NDVI Vegetation Vigor Drop in Pivot Sector Gamma',
    industry: 'agriculture',
    coordinates: { lat: -0.747, lng: 36.440 },
    severity: 'warning',
    category: 'Vegetation Stress',
    detectedDate: '2026-10-23',
    confidenceScore: 92.1,
    deltaDescription: 'Sentinel-2 NDVI index dropped from 0.76 to 0.44 over 14-day interval across 8.4 hectares.',
    baselinePeriod: 'Sep 2026 (Nominal)',
    currentPeriod: 'Oct 2026 (Anomaly)',
    affectedKm2: 0.084,
    status: 'dispatched'
  },
  {
    id: 'anom-03',
    title: 'Critical Potable Water Coverage Gap (18k Underserved Residents)',
    industry: 'development',
    coordinates: { lat: -0.346, lng: 36.053 },
    severity: 'critical',
    category: 'Coverage Deficit',
    detectedDate: '2026-10-18',
    confidenceScore: 98.2,
    deltaDescription: 'Overlay of latest high-resolution rooftop count against 5km borehole buffers revealed zero municipal water provision for 18,400 people.',
    baselinePeriod: 'Jan 2025 Planning Grid',
    currentPeriod: 'Oct 2026 Drone Census',
    affectedKm2: 5.4,
    status: 'open'
  },
  {
    id: 'anom-04',
    title: 'Geothermal Wellpad 12 Berm Surface Subsidence',
    industry: 'infrastructure',
    coordinates: { lat: -0.908, lng: 36.305 },
    severity: 'warning',
    category: 'Infrastructure Defect',
    detectedDate: '2026-10-19',
    confidenceScore: 89.5,
    deltaDescription: 'Interferometric Synthetic Aperture Radar (InSAR) differential indicates 18mm localized subsidence on drainage perimeter.',
    baselinePeriod: 'Apr 2026',
    currentPeriod: 'Oct 2026',
    affectedKm2: 0.012,
    status: 'remediated'
  }
];

export const ENTERPRISE_PLANS = [
  {
    id: 'pilot',
    name: 'Turnkey Implementation Project',
    tagline: 'Rapid 60-day custom deployment & baseline GIS integration',
    price: '$28,500',
    cadence: 'one-time project fee',
    targetAudience: 'For regional utilities, commercial farms, or development missions launching a new corridor or district.',
    features: [
      'Comprehensive high-resolution baseline GIS orthomosaic acquisition (up to 1,000 km²)',
      'Legacy spatial dataset ingestion (AutoCAD, Shapefiles, Drone geotiffs, CSVs)',
      'Custom spatial database setup with role-based field surveyor access',
      'Field survey mobile app configuration & team on-site training (up to 15 officers)',
      'Automated bi-weekly satellite change detection pipeline setup'
    ],
    recommended: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise Platform License',
    tagline: 'Continuous operational monitoring, AI anomaly engine & full API',
    price: '$54,000',
    cadence: 'billed annually',
    targetAudience: 'For national infrastructure operators, agricultural conglomerates, and multi-country development funds.',
    features: [
      'Up to 15,000 km² continuous satellite monitoring (Sentinel-2, Landsat-9 & 0.5m Planet/Pleiades on-demand)',
      'Automated multi-temporal change detection & encroachment alerts',
      'Unlimited web dashboard seats & mobile field surveyor accounts',
      'Automated donor/executive report generator (World Bank, USAID, ESG audited formats)',
      'Dedicated GIS engineer & quarterly on-site algorithm calibration',
      '99.9% uptime SLA with real-time REST & GeoJSON webhooks'
    ],
    recommended: true
  },
  {
    id: 'institutional',
    name: 'Institutional Sovereign & Consortium',
    tagline: 'Nationwide territorial surveillance & multi-stakeholder governance',
    price: '$120,000+',
    cadence: 'tailored annual contract',
    targetAudience: 'For government ministries, multilateral development banks (AfDB, IFC), and trans-border infrastructure consortia.',
    features: [
      'Country-wide or trans-corridor coverage with custom sovereign cloud hosting',
      'Daily sub-meter optical and InSAR radar displacement tracking',
      'Custom predictive machine learning models (flood inundation, crop yield, land-use conversion)',
      'Multi-agency clearance & classified data partitioning protocols',
      '24/7 priority emergency dispatch and disaster response mobilization'
    ],
    recommended: false
  }
];
