export type Cotacao = {
  id: string;
  descricao: string;
  data: string; // ISO string for Date
  tipoCotacao: 'Emissão' | 'Simulação' | 'Reemissão';
  valorDasMilhas: number;
  valorPagante: number;
  economia: number;
  passagemEmitida: boolean;
  taxaPorTipo: number;
  mes: string; // e.g., "2025-09"
  quantidadeCotacao: number;
  respNao: number; // campo legado
  taxaExtra: number;
  taxaServico: number;
  valorAgregado: number;
};

