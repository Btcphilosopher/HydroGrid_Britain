/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { REGIONS, SUPPLIERS, NEWS } from './data';
import { DeliveryRequest, Supplier } from './types';
import InteractiveMap from './components/InteractiveMap';
import SupplierDirectory from './components/SupplierDirectory';
import MarketDashboard from './components/MarketDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import DeliveryRequestModal from './components/DeliveryRequestModal';
import { 
  Building2, 
  Map, 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Terminal, 
  Layers, 
  ShieldAlert, 
  Copy, 
  Check, 
  Cpu, 
  CornerDownRight, 
  Clock,
  ExternalLink,
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'suppliers' | 'dashboard' | 'news' | 'api'>('home');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('north-east');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['caledonian-green', 'sizewell-pink']);
  const [activeQuoteSupplier, setActiveQuoteSupplier] = useState<Supplier | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initialise realistic default deliveries so the buyer dashboard looks active and professional on load
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([
    {
      id: 'GB-H2-9022',
      supplierId: 'teesside-netzero',
      supplierName: 'Teesside NetZero Consortium',
      quantityKg: 12000,
      deliveryDate: '2026-07-24',
      destinationHub: 'Stanlow Refinery Chemical Cell',
      destinationRegion: 'north-west',
      status: 'In Transit',
      quotePricePerKg: 4.25,
      totalCost: 51000,
      purityRequired: '99.97% Industrial Feedstock',
      deliveryMethod: 'Direct Pipeline Connection',
      timestamp: '2026-07-18T10:11:00Z',
    },
    {
      id: 'GB-H2-4410',
      supplierId: 'caledonian-green',
      supplierName: 'Caledonian Green Hydrogen',
      quantityKg: 3500,
      deliveryDate: '2026-07-28',
      destinationHub: 'Shetland Marine Bunker Depot',
      destinationRegion: 'scotland-north',
      status: 'Offered',
      quotePricePerKg: 6.85,
      totalCost: 23975,
      purityRequired: '99.999% Ultra-Pure (Fuel Cell)',
      deliveryMethod: 'Road Tanker (Liquid)',
      timestamp: '2026-07-19T08:30:00Z',
    },
    {
      id: 'GB-H2-1102',
      supplierId: 'sizewell-pink',
      supplierName: 'Sizewell Pink H2',
      quantityKg: 8000,
      deliveryDate: '2026-08-02',
      destinationHub: 'Port Talbot Decarbonization Plant',
      destinationRegion: 'wales',
      status: 'Pending Quote',
      quotePricePerKg: 5.80,
      totalCost: 46400,
      purityRequired: '99.99% High-Pure Logistics',
      deliveryMethod: 'Tube Trailer (Gaseous)',
      timestamp: '2026-07-19T11:45:00Z',
    }
  ]);

  // Show auto-dismissable toast alerts
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle watchlist items
  const handleToggleWatchlist = (supplierId: string) => {
    if (watchlistIds.includes(supplierId)) {
      setWatchlistIds(watchlistIds.filter(id => id !== supplierId));
      triggerToast('Removed supplier from procurement watchlist.');
    } else {
      setWatchlistIds([...watchlistIds, supplierId]);
      triggerToast('Added supplier to preferred watchlist.');
    }
  };

  // Change shipment status (Procurement simulator)
  const handleChangeRequestStatus = (id: string, newStatus: DeliveryRequest['status']) => {
    setDeliveryRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    }));
    triggerToast(`Shipment ${id} updated to [${newStatus.toUpperCase()}]`);
  };

  // Handle new delivery request submission from wizard modal
  const handleCreateDeliveryRequest = (formData: {
    quantityKg: number;
    deliveryDate: string;
    destinationHub: string;
    destinationRegion: string;
    purityRequired: string;
    deliveryMethod: string;
  }) => {
    if (!activeQuoteSupplier) return;

    const newRequest: DeliveryRequest = {
      id: `GB-H2-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: activeQuoteSupplier.id,
      supplierName: activeQuoteSupplier.name,
      quantityKg: formData.quantityKg,
      deliveryDate: formData.deliveryDate,
      destinationHub: formData.destinationHub,
      destinationRegion: formData.destinationRegion,
      status: 'Pending Quote',
      quotePricePerKg: activeQuoteSupplier.pricingIndicative,
      totalCost: formData.quantityKg * activeQuoteSupplier.pricingIndicative,
      purityRequired: formData.purityRequired,
      deliveryMethod: formData.deliveryMethod,
      timestamp: new Date().toISOString(),
    };

    setDeliveryRequests([newRequest, ...deliveryRequests]);
    setActiveQuoteSupplier(null);
    setActiveTab('dashboard'); // Redirect to dashboard to monitor request
    triggerToast('Secure procurement request sent to the National Grid Scheduler.');
  };

  // Copy API access key
  const handleCopyCode = () => {
    setCopiedCode(true);
    navigator.clipboard.writeText('curl -X GET "https://api.hydrogrid.org.uk/v1/spot-prices" \\\n  -H "Authorization: Bearer hg_live_77a8e21bc0b4"');
    setTimeout(() => setCopiedCode(false), 2000);
    triggerToast('API Code Snippet copied to clipboard.');
  };

  return (
    <div id="hydrogrid-app-shell" className="min-h-screen bg-brand-navy text-brand-stone flex flex-col justify-between font-sans relative">
      
      {/* Background blueprint grid styling overlays */}
      <div className="absolute inset-0 grid-blueprint pointer-events-none z-0 opacity-40"></div>
      
      {/* Exquisite Top-Bar National Header (Sophisticated Dark Style) */}
      <header className="border-b border-white/10 bg-brand-navy sticky top-0 z-40">
        
        {/* Upper mini control strip */}
        <div className="border-b border-white/10 px-8 py-2 flex flex-wrap justify-between items-center text-[10px] font-mono text-brand-steel gap-2 bg-[#05080F]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-racing animate-pulse"></span>
              UK_H2_SYSTEM: SECURE / ONLINE
            </span>
            <span>INDEX REVISION: V2026.07</span>
            <span>CURRENT TIME: 2026-07-19 12:11 UTC</span>
          </div>
          <div className="flex items-center gap-4">
            <span>OFF-TAKE STANDARDS: DESNZ_LOW_CARBON_V4</span>
            <span className="text-white hover:underline cursor-help">SYSTEM STATUS: OPERATIONAL // NOMINAL</span>
          </div>
        </div>

        {/* Main Navigation Row */}
        <div className="px-8 py-4 flex flex-wrap justify-between items-center gap-6 h-16">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 bg-brand-racing flex items-center justify-center font-bold text-xs border border-white/20 text-white">
              HG
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tighter leading-none text-white">HYDROGRID BRITAIN</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-brand-racing font-bold">Britain's Hydrogen Marketplace</span>
            </div>
          </div>

          {/* Navigation links (Sophisticated Dark aesthetic) */}
          <nav className="flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-widest font-medium opacity-90">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition uppercase cursor-pointer ${activeTab === 'home' ? 'text-brand-gold font-bold' : 'text-brand-stone hover:text-brand-gold'}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`transition uppercase cursor-pointer ${activeTab === 'market' ? 'text-brand-gold font-bold' : 'text-brand-stone hover:text-brand-gold'}`}
            >
              Market
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`transition uppercase cursor-pointer ${activeTab === 'suppliers' ? 'text-brand-gold font-bold' : 'text-brand-stone hover:text-brand-gold'}`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition uppercase cursor-pointer ${activeTab === 'dashboard' ? 'text-brand-gold font-bold' : 'text-brand-stone hover:text-brand-gold'}`}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`transition uppercase cursor-pointer ${activeTab === 'news' ? 'text-brand-gold font-bold' : 'text-brand-stone hover:text-brand-gold'}`}
            >
              Intelligence
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`transition uppercase cursor-pointer ${activeTab === 'api' ? 'text-brand-gold font-bold' : 'text-brand-stone hover:text-brand-gold'}`}
            >
              API Console
            </button>
          </nav>

          {/* Primary CTA */}
          <button
            onClick={() => {
              setActiveQuoteSupplier(SUPPLIERS[0]);
            }}
            className="px-6 py-2 bg-brand-racing hover:bg-brand-racing/80 border border-white/20 transition font-sans text-[11px] text-white font-bold rounded-none uppercase tracking-widest hidden md:block"
          >
            Instant Quote
          </button>

        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10 space-y-8">
        
        {/* Dynamic global warning/alert banner if applicable */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-brand-graphite border border-brand-gold text-white px-4 py-3 rounded-none font-mono text-xs flex justify-between items-center gap-4 shadow-xl max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></span>
                <span>GRID ADVISORY: {toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-brand-steel hover:text-white cursor-pointer">[DISMISS]</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Routing views */}
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: HOME PAGE */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12 bg-[radial-gradient(circle_at_top_right,_rgba(0,66,37,0.1)_0%,_transparent_50%)] p-4 md:p-8"
            >
              {/* Massive Sophisticated Dark Editorial Hero Section */}
              <div className="relative py-12 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                <div className="space-y-6 max-w-2xl">
                  <span className="font-mono text-xs text-brand-gold tracking-[0.3em] uppercase block">
                    HYDROGRID BRITAIN // Britain's Hydrogen Marketplace
                  </span>
                  <h2 className="font-serif italic text-6xl md:text-[90px] font-bold text-brand-stone tracking-tighter leading-[0.85] uppercase mb-4">
                    POWERING <br />
                    THE NEXT <br />
                    BRITAIN.
                  </h2>
                  <p className="text-lg font-light text-brand-stone/60 leading-relaxed max-w-md pt-2">
                    A national marketplace for hydrogen production, distribution and industrial supply. Engineered for reliability.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => setActiveTab('market')}
                      className="px-8 py-3 bg-brand-racing hover:bg-brand-racing/80 text-white text-[11px] uppercase tracking-widest font-bold rounded-none transition cursor-pointer"
                    >
                      View Market
                    </button>
                    <button
                      onClick={() => setActiveTab('suppliers')}
                      className="px-8 py-3 border border-white/20 hover:bg-white/5 text-white text-[11px] uppercase tracking-widest font-bold rounded-none transition cursor-pointer"
                    >
                      Explore Suppliers
                    </button>
                  </div>
                </div>

                {/* Live Indices Widget embedded in Hero just like the design! */}
                <div className="w-full md:w-[320px] bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Live Market Indices</h3>
                    <span className="text-[9px] opacity-40 font-mono">H-GRID/INDEX</span>
                  </div>
                  <div className="space-y-4 font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[11px] opacity-60 uppercase">TEESSIDE SPOT</span>
                      <span className="text-sm font-semibold">£3.98 /kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[11px] opacity-60 uppercase">HUMBER CLUSTER</span>
                      <span className="text-sm font-semibold">£4.12 /kg</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[11px] opacity-60 uppercase">SOUTH WALES</span>
                      <span className="text-sm font-semibold">£4.45 /kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[11px] opacity-60 uppercase">ABERDEEN HUB</span>
                      <span className="text-sm font-semibold">£3.85 /kg</span>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-brand-racing/30">
                    <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1 font-mono">Carbon Intensity</div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-white/10 overflow-hidden">
                        <div className="w-[82%] h-full bg-brand-racing"></div>
                      </div>
                      <span className="text-[10px] font-mono">LOW CI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected National Grid Map Visualiser Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-display text-2xl font-light text-white uppercase tracking-tight">
                    National Spine & Regional spot prices
                  </h3>
                  <span className="font-mono text-xs text-brand-steel">SECURE INTEGRATED SHIFT</span>
                </div>
                <InteractiveMap 
                  selectedRegionId={selectedRegionId} 
                  onSelectRegion={(id) => {
                    setSelectedRegionId(id);
                    triggerToast(`Synchronized grid monitor to ${id.toUpperCase()}`);
                  }} 
                />
              </div>

              {/* Three detailed column callouts for infrastructure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                <div className="border border-white/10 bg-white/5 p-6 rounded-none space-y-3 backdrop-blur-sm">
                  <Layers className="w-8 h-8 text-brand-gold" />
                  <h4 className="font-display text-lg font-semibold text-white uppercase">Regional Spot Trade</h4>
                  <p className="text-sm text-brand-steel leading-relaxed">
                    Compare daily indexed prices for green wind, blue reforming, and pink nuclear hydrogen across 9 national transmission nodes instantly.
                  </p>
                  <button 
                    onClick={() => setActiveTab('market')}
                    className="font-mono text-xs text-brand-gold hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    Terminal Access <CornerDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border border-white/10 bg-white/5 p-6 rounded-none space-y-3 backdrop-blur-sm">
                  <Users className="w-8 h-8 text-brand-gold" />
                  <h4 className="font-display text-lg font-semibold text-white uppercase">Certified Producers</h4>
                  <p className="text-sm text-brand-steel leading-relaxed">
                    Browse technical dossiers of state-vetted British producers with guaranteed low carbon certification, pure offtake standards and multi-region feeds.
                  </p>
                  <button 
                    onClick={() => setActiveTab('suppliers')}
                    className="font-mono text-xs text-brand-gold hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    Explore Directory <CornerDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border border-white/10 bg-white/5 p-6 rounded-none space-y-3 backdrop-blur-sm">
                  <Briefcase className="w-8 h-8 text-brand-gold" />
                  <h4 className="font-display text-lg font-semibold text-white uppercase">Procurement Workspace</h4>
                  <p className="text-sm text-brand-steel leading-relaxed">
                    Book large scale transport shipments, manage facility receiving ports, review quote offers, and monitor logistics with instant digital grid audits.
                  </p>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="font-mono text-xs text-brand-gold hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    Open Workspace <CornerDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* VIEW 2: MARKET TERMINAL */}
          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-brand-steel uppercase tracking-widest block">Bloomberg Core Terminal</span>
                <h2 className="font-display text-3xl font-light text-white tracking-tight uppercase mt-0.5">HYDROGRID SPOT EXCHANGE</h2>
              </div>
              <MarketDashboard />
            </motion.div>
          )}

          {/* VIEW 3: SUPPLIER DIRECTORY */}
          {activeTab === 'suppliers' && (
            <motion.div
              key="suppliers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-brand-steel uppercase tracking-widest block">low carbon certified producers</span>
                <h2 className="font-display text-3xl font-light text-white tracking-tight uppercase mt-0.5">BRITISH SUPPLIER ROSTER</h2>
              </div>
              <SupplierDirectory 
                onInitiateQuote={(supplier) => {
                  setActiveQuoteSupplier(supplier);
                  triggerToast(`Initiated quote calculation desk with ${supplier.name}`);
                }}
                watchlistIds={watchlistIds}
                onToggleWatchlist={handleToggleWatchlist}
              />
            </motion.div>
          )}

          {/* VIEW 4: BUYER DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-brand-steel uppercase tracking-widest block">enterprise buyer workspace</span>
                <h2 className="font-display text-3xl font-light text-white tracking-tight uppercase mt-0.5">PORT CONTRACT CONTROLS</h2>
              </div>
              <BuyerDashboard 
                watchlistIds={watchlistIds}
                onToggleWatchlist={handleToggleWatchlist}
                deliveryRequests={deliveryRequests}
                onChangeRequestStatus={handleChangeRequestStatus}
                onSelectSupplier={(supplier) => {
                  setActiveTab('suppliers');
                  triggerToast(`Loading dossier for ${supplier.name}`);
                }}
              />
            </motion.div>
          )}

          {/* VIEW 5: INTELLIGENCE & NEWS */}
          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <span className="font-mono text-xs text-brand-steel uppercase block">Financial Times Grid Intelligence</span>
                <h2 className="font-display text-3xl font-light text-white tracking-tight uppercase mt-0.5">MARKET DIGEST & NEWS</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* News feed column */}
                <div className="lg:col-span-8 space-y-6">
                  {NEWS.map((article) => (
                    <article key={article.id} className="border border-white/10 bg-brand-navy p-6 rounded-none space-y-3">
                      <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-brand-steel gap-2 border-b border-white/5 pb-2">
                        <span className="px-2 py-0.5 bg-brand-graphite rounded-none border border-white/5 text-white uppercase">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-3">
                          <span>SOURCE: {article.source.toUpperCase()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                        </div>
                      </div>

                      <h3 className="font-display text-lg text-white font-medium hover:text-brand-gold cursor-pointer transition">
                        {article.title}
                      </h3>

                      <p className="text-sm text-brand-steel leading-relaxed">
                        {article.summary}
                      </p>

                      <div className="flex justify-between items-center pt-2 text-[11px] font-mono">
                        <span className="text-brand-steel">RELEASE DATE: {new Date(article.timestamp).toLocaleDateString()}</span>
                        <a href="#news" className="text-brand-gold hover:underline flex items-center gap-1 uppercase">
                          Full Dispatch <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Right hand analysis panel */}
                <div className="lg:col-span-4 bg-brand-navy border border-white/10 rounded-none p-5 space-y-6">
                  <div>
                    <span className="font-mono text-xs text-brand-steel block uppercase">Weekly Grid Forecast</span>
                    <h4 className="font-display font-semibold text-white mt-1 uppercase">Sill Wind Outflow Impact</h4>
                    <p className="text-xs text-brand-steel leading-relaxed mt-2">
                      Offshore wind forecasts along the Shetland and Orkney coasts show strong continuous gale activity for late July. High-yield PEM electrolysis output is expected to rise by 22%, putting heavy downward price pressure on Northern Green spot tariffs.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <span className="font-mono text-xs text-brand-steel block uppercase">Regulatory Notice</span>
                    <h4 className="font-display font-semibold text-white mt-1 uppercase">Hydrogen Guarantee of Origin</h4>
                    <p className="text-xs text-brand-steel leading-relaxed mt-2">
                      New certification directives come into full legal effect across UK networks on August 1st. Suppliers must submit emission audits showing less than 1.0 kg CO2e / kg H2 to remain labeled under the official "Low Carbon Guarantee" tier.
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 font-mono text-[10px] text-brand-steel leading-relaxed">
                    GRID DESK EDITORIAL: Tom@ahyx.org <br />
                    All financial content is indicative. Market hedging strategies must consult certified National Grid transmission desks directly.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 6: DEVELOPER API PORTAL */}
          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs text-brand-steel uppercase tracking-widest block">Automated B2B Integration</span>
                <h2 className="font-display text-3xl font-light text-white tracking-tight uppercase mt-0.5">DEVELOPER PLATFORM PORTAL</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Documentation (Col: 7) */}
                <div className="lg:col-span-7 bg-brand-navy border border-white/10 rounded-none p-6 space-y-6">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-brand-gold uppercase block">Direct Node Queries</span>
                    <h3 className="font-display text-lg text-white font-medium uppercase">REST API SPECIFICATION V1.4</h3>
                    <p className="text-sm text-brand-steel leading-relaxed">
                      Hydrogrid Britain offers secure B2B REST endpoints allowing industrial ERP systems to automate hydrogen procurement, fetch live spot prices per transmission node, and download carbon intensity logs for ESG compliance reporting.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    
                    {/* Endpoint 1 */}
                    <div className="border border-white/5 bg-brand-graphite/40 p-3 rounded-none">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-brand-racing/25 border border-brand-racing text-white rounded-none text-[10px]">GET</span>
                        <code className="text-white text-[11px]">/v1/spot-prices</code>
                      </div>
                      <p className="text-brand-steel">Returns live, volume-weighted indicative spot prices for all 9 UK hydrogen transmission sectors.</p>
                    </div>

                    {/* Endpoint 2 */}
                    <div className="border border-white/5 bg-brand-graphite/40 p-3 rounded-none">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-brand-racing/25 border border-brand-racing text-white rounded-none text-[10px]">GET</span>
                        <code className="text-white text-[11px]">/v1/suppliers</code>
                      </div>
                      <p className="text-brand-steel">Lists all certified producers, active capacity metrics, available purity grades, and serves.</p>
                    </div>

                    {/* Endpoint 3 */}
                    <div className="border border-white/5 bg-brand-graphite/40 p-3 rounded-none">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-brand-gold/15 border border-brand-gold text-brand-gold rounded-none text-[10px]">POST</span>
                        <code className="text-white text-[11px]">/v1/procurements</code>
                      </div>
                      <p className="text-brand-steel">Directly submits a procurement quote request to specified supplier nodes inside the grid scheduler.</p>
                    </div>

                  </div>
                </div>

                {/* Live Sandbox Console (Col: 5) */}
                <div className="lg:col-span-5 bg-brand-navy border border-white/10 rounded-none p-6 space-y-4">
                  <span className="font-mono text-xs text-brand-steel block uppercase">LIVE TRANSMISSION TERMINAL</span>
                  
                  <div className="space-y-2 font-mono text-xs text-brand-steel">
                    <span>EXECUTE TERMINAL CLIENT (HTTPS):</span>
                    <div className="bg-brand-graphite border border-white/10 rounded-none p-3 text-white flex justify-between items-start">
                      <code className="text-[10px] break-all select-all leading-relaxed pr-2">
                        curl -X GET "https://api.hydrogrid.org.uk/v1/spot-prices" \<br />
                        &nbsp;&nbsp;-H "Authorization: Bearer hg_live_77a8e21bc0b4"
                      </code>
                      <button 
                        onClick={handleCopyCode}
                        className="text-brand-steel hover:text-white p-1 transition cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono text-xs text-brand-steel">
                    <span>MOCK JSON GRID REPSONSE:</span>
                    <div className="bg-brand-graphite/80 border border-white/10 rounded-none p-3 text-brand-steel overflow-x-auto max-h-[220px] text-[10px]">
                      <pre>{JSON.stringify({
                        status: "success",
                        timestamp: "2026-07-19T12:11:00Z",
                        transmission_grid: "UK_H2_MAIN_BACKBONE",
                        regional_spot_prices: REGIONS.map(r => ({
                          sector_id: r.id,
                          sector_name: r.name,
                          price_gbp_per_kg: r.spotPrice,
                          capacity_tonnes_day: r.productionCapacity,
                          carbon_intensity_kg_co2_per_kg: r.carbonIntensity
                        }))
                      }, null, 2)}</pre>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 font-mono text-[9px] text-brand-steel uppercase text-center">
                    API Access is governed under UK OpenGrid License V2
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Quote Booking Wizard Modal */}
      <AnimatePresence>
        {activeQuoteSupplier && (
          <DeliveryRequestModal 
            supplier={activeQuoteSupplier}
            onClose={() => setActiveQuoteSupplier(null)}
            onSubmit={handleCreateDeliveryRequest}
          />
        )}
      </AnimatePresence>

      {/* Foster + Partners Styled Editorial Footer */}
      <footer className="border-t border-white/10 bg-brand-navy/60 backdrop-blur-md py-12 px-6 mt-16 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Main info */}
          <div className="space-y-4">
            <span className="font-display font-bold text-white text-base tracking-widest block uppercase">HYDROGRID BRITAIN</span>
            <p className="text-xs text-brand-steel leading-relaxed max-w-xs">
              The official, AAA-quality digital operating marketplace for Great Britain’s clean hydrogen transmission and off-take infrastructure. Designed for Swiss precision and national reliability.
            </p>
          </div>

          {/* Core Hub links */}
          <div className="space-y-3 font-mono text-xs text-brand-steel">
            <span className="text-white font-semibold uppercase block">MARKET LINKS</span>
            <ul className="space-y-1.5">
              <li><button onClick={() => setActiveTab('market')} className="hover:text-white uppercase">[ Spot Price Terminal ]</button></li>
              <li><button onClick={() => setActiveTab('suppliers')} className="hover:text-white uppercase">[ Low-Carbon Roster ]</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-white uppercase">[ Intake Facility Portals ]</button></li>
              <li><button onClick={() => setActiveTab('news')} className="hover:text-white uppercase">[ Financial Intelligence ]</button></li>
            </ul>
          </div>

          {/* Grid Regulatory details */}
          <div className="space-y-3 font-mono text-xs text-brand-steel">
            <span className="text-white font-semibold uppercase block">REGULATION & POLICY</span>
            <ul className="space-y-1.5">
              <li><a href="#rules" className="hover:text-white uppercase">[ DESNZ Hydrogen Strategy ]</a></li>
              <li><a href="#rules" className="hover:text-white uppercase">[ Low Carbon H2 Standard v2 ]</a></li>
              <li><a href="#rules" className="hover:text-white uppercase">[ National Pipeline spine plan ]</a></li>
              <li><a href="#rules" className="hover:text-white uppercase">[ Salt Cavern buffer acts ]</a></li>
            </ul>
          </div>

          {/* National system status credits */}
          <div className="space-y-3 font-mono text-xs text-brand-steel">
            <span className="text-white font-semibold uppercase block">NATIONAL SYSTEM STATS</span>
            <p className="text-xs leading-relaxed">
              OPERATED BY THE JOINT CORRIDOR COMMITTEE <br />
              REGISTERED OFFICE: 10 SEVERN SPINE WAY, BRISTOL, UK. <br />
              GRID REFS: BSI-14001 // ISO-50001
            </p>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em] font-medium text-brand-steel/60 gap-4">
          <div>© 2026 HydroGrid Britain — National Strategic Asset</div>
          <div>Connected Producers: 142 // Active Industrial Clusters: 09</div>
          <div>Official Digital Marketplace</div>
        </div>

      </footer>

    </div>
  );
}
