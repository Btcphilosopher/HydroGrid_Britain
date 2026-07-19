/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Supplier } from '../types';
import { REGIONS } from '../data';
import { Shield, Truck, Droplets, Calendar, Sparkles, Building2, HelpCircle, X, DollarSign } from 'lucide-react';

interface DeliveryRequestModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSubmit: (data: {
    quantityKg: number;
    deliveryDate: string;
    destinationHub: string;
    destinationRegion: string;
    purityRequired: string;
    deliveryMethod: string;
  }) => void;
}

export default function DeliveryRequestModal({ supplier, onClose, onSubmit }: DeliveryRequestModalProps) {
  const [quantityKg, setQuantityKg] = useState<number>(5000);
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-08-01');
  const [destinationHub, setDestinationHub] = useState<string>('Port Talbot Decarbonization Plant');
  const [destinationRegion, setDestinationRegion] = useState<string>('wales');
  const [purityRequired, setPurityRequired] = useState<string>('99.99% Grade D (Logistics)');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Tube Trailer (Gaseous)');

  if (!supplier) return null;

  // Calculators
  const priceEstimate = quantityKg * supplier.pricingIndicative;
  // pipeline is cheapest, liquid road tanker mid, gaseous trailer highest
  const deliveryMultiplier = deliveryMethod.includes('Pipeline') ? 0.05 : deliveryMethod.includes('Liquid') ? 0.12 : 0.18;
  const transitCost = quantityKg * deliveryMultiplier;
  const totalEstimatedCost = priceEstimate + transitCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      quantityKg,
      deliveryDate,
      destinationHub,
      destinationRegion,
      purityRequired,
      deliveryMethod
    });
  };

  return (
    <div id="delivery-request-modal" className="fixed inset-0 bg-brand-navy/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-brand-navy border border-brand-gold rounded-none max-w-2xl w-full p-6 space-y-6 relative grid-blueprint shadow-2xl my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-steel hover:text-white font-mono text-xs p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <span className="font-mono text-[10px] text-brand-gold uppercase block">Grid Booking Protocol</span>
          <h3 className="font-display text-xl text-white font-semibold mt-1">REQUEST HYDROGEN PROCUREMENT QUOTE</h3>
          <p className="text-xs text-brand-steel mt-1 font-mono">
            CONTRACTOR ENGAGEMENT: {supplier.name.toUpperCase()}
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Delivery destination hub */}
            <div>
              <label className="block text-brand-steel uppercase mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Destination intake site
              </label>
              <input 
                type="text" 
                value={destinationHub} 
                onChange={(e) => setDestinationHub(e.target.value)}
                placeholder="e.g. Scunthorpe Steelworks"
                required
                className="w-full bg-brand-graphite border border-white/10 rounded-none px-3 py-2 text-white focus:outline-none focus:border-brand-gold text-xs"
              />
            </div>

            {/* Destination transmission zone */}
            <div>
              <label className="block text-brand-steel uppercase mb-1.5">Transmission Grid Sector</label>
              <select 
                value={destinationRegion}
                onChange={(e) => setDestinationRegion(e.target.value)}
                className="w-full bg-brand-graphite border border-white/10 rounded-none px-3 py-2 text-white focus:outline-none focus:border-brand-gold text-xs cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name.toUpperCase()} (£{r.spotPrice.toFixed(2)}/kg)
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Target Quantity (kg) */}
            <div>
              <label className="block text-brand-steel uppercase mb-1.5">INTAKE VOLUME (KG)</label>
              <input 
                type="number" 
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(100, Number(e.target.value)))}
                min="100"
                step="100"
                required
                className="w-full bg-brand-graphite border border-white/10 rounded-none px-3 py-2 text-white focus:outline-none focus:border-brand-gold text-xs"
              />
            </div>

            {/* Target Delivery Date */}
            <div>
              <label className="block text-brand-steel uppercase mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> REQUIRED DATE
              </label>
              <input 
                type="date" 
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
                className="w-full bg-brand-graphite border border-white/10 rounded-none px-3 py-2 text-white focus:outline-none focus:border-brand-gold text-xs"
              />
            </div>

            {/* Purity Requirement */}
            <div>
              <label className="block text-brand-steel uppercase mb-1.5">PURITY GRADE REQUIREMENT</label>
              <select 
                value={purityRequired}
                onChange={(e) => setPurityRequired(e.target.value)}
                className="w-full bg-brand-graphite border border-white/10 rounded-none px-3 py-2 text-white focus:outline-none focus:border-brand-gold text-xs cursor-pointer"
              >
                <option>99.97% Grade A (Industrial)</option>
                <option>99.99% Grade D (Logistics)</option>
                <option>99.999% Grade 5.0 (Ultra-Pure)</option>
                <option>99.9995% Grade 5.5 (Aerospace Spec)</option>
              </select>
            </div>

          </div>

          {/* Delivery Method Choice */}
          <div>
            <span className="block text-brand-steel uppercase mb-2">INTEGRATED LOGISTICS CONTAINER MEDIUM</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {supplier.deliveryOptions.map((opt) => {
                const isSelected = deliveryMethod === opt;
                return (
                  <div 
                    key={opt}
                    onClick={() => setDeliveryMethod(opt)}
                    className={`border p-3 rounded-none cursor-pointer transition text-center ${
                      isSelected 
                        ? 'bg-brand-racing/15 border-brand-racing text-white font-bold' 
                        : 'bg-brand-graphite/40 border-white/10 text-brand-steel hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] block uppercase">{opt.split(' (')[0]}</span>
                    <span className="text-[9px] text-brand-steel block mt-1 uppercase">
                      {opt.includes('Pipeline') ? 'Direct Spine' : opt.includes('Liquid') ? 'Cold Liquid' : 'High Press Gaseous'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Calculation summary */}
          <div className="bg-brand-graphite/60 border border-white/10 rounded-none p-4 space-y-2 text-[11px]">
            <span className="text-white font-bold block uppercase border-b border-white/5 pb-1 mb-2">PROCUREMENT COST ESTIMATION</span>
            
            <div className="flex justify-between text-brand-steel">
              <span>INDICATIVE GAS TARIFF ({quantityKg.toLocaleString()} KG @ £{supplier.pricingIndicative.toFixed(2)}):</span>
              <span className="text-white">£{priceEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-brand-steel">
              <span>INTEGRATED TRANSIT & CONTAINER FREIGHT CHARGES:</span>
              <span className="text-white">£{transitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-white font-bold border-t border-white/5 pt-2 mt-2 text-xs">
              <span className="flex items-center gap-1 text-brand-gold uppercase"><DollarSign className="w-3.5 h-3.5" /> TOTAL ESTIMATE TARIFF:</span>
              <span className="text-brand-gold">£{totalEstimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <span className="text-[9px] text-brand-steel block pt-2 uppercase">
              * FINAL AUDITED OFF-TAKE TARIFF SUBJECT TO GRID CONGESTION FEES AT HARVEST
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-transparent border border-white/10 hover:border-white/25 text-brand-steel hover:text-white rounded-none transition uppercase font-semibold text-center text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-[#05080F] font-bold rounded-none transition uppercase text-xs text-center cursor-pointer"
            >
              SECURE SUBMIT REQUEST
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
