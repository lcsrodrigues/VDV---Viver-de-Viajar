import { BaseService } from './BaseService';
import { Produto } from '../types/Produto';

const initialProdutos: Produto[] = [
  { id: '1', titulo: 'Passagem Aérea' },
  { id: '2', titulo: 'Hospedagem' },
  { id: '3', titulo: 'Aluguel de Carro' },
  { id: '4', titulo: 'Eletrônicos' },
  { id: '5', titulo: 'Eletrodomésticos' },
  { id: '6', titulo: 'Viagem Nacional' },
  { id: '7', titulo: 'Viagem Internacional' },
  { id: '8', titulo: 'Serviços Financeiros' },
];

export const produtosService = new BaseService<Produto>('produtos', initialProdutos);

