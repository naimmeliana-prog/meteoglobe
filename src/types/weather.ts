export interface Satellite {
  id: string;
  name: string;
  agency: string;
  coverage: string;
  type: 'Geostationary' | 'Polar Orbiting' | 'Radar Constellation';
  status: 'Active' | 'Optimal' | 'Calibrating';
  weight: number;
  mlAccuracy: number;
  lastUpdate: string;
}

export interface CityForecast {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  tempMax: number;
  tempMin: number;
  tempCurrent: number;
  feelsLike: number;
  weatherCondition: string;
  icon: 'sun' | 'rain' | 'cloud' | 'thunder' | 'wind' | 'snow';
  rainProbability: number;
  precipitationMm: number;
  windSpeed: number;
  windDirection: string;
  windDeg: number;
  humidity: number;
  uvIndex: number;
  pressure: number;
  alertLevel: 'none' | 'yellow' | 'orange' | 'red';
  alertType?: string;
  alertDescription?: string;
}

export interface HourlyComparisonData {
  time: string;
  actualStationTemp: number;
  ensembleTemp: number;
  goes16Temp: number;
  meteosatTemp: number;
  himawariTemp: number;
  sentinelTemp: number;
  jpssTemp: number;
  precipitation: number;
  windSpeed: number;
}

export interface RadarFrame {
  id: string;
  timestamp: string;
  timeLabel: string;
  isPast: boolean;
  isForecast: boolean;
  radarOverlayUrl?: string;
}

export interface ClimateAnomaly {
  id: string;
  title: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  type: 'thermal_high' | 'thermal_low' | 'extreme_precipitation' | 'dana_convection' | 'severe_wind';
  severity: 'moderate' | 'high' | 'critical';
  deviation: string;
  description: string;
  detectedBy: string[];
  timestamp: string;
}

export interface HistoricalTrend {
  period: string;
  historicalAvgTemp: number;
  currentObservedTemp: number;
  historicalRainfall: number;
  currentRainfall: number;
  anomalyScore: number;
}

export interface EmergencyAlertConfig {
  id: string;
  title: string;
  enabled: boolean;
  thresholdValue: number;
  unit: string;
  severityLevel: 'yellow' | 'orange' | 'red';
  pushNotification: boolean;
  soundAlert: boolean;
}
