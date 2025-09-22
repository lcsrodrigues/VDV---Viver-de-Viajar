import { BaseService } from './BaseService';
import { Movimentacao } from '../types/Movimentacao';

const initialMovimentacoes: Movimentacao[] = [
  {
    id: '1',
    data: '2025-09-20',
    moedaDigital: 'Milhas',
    quantidade: 10000,
    programaId: '1', // Smiles
    tipoOperacao: 'Compra',
    lojaId: '1', // Amazon
    clValorProduto: 500,
    clFator: '10x1',
    clProduto: 'Produto A',
    valor: 200,
    valorDesconto: 0,
    valorInvestido: 200,
    totalEconomia: 300,
  },
  {
    id: '2',
    data: '2025-09-19',
    moedaDigital: 'Pontos',
    quantidade: 5000,
    programaId: '3', // Livelo
    tipoOperacao: 'Venda',
    lojaId: '5', // Decolar
    clValorProduto: 0,
    clFator: '',
    clProduto: '',
    valor: 150,
    valorDesconto: 0,
    valorInvestido: 0,
    totalEconomia: 0,
  },
  {
    id: '3',
    data: '2025-09-18',
    moedaDigital: 'Milhas',
    quantidade: 20000,
    programaId: '2', // Latam Pass
    tipoOperacao: 'Bônus',
    lojaId: undefined,
    clValorProduto: undefined,
    clFator: undefined,
    clProduto: undefined,
    valor: undefined,
    valorDesconto: undefined,
    valorInvestido: undefined,
    totalEconomia: undefined,
  },
  {
    id: '4',
    data: '2025-09-17',
    moedaDigital: 'Cashback',
    quantidade: 50,
    programaId: '5', // Méliuz
    tipoOperacao: 'Compra Inteligente',
    lojaId: '2', // Magazine Luiza
    clValorProduto: 1000,
    clFator: '5%',
    clProduto: 'Produto B',
    valor: 950,
    valorDesconto: 50,
    valorInvestido: 950,
    totalEconomia: 50,
  },
  {
    id: '5',
    data: '2025-09-16',
    moedaDigital: 'Milhas',
    quantidade: 7000,
    programaId: '1', // Smiles
    tipoOperacao: 'Transferência',
    lojaId: undefined,
    clValorProduto: undefined,
    clFator: undefined,
    clProduto: undefined,
    valor: undefined,
    valorDesconto: undefined,
    valorInvestido: undefined,
    totalEconomia: undefined,
  },
  {
    id: '6',
    data: '2025-09-15',
    moedaDigital: 'Pontos',
    quantidade: 3000,
    programaId: '4', // Esfera
    tipoOperacao: 'Ajuste',
    lojaId: undefined,
    clValorProduto: undefined,
    clFator: undefined,
    clProduto: undefined,
    valor: undefined,
    valorDesconto: undefined,
    valorInvestido: undefined,
    totalEconomia: undefined,
  },
  {
    id: '7',
    data: '2025-09-14',
    moedaDigital: 'Milhas',
    quantidade: 12000,
    programaId: '7', // TudoAzul
    tipoOperacao: 'Compra',
    lojaId: '6', // CVC
    clValorProduto: 600,
    clFator: '10x1',
    clProduto: 'Pacote Viagem',
    valor: 250,
    valorDesconto: 0,
    valorInvestido: 250,
    totalEconomia: 350,
  },
  {
    id: '8',
    data: '2025-09-13',
    moedaDigital: 'Pontos',
    quantidade: 8000,
    programaId: '3', // Livelo
    tipoOperacao: 'Troca',
    lojaId: '3', // Casas Bahia
    clValorProduto: 400,
    clFator: '1x1',
    clProduto: 'Geladeira',
    valor: 0,
    valorDesconto: 0,
    valorInvestido: 0,
    totalEconomia: 0,
  },
  {
    id: '9',
    data: '2025-09-12',
    moedaDigital: 'Milhas',
    quantidade: 9000,
    programaId: '2', // Latam Pass
    tipoOperacao: 'Venda',
    lojaId: '7', // Booking.com
    clValorProduto: 0,
    clFator: '',
    clProduto: '',
    valor: 200,
    valorDesconto: 0,
    valorInvestido: 0,
    totalEconomia: 0,
  },
  {
    id: '10',
    data: '2025-09-11',
    moedaDigital: 'Milhas',
    quantidade: 15000,
    programaId: '1', // Smiles
    tipoOperacao: 'Bônus',
    lojaId: undefined,
    clValorProduto: undefined,
    clFator: undefined,
    clProduto: undefined,
    valor: undefined,
    valorDesconto: undefined,
    valorInvestido: undefined,
    totalEconomia: undefined,
  },
];

export const movimentacoesService = new BaseService<Movimentacao>('movimentacoes', initialMovimentacoes);

