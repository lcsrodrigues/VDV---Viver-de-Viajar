import { BaseService } from './BaseService';
import { Program } from '../types/Program';

const initialPrograms: Program[] = [
  {
    id: '1',
    programa: 'Smiles',
    tipoPrograma: 'Milhas',
    subTipoPrograma: 'Aéreo',
    valor: '1000 milhas = R$ 20,00',
  },
  {
    id: '2',
    programa: 'Latam Pass',
    tipoPrograma: 'Milhas',
    subTipoPrograma: 'Aéreo',
    valor: '1000 milhas = R$ 25,00',
  },
  {
    id: '3',
    programa: 'Livelo',
    tipoPrograma: 'Pontos',
    subTipoPrograma: 'Bancário',
    valor: '1 ponto = R$ 0,03',
  },
  {
    id: '4',
    programa: 'Esfera',
    tipoPrograma: 'Pontos',
    subTipoPrograma: 'Bancário',
    valor: '1 ponto = R$ 0,025',
  },
  {
    id: '5',
    programa: 'Méliuz',
    tipoPrograma: 'Cashback',
    subTipoPrograma: 'Marketplace',
    valor: '1% de volta',
  },
  {
    id: '6',
    programa: 'Nubank Rewards',
    tipoPrograma: 'Pontos',
    subTipoPrograma: 'Cartão',
    valor: '100 pontos = R$ 1,00',
  },
  {
    id: '7',
    programa: 'TudoAzul',
    tipoPrograma: 'Milhas',
    subTipoPrograma: 'Aéreo',
    valor: '1000 milhas = R$ 18,00',
  },
  {
    id: '8',
    programa: 'Itaú Pontos',
    tipoPrograma: 'Pontos',
    subTipoPrograma: 'Bancário',
    valor: '1 ponto = R$ 0,02',
  },
];

export const programasService = new BaseService<Program>('programas', initialPrograms);

