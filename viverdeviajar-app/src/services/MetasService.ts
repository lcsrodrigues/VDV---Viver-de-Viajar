import { BaseService } from './BaseService';
import { Meta } from '../types/Meta';

const initialMetas: Meta[] = [
  {
    id: '1',
    programas: 'Smiles',
    quantidadeNecessaria: 100000,
    quantidadeAtual: 75000,
  },
  {
    id: '2',
    programas: 'Livelo',
    quantidadeNecessaria: 50000,
    quantidadeAtual: 25000,
  },
  {
    id: '3',
    programas: 'Latam Pass',
    quantidadeNecessaria: 120000,
    quantidadeAtual: 100000,
  },
  {
    id: '4',
    programas: 'TudoAzul',
    quantidadeNecessaria: 80000,
    quantidadeAtual: 60000,
  },
];

export const metasService = new BaseService<Meta>('metas', initialMetas);

