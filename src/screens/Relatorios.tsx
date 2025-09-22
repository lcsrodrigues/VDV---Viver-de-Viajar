import React, { useEffect, useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../components/Button';
import { CardKPI } from '../components/CardKPI';
import { movimentacoesService } from '../services/MovimentacoesService';
import { cotacaoService } from '../services/CotacaoService';
import { programasService } from '../services/ProgramasService';
import { lojasService } from '../services/LojasService';
import { Movimentacao } from '../types/Movimentacao';
import { Cotacao } from '../types/Cotacao';
import { Program } from '../types/Program';
import { Loja } from '../types/Loja';
import { exportToCSV } from '../utils/csvExport';

export const Relatorios: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [programas, setProgramas] = useState<Program[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState('2025-09');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [reportType, setReportType] = useState<'movimentacoes' | 'cotacoes'>('movimentacoes');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movData, cotData, progData, lojaData] = await Promise.all([
          movimentacoesService.list(),
          cotacaoService.list(),
          programasService.list(),
          lojasService.list()
        ]);
        setMovimentacoes(movData);
        setCotacoes(cotData);
        setProgramas(progData);
        setLojas(lojaData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProgramaName = (programaId: string) => {
    return programas.find(p => p.id === programaId)?.programa || 'N/A';
  };

  const getLojaName = (lojaId?: string) => {
    if (!lojaId) return 'N/A';
    return lojas.find(l => l.id === lojaId)?.titulo || 'N/A';
  };

  // Filter data based on selected filters
  const getFilteredMovimentacoes = () => {
    return movimentacoes.filter(mov => {
      const periodMatch = !selectedPeriod || mov.data.startsWith(selectedPeriod);
      const programMatch = !selectedProgram || mov.programaId === selectedProgram;
      return periodMatch && programMatch;
    });
  };

  const getFilteredCotacoes = () => {
    return cotacoes.filter(cot => {
      const periodMatch = !selectedPeriod || cot.mes === selectedPeriod;
      return periodMatch;
    });
  };

  // Calculate summary statistics
  const filteredMovimentacoes = getFilteredMovimentacoes();
  const filteredCotacoes = getFilteredCotacoes();

  const totalMovimentacoes = filteredMovimentacoes.length;
  const totalCotacoes = filteredCotacoes.length;
  const totalQuantidade = filteredMovimentacoes.reduce((sum, mov) => sum + mov.quantidade, 0);
  const totalEconomia = filteredMovimentacoes.reduce((sum, mov) => sum + (mov.totalEconomia || 0), 0) +
                       filteredCotacoes.reduce((sum, cot) => sum + cot.economia, 0);

  const handleDownloadMovimentacoes = () => {
    const data = filteredMovimentacoes.map(mov => ({
      'Data': new Date(mov.data).toLocaleDateString('pt-BR'),
      'Programa': getProgramaName(mov.programaId),
      'Tipo de Operação': mov.tipoOperacao,
      'Quantidade': mov.quantidade,
      'Moeda Digital': mov.moedaDigital,
      'Loja': getLojaName(mov.lojaId),
      'Valor': mov.valor || 0,
      'Valor Investido': mov.valorInvestido || 0,
      'Total Economia': mov.totalEconomia || 0,
      'CL Produto': mov.clProduto || '',
      'CL Fator': mov.clFator || '',
      'CL Valor Produto': mov.clValorProduto || 0,
      'Valor Desconto': mov.valorDesconto || 0
    }));

    const filename = `movimentacoes_${selectedPeriod || 'todos'}_${selectedProgram ? getProgramaName(selectedProgram) : 'todos'}_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(data, filename);
  };

  const handleDownloadCotacoes = () => {
    const data = filteredCotacoes.map(cot => ({
      'Data': new Date(cot.data).toLocaleDateString('pt-BR'),
      'Descrição': cot.descricao,
      'Tipo de Cotação': cot.tipoCotacao,
      'Valor das Milhas': cot.valorDasMilhas,
      'Valor Pagante': cot.valorPagante,
      'Economia': cot.economia,
      'Passagem Emitida': cot.passagemEmitida ? 'Sim' : 'Não',
      'Taxa por Tipo': cot.taxaPorTipo,
      'Mês': cot.mes,
      'Quantidade Cotação': cot.quantidadeCotacao,
      'Taxa Extra': cot.taxaExtra,
      'Taxa Serviço': cot.taxaServico,
      'Valor Agregado': cot.valorAgregado
    }));

    const filename = `cotacoes_${selectedPeriod || 'todos'}_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(data, filename);
  };

  const handleDownload = () => {
    if (reportType === 'movimentacoes') {
      handleDownloadMovimentacoes();
    } else {
      handleDownloadCotacoes();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Relatórios
          </h2>
          <p className="text-gray-600 mt-1">
            Exporte dados filtrados para análise
          </p>
        </div>
        <Button icon={Download} onClick={handleDownload}>
          Baixar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Filtros
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'movimentacoes' | 'cotacoes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              <option value="movimentacoes">Movimentações</option>
              <option value="cotacoes">Cotações</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              <option value="">Todos os períodos</option>
              <option value="2025-09">Setembro 2025</option>
              <option value="2025-08">Agosto 2025</option>
              <option value="2025-07">Julho 2025</option>
              <option value="2025-06">Junho 2025</option>
              <option value="2025-05">Maio 2025</option>
            </select>
          </div>
          
          {reportType === 'movimentacoes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programa
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                <option value="">Todos os programas</option>
                {programas.map(programa => (
                  <option key={programa.id} value={programa.id}>
                    {programa.programa}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardKPI
          title={reportType === 'movimentacoes' ? 'Total Movimentações' : 'Total Cotações'}
          value={reportType === 'movimentacoes' ? totalMovimentacoes : totalCotacoes}
          subtitle="no período filtrado"
          icon={Calendar}
        />
        
        {reportType === 'movimentacoes' && (
          <CardKPI
            title="Total Quantidade"
            value={totalQuantidade.toLocaleString('pt-BR')}
            subtitle="milhas/pontos"
          />
        )}
        
        <CardKPI
          title="Total Economia"
          value={`R$ ${totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="no período"
        />
        
        <CardKPI
          title="Registros Filtrados"
          value={reportType === 'movimentacoes' ? filteredMovimentacoes.length : filteredCotacoes.length}
          subtitle="para download"
        />
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Prévia dos Dados ({reportType === 'movimentacoes' ? 'Movimentações' : 'Cotações'})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Mostrando os primeiros 10 registros que serão exportados
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {reportType === 'movimentacoes' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Economia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportType === 'movimentacoes' 
                ? filteredMovimentacoes.slice(0, 10).map((mov, index) => (
                    <tr key={mov.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(mov.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getProgramaName(mov.programaId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mov.tipoOperacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mov.quantidade.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mov.valor ? `R$ ${mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                    </tr>
                  ))
                : filteredCotacoes.slice(0, 10).map((cot, index) => (
                    <tr key={cot.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(cot.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cot.descricao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cot.tipoCotacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {cot.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cot.passagemEmitida ? 'Emitida' : 'Pendente'}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

