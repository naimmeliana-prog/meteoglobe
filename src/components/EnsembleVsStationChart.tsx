import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { Satellite, HourlyComparisonData, CityForecast } from '../types/weather';
import { Cpu, Satellite as SatelliteIcon, CheckCircle2, Layers } from 'lucide-react';

interface EnsembleVsStationChartProps {
  hourlyData: HourlyComparisonData[];
  satellites: Satellite[];
  selectedCity: CityForecast;
}

export const EnsembleVsStationChart: React.FC<EnsembleVsStationChartProps> = ({
  hourlyData,
  satellites,
  selectedCity,
}) => {
  const [selectedSatelliteIds, setSelectedSatelliteIds] = useState<string[]>(['ensemble', 'actualStation']);
  const [useWeightedEnsemble, setUseWeightedEnsemble] = useState<boolean>(true);

  // Toggle satellite selection in graph
  const toggleSatellite = (id: string) => {
    if (selectedSatelliteIds.includes(id)) {
      if (selectedSatelliteIds.length > 1) {
        setSelectedSatelliteIds(selectedSatelliteIds.filter((item) => item !== id));
      }
    } else {
      setSelectedSatelliteIds([...selectedSatelliteIds, id]);
    }
  };

  const selectAllSatellites = () => {
    setSelectedSatelliteIds(['actualStation', 'ensemble', ...satellites.map((s) => s.id)]);
  };

  const resetToEnsembleOnly = () => {
    setSelectedSatelliteIds(['actualStation', 'ensemble']);
  };

  // Adjust temperature values dynamically based on selected city temperature
  const cityTempOffset = selectedCity.tempCurrent - 19; // baseline 19

  const adjustedData = hourlyData.map((d) => ({
    ...d,
    actualStationTemp: parseFloat((d.actualStationTemp + cityTempOffset).toFixed(1)),
    ensembleTemp: parseFloat((d.ensembleTemp + cityTempOffset).toFixed(1)),
    goes16Temp: parseFloat((d.goes16Temp + cityTempOffset).toFixed(1)),
    meteosatTemp: parseFloat((d.meteosatTemp + cityTempOffset).toFixed(1)),
    himawariTemp: parseFloat((d.himawariTemp + cityTempOffset).toFixed(1)),
    sentinelTemp: parseFloat((d.sentinelTemp + cityTempOffset).toFixed(1)),
    jpssTemp: parseFloat((d.jpssTemp + cityTempOffset).toFixed(1)),
  }));

  // ML algorithm overall confidence score
  const activeSatellites = satellites.filter(
    (s) => selectedSatelliteIds.includes('ensemble') || selectedSatelliteIds.includes(s.id)
  );
  const averageMLAccuracy = (
    activeSatellites.reduce((acc, curr) => acc + curr.mlAccuracy, 0) / (activeSatellites.length || 1)
  ).toFixed(1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              Gráfico Comparativo: Ensamble Predicho vs Estación Real ({selectedCity.name})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluación de 24 horas entre las observaciones reales de la estación física y la media ponderada del ensamble satelital global.
          </p>
        </div>

        {/* ML Status Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-mono">Precisión ML Ponderada</span>
            <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {averageMLAccuracy}% Fiabilidad
            </span>
          </div>
          <button
            onClick={() => setUseWeightedEnsemble(!useWeightedEnsemble)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              useWeightedEnsemble
                ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Refinar ensamble con algoritmo de aprendizaje automático"
          >
            ML Weighting: {useWeightedEnsemble ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Satellite Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            Satélites y Ensamble en Gráfico:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={resetToEnsembleOnly}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Sólo Ensamble
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={selectAllSatellites}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Mostrar Todos
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Real Station Toggle */}
          <button
            onClick={() => toggleSatellite('actualStation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              selectedSatelliteIds.includes('actualStation')
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/40 text-slate-500 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Estación Real (Observado)
          </button>

          {/* Ensemble Average Toggle */}
          <button
            onClick={() => toggleSatellite('ensemble')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              selectedSatelliteIds.includes('ensemble')
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 ring-1 ring-blue-500/30'
                : 'bg-slate-950/40 text-slate-500 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
            Media Ensamble (Media Satélites)
          </button>

          {/* Individual Satellites */}
          {satellites.map((sat) => {
            const isSelected = selectedSatelliteIds.includes(sat.id);
            return (
              <button
                key={sat.id}
                onClick={() => toggleSatellite(sat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-slate-200 border-indigo-500/50 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/40 text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                <SatelliteIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                {sat.name}
                <span className="text-[10px] text-slate-400 font-mono">({sat.mlAccuracy}%)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Chart Container */}
      <div className="h-72 md:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={adjustedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="temp"
              stroke="#94a3b8"
              domain={['dataMin - 2', 'dataMax + 2']}
              tick={{ fontSize: 12 }}
              unit="°C"
            />
            <YAxis
              yAxisId="precip"
              orientation="right"
              stroke="#38bdf8"
              domain={[0, 40]}
              tick={{ fontSize: 10 }}
              unit="mm"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any, name: any) => {
                if (name === 'Precipitación') return [`${value} mm/h`, name];
                return [`${value} °C`, name];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />

            {/* Precipitation Bar */}
            <Bar
              yAxisId="precip"
              dataKey="precipitation"
              name="Precipitación"
              fill="#0284c7"
              opacity={0.35}
              barSize={16}
              radius={[4, 4, 0, 0]}
            />

            {/* Actual Station Observations */}
            {selectedSatelliteIds.includes('actualStation') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="actualStationTemp"
                name="Estación Real"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 7 }}
              />
            )}

            {/* Ensemble Mean */}
            {selectedSatelliteIds.includes('ensemble') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="ensembleTemp"
                name="Ensamble Satelital"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="4 2"
                dot={{ r: 3, fill: '#3b82f6' }}
              />
            )}

            {/* Individual Satellite Lines */}
            {selectedSatelliteIds.includes('goes-16') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="goes16Temp"
                name="GOES-16"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
              />
            )}
            {selectedSatelliteIds.includes('meteosat-11') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="meteosatTemp"
                name="Meteosat-11"
                stroke="#a855f7"
                strokeWidth={1.5}
                dot={false}
              />
            )}
            {selectedSatelliteIds.includes('himawari-9') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="himawariTemp"
                name="Himawari-9"
                stroke="#ec4899"
                strokeWidth={1.5}
                dot={false}
              />
            )}
            {selectedSatelliteIds.includes('sentinel-3') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="sentinelTemp"
                name="Sentinel-3"
                stroke="#06b6d4"
                strokeWidth={1.5}
                dot={false}
              />
            )}
            {selectedSatelliteIds.includes('jpss-2') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="jpssTemp"
                name="JPSS / NPP"
                stroke="#84cc16"
                strokeWidth={1.5}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Satellite ML Precision Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {satellites.map((sat) => (
          <div
            key={sat.id}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-slate-200 truncate">{sat.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{sat.agency}</div>
            </div>
            <div className="mt-2 flex items-baseline justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400">Precisión ML:</span>
              <span className="text-xs font-extrabold text-indigo-400 font-mono">{sat.mlAccuracy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
