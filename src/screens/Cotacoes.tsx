import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle, Clock } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { CardKPI } from '../components/CardKPI';
import { Button } from '../components/Button';
import { cotacaoService } from '../services/CotacaoService';
import { Cotacao } from '../types/Cotacao';

export const Cotacoes: React.FC = () => {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2025-09');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await cotacaoService.list();
        setCotacoes(data);
      } catch (error) {
        console.error('Error loading quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter by selected month
  const filteredCotacoes = cotacoes.filter(cotacao => 
    cotacao.mes === selectedMonth
  );

  // Calculate KPIs for the selected period
  const totalEconomia = filteredCotacoes.reduce((sum, cotacao) => sum + cotacao.economia, 0);
  const taxaMedia = filteredCotacoes.length > 0 
    ? filteredCotacoes.reduce((sum, cotacao) => sum + cotacao.taxaPorTipo, 0) / filteredCotacoes.length 
    : 0;
  const valorAgregado = filteredCotacoes.reduce((sum, cotacao) => sum + cotacao.valorAgregado, 0);
  const passagensEmitidas = filteredCotacoes.filter(cotacao => cotacao.passagemEmitida).length;

  const handleEdit = (cotacao: Cotacao) => {
    console.log('Edit quote:', cotacao);
    // TODO: Open edit modal/form
  };

  const handleDelete = async (cotacao: Cotacao) => {
    if (window.confirm('Tem certeza que deseja excluir esta cotação?')) {
      try {
        await cotacaoService.delete(cotacao.id);
        setCotacoes(cotacoes => cotacoes.filter(c => c.id !== cotacao.id));
      } catch (error) {
        console.error('Error deleting quote:', error);
      }
    }
  };

  const handleDuplicate = async (cotacao: Cotacao) => {
    try {
      const { id, ...cotacaoData } = cotacao;
      const newCotacao = await cotacaoService.create({
        ...cotacaoData,
        data: new Date().toISOString().split('T')[0],
        descricao: `${cotacao.descricao} (Cópia)`,
        passagemEmitida: false
      });
      setCotacoes(cotacoes => [newCotacao, ...cotacoes]);
    } catch (error) {
      console.error('Error duplicating quote:', error);
    }
  };

  const columns = [
    {
      key: 'data' as keyof Cotacao,
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    {
      key: 'descricao' as keyof Cotacao,
      label: 'Descrição',
      render: (value: string) => value
    },
    {
      key: 'tipoCotacao' as keyof Cotacao,
      label: 'Tipo',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Emissão' ? 'bg-green-100 text-green-800' :
          value === 'Simulação' ? 'bg-blue-100 text-blue-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'valorDasMilhas' as keyof Cotacao,
      label: 'Milhas',
      render: (value: number) => value.toLocaleString('pt-BR')
    },
    {
      key: 'valorPagante' as keyof Cotacao,
      label: 'Valor Pago',
      render: (value: number) => value > 0 ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'
    },
    {
      key: 'economia' as keyof Cotacao,
      label: 'Economia',
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    {
      key: 'passagemEmitida' as keyof Cotacao,
      label: 'Status',
      render: (value: boolean) => (
        <div className="flex items-center space-x-1">
          {value ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600 text-sm font-medium">Emitida</span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 text-sm font-medium">Pendente</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'valorAgregado' as keyof Cotacao,
      label: 'Valor Agregado',
      render: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    }
  ];

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
            Cotações
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredCotacoes.length} cotações em {selectedMonth}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
          >
            <option value="2025-09">Setembro 2025</option>
            <option value="2025-08">Agosto 2025</option>
            <option value="2025-07">Julho 2025</option>
            <option value="2025-06">Junho 2025</option>
            <option value="2025-05">Maio 2025</option>
          </select>
          <Button icon={Plus}>
            Nova Cotação
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardKPI
          title="Total de Economia"
          value={`R$ ${totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="no período"
        />
        <CardKPI
          title="Taxa Média"
          value={`R$ ${taxaMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="por cotação"
        />
        <CardKPI
          title="Valor Agregado"
          value={`R$ ${valorAgregado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="total"
        />
        <CardKPI
          title="Passagens Emitidas"
          value={passagensEmitidas}
          subtitle={`de ${filteredCotacoes.length} cotações`}
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredCotacoes}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        itemsPerPage={10}
      />
    </div>
  );
};

