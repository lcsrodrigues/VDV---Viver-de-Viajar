import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FiltersBar } from '../components/FiltersBar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { movimentacoesService } from '../services/MovimentacoesService';
import { programasService } from '../services/ProgramasService';
import { lojasService } from '../services/LojasService';
import { Movimentacao } from '../types/Movimentacao';
import { Program } from '../types/Program';
import { Loja } from '../types/Loja';

export const Movimentacoes: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [programas, setProgramas] = useState<Program[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchValue, setSearchValue] = useState('');
  const [filterChips, setFilterChips] = useState([
    { id: 'compra', label: 'Compra', value: 'Compra', active: false },
    { id: 'venda', label: 'Venda', value: 'Venda', active: false },
    { id: 'transferencia', label: 'Transferência', value: 'Transferência', active: false },
    { id: 'troca', label: 'Troca', value: 'Troca', active: false },
    { id: 'compra-inteligente', label: 'Compra Inteligente', value: 'Compra Inteligente', active: false },
    { id: 'bonus', label: 'Bônus', value: 'Bônus', active: false },
    { id: 'ajuste', label: 'Ajuste', value: 'Ajuste', active: false },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movData, progData, lojaData] = await Promise.all([
          movimentacoesService.list(),
          programasService.list(),
          lojasService.list()
        ]);
        setMovimentacoes(movData);
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

  // Filter data
  const filteredData = movimentacoes.filter(mov => {
    // Search filter
    const searchMatch = !searchValue || 
      getProgramaName(mov.programaId).toLowerCase().includes(searchValue.toLowerCase()) ||
      getLojaName(mov.lojaId).toLowerCase().includes(searchValue.toLowerCase()) ||
      mov.tipoOperacao.toLowerCase().includes(searchValue.toLowerCase());

    // Chip filters
    const activeChips = filterChips.filter(chip => chip.active);
    const chipMatch = activeChips.length === 0 || 
      activeChips.some(chip => mov.tipoOperacao === chip.value);

    return searchMatch && chipMatch;
  });

  const handleChipToggle = (chipId: string) => {
    setFilterChips(chips => 
      chips.map(chip => 
        chip.id === chipId ? { ...chip, active: !chip.active } : chip
      )
    );
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setFilterChips(chips => chips.map(chip => ({ ...chip, active: false })));
  };

  const handleEdit = (movimentacao: Movimentacao) => {
    console.log('Edit:', movimentacao);
    // TODO: Open edit modal/form
  };

  const handleDelete = async (movimentacao: Movimentacao) => {
    if (window.confirm('Tem certeza que deseja excluir esta movimentação?')) {
      try {
        await movimentacoesService.delete(movimentacao.id);
        setMovimentacoes(movs => movs.filter(m => m.id !== movimentacao.id));
      } catch (error) {
        console.error('Error deleting movement:', error);
      }
    }
  };

  const handleDuplicate = async (movimentacao: Movimentacao) => {
    try {
      const { id, ...movData } = movimentacao;
      const newMov = await movimentacoesService.create({
        ...movData,
        data: new Date().toISOString().split('T')[0] // Today's date
      });
      setMovimentacoes(movs => [newMov, ...movs]);
    } catch (error) {
      console.error('Error duplicating movement:', error);
    }
  };

  const columns = [
    {
      key: 'data' as keyof Movimentacao,
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    {
      key: 'programaId' as keyof Movimentacao,
      label: 'Programa',
      render: (value: string) => getProgramaName(value)
    },
    {
      key: 'tipoOperacao' as keyof Movimentacao,
      label: 'Tipo',
      render: (value: string) => <Badge type={value as any} />
    },
    {
      key: 'quantidade' as keyof Movimentacao,
      label: 'Quantidade',
      render: (value: number) => value.toLocaleString('pt-BR')
    },
    {
      key: 'valor' as keyof Movimentacao,
      label: 'Valor',
      render: (value: number | undefined) => 
        value ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'
    },
    {
      key: 'lojaId' as keyof Movimentacao,
      label: 'Loja',
      render: (value: string | undefined) => getLojaName(value)
    },
    {
      key: 'moedaDigital' as keyof Movimentacao,
      label: 'Moeda',
      render: (value: string) => value
    },
    {
      key: 'totalEconomia' as keyof Movimentacao,
      label: 'Economia',
      render: (value: number | undefined) => 
        value ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'
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
            Movimentações
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredData.length} de {movimentacoes.length} movimentações
          </p>
        </div>
        <Button icon={Plus}>
          Nova Movimentação
        </Button>
      </div>

      {/* Filters */}
      <FiltersBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterChips={filterChips}
        onChipToggle={handleChipToggle}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        itemsPerPage={10}
      />
    </div>
  );
};

