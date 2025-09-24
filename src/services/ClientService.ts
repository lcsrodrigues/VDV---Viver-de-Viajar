import { Client } from '../types/Client';
import { BaseService } from './BaseService';

const initialClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    contractNumber: 'C001',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    status: 'active',
    pointsBalance: 15000,
    milesBalance: 250000,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    contractNumber: 'C002',
    startDate: '2024-03-15',
    endDate: '2025-03-15',
    status: 'active',
    pointsBalance: 8000,
    milesBalance: 120000,
  },
  {
    id: '3',
    name: 'Pedro Souza',
    contractNumber: 'C003',
    startDate: '2024-06-01',
    endDate: '2025-06-01',
    status: 'inactive',
    pointsBalance: 0,
    milesBalance: 0,
  },
];

export const clientService = new BaseService<Client>('clients', initialClients);


