import React from 'react';
import { motion } from 'motion/react';

interface RadarChartProps {
  scores: {
    damavi: number;
    safravi: number;
    balghami: number;
    sawdawi: number;
  };
}

export default function RadarChart({ scores }: RadarChartProps) {
  const maxPossible = 120; // 40 questions, max score is around 120
  const width = 360;
  const height = 360;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 110;

  // Normalize scores to maxRadius
  const getRadius = (score: number) => {
    const minScore = 0;
    const ratio = Math.max(0, Math.min(1, score / maxPossible));
    return 15 + ratio * (maxRadius - 15); // baseline offset 15
  };

  const rDam = getRadius(scores.damavi);
  const rSafra = getRadius(scores.safravi);
  const rBalgham = getRadius(scores.balghami);
  const rSawda = getRadius(scores.sawdawi);

  // Axis coordinates
  // top: Sanguine (دم)
  const pDam = { x: cx, y: cy - rDam };
  // right: Choleric (صفرا)
  const pSafra = { x: cx + rSafra, y: cy };
  // bottom: Phlegmatic (بلغم)
  const pBalgham = { x: cx, y: cy + rBalgham };
  // left: Melancholic (سودا)
  const pSawda = { x: cx - rSawda, y: cy };

  // Grid levels (concentric squares/diamonds or circles)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl border-2 border-[#E8D5BC] shadow-sm max-w-md mx-auto">
      <h4 className="text-sm font-semibold text-[#5C4A3A] mb-4 flex items-center gap-1.5">
        📊 تحلیل گرافیکی اخلاط چهارگانه (کیفیت سرشتی)
      </h4>
      
      <div className="relative w-full aspect-square max-w-[340px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Defs for gradients */}
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C5A880" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B4332" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#C5A880" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Central glow */}
          <circle cx={cx} cy={cy} r={maxRadius + 20} fill="url(#centerGlow)" />

          {/* Grid lines */}
          {gridLevels.map((level, idx) => {
            const r = level * maxRadius;
            return (
              <g key={idx}>
                {/* Concentric diamond grid */}
                <polygon
                  points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
                  fill="none"
                  stroke="#E8D5BC"
                  strokeWidth="1"
                  strokeDasharray={idx < 3 ? "4,4" : "none"}
                />
                {/* Value labels on top axis */}
                <text
                  x={cx + 6}
                  y={cy - r + 4}
                  fill="#8B7355"
                  fontSize="9"
                  className="font-mono select-none"
                >
                  {Math.round(level * maxPossible)}
                </text>
              </g>
            );
          })}

          {/* Axis lines */}
          <line x1={cx} y1={cy - maxRadius - 10} x2={cx} y2={cy + maxRadius + 10} stroke="#E8D5BC" strokeWidth="1.5" />
          <line x1={cx - maxRadius - 10} y1={cy} x2={cx + maxRadius + 10} y2={cy} stroke="#E8D5BC" strokeWidth="1.5" />

          {/* Axis Labels */}
          {/* Sanguine (دموی) - top */}
          <text x={cx} y={cy - maxRadius - 20} textAnchor="middle" className="fill-[#C0392B] font-bold text-xs sm:text-sm select-none">
            🩸 دَم (گرم و تر)
          </text>
          {/* Choleric (صفراوی) - right */}
          <text x={cx + maxRadius + 22} y={cy + 4} textAnchor="start" className="fill-[#D4A017] font-bold text-xs sm:text-sm select-none">
            🔥 صفرا (گرم و خشک)
          </text>
          {/* Phlegmatic (بلغمی) - bottom */}
          <text x={cx} y={cy + maxRadius + 28} textAnchor="middle" className="fill-[#2E86AB] font-bold text-xs sm:text-sm select-none">
            💧 بلغم (سرد و تر)
          </text>
          {/* Melancholic (سوداوی) - left */}
          <text x={cx - maxRadius - 22} y={cy + 4} textAnchor="end" className="fill-[#5D4E60] font-bold text-xs sm:text-sm select-none">
            🍂 سودا (سرد و خشک)
          </text>

          {/* Score indicators at max axis ends */}
          <circle cx={cx} cy={cy - rDam} r="4" fill="#C0392B" />
          <circle cx={cx + rSafra} cy={cy} r="4" fill="#D4A017" />
          <circle cx={cx} cy={cy + rBalgham} r="4" fill="#2E86AB" />
          <circle cx={cx - rSawda} cy={cy} r="4" fill="#5D4E60" />

          {/* The Data Polygon representing user scores */}
          <motion.polygon
            points={`${pDam.x},${pDam.y} ${pSafra.x},${pSafra.y} ${pBalgham.x},${pBalgham.y} ${pSawda.x},${pSawda.y}`}
            fill="url(#polyGradient)"
            stroke="#1B4332"
            strokeWidth="3.5"
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Score badges inside nodes */}
          <g transform={`translate(${pDam.x}, ${pDam.y - 12})`}>
            <rect x="-14" y="-7" width="28" height="14" rx="4" fill="#C0392B" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" className="font-mono font-bold select-none">
              {scores.damavi}
            </text>
          </g>

          <g transform={`translate(${pSafra.x + 14}, ${pSafra.y + 4})`}>
            <rect x="-14" y="-7" width="28" height="14" rx="4" fill="#D4A017" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" className="font-mono font-bold select-none">
              {scores.safravi}
            </text>
          </g>

          <g transform={`translate(${pBalgham.x}, ${pBalgham.y + 14})`}>
            <rect x="-14" y="-7" width="28" height="14" rx="4" fill="#2E86AB" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" className="font-mono font-bold select-none">
              {scores.balghami}
            </text>
          </g>

          <g transform={`translate(${pSawda.x - 14}, ${pSawda.y + 4})`}>
            <rect x="-14" y="-7" width="28" height="14" rx="4" fill="#5D4E60" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" className="font-mono font-bold select-none">
              {scores.sawdawi}
            </text>
          </g>

          {/* Center core point */}
          <circle cx={cx} cy={cy} r="5" fill="#1B4332" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="flex flex-wrap gap-2.5 justify-center mt-2 border-t border-[#FAF6F0] pt-4 w-full text-xs">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#C0392B]" /> دموی: {scores.damavi}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" /> صفراوی: {scores.safravi}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2E86AB]" /> بلغمی: {scores.balghami}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#5D4E60]" /> سوداوی: {scores.sawdawi}</span>
      </div>
    </div>
  );
}
