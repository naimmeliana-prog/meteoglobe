import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, Gauge } from 'lucide-react';
import type { RadarFrame } from '../types/weather';

interface TimelinePlayerProps {
  frames: RadarFrame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayToggle: () => void;
  onSelectFrame: (index: number) => void;
  onChangeSpeed: (speed: number) => void;
  onStepNext: () => void;
  onStepPrev: () => void;
}

export const TimelinePlayer: React.FC<TimelinePlayerProps> = ({
  frames,
  currentFrameIndex,
  isPlaying,
  playbackSpeed,
  onPlayToggle,
  onSelectFrame,
  onChangeSpeed,
  onStepNext,
  onStepPrev,
}) => {
  const currentFrame = frames[currentFrameIndex] || frames[0];

  return (
    <div className="bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 md:p-4 shadow-xl space-y-3">
      {/* Top Header Controls: Play/Pause, Frame Status, Speed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Frame Info */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{currentFrame.timeLabel}</span>
              {currentFrame.isPast && (
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                  OBSERVADO (PASADO)
                </span>
              )}
              {!currentFrame.isPast && !currentFrame.isForecast && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                  REAL (AHORA)
                </span>
              )}
              {currentFrame.isForecast && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  PREDICCIÓN ENSEMBLE
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Sincronización Satelital AEMET / EUMETSAT Radar Loop
            </div>
          </div>
        </div>

        {/* Player Controls & Speed Selector */}
        <div className="flex items-center gap-2 self-center sm:self-auto">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
            <button
              onClick={onStepPrev}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all"
              title="Fotograma Anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayToggle}
              className={`p-2 rounded-lg font-bold flex items-center gap-1 text-xs transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-500'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSA' : 'PLAY'}</span>
            </button>

            <button
              onClick={onStepNext}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all"
              title="Fotograma Siguiente"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {[0.5, 1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Scrubber Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={currentFrameIndex}
          onChange={(e) => onSelectFrame(parseInt(e.target.value, 10))}
          className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
        />

        {/* Frame Labels under Scrubber */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          {frames.map((frame, idx) => (
            <button
              key={frame.id}
              onClick={() => onSelectFrame(idx)}
              className={`hover:text-blue-400 transition-colors ${
                idx === currentFrameIndex ? 'font-bold text-blue-400 underline scale-110' : ''
              } ${frame.isForecast ? 'text-indigo-400' : ''}`}
            >
              {frame.timeLabel.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
