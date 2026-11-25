import React, { useRef, useState, useCallback } from "react";

interface VolumeFaderProps {
  volume: number; // 0 to 1
  onChange: (volume: number) => void;
}

const VolumeFader: React.FC<VolumeFaderProps> = ({ volume, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const calculateVolumeFromPointer = useCallback(
    (clientY: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      // top = 1 (100%), bottom = 0 (0%)
      const ratio = 1 - relativeY / rect.height;
      const clamped = Math.max(0, Math.min(1, Math.round(ratio * 100) / 100));
      onChange(clamped);
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    calculateVolumeFromPointer(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    calculateVolumeFromPointer(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newVol = Math.max(0, Math.min(1, Math.round((volume + delta) * 100) / 100));
    onChange(newVol);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let delta = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") delta = 0.05;
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") delta = -0.05;
    else if (e.key === "PageUp") delta = 0.1;
    else if (e.key === "PageDown") delta = -0.1;
    else if (e.key === "Home") delta = 1;
    else if (e.key === "End") delta = -1;

    if (delta !== 0) {
      e.preventDefault();
      const newVol = Math.max(0, Math.min(1, Math.round((volume + delta) * 100) / 100));
      onChange(newVol);
    }
  };

  const percent = Math.round(volume * 100);

  return (
    <div
      className="flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Percentage Pill */}
      <div
        className={`text-[10px] font-bold tracking-wider mb-2 px-2 py-0.5 rounded-full transition-all duration-150 ${
          isDragging || isHovered
            ? "bg-emerald-500 text-white shadow-sm scale-105"
            : "bg-neutral-800 text-neutral-400"
        }`}
      >
        {percent}%
      </div>

      {/* Main Fader Housing / Bezel */}
      <div
        className="relative flex items-center justify-between w-[58px] sm:w-[64px] h-[200px] sm:h-[220px] px-2 py-4 rounded-xl border-2 border-neutral-700/70 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_6px_16px_rgba(0,0,0,0.3)] cursor-pointer"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Control de volumen"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Track Slot Area */}
        <div ref={trackRef} className="relative w-4 h-full flex justify-center items-center">
          {/* Recessed Slot Groove */}
          <div className="w-1.5 h-full bg-black rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Emerald Fill Level */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-emerald-500/50 shadow-[0_0_8px_#10b981] transition-[height] duration-75"
              style={{ height: `${percent}%` }}
            />
          </div>

          {/* Metallic Fader Thumb / Knob */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 sm:w-9 h-6 sm:h-6.5 rounded-sm bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 border border-white/60 shadow-[0_4px_8px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col justify-center items-center gap-[2.5px] pointer-events-none transition-transform duration-75 active:scale-95"
            style={{ top: `${(1 - volume) * 100}%` }}
          >
            {/* Grip Grooves */}
            <div className="w-4/5 h-[1.5px] bg-neutral-600/70 rounded-full" />
            <div className="w-4/5 h-[1.5px] bg-neutral-600/70 rounded-full" />
            <div className="w-4/5 h-[1.5px] bg-neutral-600/70 rounded-full" />
          </div>
        </div>

        {/* Scale Markings & Calibration Lines */}
        <div className="flex flex-col justify-between h-full pl-1 text-[8px] font-mono text-neutral-400 select-none">
          {/* Top (+) */}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-[1px] bg-neutral-500" />
            <span className="text-[9px] font-bold text-neutral-300">+</span>
          </div>

          {/* Intermediate high marks */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-[1px] bg-neutral-600" />
            <span>4</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-[1px] bg-neutral-700" />
            <span>3</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-[1px] bg-neutral-700" />
            <span>2</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-[1px] bg-neutral-600" />
            <span>1</span>
          </div>

          {/* Center (0 with green LED indicator dot) */}
          <div className="flex items-center gap-1">
            <span className="w-3 h-[1px] bg-emerald-500/80" />
            <span className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
          </div>

          {/* Intermediate low marks */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-[1px] bg-neutral-600" />
            <span>1</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-[1px] bg-neutral-700" />
            <span>2</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-[1px] bg-neutral-700" />
            <span>3</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-[1px] bg-neutral-600" />
            <span>4</span>
          </div>

          {/* Bottom (-) */}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-[1px] bg-neutral-500" />
            <span className="text-[9px] font-bold text-neutral-300">-</span>
          </div>
        </div>
      </div>

      {/* Label under fader */}
      <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase mt-2">
        VOL
      </span>
    </div>
  );
};

export default VolumeFader;
