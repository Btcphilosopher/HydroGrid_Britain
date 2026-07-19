/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REGIONS } from '../data';
import { RegionalStats } from '../types';
import { Shield, Radio, Activity, Database, Wind, Landmark, Eye, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveMapProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

// Coordinate mappings for stylised UK map nodes and boundaries
// Centered and scaled to look beautiful in a modern dashboard box
interface MapNode {
  id: string;
  name: string;
  x: number; // Percentage width
  y: number; // Percentage height
  type: 'production' | 'storage' | 'port' | 'terminal';
  capacity: string;
  status: 'Operational' | 'Nominal' | 'Expanding';
}

const MAP_NODES: MapNode[] = [
  { id: 'orkney', name: 'Flotta & Orkney Tidal Array', x: 45, y: 10, type: 'production', capacity: '45 t/day', status: 'Expanding' },
  { id: 'aberdeen', name: 'Aberdeen Offshore Wind Hub', x: 49, y: 19, type: 'production', capacity: '80 t/day', status: 'Operational' },
  { id: 'grangemouth', name: 'Grangemouth Refinery Hub', x: 42, y: 28, type: 'terminal', capacity: '120 t/day', status: 'Operational' },
  { id: 'teesside', name: 'Teesside NetZero Cluster', x: 55, y: 44, type: 'production', capacity: '320 t/day', status: 'Operational' },
  { id: 'humber', name: 'Humber Clean Port Terminal', x: 58, y: 52, type: 'port', capacity: '160 t/day', status: 'Expanding' },
  { id: 'bacton', name: 'Bacton Interconnector Terminal', x: 67, y: 64, type: 'terminal', capacity: '90 t/day', status: 'Nominal' },
  { id: 'sizewell', name: 'Sizewell Pink H2 (SOEC)', x: 65, y: 70, type: 'production', capacity: '150 t/day', status: 'Nominal' },
  { id: 'hynet', name: 'HyNet Mersey Salt Caverns', x: 41, y: 54, type: 'storage', capacity: '10,000 tonnes storage', status: 'Operational' },
  { id: 'milford', name: 'Milford Haven Deep Sea Port', x: 26, y: 68, type: 'port', capacity: '95 t/day', status: 'Operational' },
  { id: 'severn', name: 'Severn Floating Wind Hub', x: 35, y: 76, type: 'production', capacity: '65 t/day', status: 'Expanding' },
  { id: 'london', name: 'London East Gateway Terminal', x: 58, y: 78, type: 'terminal', capacity: '100 t/day', status: 'Nominal' }
];

// Simplified polygons representing regional transmission zones
interface MapRegionPath {
  id: string;
  name: string;
  points: string; // SVG points coordinate
  textX: number;
  textY: number;
}

const REGION_PATHS: MapRegionPath[] = [
  { id: 'scotland-north', name: 'Scotland North', points: '30,5 50,5 60,15 55,25 35,22 30,12', textX: 43, textY: 13 },
  { id: 'scotland-south', name: 'Scotland Central', points: '35,22 55,25 58,32 50,38 30,35 28,28', textX: 41, textY: 31 },
  { id: 'north-east', name: 'North East', points: '50,38 58,32 64,48 56,54 46,46', textX: 56, textY: 41 },
  { id: 'north-west', name: 'North West', points: '30,35 46,46 44,56 36,58 32,48', textX: 38, textY: 49 },
  { id: 'midlands', name: 'Midlands', points: '44,56 56,54 62,65 52,72 40,68 38,62', textX: 49, textY: 62 },
  { id: 'wales', name: 'Wales', points: '24,58 38,62 35,74 20,72 22,64', textX: 28, textY: 66 },
  { id: 'east-anglia', name: 'East Anglia', points: '62,65 72,66 70,76 60,76 58,70', textX: 66, textY: 71 },
  { id: 'south-west', name: 'South West', points: '20,72 35,74 40,78 30,88 15,86', textX: 25, textY: 80 },
  { id: 'south-east', name: 'South East', points: '40,78 60,76 65,84 55,88 42,86', textX: 52, textY: 82 }
];

export default function InteractiveMap({ selectedRegionId, onSelectRegion }: InteractiveMapProps) {
  const [activeLayer, setActiveLayer] = useState<'pipelines' | 'hubs' | 'storage'>('pipelines');
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const selectedRegionData = REGIONS.find(r => r.id === selectedRegionId);

  return (
    <div id="interactive-map-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-brand-navy border border-white/10 rounded-none overflow-hidden backdrop-blur-md">
      
      {/* Map visualization panel (Col: 7) */}
      <div className="lg:col-span-7 p-6 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 grid-blueprint min-h-[550px]">
        {/* Header overlays */}
        <div className="flex flex-wrap items-center justify-between gap-4 z-10">
          <div>
            <span className="font-mono text-xs text-brand-gold tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-racing animate-pulse"></span>
              Live National Control Grid
            </span>
            <h3 className="font-display text-lg text-white font-medium mt-1">UNITED KINGDOM ENERGY NETWORK</h3>
          </div>

          {/* Layer Selector */}
          <div className="flex bg-brand-graphite/80 border border-white/10 rounded-none p-1 text-xs font-mono">
            <button 
              onClick={() => setActiveLayer('pipelines')}
              className={`px-3 py-1.5 rounded-none transition cursor-pointer ${activeLayer === 'pipelines' ? 'bg-brand-racing text-white font-bold' : 'text-brand-steel hover:text-white'}`}
            >
              Pipelines
            </button>
            <button 
              onClick={() => setActiveLayer('hubs')}
              className={`px-3 py-1.5 rounded-none transition cursor-pointer ${activeLayer === 'hubs' ? 'bg-brand-racing text-white font-bold' : 'text-brand-steel hover:text-white'}`}
            >
              Hubs
            </button>
            <button 
              onClick={() => setActiveLayer('storage')}
              className={`px-3 py-1.5 rounded-none transition cursor-pointer ${activeLayer === 'storage' ? 'bg-brand-racing text-white font-bold' : 'text-brand-steel hover:text-white'}`}
            >
              Storage
            </button>
          </div>
        </div>

        {/* SVG Map Canvas */}
        <div className="relative flex-1 w-full flex items-center justify-center py-4">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full max-w-[420px] h-full max-h-[460px] overflow-visible select-none"
          >
            {/* Grid Coordinates (Anglo-Futurism detail) */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.02)" strokeDasharray="2,2" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.02)" strokeDasharray="2,2" strokeWidth="0.5" />
            
            {/* Background Map Contours (Stylized Regions) */}
            <g id="regions-group">
              {REGION_PATHS.map((r) => {
                const isSelected = selectedRegionId === r.id;
                const isHovered = hoveredRegion === r.id;
                
                // Color intensity based on capacity
                let fillColor = 'rgba(255, 255, 255, 0.01)';
                if (isSelected) fillColor = 'rgba(0, 66, 37, 0.25)'; // British Racing Green hue
                else if (isHovered) fillColor = 'rgba(178, 148, 91, 0.08)'; // Gold glow on hover

                let strokeColor = isSelected ? 'rgba(0, 66, 37, 0.8)' : 'rgba(255, 255, 255, 0.08)';
                if (isHovered) strokeColor = 'rgba(178, 148, 91, 0.4)';

                return (
                  <g key={r.id} className="cursor-pointer" onClick={() => onSelectRegion(r.id)}>
                    <polygon
                      points={r.points}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '0.8' : '0.4'}
                      className="transition-all duration-300"
                      onMouseEnter={() => setHoveredRegion(r.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />
                    
                    {/* Tiny Regional ID Label */}
                    <text
                      x={r.textX}
                      y={r.textY}
                      fill={isSelected ? '#B2945B' : 'rgba(245, 245, 240, 0.4)'}
                      fontSize="2.2"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                      opacity={isSelected || isHovered ? '1' : '0.4'}
                      className="transition-all pointer-events-none"
                    >
                      {r.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Pipeline Backbone Layer (Norman Foster Infrastructure Spine) */}
            {activeLayer === 'pipelines' && (
              <g id="pipeline-spine" className="pointer-events-none">
                {/* Main backbone line */}
                <path
                  d="M 45,10 Q 49,19 42,28 T 55,44 T 58,52 T 67,64 T 65,70 T 58,78"
                  fill="none"
                  stroke="rgba(178, 148, 91, 0.5)"
                  strokeWidth="0.6"
                  strokeDasharray="1.5, 1"
                  className="animate-pulse"
                />
                {/* Branch to Wales */}
                <path
                  d="M 55,44 Q 41,54 26,68"
                  fill="none"
                  stroke="rgba(178, 148, 91, 0.35)"
                  strokeWidth="0.4"
                  strokeDasharray="2, 2"
                />
                {/* Branch to Mersey/West */}
                <path
                  d="M 42,28 Q 38,42 41,54 T 35,76"
                  fill="none"
                  stroke="rgba(178, 148, 91, 0.35)"
                  strokeWidth="0.4"
                  strokeDasharray="2, 2"
                />
              </g>
            )}

            {/* Storage caverns indicators */}
            {activeLayer === 'storage' && (
              <g id="storage-nodes" className="pointer-events-none">
                <circle cx="41" cy="54" r="2.5" fill="none" stroke="#B2945B" strokeWidth="0.3" strokeDasharray="0.5,0.5" />
                <circle cx="41" cy="54" r="1.2" fill="#B2945B" className="animate-pulse" />
                <circle cx="67" cy="64" r="2.2" fill="none" stroke="#B2945B" strokeWidth="0.3" strokeDasharray="0.5,0.5" />
                <circle cx="67" cy="64" r="1" fill="#B2945B" />
              </g>
            )}

            {/* Infrastructure Location Pins */}
            {activeLayer === 'hubs' && (
              <g id="infrastructure-pins">
                {MAP_NODES.map((node) => {
                  const isHovered = hoveredNode?.id === node.id;
                  let color = '#94A3B8';
                  if (node.type === 'production') color = '#004225'; // Racing Green
                  if (node.type === 'storage') color = '#B2945B'; // Gold
                  if (node.type === 'terminal') color = '#B2945B'; // Gold/Terminal
                  if (node.type === 'port') color = '#F5F5F0'; // Warm white

                  return (
                    <g 
                      key={node.id} 
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Outer pulse */}
                      {isHovered && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="3"
                          fill="none"
                          stroke={color}
                          strokeWidth="0.2"
                          className="animate-ping"
                        />
                      )}
                      
                      {/* Anchor pin */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? "1.5" : "1"}
                        fill={color}
                        stroke="#05080F"
                        strokeWidth="0.25"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* Floating Hover Card for Nodes */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 left-6 right-6 bg-brand-graphite border border-white/15 p-3 rounded-none shadow-lg font-mono text-xs z-20 backdrop-blur-sm"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1.5">
                  <span className="text-white font-medium">{hoveredNode.name}</span>
                  <span className="px-1.5 py-0.5 rounded-none text-[10px] bg-brand-navy border border-white/15 text-brand-gold uppercase">
                    {hoveredNode.type}
                  </span>
                </div>
                <div className="flex justify-between text-brand-steel text-[11px]">
                  <span>CAPACITY / BOUND: {hoveredNode.capacity}</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${hoveredNode.status === 'Operational' ? 'bg-brand-racing' : 'bg-brand-gold'}`}></span>
                    {hoveredNode.status.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls instruction */}
        <div className="flex justify-between items-center font-mono text-[10px] text-brand-steel border-t border-white/10 pt-3 mt-4">
          <span>COORDINATE GRID SYSTEM: REF UK_H2_NAT_2026</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> CLICK REGION TO SYNCHRONISE MARKET VIEW
          </span>
        </div>
      </div>

      {/* Regional summary data details (Col: 5) */}
      <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-brand-graphite/30">
        {selectedRegionData ? (
          <div className="flex flex-col h-full justify-between gap-6">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-brand-steel">TRANSMISSION SECTOR</span>
                  <h4 className="font-display text-2xl text-white font-semibold tracking-tight mt-0.5">{selectedRegionData.name}</h4>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-brand-steel">INDICATIVE SPOT</span>
                  <div className="font-mono text-2xl text-brand-gold font-semibold mt-0.5">
                    £{selectedRegionData.spotPrice.toFixed(2)}<span className="text-xs text-brand-steel">/kg</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase ${
                    selectedRegionData.priceTrend === 'down' ? 'text-emerald-400' : selectedRegionData.priceTrend === 'up' ? 'text-amber-500' : 'text-brand-steel'
                  }`}>
                    {selectedRegionData.priceTrend === 'down' ? '▼ PRICE SOFTENING' : selectedRegionData.priceTrend === 'up' ? '▲ PRICE PRESSURE' : '■ SPOT STABLE'}
                  </span>
                </div>
              </div>

              {/* Status bar checklist */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border border-white/10 rounded-none p-3 bg-brand-graphite/40">
                  <span className="font-mono text-[10px] text-brand-steel block uppercase">National Pipe Status</span>
                  <span className="font-mono text-sm text-white font-medium flex items-center gap-1.5 mt-1">
                    <Radio className="w-3.5 h-3.5 text-brand-gold" />
                    {selectedRegionData.pipelineStatus}
                  </span>
                </div>
                <div className="border border-white/10 rounded-none p-3 bg-brand-graphite/40">
                  <span className="font-mono text-[10px] text-brand-steel block uppercase">CO2 intensity</span>
                  <span className="font-mono text-sm text-white font-medium flex items-center gap-1.5 mt-1">
                    <Activity className="w-3.5 h-3.5 text-brand-steel" />
                    {selectedRegionData.carbonIntensity.toFixed(2)} kg/kg
                  </span>
                </div>
              </div>
            </div>

            {/* Core Statistics progress gauges */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-brand-steel uppercase">Regional Capacity</span>
                  <span className="text-white font-medium">{selectedRegionData.productionCapacity} Tonnes / Day</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-brand-racing rounded-none transition-all duration-500"
                    style={{ width: `${Math.min(100, (selectedRegionData.productionCapacity / 500) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-brand-steel uppercase">Cavern Storage Vol.</span>
                  <span className="text-white font-medium">{selectedRegionData.storageLevel}% Full capacity</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-brand-gold rounded-none transition-all duration-500"
                    style={{ width: `${selectedRegionData.storageLevel}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-brand-steel uppercase">Demand Forecast (24h)</span>
                  <span className="text-white font-medium">{selectedRegionData.demandForecast} Tonnes / Day</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 rounded-none transition-all duration-500"
                    style={{ width: `${Math.min(100, (selectedRegionData.demandForecast / 500) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Visual Callout - Foster styled editorial info */}
            <div className="border-t border-white/10 pt-4 font-mono text-[11px] leading-relaxed text-brand-steel">
              <span className="text-white block font-medium mb-1 uppercase">Infrastructure Guidance</span>
              Supply routing in <strong className="text-brand-gold">{selectedRegionData.name}</strong> is managed under National Grid protocol H2-TRANS. Spot pricing reflects local wind yields, tidal buffers, and salt-cavern injection tariffs. Procurement agreements booked through Hydrogrid Britain ensure priority scheduling.
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-none p-6">
            <span className="font-mono text-xs text-brand-steel uppercase">Select a zone on the map to inspect control metrics</span>
          </div>
        )}
      </div>

    </div>
  );
}
