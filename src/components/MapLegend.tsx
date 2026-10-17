import React from 'react';

interface MapLegendProps {
  activeLayer: 'precipitation' | 'wind' | 'cloudiness' | 'thermal';
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeLayer }) => {
  return (
    <div className="bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 text-xs shadow-xl space-y-2 max-w-xs">
      <div className="flex items-center justify-between font-bold text-slate-200">
        <span>Leyenda: {activeLayer === 'precipitation' ? 'Precipitación (mm/h)' : activeLayer === 'wind' ? 'Viento (km/h)' : activeLayer === 'cloudiness' ? 'Nubosidad (%)' : 'Anomalía Térmica (°C)'}</span>
      </div>

      {activeLayer === 'precipitation' && (
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 via-yellow-400 via-orange-500 to-red-600" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.1 (Débil)</span>
            <span>5 (Mod)</span>
            <span>15 (Fuerte)</span>
            <span>&gt;30 (DANA / Torrencial)</span>
          </div>
        </div>
      )}

      {activeLayer === 'wind' && (
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 via-indigo-500 via-purple-500 to-rose-600" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10 km/h</span>
            <span>40 km/h</span>
            <span>80 km/h</span>
            <span>&gt;120 km/h (Huracanado)</span>
          </div>
        </div>
      )}

      {activeLayer === 'cloudiness' && (
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-gradient-to-r from-slate-800 via-slate-500 to-white" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0% (Despejado)</span>
            <span>50% (Nuboso)</span>
            <span>100% (Cubierto)</span>
          </div>
        </div>
      )}

      {activeLayer === 'thermal' && (
        <div className="space-y-1">
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-300 via-emerald-400 via-amber-400 to-red-600" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-5°C (Anom Fría)</span>
            <span>0°C (Normal)</span>
            <span>+5°C (Ola calor)</span>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-300 inline-block animate-pulse" />
          Zona Aviso DANA
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-200 inline-block" />
          Aviso Naranja
        </span>
      </div>
    </div>
  );
};
