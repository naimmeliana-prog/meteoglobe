import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { CityForecast, ClimateAnomaly, RadarFrame } from '../types/weather';
import { MapLegend } from './MapLegend';
import { AlertTriangle, Wind, Eye } from 'lucide-react';

// Fix Leaflet marker icon issue in Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface WeatherMapProps {
  cities: CityForecast[];
  selectedCity: CityForecast;
  onSelectCity: (city: CityForecast) => void;
  activeLayer: 'precipitation' | 'wind' | 'cloudiness' | 'thermal';
  currentFrame: RadarFrame;
  anomalies: ClimateAnomaly[];
}

// Controller component to center map smoothly on city change
const MapCenterController: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 6, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
};

export const WeatherMap: React.FC<WeatherMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeLayer,
  currentFrame,
  anomalies,
}) => {
  // Custom styled Leaflet Marker Icon for Cities
  const createCityMarkerIcon = (city: CityForecast, isSelected: boolean) => {
    let alertBgClass = 'bg-slate-900 border-slate-600 text-slate-100';
    if (city.alertLevel === 'red') alertBgClass = 'bg-red-600 border-red-300 text-white shadow-red-500/50 animate-bounce';
    else if (city.alertLevel === 'orange') alertBgClass = 'bg-amber-500 border-amber-200 text-slate-950 shadow-amber-500/50';
    else if (city.alertLevel === 'yellow') alertBgClass = 'bg-yellow-400 border-yellow-100 text-slate-950';

    const selectedRing = isSelected ? 'ring-4 ring-blue-500 scale-110 z-50' : '';

    const html = `
      <div class="relative group cursor-pointer">
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold text-xs border shadow-xl transition-all duration-300 ${alertBgClass} ${selectedRing}">
          <span class="font-extrabold">${city.name}</span>
          <span class="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[11px]">${city.tempCurrent}°C</span>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-map-marker',
      iconSize: [110, 32],
      iconAnchor: [55, 16],
    });
  };

  // Simulated Convective DANA Storm Zones over Iberian Peninsula & Mediterranean
  const danaZones = [
    {
      center: [39.4699, -0.3763] as [number, number], // Valencia / Levante
      radius: 120000,
      color: '#ef4444',
      fillColor: '#dc2626',
      fillOpacity: 0.35,
      label: 'Núcleo Convectivo DANA Levante',
    },
    {
      center: [38.5, -1.2] as [number, number], // Murcia / Béticas
      radius: 85000,
      color: '#f97316',
      fillColor: '#ea580c',
      fillOpacity: 0.30,
      label: 'Célula Torrencial Secundaria',
    },
  ];

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Frame indicator badge inside map */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2 font-mono">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Radar Loop: <strong>{currentFrame.timeLabel}</strong></span>
      </div>

      <MapContainer
        center={[selectedCity.lat, selectedCity.lng]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0 bg-slate-950"
      >
        <MapCenterController lat={selectedCity.lat} lng={selectedCity.lng} />

        {/* Base Map Tiles (CartoDB Dark Matter / Global Sat Layer) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; AEMET / EUMETSAT'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Dynamic Weather Layer Overlay depending on active tab */}
        {activeLayer === 'precipitation' && (
          <TileLayer
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            opacity={0.6}
          />
        )}
        {activeLayer === 'cloudiness' && (
          <TileLayer
            url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            opacity={0.5}
          />
        )}
        {activeLayer === 'wind' && (
          <TileLayer
            url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            opacity={0.55}
          />
        )}
        {activeLayer === 'thermal' && (
          <TileLayer
            url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            opacity={0.5}
          />
        )}

        {/* DANA Convective Risk Zones */}
        {danaZones.map((zone, i) => (
          <Circle
            key={i}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.fillColor,
              fillOpacity: zone.fillOpacity,
              weight: 2,
              dashArray: '6, 6',
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <span className="text-xs font-bold text-red-600 uppercase block">{zone.label}</span>
                <p className="text-xs text-slate-800 mt-1">
                  Célula convectiva estacionaria con alta reflectividad de radar (&gt;55 dBZ). Riesgo de precipitación acumulada de 60-100 mm en 2h.
                </p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Climate Anomaly Points */}
        {anomalies.map((anom) => (
          <Circle
            key={anom.id}
            center={[anom.lat, anom.lng]}
            radius={90000}
            pathOptions={{
              color: anom.severity === 'critical' ? '#dc2626' : '#f59e0b',
              fillColor: anom.severity === 'critical' ? '#ef4444' : '#fbbf24',
              fillOpacity: 0.4,
            }}
          >
            <Popup>
              <div className="p-1 text-xs">
                <div className="font-bold text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {anom.title}
                </div>
                <div className="text-slate-800 font-medium mt-1">{anom.region} ({anom.country})</div>
                <div className="text-red-700 font-mono text-[11px] mt-0.5">{anom.deviation}</div>
                <p className="text-slate-600 text-[11px] mt-1">{anom.description}</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Major City Markers */}
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createCityMarkerIcon(city, selectedCity.id === city.id)}
            eventHandlers={{
              click: () => onSelectCity(city),
            }}
          >
            <Popup>
              <div className="p-2 text-slate-900 font-sans min-w-[200px]">
                <div className="flex items-center justify-between border-b pb-1">
                  <h4 className="font-bold text-sm text-slate-900">{city.name}</h4>
                  <span className="text-xs font-semibold text-blue-600">{city.tempCurrent}°C</span>
                </div>
                <div className="mt-2 text-xs space-y-1">
                  <p><strong>Condición:</strong> {city.weatherCondition}</p>
                  <p><strong>Máx / Mín:</strong> {city.tempMax}° / {city.tempMin}°</p>
                  <p><strong>Precipitación:</strong> {city.precipitationMm} mm ({city.rainProbability}%)</p>
                  <p className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-600" />
                    <strong>Viento:</strong> {city.windSpeed} km/h ({city.windDirection})
                  </p>
                </div>
                {city.alertLevel !== 'none' && (
                  <div className="mt-2 p-1.5 rounded bg-red-100 border border-red-300 text-[11px] text-red-800 font-medium">
                    {city.alertDescription}
                  </div>
                )}
                <button
                  onClick={() => onSelectCity(city)}
                  className="mt-2.5 w-full py-1 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Ver Detalle de Estación
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Dynamic Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[400]">
        <MapLegend activeLayer={activeLayer} />
      </div>
    </div>
  );
};
