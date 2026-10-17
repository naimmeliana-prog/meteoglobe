import React from 'react';
import type { ClimateAnomaly, EmergencyAlertConfig } from '../types/weather';
import { Flame, AlertTriangle, Bell, Wifi, WifiOff, ShieldCheck } from 'lucide-react';

interface AnomaliesAndAlertsProps {
  anomalies: ClimateAnomaly[];
  alertConfigs: EmergencyAlertConfig[];
  onToggleAlert: (id: string) => void;
  isOffline: boolean;
  onToggleOfflineMode: () => void;
}

export const AnomaliesAndAlerts: React.FC<AnomaliesAndAlertsProps> = ({
  anomalies,
  alertConfigs,
  onToggleAlert,
  isOffline,
  onToggleOfflineMode,
}) => {
  return (
    <div className="space-y-6">
      {/* Offline Mode & Sync Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl border ${
              isOffline
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isOffline ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                Estado de Conexión & Cache Offline
              </h3>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                  isOffline ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                }`}
              >
                {isOffline ? 'MODO SIN CONEXIÓN' : 'SINCRONIZADO EN TIEMPO REAL'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isOffline
                ? 'Consultando la versión almacenada en caché local. Los datos se actualizarán automáticamente al reconectar.'
                : 'Punteros de datos satelitales en vivo (EUMETSAT & NOAA). Sincronización automática activa.'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleOfflineMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isOffline
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg hover:bg-emerald-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isOffline ? 'Simular Reconexión (En Línea)' : 'Simular Pérdida de Conexión (Offline)'}
        </button>
      </div>

      {/* Global Heatmap & Anomalies Reports */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Informe Detallado de Anomalías Climáticas Globales
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detección por infrarrojo térmico, radar de microondas y sensores remotos.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-800 px-3 py-1 rounded-lg">
            {anomalies.length} Eventos Críticos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className={`rounded-xl p-4 border flex flex-col justify-between space-y-3 ${
                anom.severity === 'critical'
                  ? 'bg-red-950/40 border-red-500/50 text-red-100'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10">
                    {anom.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono opacity-75">{anom.timestamp}</span>
                </div>
                <h4 className="font-bold text-base text-white mt-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  {anom.title}
                </h4>
                <p className="text-xs opacity-90 mt-1 font-medium">{anom.region} ({anom.country})</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-xs font-mono font-bold text-amber-300">{anom.deviation}</div>
                <p className="text-xs opacity-80 leading-relaxed">{anom.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {anom.detectedBy.map((sensor, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300"
                    >
                      {sensor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Alerts Config Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Notificaciones Push & Sistema de Alertas Configurables
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configura umbrales de aviso para DANAs, tormentas severas y anomalías térmicas críticas.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {alertConfigs.map((cfg) => (
            <div
              key={cfg.id}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleAlert(cfg.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    cfg.enabled
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{cfg.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Umbral disparador: &gt; {cfg.thresholdValue} {cfg.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                    cfg.severityLevel === 'red'
                      ? 'bg-red-600 text-white'
                      : cfg.severityLevel === 'orange'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-yellow-400 text-slate-950'
                  }`}
                >
                  Nivel {cfg.severityLevel}
                </span>

                <button
                  onClick={() => onToggleAlert(cfg.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    cfg.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {cfg.enabled ? 'Notificación Activa' : 'Desactivado'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
