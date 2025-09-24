export interface Cotacao {
  id: string;
  clientId: string; // Relates to Client.id
  contractId: string; // Relates to Contract.id
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  status: 'pending' | 'quoted' | 'booked' | 'cancelled';
  estimatedValue?: number;
  milesUsed?: number;
  notes?: string;
}

