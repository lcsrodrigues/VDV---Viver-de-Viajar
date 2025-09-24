export interface Contract {
  id: string;
  contractNumber: string;
  clientId: string; // Relates to Client.id
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'expired';
  serviceType: 'gestao_milhas' | 'consultoria' | 'premium' | 'basico';
  monthlyFee: number;
  commissionRate: number; // Percentage
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
