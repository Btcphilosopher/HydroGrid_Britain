/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SUPPLIERS, REGIONS } from '../data';
import { Supplier } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown, Bookmark, FileSpreadsheet, CheckCircle2, ChevronRight, Mail, Phone, MapPin, Building, Sparkles, Award } from 'lucide-react';

interface SupplierDirectoryProps {
  onInitiateQuote: (supplier: Supplier) => void;
  watchlistIds: string[];
  onToggleWatchlist: (supplierId: string) => void;
}

export default function SupplierDirectory({ onInitiateQuote, watchlistIds, onToggleWatchlist }: SupplierDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Green' | 'Blue' | 'Pink'>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price' | 'capacity' | 'intensity'>('price');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  // Filter and sort logic
  const filteredSuppliers = useMemo(() => {
    let result = [...SUPPLIERS];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(term) || 
             s.location.toLowerCase().includes(term) || 
             s.description.toLowerCase().includes(term)
      );
    }

    if (selectedType !== 'All') {
      result = result.filter(s => s.type === selectedType);
    }

    if (selectedRegion !== 'All') {
      result = result.filter(s => s.regionsServed.includes(selectedRegion));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price') {
        return a.pricingIndicative - b.pricingIndicative; // lower is better
      } else if (sortBy === 'capacity') {
        return b.capacityTonnesDay - a.capacityTonnesDay; // higher is better
      } else if (sortBy === 'intensity') {
        return a.emissionIntensity - b.emissionIntensity; // lower is better
      }
      return 0;
    });

    return result;
  }, [searchTerm, selectedType, selectedRegion, sortBy]);

  const activeSupplier = useMemo(() => {
    return SUPPLIERS.find(s => s.id === selectedSupplierId) || null;
  }, [selectedSupplierId]);

  return (
    <div id="supplier-directory-root" className="space-y-6">
      
      {/* Search and filtering console (Foster style thin border panels) */}
      <div className="bg-brand-navy border border-white/10 rounded-none p-5">
        <span className="font-mono text-xs text-brand-steel block mb-2 uppercase">procurement search controls</span>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Text Search Input */}
          <div className="md:col-span-4 relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-brand-steel pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by supplier or infrastructure name..."
              className="w-full pl-9 pr-4 py-2 bg-brand-graphite border border-white/10 rounded-none text-sm text-white placeholder-brand-steel focus:outline-none focus:border-brand-gold transition"
            />
          </div>

          {/* Color Type Selector */}
          <div className="md:col-span-3 flex bg-brand-graphite/50 border border-white/10 rounded-none p-1 text-xs font-mono">
            {(['All', 'Green', 'Blue', 'Pink'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`flex-1 py-1.5 rounded-none transition uppercase text-center cursor-pointer ${
                  selectedType === t ? 'bg-brand-racing text-white font-bold' : 'text-brand-steel hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Region Dropdown Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full py-2 px-3 bg-brand-graphite border border-white/10 rounded-none text-sm text-white font-mono focus:outline-none focus:border-brand-gold transition"
            >
              <option value="All">ALL TRANSMISSION SECTORS</option>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Sort Selection */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 border border-white/10 rounded-none px-2 bg-brand-graphite/30 h-full">
              <ArrowUpDown className="w-4 h-4 text-brand-steel" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-1.5 bg-transparent border-none text-xs text-white font-mono focus:outline-none uppercase cursor-pointer"
              >
                <option value="price" className="bg-brand-navy">Lowest Price</option>
                <option value="capacity" className="bg-brand-navy">High Capacity</option>
                <option value="intensity" className="bg-brand-navy">Low Carbon</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Directory Grid split with details drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Suppliers List (Col: 7 if selected, 12 if none) */}
        <div className={`space-y-4 ${selectedSupplierId ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex justify-between items-center font-mono text-xs text-brand-steel px-1">
            <span>SHOWING {filteredSuppliers.length} CERTIFIED PRODUCERS</span>
            <span>STANDARDS: LOW-CARBON HYDROGEN SCHEME V2.4</span>
          </div>

          {filteredSuppliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              {filteredSuppliers.map((supplier) => {
                const isSaved = watchlistIds.includes(supplier.id);
                const isSelected = selectedSupplierId === supplier.id;

                return (
                  <div 
                    key={supplier.id}
                    className={`border transition-all duration-300 rounded-none p-5 ${
                      isSelected 
                        ? 'bg-brand-navy/60 border-brand-gold shadow-md' 
                        : 'bg-brand-navy border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      
                      {/* Name and Tagline */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-lg text-white font-semibold leading-none">{supplier.name}</h4>
                          <span className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-medium tracking-wider uppercase border ${
                            supplier.type === 'Green' 
                              ? 'bg-brand-racing/20 border-brand-racing/40 text-emerald-400' 
                              : supplier.type === 'Blue' 
                                ? 'bg-slate-500/20 border-slate-500/40 text-slate-300' 
                                : 'bg-brand-gold/20 border-brand-gold/40 text-brand-gold'
                          }`}>
                            {supplier.type} Hydrogen
                          </span>
                        </div>
                        <span className="font-mono text-xs text-brand-steel flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {supplier.location}
                        </span>
                      </div>

                      {/* Financial statistics indicators */}
                      <div className="flex items-center gap-6 font-mono text-right">
                        <div>
                          <span className="text-[10px] text-brand-steel block uppercase">indicative pricing</span>
                          <span className="text-sm font-semibold text-white">£{supplier.pricingIndicative.toFixed(2)}/kg</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-steel block uppercase">CAPACITY</span>
                          <span className="text-sm font-semibold text-white">{supplier.capacityTonnesDay} t/d</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-steel block uppercase">CARBON FOOTPRINT</span>
                          <span className={`text-sm font-semibold ${supplier.emissionIntensity < 0.2 ? 'text-emerald-400' : 'text-brand-steel'}`}>
                            {supplier.emissionIntensity.toFixed(2)} CO2e
                          </span>
                        </div>
                      </div>

                    </div>

                    <p className="text-sm text-brand-steel mt-3 leading-relaxed max-w-3xl">
                      {supplier.description}
                    </p>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-4">
                      <div className="flex gap-2 font-mono text-[10px]">
                        {supplier.regionsServed.slice(0, 3).map((reg) => {
                          const rName = REGIONS.find(r => r.id === reg)?.name || reg;
                          return (
                            <span key={reg} className="px-2 py-0.5 bg-brand-graphite border border-white/5 rounded-none text-brand-steel">
                              {rName.replace(' Transmission Zone', '').toUpperCase()}
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleWatchlist(supplier.id)}
                          className={`p-2 rounded-none border transition cursor-pointer ${
                            isSaved 
                              ? 'bg-brand-racing/20 border-brand-racing text-white' 
                              : 'bg-transparent border-white/10 hover:border-white/20 text-brand-steel hover:text-white'
                          }`}
                          title="Save to watchlist"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : ''}`} />
                        </button>
                        <button
                          onClick={() => setSelectedSupplierId(isSelected ? null : supplier.id)}
                          className="px-3.5 py-1.5 bg-brand-graphite border border-white/10 hover:border-white/20 text-xs font-mono text-white rounded-none transition flex items-center gap-1 cursor-pointer"
                        >
                          {isSelected ? 'Collapse' : 'Technical Dossier'}
                          <ChevronRight className={`w-3 h-3 transition ${isSelected ? 'rotate-90' : ''}`} />
                        </button>
                        <button
                          onClick={() => onInitiateQuote(supplier)}
                          className="px-3.5 py-1.5 bg-brand-gold hover:bg-brand-gold/90 text-xs font-mono text-[#05080F] font-bold rounded-none transition cursor-pointer"
                        >
                          Request Supply
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-white/5 bg-white/[0.01] rounded-none p-12 text-center">
              <span className="font-mono text-xs text-brand-steel uppercase block mb-1">No matching energy assets found</span>
              <p className="text-sm text-brand-steel">Try adjusting your search criteria or color filter</p>
            </div>
          )}
        </div>

        {/* Detailed Supplier Dossier Drawer (Col: 5) */}
        {selectedSupplierId && activeSupplier && (
          <div className="lg:col-span-5 border border-brand-gold bg-brand-navy rounded-none p-6 space-y-6 sticky top-6">
            
            {/* Drawer Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] text-brand-steel uppercase">Supplier Dossier</span>
                  <h3 className="font-display text-xl text-white font-semibold leading-tight mt-0.5">{activeSupplier.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedSupplierId(null)}
                  className="font-mono text-xs text-brand-steel hover:text-white p-1"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="px-2 py-0.5 bg-brand-graphite text-[10px] border border-white/5 text-brand-steel font-mono uppercase">
                  Rating: {activeSupplier.sustainabilityRating}
                </span>
                <span className="px-2 py-0.5 bg-brand-graphite text-[10px] border border-white/5 text-brand-steel font-mono uppercase">
                  Purity: 5.0 Grade
                </span>
              </div>
            </div>

            {/* In depth profile section */}
            <div className="space-y-4 text-sm leading-relaxed text-brand-steel">
              <div>
                <span className="font-mono text-[10px] text-white block uppercase mb-1">Infrastructure Overview</span>
                <p>{activeSupplier.overview}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-white block uppercase mb-1.5">Primary Offtake Quality</span>
                <div className="border border-white/5 bg-brand-graphite/40 p-2.5 rounded-none font-mono text-xs text-white">
                  <div>PURITY: {activeSupplier.purityGrade}</div>
                  <div className="mt-1 text-brand-steel">DELIVERY METRIC: {activeSupplier.deliveryOptions.join(' | ')}</div>
                </div>
              </div>

              {/* Grid assets listed */}
              <div>
                <span className="font-mono text-[10px] text-white block uppercase mb-1.5">Active Infrastructure Links</span>
                <ul className="space-y-1 text-xs font-mono text-brand-steel">
                  {activeSupplier.infrastructureProjects.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-gold"></span>
                      {p.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certified Standards list */}
              <div>
                <span className="font-mono text-[10px] text-white block uppercase mb-1.5">Accreditation Seals</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSupplier.certifications.map((cert) => (
                    <span 
                      key={cert} 
                      className="px-2 py-1 bg-brand-graphite border border-white/10 rounded-none font-mono text-[9px] text-white flex items-center gap-1"
                    >
                      <Award className="w-2.5 h-2.5 text-brand-gold" />
                      {cert.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Secure Contact Details */}
            <div className="border-t border-white/10 pt-4 space-y-2.5 font-mono text-xs text-brand-steel">
              <span className="text-white font-medium uppercase text-[10px] block mb-1">Transmission Contact Desk</span>
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-brand-gold" />
                <a href={`mailto:${activeSupplier.contactEmail}`} className="hover:underline">{activeSupplier.contactEmail}</a>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>{activeSupplier.contactPhone}</span>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => onToggleWatchlist(activeSupplier.id)}
                className={`flex-1 py-2 font-mono text-xs text-center border rounded-none transition uppercase cursor-pointer ${
                  watchlistIds.includes(activeSupplier.id)
                    ? 'bg-brand-racing/10 border-brand-racing text-white'
                    : 'border-white/10 hover:border-white/25 text-brand-steel hover:text-white'
                }`}
              >
                {watchlistIds.includes(activeSupplier.id) ? 'SAVED' : 'SAVE TO PROCUREMENT'}
              </button>
              <button
                onClick={() => onInitiateQuote(activeSupplier)}
                className="flex-1 py-2 bg-brand-gold hover:bg-brand-gold/90 font-mono text-xs font-bold text-center text-[#05080F] rounded-none transition uppercase cursor-pointer"
              >
                BOOK PROCUREMENT
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
