/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { REGIONS, PRICE_HISTORY } from '../data';
import { TrendingDown, TrendingUp, Info, Shield, Radio, Activity, Download, Calendar, Sparkles } from 'lucide-react';

export default function MarketDashboard() {
  const [selectedSeries, setSelectedSeries] = useState<'all' | 'green' | 'blue' | 'pink'>('all');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const padding = 40;
  const chartWidth = 500;
  const chartHeight = 220;

  // Compute SVG Points based on MONTHS data
  const chartPoints = useMemo(() => {
    const dataCount = PRICE_HISTORY.months.length;
    
    // Scale helper
    const getPointsStr = (series: number[]) => {
      const minVal = 3.5; // £3.5
      const maxVal = 8.0; // £8.0
      
      return series.map((val, i) => {
        const x = padding + (i / (dataCount - 1)) * (chartWidth - padding * 2);
        // Invert Y because SVG coordinates start from top-left
        const y = chartHeight - padding - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);
        return { x, y, val };
      });
    };

    return {
      green: getPointsStr(PRICE_HISTORY.green),
      blue: getPointsStr(PRICE_HISTORY.blue),
      pink: getPointsStr(PRICE_HISTORY.pink)
    };
  }, []);

  // Format SVG line path
  const makePath = (points: { x: number, y: number }[]) => {
    return points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  };

  const makeAreaPath = (points: { x: number, y: number }[]) => {
    if (points.length === 0) return '';
    const linePath = makePath(points);
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const baselineY = chartHeight - padding;
    return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
  };

  // Get current values on hover
  const activeTooltipData = useMemo(() => {
    if (hoverIndex === null) return null;
    return {
      month: PRICE_HISTORY.months[hoverIndex],
      green: PRICE_HISTORY.green[hoverIndex],
      blue: PRICE_HISTORY.blue[hoverIndex],
      pink: PRICE_HISTORY.pink[hoverIndex]
    };
  }, [hoverIndex]);

  return (
    <div id="market-dashboard-root" className="space-y-6">
      
      {/* Upper 3 grid summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-brand-navy border border-white/10 p-5 rounded-none">
          <span className="font-mono text-xs text-brand-steel block uppercase">UNITED KINGDOM COMPOSITE SPOT</span>
          <div className="flex justify-between items-baseline mt-2">
            <h4 className="font-display text-3xl font-semibold text-white">£5.42 <span className="text-sm text-brand-steel">/kg</span></h4>
            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -3.1% FROM PREV MONTH
            </span>
          </div>
          <p className="text-xs text-brand-steel mt-3 leading-relaxed border-t border-white/5 pt-2 font-mono">
            REF: H2-UK-COMPO-INDEX // UPDATED 2026-07-19
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-brand-navy border border-white/10 p-5 rounded-none">
          <span className="font-mono text-xs text-brand-steel block uppercase">TOTAL TRANSMITTED VOLUME (24H)</span>
          <div className="flex justify-between items-baseline mt-2">
            <h4 className="font-display text-3xl font-semibold text-white">1,624 <span className="text-sm text-brand-steel">Tonnes</span></h4>
            <span className="font-mono text-xs text-brand-gold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +5.4% VS SEASONAL AVG
            </span>
          </div>
          <p className="text-xs text-brand-steel mt-3 leading-relaxed border-t border-white/5 pt-2 font-mono">
            PIPELINE CORRIDOR FLOW: NOMINAL CAPACITY
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-brand-navy border border-white/10 p-5 rounded-none">
          <span className="font-mono text-xs text-brand-steel block uppercase">NATIONAL RESERVE BUFFER</span>
          <div className="flex justify-between items-baseline mt-2">
            <h4 className="font-display text-3xl font-semibold text-white">71.8% <span className="text-sm text-brand-steel">Capacity</span></h4>
            <span className="font-mono text-xs text-brand-steel flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> STABLE BUFFER LOAD
            </span>
          </div>
          <p className="text-xs text-brand-steel mt-3 leading-relaxed border-t border-white/5 pt-2 font-mono">
            SALT CAVERN SEQUESTER BUFFER: ACTIVE INJECTION
          </p>
        </div>

      </div>

      {/* Main Terminal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Line Chart Panel (Col: 8) */}
        <div className="lg:col-span-8 bg-brand-navy border border-white/10 rounded-none p-6 relative">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <div>
              <span className="font-mono text-[10px] text-brand-gold uppercase tracking-wider block">financial times pricing monitor</span>
              <h3 className="font-display text-lg font-medium text-white">H2 SPOT PRICE REGRESSION (6-MONTH PERIOD)</h3>
            </div>

            {/* Filter buttons for graph series */}
            <div className="flex bg-brand-graphite border border-white/10 rounded-none p-1 text-xs font-mono">
              {(['all', 'green', 'blue', 'pink'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-2.5 py-1 rounded-none transition uppercase cursor-pointer ${
                    selectedSeries === s ? 'bg-brand-racing text-white font-bold' : 'text-brand-steel hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="relative">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible"
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Horizontal grid lines */}
              {[3.5, 4.5, 5.5, 6.5, 7.5].map((val, idx) => {
                const y = chartHeight - padding - ((val - 3.5) / (8.0 - 3.5)) * (chartHeight - padding * 2);
                return (
                  <g key={idx} className="opacity-40">
                    <line 
                      x1={padding} 
                      y1={y} 
                      x2={chartWidth - padding} 
                      y2={y} 
                      stroke="rgba(255,255,255,0.06)" 
                      strokeWidth="0.5" 
                    />
                    <text 
                      x={padding - 10} 
                      y={y + 3} 
                      fill="#94A3B8" 
                      fontSize="9" 
                      fontFamily="var(--font-mono)" 
                      textAnchor="end"
                    >
                      £{val.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Month Vertical Labels & hover triggers */}
              {PRICE_HISTORY.months.map((m, idx) => {
                const x = padding + (idx / (PRICE_HISTORY.months.length - 1)) * (chartWidth - padding * 2);
                return (
                  <g key={idx}>
                    <text 
                      x={x} 
                      y={chartHeight - padding + 15} 
                      fill="#94A3B8" 
                      fontSize="9" 
                      fontFamily="var(--font-mono)" 
                      textAnchor="middle"
                    >
                      {m.toUpperCase()}
                    </text>

                    {/* Interactive vertical hover bounds */}
                    <line 
                      x1={x} 
                      y1={padding} 
                      x2={x} 
                      y2={chartHeight - padding} 
                      stroke={hoverIndex === idx ? 'rgba(178, 148, 91, 0.4)' : 'rgba(255,255,255,0.02)'} 
                      strokeWidth={hoverIndex === idx ? '1' : '15'}
                      className="cursor-crosshair transition-all"
                      onMouseEnter={() => setHoverIndex(idx)}
                    />
                  </g>
                );
              })}

              {/* Data Lines */}
              {/* Green Series (Electrolytic) */}
              {(selectedSeries === 'all' || selectedSeries === 'green') && (
                <g>
                  <path 
                    d={makeAreaPath(chartPoints.green)}
                    fill="url(#greenGradient)"
                    opacity="0.08"
                  />
                  <path 
                    d={makePath(chartPoints.green)}
                    fill="none" 
                    stroke="#004225" 
                    strokeWidth="1.8" 
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Blue Series (ATR + CCS) */}
              {(selectedSeries === 'all' || selectedSeries === 'blue') && (
                <g>
                  <path 
                    d={makeAreaPath(chartPoints.blue)}
                    fill="url(#blueGradient)"
                    opacity="0.08"
                  />
                  <path 
                    d={makePath(chartPoints.blue)}
                    fill="none" 
                    stroke="#4A5568" 
                    strokeWidth="1.8" 
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Pink Series (Nuclear) */}
              {(selectedSeries === 'all' || selectedSeries === 'pink') && (
                <g>
                  <path 
                    d={makeAreaPath(chartPoints.pink)}
                    fill="url(#pinkGradient)"
                    opacity="0.08"
                  />
                  <path 
                    d={makePath(chartPoints.pink)}
                    fill="none" 
                    stroke="#B2945B" 
                    strokeWidth="1.8" 
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Hover Indicator Points */}
              {hoverIndex !== null && (
                <g>
                  {/* Green hover circle */}
                  {(selectedSeries === 'all' || selectedSeries === 'green') && (
                    <circle 
                      cx={chartPoints.green[hoverIndex].x} 
                      cy={chartPoints.green[hoverIndex].y} 
                      r="4" 
                      fill="#004225" 
                      stroke="#05080F" 
                      strokeWidth="1.5" 
                    />
                  )}
                  {/* Blue hover circle */}
                  {(selectedSeries === 'all' || selectedSeries === 'blue') && (
                    <circle 
                      cx={chartPoints.blue[hoverIndex].x} 
                      cy={chartPoints.blue[hoverIndex].y} 
                      r="4" 
                      fill="#4A5568" 
                      stroke="#05080F" 
                      strokeWidth="1.5" 
                    />
                  )}
                  {/* Pink hover circle */}
                  {(selectedSeries === 'all' || selectedSeries === 'pink') && (
                    <circle 
                      cx={chartPoints.pink[hoverIndex].x} 
                      cy={chartPoints.pink[hoverIndex].y} 
                      r="4" 
                      fill="#B2945B" 
                      stroke="#05080F" 
                      strokeWidth="1.5" 
                    />
                  )}
                </g>
              )}

              {/* SVG Gradients for beautiful under-fill */}
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#004225" />
                  <stop offset="100%" stopColor="#004225" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A5568" />
                  <stop offset="100%" stopColor="#4A5568" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B2945B" />
                  <stop offset="100%" stopColor="#B2945B" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hover Tooltip Overlay (Bloomberg Style) */}
            {activeTooltipData && (
              <div className="absolute top-[80px] left-[55px] bg-brand-graphite border border-white/15 p-3 rounded-none shadow-lg font-mono text-[11px] space-y-1 z-10 w-[140px] pointer-events-none">
                <div className="text-white border-b border-white/10 pb-1 mb-1 font-bold">
                  {activeTooltipData.month.toUpperCase()} SPOT INDEX
                </div>
                {(selectedSeries === 'all' || selectedSeries === 'green') && (
                  <div className="flex justify-between items-center text-white">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-racing"></span>GREEN:</span>
                    <span>£{activeTooltipData.green.toFixed(2)}</span>
                  </div>
                )}
                {(selectedSeries === 'all' || selectedSeries === 'blue') && (
                  <div className="flex justify-between items-center text-white">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-steel"></span>BLUE:</span>
                    <span>£{activeTooltipData.blue.toFixed(2)}</span>
                  </div>
                )}
                {(selectedSeries === 'all' || selectedSeries === 'pink') && (
                  <div className="flex justify-between items-center text-white">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>PINK:</span>
                    <span>£{activeTooltipData.pink.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Legend and explanation */}
          <div className="flex flex-wrap justify-between items-center border-t border-white/10 pt-4 mt-6 font-mono text-[10px] text-brand-steel gap-4">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-racing"></span> Green Electrolytic H2</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-steel"></span> Blue Reforming (ATR+CCS)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> Pink Nuclear SOEC H2</span>
            </div>
            <div>
              <span>* PRICES REFLECT INDICATIVE GRID CONTRACT MINIMA</span>
            </div>
          </div>

        </div>

        {/* Heatmap & Grid Flow Panel (Col: 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Heatmap table of transmission sectors */}
          <div className="bg-brand-navy border border-white/10 rounded-none p-5">
            <span className="font-mono text-xs text-brand-steel block uppercase mb-3">sector price matrix</span>
            
            <div className="space-y-2.5">
              {REGIONS.slice(0, 5).map((r) => (
                <div key={r.id} className="flex justify-between items-center border-b border-white/5 pb-2 font-mono text-xs text-white">
                  <span className="text-brand-steel truncate max-w-[150px]">{r.name.toUpperCase()}</span>
                  <div className="flex items-center gap-4">
                    <span className="px-1.5 py-0.5 rounded-none bg-brand-graphite border border-white/5 text-white">
                      {r.productionCapacity} t/d
                    </span>
                    <span className="font-semibold text-brand-gold">
                      £{r.spotPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-2 border-t border-white/5 font-mono text-[10px] text-brand-steel text-center">
              SYSTEM CONGESTION TARIFFS APPLY OUTSIDE CORE
            </div>
          </div>

          {/* National Energy News alerts */}
          <div className="bg-brand-navy border border-white/10 rounded-none p-5">
            <span className="font-mono text-xs text-brand-steel block uppercase mb-3">grid control telemetry</span>
            
            <div className="space-y-3 font-mono text-[11px] text-brand-steel">
              <div className="flex items-start gap-2 border-l-2 border-brand-racing pl-2.5">
                <div>
                  <span className="text-white font-medium block uppercase">Bacton Terminal Active</span>
                  <span>Direct pipeline loop connection tests finalized for east coast offshore nodes.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 border-l-2 border-brand-gold pl-2.5">
                <div>
                  <span className="text-white font-medium block uppercase">Salt Cavern Buffer Alert</span>
                  <span>Injections initiated in Mersey Cheshire storage networks.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 border-l-2 border-white/20 pl-2.5">
                <div>
                  <span className="text-white font-medium block uppercase">Standard Update Scheme</span>
                  <span>DESNZ confirms low carbon purity baseline of 99.97% minimum for bulk grid feed.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
