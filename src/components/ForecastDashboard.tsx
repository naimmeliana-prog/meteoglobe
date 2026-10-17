import React from 'react';
import { Tv, MapPin, Radio, ShieldAlert } from 'lucide-react';
import type { CityForecast } from '../types/weather';
import { CityForecastCard } from './CityForecastCard';

interface ForecastDashboardProps {
  cities: CityForecast[];
  selectedCity: CityForecast;
  onSelectCity: (city: CityForecast) => void;
  children?: React.ReactNode;
}

export const ForecastDashboard: React.FC<ForecastDashboardProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  children,
}) => {
  const severeAlertCities = cities.filter((c) => c.alertLevel === 'red' || c.alertLevel === 'orange');

  return (
    <div className="space-y-6">
      {/* Critical Severe Weather Banner (Aviso DANA / Tormentas) */}
      {severeAlertCities.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/90 via-amber-950/80 to-slate-900 border border-red-500/50 rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/40 shrink-0">
                <ShieldAlert className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-extrabold text-xs uppercase px-2 py-0.5 rounded tracking-wider animate-pulse">
                    ALERTA SEVERA DANA
                  </span>
                  <span className="text-xs text-red-300 font-mono">EN TIEMPO REAL</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white mt-1">
                  Aviso Convectivo Crítico en {severeAlertCities.map((c) => c.name).join(', ')}
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                  Sensores satelitales detectan núcleos de convección profunda con alta densidad de precipitaciones.
                  Peligro extremo de inundaciones y rachas severas en áreas bajo aviso rojo/naranja.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {severeAlertCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                    selectedCity.id === city.id
                      ? 'bg-red-600 text-white border-red-400 shadow'
                      : 'bg-red-950/60 text-red-200 border-red-800/80 hover:bg-red-900/80'
                  }`}
                >
                  {city.name} ({city.tempCurrent}°C)
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Header Banner for TV Weather View */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Previsión - Vista Rápida de Radar & Convección DANA
              </h2>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" /> EN DIRECTO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualización estilo televisión con predicción de ensemble multisatelital y estaciones de campo.
            </p>
          </div>
        </div>

        {/* Selected City Quick Highlight */}
        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl">
          <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-400">Estación Seleccionada</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              {selectedCity.name}, {selectedCity.country}
              <span className="text-blue-400 font-mono">{selectedCity.tempCurrent}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Forecast Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
            Ciudades Principales del Mundo & España
          </h3>
          <span className="text-xs text-slate-400 font-mono">Haz clic para seleccionar estación</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <CityForecastCard
              key={city.id}
              city={city}
              isSelected={selectedCity.id === city.id}
              onSelect={onSelectCity}
            />
          ))}
        </div>
      </div>

      {/* Embedded Chart / Satellite selector slot */}
      {children}
    </div>
  );
};
