import React from 'react';
import { Sun, CloudRain, Cloud, CloudLightning, Wind, Snowflake, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import type { CityForecast } from '../types/weather';

interface CityForecastCardProps {
  city: CityForecast;
  isSelected?: boolean;
  onSelect?: (city: CityForecast) => void;
}

export const CityForecastCard: React.FC<CityForecastCardProps> = ({ city, isSelected, onSelect }) => {
  const renderWeatherIcon = () => {
    switch (city.icon) {
      case 'sun':
        return <Sun className="w-10 h-10 text-amber-400 animate-spin-slow" />;
      case 'rain':
        return <CloudRain className="w-10 h-10 text-blue-400" />;
      case 'cloud':
        return <Cloud className="w-10 h-10 text-slate-300" />;
      case 'thunder':
        return <CloudLightning className="w-10 h-10 text-purple-400" />;
      case 'wind':
        return <Wind className="w-10 h-10 text-cyan-400" />;
      case 'snow':
        return <Snowflake className="w-10 h-10 text-sky-200" />;
      default:
        return <Sun className="w-10 h-10 text-amber-400" />;
    }
  };

  const getAlertBadge = () => {
    if (city.alertLevel === 'red') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-red-600/90 text-white border border-red-400 shadow-sm animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> AVISO ROJO
        </span>
      );
    }
    if (city.alertLevel === 'orange') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 border border-amber-300 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5" /> AVISO NARANJA
        </span>
      );
    }
    if (city.alertLevel === 'yellow') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-yellow-400/80 text-slate-900 border border-yellow-200 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5" /> AVISO AMARILLO
        </span>
      );
    }
    return null;
  };

  return (
    <div
      onClick={() => onSelect && onSelect(city)}
      className={`relative overflow-hidden rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50'
          : 'bg-slate-900/70 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/60'
      }`}
    >
      {/* Background weather indicator subtle glow */}
      {city.alertLevel === 'red' && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-slate-100">{city.name}</h3>
            <span className="text-xs text-slate-400 font-medium">({city.country})</span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">{city.weatherCondition}</p>
        </div>
        <div>{renderWeatherIcon()}</div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {city.tempCurrent}°C
          </div>
          <div className="text-xs text-slate-400">Sensación {city.feelsLike}°C</div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center text-red-400 font-semibold text-sm">
            <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
            {city.tempMax}°
          </div>
          <div className="text-slate-600">|</div>
          <div className="flex items-center text-blue-400 font-semibold text-sm">
            <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
            {city.tempMin}°
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Lluvia:</span>
          <span className="font-medium text-blue-300">{city.rainProbability}% ({city.precipitationMm} mm)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Viento:</span>
          <span className="font-medium flex items-center gap-1 text-cyan-300">
            <span
              className="inline-block transform transition-transform"
              style={{ transform: `rotate(${city.windDeg}deg)` }}
            >
              ↑
            </span>
            {city.windSpeed} km/h ({city.windDirection})
          </span>
        </div>
      </div>

      {city.alertLevel !== 'none' && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
          {getAlertBadge()}
          <span className="text-[11px] text-slate-400 truncate max-w-[170px]" title={city.alertType}>
            {city.alertType}
          </span>
        </div>
      )}
    </div>
  );
};
