/**
 * SharePoint Column Mapping Configuration
 * 
 * This file contains the mapping between the application's data models
 * and SharePoint list columns for future integration.
 */

export const SharePointColumnMapping = {
  // Programas List Mapping
  Programas: {
    listName: 'Programas',
    columns: {
      id: 'ID',
      programa: 'Title', // SharePoint default title column
      tipoPrograma: 'TipoPrograma', // Choice: Milhas, Pontos, Cashback
      subTipoPrograma: 'SubTipoPrograma', // Choice: Aéreo, Bancário, Marketplace, Cartão
      valor: 'Valor' // Single line of text
    }
  },

  // Produtos List Mapping
  Produtos: {
    listName: 'Produtos',
    columns: {
      id: 'ID',
      titulo: 'Title' // SharePoint default title column
    }
  },

  // Lojas List Mapping
  Lojas: {
    listName: 'Lojas',
    columns: {
      id: 'ID',
      titulo: 'Title' // SharePoint default title column
    }
  },

  // Metas List Mapping
  Metas: {
    listName: 'Metas',
    columns: {
      id: 'ID',
      programas: 'Programas', // Single line of text
      quantidadeNecessaria: 'QuantidadeNecessaria', // Number
      quantidadeAtual: 'QuantidadeAtual' // Number
    }
  },

  // Movimentacoes List Mapping
  Movimentacoes: {
    listName: 'Movimentacoes',
    columns: {
      id: 'ID',
      data: 'Data', // Date and Time (stored as text in current implementation)
      moedaDigital: 'MoedaDigital', // Choice: Milhas, Pontos, Dinheiro, Cupom
      quantidade: 'Quantidade', // Number
      programaId: 'ProgramaId', // Lookup to Programas list
      tipoOperacao: 'TipoOperacao', // Choice: Compra, Venda, Transferência, Troca, Compra Inteligente, Bônus, Ajuste
      lojaId: 'LojaId', // Lookup to Lojas list
      clValorProduto: 'CL_ValorProduto', // Number
      clFator: 'CL_Fator', // Single line of text
      clProduto: 'CL_Produto', // Single line of text
      valor: 'Valor', // Number (currency)
      valorDesconto: 'ValorDesconto', // Number (currency)
      valorInvestido: 'ValorInvestido', // Number (currency)
      totalEconomia: 'TotalEconomia' // Number (currency)
    }
  },

  // Cotacao List Mapping
  Cotacao: {
    listName: 'Cotacao',
    columns: {
      id: 'ID',
      descricao: 'Descricao', // Single line of text
      data: 'Data', // Date and Time
      tipoCotacao: 'TipoCotacao', // Choice: Emissão, Simulação, Reemissão
      valorDasMilhas: 'ValorDasMilhas', // Number
      valorPagante: 'ValorPagante', // Number (currency)
      economia: 'Economia', // Number (currency)
      passagemEmitida: 'PassagemEmitida', // Yes/No
      taxaPorTipo: 'TaxaPorTipo', // Number (currency)
      mes: 'Mes', // Single line of text (e.g., "2025-09")
      quantidadeCotacao: 'QuantidadeCotacao', // Number
      respNao: 'RespNao', // Number (legacy field)
      taxaExtra: 'TaxaExtra', // Number (currency)
      taxaServico: 'TaxaServico', // Number (currency)
      valorAgregado: 'ValorAgregado' // Number (currency)
    }
  }
};

/**
 * SharePoint REST API Helper Functions
 * 
 * These functions will help with future SharePoint integration
 * using Microsoft Graph API or SharePoint REST API.
 */

export class SharePointService {
  private baseUrl: string;
  private accessToken: string;

  constructor(siteUrl: string, accessToken: string) {
    this.baseUrl = `${siteUrl}/_api/web/lists`;
    this.accessToken = accessToken;
  }

  /**
   * Get headers for SharePoint REST API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
      'Authorization': `Bearer ${this.accessToken}`,
      'X-RequestDigest': '', // Will need to be obtained from SharePoint
    };
  }

  /**
   * Generic method to get items from a SharePoint list
   */
  async getListItems(listName: string, select?: string, filter?: string): Promise<any[]> {
    let url = `${this.baseUrl}/getbytitle('${listName}')/items`;
    
    const params = new URLSearchParams();
    if (select) params.append('$select', select);
    if (filter) params.append('$filter', filter);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.d.results;
  }

  /**
   * Generic method to create an item in a SharePoint list
   */
  async createListItem(listName: string, itemData: any): Promise<any> {
    const url = `${this.baseUrl}/getbytitle('${listName}')/items`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.d;
  }

  /**
   * Generic method to update an item in a SharePoint list
   */
  async updateListItem(listName: string, itemId: string, itemData: any): Promise<any> {
    const url = `${this.baseUrl}/getbytitle('${listName}')/items(${itemId})`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE'
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.statusText}`);
    }

    return response.status === 204; // No content on successful update
  }

  /**
   * Generic method to delete an item from a SharePoint list
   */
  async deleteListItem(listName: string, itemId: string): Promise<boolean> {
    const url = `${this.baseUrl}/getbytitle('${listName}')/items(${itemId})`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.getHeaders(),
        'IF-MATCH': '*'
      }
    });

    if (!response.ok) {
      throw new Error(`SharePoint API error: ${response.statusText}`);
    }

    return response.status === 200;
  }
}

/**
 * Data transformation utilities for SharePoint integration
 */
export const SharePointTransformers = {
  /**
   * Transform application data to SharePoint format
   */
  toSharePoint: {
    movimentacao: (data: any) => ({
      Title: `${data.tipoOperacao} - ${data.quantidade}`,
      Data: data.data,
      MoedaDigital: data.moedaDigital,
      Quantidade: data.quantidade,
      ProgramaId: data.programaId,
      TipoOperacao: data.tipoOperacao,
      LojaId: data.lojaId,
      CL_ValorProduto: data.clValorProduto,
      CL_Fator: data.clFator,
      CL_Produto: data.clProduto,
      Valor: data.valor,
      ValorDesconto: data.valorDesconto,
      ValorInvestido: data.valorInvestido,
      TotalEconomia: data.totalEconomia
    }),

    cotacao: (data: any) => ({
      Title: data.descricao,
      Descricao: data.descricao,
      Data: data.data,
      TipoCotacao: data.tipoCotacao,
      ValorDasMilhas: data.valorDasMilhas,
      ValorPagante: data.valorPagante,
      Economia: data.economia,
      PassagemEmitida: data.passagemEmitida,
      TaxaPorTipo: data.taxaPorTipo,
      Mes: data.mes,
      QuantidadeCotacao: data.quantidadeCotacao,
      RespNao: data.respNao,
      TaxaExtra: data.taxaExtra,
      TaxaServico: data.taxaServico,
      ValorAgregado: data.valorAgregado
    })
  },

  /**
   * Transform SharePoint data to application format
   */
  fromSharePoint: {
    movimentacao: (spData: any) => ({
      id: spData.ID.toString(),
      data: spData.Data,
      moedaDigital: spData.MoedaDigital,
      quantidade: spData.Quantidade,
      programaId: spData.ProgramaId,
      tipoOperacao: spData.TipoOperacao,
      lojaId: spData.LojaId,
      clValorProduto: spData.CL_ValorProduto,
      clFator: spData.CL_Fator,
      clProduto: spData.CL_Produto,
      valor: spData.Valor,
      valorDesconto: spData.ValorDesconto,
      valorInvestido: spData.ValorInvestido,
      totalEconomia: spData.TotalEconomia
    }),

    cotacao: (spData: any) => ({
      id: spData.ID.toString(),
      descricao: spData.Descricao,
      data: spData.Data,
      tipoCotacao: spData.TipoCotacao,
      valorDasMilhas: spData.ValorDasMilhas,
      valorPagante: spData.ValorPagante,
      economia: spData.Economia,
      passagemEmitida: spData.PassagemEmitida,
      taxaPorTipo: spData.TaxaPorTipo,
      mes: spData.Mes,
      quantidadeCotacao: spData.QuantidadeCotacao,
      respNao: spData.RespNao,
      taxaExtra: spData.TaxaExtra,
      taxaServico: spData.TaxaServico,
      valorAgregado: spData.ValorAgregado
    })
  }
};

/**
 * Instructions for SharePoint Integration
 * 
 * To integrate with SharePoint:
 * 
 * 1. Create SharePoint lists with the column names specified in SharePointColumnMapping
 * 2. Set up authentication (Azure AD app registration)
 * 3. Replace the mock services with SharePoint services using the SharePointService class
 * 4. Use the transformers to convert data between application and SharePoint formats
 * 5. Handle lookup fields properly (ProgramaId, LojaId) by creating relationships
 * 6. Implement proper error handling and retry logic
 * 7. Consider caching strategies for better performance
 * 8. Test thoroughly with SharePoint Online or SharePoint Server
 */

