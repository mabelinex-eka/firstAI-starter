import React from 'react';
import { TechnicalRating } from '../types/market';

interface TechnicalGaugeProps {
  rating: TechnicalRating;
  size?: 'sm' | 'md' | 'lg';
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ rating, size = 'md' }) => {
  // Mapping rating to needle angle:
  // Strong Sell: -72deg
  // Sell: -36deg
  // Neutral: 0deg
  // Buy: 36deg
  // Strong Buy: 72deg
  const angles: Record<TechnicalRating, number> = {
    'Strong Sell': -72,
    'Sell': -36,
    'Neutral': 0,
    'Buy': 36,
    'Strong Buy': 72,
  };

  const colors: Record<TechnicalRating, string> = {
    'Strong Sell': '#f23645',
    'Sell': '#ff7878',
    'Neutral': '#787b86',
    'Buy': '#36c694',
    'Strong Buy': '#089981',
  };

  const needleAngle = angles[rating] ?? 0;
  const activeColor = colors[rating] ?? '#787b86';

  // Sub-metrics
  const breakdown = {
    'Strong Buy': { buy: 15, neutral: 2, sell: 1 },
    'Buy': { buy: 11, neutral: 5, sell: 2 },
    'Neutral': { buy: 6, neutral: 6, sell: 6 },
    'Sell': { buy: 2, neutral: 5, sell: 11 },
    'Strong Sell': { buy: 1, neutral: 2, sell: 15 },
  }[rating];

  const dimensions = {
    sm: { width: 140, height: 80, radius: 52, stroke: 7, font: 'text-xs' },
    md: { width: 190, height: 110, radius: 72, stroke: 10, font: 'text-sm' },
    lg: { width: 240, height: 140, radius: 95, stroke: 12, font: 'text-base' },
  }[size];

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.width, height: dimensions.height }}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="overflow-visible"
        >
          {/* Background arc segments */}
          {/* Center coordinate */}
          {(() => {
            const cx = dimensions.width / 2;
            const cy = dimensions.height - 10;
            const r = dimensions.radius;
            const sw = dimensions.stroke;

            // Arc segment helper
            const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
              const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
              return {
                x: centerX + radius * Math.cos(angleInRadians),
                y: centerY + radius * Math.sin(angleInRadians),
              };
            };

            const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
              const start = polarToCartesian(x, y, radius, endAngle);
              const end = polarToCartesian(x, y, radius, startAngle);
              const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
              return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
            };

            const segments = [
              { color: '#f23645', start: -90, end: -54 },
              { color: '#ff9898', start: -52, end: -18 },
              { color: '#787b86', start: -16, end: 16 },
              { color: '#80e2b9', start: 18, end: 52 },
              { color: '#089981', start: 54, end: 90 },
            ];

            return (
              <>
                {segments.map((seg, i) => (
                  <path
                    key={i}
                    d={describeArc(cx, cy, r, seg.start, seg.end)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={sw}
                    strokeLinecap="round"
                    className="opacity-70 dark:opacity-85"
                  />
                ))}

                {/* Center needle pivot */}
                <circle cx={cx} cy={cy} r={5} fill={activeColor} />
                
                {/* Needle line */}
                <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx}
                    y2={cy - r + 8}
                    stroke={activeColor}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${cx - 3},${cy - r + 16} ${cx + 3},${cy - r + 16} ${cx},${cy - r + 8}`}
                    fill={activeColor}
                  />
                </g>
              </>
            );
          })()}
        </svg>

        {/* Labels underneath */}
        <div className="absolute bottom-1 left-2 text-[10px] text-[#787b86] font-medium">Sell</div>
        <div className="absolute bottom-1 right-2 text-[10px] text-[#787b86] font-medium">Buy</div>
      </div>

      <div className="mt-1 flex items-center gap-1.5">
        <span
          className="font-semibold text-xs tracking-wide uppercase px-2 py-0.5 rounded"
          style={{ color: activeColor, backgroundColor: `${activeColor}18` }}
        >
          {rating}
        </span>
      </div>

      {size !== 'sm' && (
        <div className="mt-2.5 flex items-center gap-4 text-[11px] text-[#787b86] font-mono tabular-nums">
          <span className="flex items-center gap-1">
            <span className="text-[#f23645] font-semibold">{breakdown.sell}</span> Sell
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#787b86] font-semibold">{breakdown.neutral}</span> Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#089981] font-semibold">{breakdown.buy}</span> Buy
          </span>
        </div>
      )}
    </div>
  );
};
