/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SUPPLIERS, REGIONS } from '../data';
import { DeliveryRequest, Supplier } from '../types';
import { FileDown, Calendar, ShieldAlert, CheckCircle, PackageOpen, RefreshCw, X, Sliders, ArrowRight, Settings, ExternalLink, BookmarkCheck } from 'lucide-react';

interface BuyerDashboardProps {
  watchlistIds: string[];
  onToggleWatchlist: (supplierId: string) => void;
  deliveryRequests: DeliveryRequest[];
  onChangeRequestStatus: (id: string, newStatus: DeliveryRequest['status']) => void;
  onSelectSupplier: (supplier: Supplier) => void;
}

export default function BuyerDashboard({ 
  watchlistIds, 
  onToggleWatchlist, 
  deliveryRequests, 
  onChangeRequestStatus,
  onSelectSupplier
}: BuyerDashboardProps) {
  
  // Local state for facility management
  const [facilities, setFacilities] = useState([
    { id: 'f-1', name: 'Port Talbot Decarbonization Plant', location: 'South Wales', region: 'wales', capacityNeeded: 45, purity: '99.97% Industrial' },
    { id: 'f-2', name: 'Stanlow Refinery Chemical Cell', location: 'Cheshire', region: 'north-west', capacityNeeded: 120, purity: '99.999% Ultra-Pure' },
    { id: 'f-3', name: 'Shetland Marine Bunker Depot', location: 'Lerwick, Orkney', region: 'scotland-north', capacityNeeded: 30, purity: '99.99% Logistics' }
  ]);

  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityLocation, setNewFacilityLocation] = useState('');
  const [newFacilityRegion, setNewFacilityRegion] = useState('wales');
  const [newFacilityCapacity, setNewFacilityCapacity] = useState(25);
  const [newFacilityPurity, setNewFacilityPurity] = useState('99.97% Industrial');
  const [isAddingFacility, setIsAddingFacility] = useState(false);

  // Filter saved suppliers
  const savedSuppliers = SUPPLIERS.filter(s => watchlistIds.includes(s.id));

  // Add facility
  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName || !newFacilityLocation) return;
    
    setFacilities([
      ...facilities,
      {
        id: `f-${Date.now()}`,
        name: newFacilityName,
        location: newFacilityLocation,
        region: newFacilityRegion,
        capacityNeeded: Number(newFacilityCapacity),
        purity: newFacilityPurity
      }
    ]);

    setNewFacilityName('');
    setNewFacilityLocation('');
    setIsAddingFacility(false);
  };

  return (
    <div id="buyer-dashboard-root" className="space-y-6">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-white/10 bg-brand-navy p-4 rounded-none">
          <span className="font-mono text-[10px] text-brand-steel block uppercase">Active Bookings</span>
          <span className="font-display text-2xl font-semibold text-white mt-1 block">
            {deliveryRequests.filter(r => r.status === 'Scheduled' || r.status === 'In Transit').length}
          </span>
          <span className="font-mono text-[9px] text-brand-steel block mt-1 uppercase">GRID LOCKED SHIPMENTS</span>
        </div>

        <div className="border border-white/10 bg-brand-navy p-4 rounded-none">
          <span className="font-mono text-[10px] text-brand-steel block uppercase">PENDING QUOTES</span>
          <span className="font-display text-2xl font-semibold text-brand-gold mt-1 block">
            {deliveryRequests.filter(r => r.status === 'Pending Quote' || r.status === 'Offered').length}
          </span>
          <span className="font-mono text-[9px] text-brand-steel block mt-1 uppercase">AWAITING ADVICE SECTOR</span>
        </div>

        <div className="border border-white/10 bg-brand-navy p-4 rounded-none">
          <span className="font-mono text-[10px] text-brand-steel block uppercase">MONITORED FACILITIES</span>
          <span className="font-display text-2xl font-semibold text-white mt-1 block">
            {facilities.length}
          </span>
          <span className="font-mono text-[9px] text-brand-steel block mt-1 uppercase">UK HEAVY INTAKE INFRA</span>
        </div>

        <div className="border border-white/10 bg-brand-navy p-4 rounded-none">
          <span className="font-mono text-[10px] text-brand-steel block uppercase">SAVED PRODUCERS</span>
          <span className="font-display text-2xl font-semibold text-white mt-1 block">
            {watchlistIds.length}
          </span>
          <span className="font-mono text-[9px] text-brand-steel block mt-1 uppercase">PREFERRED ACCREDITED LIST</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Active Delivery Requests List (Col: 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="border border-white/10 bg-brand-navy rounded-none p-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] text-brand-steel uppercase block">Transmission tracking</span>
                <h3 className="font-display text-lg text-white font-semibold">PROCUREMENT SCHEDULER</h3>
              </div>
              <button 
                onClick={() => window.print()}
                className="font-mono text-xs text-brand-steel hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" /> EXPORT SHEETS
              </button>
            </div>

            {deliveryRequests.length > 0 ? (
              <div className="space-y-4">
                {deliveryRequests.map((req) => {
                  return (
                    <div 
                      key={req.id} 
                      className="border border-white/10 bg-brand-graphite/40 rounded-none p-4 font-mono text-xs"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                        <div>
                          <span className="text-[10px] text-brand-steel block">BOOKING REF ID</span>
                          <span className="text-white font-bold">{req.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-steel block text-right">SUPPLIER GRID NAME</span>
                          <span className="text-white">{req.supplierName.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-brand-steel">
                        <div>
                          <span>QUANTITY INTAKE</span>
                          <p className="text-white font-semibold mt-0.5">{req.quantityKg.toLocaleString()} kg</p>
                        </div>
                        <div>
                          <span>SHIPPING HUB</span>
                          <p className="text-white mt-0.5 truncate">{req.destinationHub}</p>
                        </div>
                        <div>
                          <span>DELIVERY DATE</span>
                          <p className="text-white mt-0.5">{req.deliveryDate}</p>
                        </div>
                        <div className="text-right">
                          <span>QUOTE TARIFF</span>
                          <p className="text-brand-gold font-bold mt-0.5">
                            {req.quotePricePerKg > 0 ? `£${req.quotePricePerKg.toFixed(2)}/kg` : 'Pending quote'}
                          </p>
                        </div>
                      </div>

                      {/* Interactive state actions */}
                      <div className="flex flex-wrap justify-between items-center border-t border-white/5 pt-3 mt-3 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase">Shipping state:</span>
                          <span className={`px-2 py-0.5 rounded-none text-[10px] border uppercase ${
                            req.status === 'Completed' 
                              ? 'bg-brand-racing/20 border-brand-racing text-white' 
                              : req.status === 'Cancelled' 
                                ? 'bg-red-950/45 border-red-500/50 text-red-100'
                                : req.status === 'Offered' 
                                  ? 'bg-brand-gold/15 border-brand-gold text-brand-gold'
                                  : 'bg-brand-graphite border-white/10 text-brand-steel'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {req.status === 'Pending Quote' && (
                            <button
                              onClick={() => onChangeRequestStatus(req.id, 'Offered')}
                              className="px-3 py-1 bg-brand-gold text-[10px] text-[#05080F] font-bold rounded-none transition hover:bg-brand-gold/90 uppercase cursor-pointer"
                            >
                              Receive Quote Offer
                            </button>
                          )}
                          {req.status === 'Offered' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => onChangeRequestStatus(req.id, 'Cancelled')}
                                className="px-3 py-1 bg-transparent border border-white/10 text-[10px] text-brand-steel rounded-none transition hover:text-white uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => onChangeRequestStatus(req.id, 'Scheduled')}
                                className="px-3 py-1 bg-brand-racing text-[10px] text-white font-bold rounded-none transition hover:bg-brand-racing/90 uppercase cursor-pointer"
                              >
                                Accept & Book (£{(req.quantityKg * req.quotePricePerKg).toLocaleString()})
                              </button>
                            </div>
                          )}
                          {req.status === 'Scheduled' && (
                            <button
                              onClick={() => onChangeRequestStatus(req.id, 'In Transit')}
                              className="px-3 py-1 bg-brand-graphite border border-white/10 text-[10px] text-white rounded-none transition hover:border-white/25 uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Dispatch
                            </button>
                          )}
                          {req.status === 'In Transit' && (
                            <button
                              onClick={() => onChangeRequestStatus(req.id, 'Completed')}
                              className="px-3 py-1 bg-brand-racing text-[10px] text-white font-bold rounded-none transition hover:bg-brand-racing/90 uppercase cursor-pointer"
                            >
                              Acknowledge Delivery
                            </button>
                          )}
                          {req.status === 'Completed' && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle className="w-3.5 h-3.5" /> SECURE AUDITED ARRIVAL
                            </span>
                          )}
                          {req.status === 'Cancelled' && (
                            <span className="text-[10px] text-brand-steel uppercase">CLOSED TRANSACTION</span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-white/5 bg-white/[0.01] rounded-none p-8 text-center">
                <PackageOpen className="w-8 h-8 text-brand-steel mx-auto mb-2" />
                <span className="font-mono text-xs text-brand-steel uppercase block mb-1">No active procurement pipelines</span>
                <p className="text-sm text-brand-steel">Search the supplier directory to establish custom shipping agreements</p>
              </div>
            )}

          </div>

          {/* Saved Preferred Supplier Watchlist */}
          <div className="border border-white/10 bg-brand-navy rounded-none p-5">
            <span className="font-mono text-xs text-brand-steel block uppercase mb-4">PREFERRED PROCUREMENT ASSETS</span>
            
            {savedSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedSuppliers.map((supplier) => (
                  <div 
                    key={supplier.id} 
                    className="border border-white/5 bg-brand-graphite/30 p-4 rounded-none flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-semibold text-white text-sm">{supplier.name}</h4>
                        <button
                          onClick={() => onToggleWatchlist(supplier.id)}
                          className="text-brand-gold font-mono text-[10px] hover:underline cursor-pointer"
                        >
                          REMOVE
                        </button>
                      </div>
                      <span className="font-mono text-[10px] text-brand-steel flex items-center gap-1 mt-1">
                        {supplier.location}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4">
                      <div className="font-mono text-[10px] text-brand-steel">
                        <span>£{supplier.pricingIndicative.toFixed(2)}/kg</span>
                      </div>
                      <button
                        onClick={() => onSelectSupplier(supplier)}
                        className="text-[10px] font-mono text-white flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        VIEW DOSSIER <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-white/5 bg-white/[0.01] rounded-none p-6 text-center">
                <BookmarkCheck className="w-6 h-6 text-brand-steel mx-auto mb-1" />
                <span className="font-mono text-[10px] text-brand-steel uppercase block">Procurement list is empty</span>
              </div>
            )}
          </div>

        </div>

        {/* Facility Manager Section (Col: 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="border border-white/10 bg-brand-navy rounded-none p-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] text-brand-steel uppercase block">Intake sites</span>
                <h3 className="font-display text-base text-white font-semibold">FACILITY MANAGEMENT</h3>
              </div>
              <button
                onClick={() => setIsAddingFacility(!isAddingFacility)}
                className="font-mono text-xs text-brand-gold hover:underline cursor-pointer"
              >
                {isAddingFacility ? '[CANCEL]' : '[+ ADD]'}
              </button>
            </div>

            {/* Add Facility Form Toggle */}
            {isAddingFacility && (
              <form onSubmit={handleAddFacility} className="bg-brand-graphite border border-white/15 p-4 rounded-none mb-4 font-mono text-xs space-y-3">
                <div>
                  <label className="block text-brand-steel uppercase mb-1">FACILITY INDUSTRIAL NAME</label>
                  <input 
                    type="text" 
                    value={newFacilityName} 
                    onChange={e => setNewFacilityName(e.target.value)} 
                    placeholder="e.g. Scunthorpe Steelworks H2 Cell" 
                    required
                    className="w-full bg-brand-navy border border-white/10 rounded-none px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-brand-steel uppercase mb-1">LOCATION / ADDRESS</label>
                  <input 
                    type="text" 
                    value={newFacilityLocation} 
                    onChange={e => setNewFacilityLocation(e.target.value)} 
                    placeholder="e.g. Lincolnshire" 
                    required
                    className="w-full bg-brand-navy border border-white/10 rounded-none px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-brand-steel uppercase mb-1">DAILY REQUIREMENT (T)</label>
                    <input 
                      type="number" 
                      value={newFacilityCapacity} 
                      onChange={e => setNewFacilityCapacity(Number(e.target.value))} 
                      min="1" 
                      className="w-full bg-brand-navy border border-white/10 rounded-none px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-brand-steel uppercase mb-1">PURITY REQ</label>
                    <select 
                      value={newFacilityPurity} 
                      onChange={e => setNewFacilityPurity(e.target.value)} 
                      className="w-full bg-brand-navy border border-white/10 rounded-none px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-gold cursor-pointer"
                    >
                      <option>99.97% Industrial</option>
                      <option>99.99% Logistics</option>
                      <option>99.999% Ultra-Pure</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#05080F] font-bold py-1.5 rounded-none transition uppercase cursor-pointer"
                >
                  SECURE REGISTER FACILITY
                </button>
              </form>
            )}

            {/* Facilities List */}
            <div className="space-y-4">
              {facilities.map((fac) => {
                const regionName = REGIONS.find(r => r.id === fac.region)?.name || fac.region;

                return (
                  <div key={fac.id} className="border border-white/5 bg-brand-graphite/40 p-3 rounded-none font-mono text-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-semibold uppercase">{fac.name}</span>
                      <button 
                        onClick={() => setFacilities(facilities.filter(f => f.id !== fac.id))}
                        className="text-brand-steel hover:text-red-400 cursor-pointer"
                        title="Remove facility"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-brand-steel mt-1.5">
                      <span>LOCATION:</span>
                      <span className="text-white">{fac.location} ({regionName.toUpperCase().replace(' TRANSMISSION ZONE', '')})</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2.5 text-brand-steel text-[10px]">
                      <span>DEMAND: {fac.capacityNeeded} TONNES/DAY</span>
                      <span>PURITY: {fac.purity.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-3 mt-4 font-mono text-[9px] text-brand-steel text-center uppercase">
              REGISTERED SITES CO-BOUND UNDER SECTION-17 OFF-TAKE CODE
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
