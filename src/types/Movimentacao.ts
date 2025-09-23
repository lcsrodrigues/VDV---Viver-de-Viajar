export interface Movimentacao {
  id: string;
  clientId: string; // Relates to Client.id
  type: 'compra' | 'venda' | 'transferencia' | 'bonus' | 'ajuste' | 'troca';
  program: string;
  quantity: number;
  value: number;
  date: string;
  description?: string;
}

