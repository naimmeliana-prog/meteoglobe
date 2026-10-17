import { useState, useEffect } from 'react';
import {
  SATELLITES,
  MAJOR_CITIES,
  HOURLY_24H_COMPARISON,
  RADAR_TIMELINE_FRAMES,
  CLIMATE_ANOMALIES,
  HISTORICAL_TRENDS,
  DEFAULT_ALERTS_CONFIG,
} from './data/mockData';
import type { CityForecast, EmergencyAlertConfig } from './types/weather';
import { ForecastDashboard } from './components/ForecastDashboard';
import { EnsembleVsStationChart } from './components/EnsembleVsStationChart';
import { WeatherMap } from './components/WeatherMap';
import { TimelinePlayer } from './components/TimelinePlayer';
import { ClimateTrendsAndML } from './components/ClimateTrendsAndML';
import { AnomaliesAndAlerts } from './components/AnomaliesAndAlerts';
import {
  Satellite,
  Tv,
  Map,
  TrendingUp,
  AlertTriangle,
  Globe,
  Radio,
  CloudRain,
  Wind,
  Cloud,
  Flame,
  Search,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'quick_view' | 'radar_map' | 'historical_ml' | 'anomalies_alerts'
  >('quick_view');

  const [selectedCity, setSelectedCity] = useState<CityForecast>(MAJOR_CITIES[0]); // Madrid default
  const [activeLayer, setActiveLayer] = useState<'precipitation' | 'wind' | 'cloudiness' | 'thermal'>('precipitation');

  // Timeline radar playback
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(5); // 'Ahora'
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Offline mode & Alert config state
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [alertConfigs, setAlertConfigs] = useState<EmergencyAlertConfig[]>(DEFAULT_ALERTS_CONFIG);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Timeline Auto-play Loop effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % RADAR_TIMELINE_FRAMES.length);
      }, 2000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  const toggleAlertConfig = (id: string) => {
    setAlertConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const filteredCities = MAJOR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  MeteoGlobe <span className="text-blue-400">Ensemble 360</span>
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  Global Satellite AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Red Mundial de Predicción Meteorológica Multisatelital & Observación en Tiempo Real
              </p>
            </div>
          </div>

          {/* Quick Search & Offline Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar ciudad o país..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all shrink-0 ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`}
              />
              <span>{isOffline ? 'Modo Offline' : 'En Línea'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 space-y-6">
        {/* Main Tab Navigation Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('quick_view')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'quick_view'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            Previsión - Vista Rápida de Radar & Convección DANA
          </button>

          <button
            onClick={() => setActiveTab('radar_map')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'radar_map'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Map className="w-4 h-4" />
            Radar & Maps Interactivo Global
          </button>

          <button
            onClick={() => setActiveTab('historical_ml')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'historical_ml'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Historial, Tendencias & Calibración ML Satélites
          </button>

          <button
            onClick={() => setActiveTab('anomalies_alerts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'anomalies_alerts'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Anomalías Climáticas & Sistema de Alertas DANA
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'quick_view' && (
          <ForecastDashboard
            cities={filteredCities}
            selectedCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city)}
          >
            <EnsembleVsStationChart
              hourlyData={HOURLY_24H_COMPARISON}
              satellites={SATELLITES}
              selectedCity={selectedCity}
            />
          </ForecastDashboard>
        )}

        {activeTab === 'radar_map' && (
          <div className="space-y-4">
            {/* Layer Selection Selector Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Satellite className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Capas de Fenómenos Meteorológicos en Tiempo Real</h3>
                  <p className="text-xs text-slate-400">Selecciona el campo meteorológico overlay para el mapa interactivo</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveLayer('precipitation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeLayer === 'precipitation'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <CloudRain className="w-4 h-4" /> Precipitación & Radar
                </button>

                <button
                  onClick={() => setActiveLayer('wind')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeLayer === 'wind'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Wind className="w-4 h-4" /> Campo de Vientos
                </button>

                <button
                  onClick={() => setActiveLayer('cloudiness')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeLayer === 'cloudiness'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Cloud className="w-4 h-4" /> Cobertura Nubosa
                </button>

                <button
                  onClick={() => setActiveLayer('thermal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    activeLayer === 'thermal'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Flame className="w-4 h-4" /> Mapa de Calor Térmico
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <WeatherMap
              cities={filteredCities}
              selectedCity={selectedCity}
              onSelectCity={(city) => setSelectedCity(city)}
              activeLayer={activeLayer}
              currentFrame={RADAR_TIMELINE_FRAMES[currentFrameIndex]}
              anomalies={CLIMATE_ANOMALIES}
            />

            {/* Timeline Player Animation Controls */}
            <TimelinePlayer
              frames={RADAR_TIMELINE_FRAMES}
              currentFrameIndex={currentFrameIndex}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onSelectFrame={(idx) => setCurrentFrameIndex(idx)}
              onChangeSpeed={(speed) => setPlaybackSpeed(speed)}
              onStepNext={() => setCurrentFrameIndex((prev) => (prev + 1) % RADAR_TIMELINE_FRAMES.length)}
              onStepPrev={() =>
                setCurrentFrameIndex((prev) => (prev - 1 + RADAR_TIMELINE_FRAMES.length) % RADAR_TIMELINE_FRAMES.length)
              }
            />
          </div>
        )}

        {activeTab === 'historical_ml' && (
          <ClimateTrendsAndML satellites={SATELLITES} historicalTrends={HISTORICAL_TRENDS} />
        )}

        {activeTab === 'anomalies_alerts' && (
          <AnomaliesAndAlerts
            anomalies={CLIMATE_ANOMALIES}
            alertConfigs={alertConfigs}
            onToggleAlert={toggleAlertConfig}
            isOffline={isOffline}
            onToggleOfflineMode={() => setIsOffline(!isOffline)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
            <span>Sistema global activo. Alimentado por EUMETSAT, NOAA GOES, ESA Copernicus & AEMET.</span>
          </div>
          <div>© 2026 MeteoGlobe Ensemble. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
