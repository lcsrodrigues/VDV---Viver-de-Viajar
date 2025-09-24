import { Contract } from '../types/Contract';
import { BaseService } from './BaseService';

const initialContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'VDV-2024-001',
    clientId: '1',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    status: 'active',
    serviceType: 'gestao_milhas',
    monthlyFee: 299.90,
    commissionRate: 5.0,
    notes: 'Cliente premium com gestão completa de milhas',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    contractNumber: 'VDV-2024-002',
    clientId: '2',
    startDate: '2024-03-15',
    endDate: '2025-03-15',
    status: 'active',
    serviceType: 'consultoria',
    monthlyFee: 149.90,
    commissionRate: 3.0,
    notes: 'Consultoria mensal para otimização de milhas',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '3',
    contractNumber: 'VDV-2024-003',
    clientId: '3',
    startDate: '2024-06-01',
    endDate: '2025-06-01',
    status: 'suspended',
    serviceType: 'basico',
    monthlyFee: 99.90,
    commissionRate: 2.0,
    notes: 'Contrato suspenso por falta de pagamento',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z',
  },
];

export const contractService = new BaseService<Contract>('contracts', initialContracts);
