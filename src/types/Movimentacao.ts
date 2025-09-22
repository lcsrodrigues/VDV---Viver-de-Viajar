export type Movimentacao = {
  id: string;
  data: string; // ISO string e.g., "2025-09-21"
  moedaDigital: 'Milhas' | 'Pontos' | 'Dinheiro' | 'Cupom' | 'Cashback';
  quantidade: number;
  programaId: string; // lookup Programas
  tipoOperacao: 'Compra' | 'Venda' | 'Transferência' | 'Troca' | 'Compra Inteligente' | 'Bônus' | 'Ajuste';
  lojaId?: string; // lookup Lojas
  clValorProduto?: number;
  clFator?: string;
  clProduto?: string;
  valor?: number; // valor pago/recebido em dinheiro
  valorDesconto?: number;
  valorInvestido?: number;
  totalEconomia?: number;
};

