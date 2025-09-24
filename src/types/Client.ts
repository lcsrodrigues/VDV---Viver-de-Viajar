export interface Client {
  id: string;
  name: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  pointsBalance: number;
  milesBalance: number;
}

