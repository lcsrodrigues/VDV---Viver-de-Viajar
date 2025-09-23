import { Movimentacao } from '../types/Movimentacao';
import { BaseService } from './BaseService';

const initialMovimentacoes: Movimentacao[] = [
  {
    id: '1',
    clientId: '1',
    type: 'compra',
    program: 'Smiles',
    quantity: 10000,
    value: 200,
    date: '2025-09-20',
    description: 'Compra de milhas na Amazon',
  },
  {
    id: '2',
    clientId: '2',
    type: 'venda',
    program: 'Livelo',
    quantity: 5000,
    value: 150,
    date: '2025-09-19',
    description: 'Venda de pontos para Decolar',
  },
  {
    id: '3',
    clientId: '1',
    type: 'bonus',
    program: 'Latam Pass',
    quantity: 20000,
    value: 0,
    date: '2025-09-18',
    description: 'Bônus de transferência de cartão',
  },
];

export const movimentacaoService = new BaseService<Movimentacao>('movimentacoes', initialMovimentacoes);


