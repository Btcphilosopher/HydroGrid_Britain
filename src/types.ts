/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegionalStats {
  id: string;
  name: string;
  spotPrice: number; // £/kg
  priceTrend: 'up' | 'down' | 'stable';
  productionCapacity: number; // tonnes/day
  storageLevel: number; // %
  pipelineStatus: 'Operational' | 'Nominal' | 'Maintenance' | 'Expanding';
  demandForecast: number; // tonnes/day
  carbonIntensity: number; // kg CO2e / kg H2
}

export interface Supplier {
  id: string;
  name: string;
  type: 'Green' | 'Blue' | 'Pink'; // Green: Electrolysis, Blue: Carbon Capture Reforming, Pink: Nuclear Electrolysis
  logoUrl?: string;
  description: string;
  location: string;
  capacityTonnesDay: number;
  regionsServed: string[];
  certifications: string[];
  emissionIntensity: number; // kg CO2e/kg H2
  pricingIndicative: number; // £/kg
  purityGrade: string; // e.g. "99.999% Ultra-Pure (Fuel Cell)"
  deliveryOptions: string[]; // e.g. ["Pipeline", "Road Tanker", "Tube Trailer"]
  contactEmail: string;
  contactPhone: string;
  overview: string;
  infrastructureProjects: string[];
  sustainabilityRating: string; // e.g. "A+", "AA", "AAA"
}

export interface DeliveryRequest {
  id: string;
  supplierId: string;
  supplierName: string;
  quantityKg: number;
  deliveryDate: string;
  destinationHub: string;
  destinationRegion: string;
  status: 'Pending Quote' | 'Offered' | 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
  quotePricePerKg: number;
  totalCost: number;
  purityRequired: string;
  deliveryMethod: string;
  timestamp: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  category: 'Infrastructure' | 'Market' | 'Regulation' | 'Technology';
  timestamp: string;
  summary: string;
  readTime: string;
}

export interface UserWatchlist {
  supplierIds: string[];
  regionIds: string[];
}
