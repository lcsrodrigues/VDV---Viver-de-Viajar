export interface Cotacao {
  id: string;
  clientId: string; // Relates to Client.id
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  status: 'pending' | 'quoted' | 'booked' | 'cancelled';
  notes?: string;
}

