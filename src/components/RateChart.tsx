import React, { useState } from 'react';
import { getChartPoints } from '../data/mockData';

interface RateChartProps {
  pair: string;
  currentRate: number;
}

export const RateChart: React.FC<RateChartProps> = ({ pair, currentRate }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | '5Y'>('1D');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = getChartPoints(pair, timeframe);
  const values = points.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 0.0001;

  const width = 600;
  const height = 220;
  const paddingX = 20;
  const paddingY = 25;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
    return { x, y };
  };

  const pathD = points
    .map((p, i) => {
      const { x, y } = getCoordinates(i, p.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${width - paddingX} ${height} L ${paddingX} ${height} Z`;

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const activeRate = hoveredPoint ? hoveredPoint.value : currentRate;
  const activeTime = hoveredPoint ? hoveredPoint.time : 'Live';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Interbank Mid-Market Rate
            </span>
            <span className="text-xs font-bold font-mono text-[#0052FF] bg-[#F0F5FF] px-2 py-0.5 rounded">
              {pair}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold tracking-tight text-[#0A2540]">
              {activeRate.toFixed(4)}
            </span>
            <span className="text-xs font-mono text-[#64748B]">
              @ {activeTime}
            </span>
          </div>
        </div>

        {/* Timeframe selector tabs */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-md">
          {(['1D', '1W', '1M', '1Y', '5Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
                timeframe === tf
                  ? 'bg-white text-[#0052FF] shadow-xs font-bold'
                  : 'text-[#49607E] hover:text-[#0A2540]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart area */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0052FF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0052FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#F1F5F9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#F1F5F9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#F1F5F9"
            strokeDasharray="4 4"
          />

          {/* Gradient Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Chart Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#0052FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover interactive vertical line and points */}
          {hoverIndex !== null && (
            <>
              {(() => {
                const { x, y } = getCoordinates(hoverIndex, points[hoverIndex].value);
                return (
                  <>
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={height - paddingY}
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle cx={x} cy={y} r="4.5" fill="#0052FF" stroke="#FFFFFF" strokeWidth="2" />
                  </>
                );
              })()}
            </>
          )}

          {/* Transparent interactive overlay zones for touch & mouse */}
          {points.map((p, idx) => {
            const segWidth = (width - paddingX * 2) / points.length;
            const segX = paddingX + idx * segWidth - segWidth / 2;
            return (
              <rect
                key={idx}
                x={segX}
                y={0}
                width={segWidth}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}
        </svg>
      </div>

      {/* High, Low, Range tabular stats */}
      <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <div className="text-[11px] text-[#64748B]">24h Low</div>
          <div className="font-mono font-semibold text-[#0A2540]">{minVal.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#64748B]">24h High</div>
          <div className="font-mono font-semibold text-[#0A2540]">{maxVal.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#64748B]">Mid-Market Spread</div>
          <div className="font-mono font-semibold text-[#00875A]">0.02% (2.0 pips)</div>
        </div>
        <div>
          <div className="text-[11px] text-[#64748B]">Settlement</div>
          <div className="font-mono font-semibold text-[#0052FF]">FAST Instant</div>
        </div>
      </div>
    </div>
  );
};
