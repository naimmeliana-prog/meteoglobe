import React from 'react';
import type { Satellite, HistoricalTrend } from '../types/weather';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { History, Cpu, TrendingUp, Award, Activity, RefreshCw } from 'lucide-react';

interface ClimateTrendsAndMLProps {
  satellites: Satellite[];
  historicalTrends: HistoricalTrend[];
}

export const ClimateTrendsAndML: React.FC<ClimateTrendsAndMLProps> = ({
  satellites,
  historicalTrends,
}) => {
  return (
    <div className="space-y-6">
      {/* Module 1: ML Satellite Reliability Analysis & Auto-refinement */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Evaluación & Refinamiento Continuo con Aprendizaje Automático
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ponderación dinámica en tiempo real de cada satélite comparando predicciones de radar frente a estaciones meteorológicas reales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 font-mono font-medium flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" /> Auto-optimización ML Activa
            </span>
          </div>
        </div>

        {/* Satellites Reliability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {satellites.map((sat) => {
            return (
              <div
                key={sat.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                      {sat.agency}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm mt-0.5">{sat.name}</h4>
                    <p className="text-xs text-slate-400">{sat.coverage}</p>
                  </div>
                  <span className="p-1.5 bg-slate-900 text-indigo-400 rounded-lg border border-slate-800">
                    <Activity className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Fiabilidad ML:</span>
                    <span className="font-extrabold text-emerald-400 font-mono">{sat.mlAccuracy}%</span>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${sat.mlAccuracy}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Peso Ensamble: {(sat.weight * 100).toFixed(0)}%</span>
                    <span className="text-slate-400">{sat.lastUpdate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ML Explanation Callout */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex items-start gap-3">
          <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-indigo-300">Algoritmo de Aprendizaje Continuo:</strong> En situaciones de episodios torrenciales (DANAs o ciclones), el sistema ajusta prioritariamente los pesos de los satélites geoestacionarios con mayor resolución espacio-temporal (como Meteosat-11 en Europa o GOES-16 en Américas), minimizando desviaciones de temperatura y bandas de precipitación.
          </p>
        </div>
      </div>

      {/* Module 2: Long-Term Climate Trend Analysis */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Historial de Datos & Tendencias Climáticas a Largo Plazo
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparativa de registros observados frente al promedio histórico (1991-2020) para detectar desviaciones en temperatura y precipitación.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-300 font-mono bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-lg">
              Serie Climatológica Global
            </span>
          </div>
        </div>

        {/* Historical Recharts Bar Chart */}
        <div className="h-64 md:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} unit="°C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="historicalAvgTemp" name="Temp Media Histórica (°C)" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="currentObservedTemp" name="Temp Observada Actual (°C)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Trend Takeaways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {historicalTrends.map((trend, i) => (
            <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <div className="text-xs font-bold text-slate-300">{trend.period}</div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Desviación:</span>
                <span className="text-sm font-extrabold text-amber-400 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />+{trend.anomalyScore}°C
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Lluvia: {trend.currentRainfall} mm vs {trend.historicalRainfall} mm norm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
