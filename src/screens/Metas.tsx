import React, { useEffect, useState } from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { CardKPI } from '../components/CardKPI';
import { Button } from '../components/Button';
import { metasService } from '../services/MetasService';
import { Meta } from '../types/Meta';

export const Metas: React.FC = () => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Meta>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await metasService.list();
        setMetas(data);
      } catch (error) {
        console.error('Error loading goals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (meta: Meta) => {
    setEditingId(meta.id);
    setEditValues(meta);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedMeta = await metasService.update(id, editValues);
      if (updatedMeta) {
        // Recarregar dados do serviço para garantir sincronização
        const updatedMetas = await metasService.list();
        setMetas(updatedMetas);
      }
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAddNew = async () => {
    try {
      const newMeta = await metasService.create({
        programas: 'Novo Programa',
        quantidadeNecessaria: 0,
        quantidadeAtual: 0
      });
      // Recarregar dados do serviço para garantir sincronização
      const updatedMetas = await metasService.list();
      setMetas(updatedMetas);
      setEditingId(newMeta.id);
      setEditValues(newMeta);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        await metasService.delete(id);
        // Recarregar dados do serviço para garantir sincronização
        const updatedMetas = await metasService.list();
        setMetas(updatedMetas);
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  // Calculate summary data
  const totalNecessario = metas.reduce((sum, meta) => sum + meta.quantidadeNecessaria, 0);
  const totalAtual = metas.reduce((sum, meta) => sum + meta.quantidadeAtual, 0);
  const totalFaltante = totalNecessario - totalAtual;
  const percentualGeral = totalNecessario > 0 ? (totalAtual / totalNecessario) * 100 : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
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
            Metas
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie suas metas de acúmulo por programa
          </p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Nova Meta
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardKPI
          title="Total Necessário"
          value={totalNecessario.toLocaleString('pt-BR')}
          subtitle="milhas/pontos"
          icon={Target}
        />
        <CardKPI
          title="Total Atual"
          value={totalAtual.toLocaleString('pt-BR')}
          subtitle="acumulado"
          icon={TrendingUp}
        />
        <CardKPI
          title="Faltante"
          value={totalFaltante.toLocaleString('pt-BR')}
          subtitle="para atingir metas"
        />
        <CardKPI
          title="Progresso Geral"
          value={`${percentualGeral.toFixed(1)}%`}
          subtitle="das metas"
        />
      </div>

      {/* Goals Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Metas por Programa
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade Necessária
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Atingida
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metas.map((meta, index) => {
                const percentage = meta.quantidadeNecessaria > 0 
                  ? (meta.quantidadeAtual / meta.quantidadeNecessaria) * 100 
                  : 0;
                const isEditing = editingId === meta.id;

                return (
                  <tr key={meta.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.programas || ''}
                          onChange={(e) => setEditValues({ ...editValues, programas: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {meta.programas}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.quantidadeNecessaria || 0}
                          onChange={(e) => setEditValues({ ...editValues, quantidadeNecessaria: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {meta.quantidadeNecessaria.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.quantidadeAtual || 0}
                          onChange={(e) => setEditValues({ ...editValues, quantidadeAtual: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {meta.quantidadeAtual.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        percentage >= 100 ? 'text-green-600' :
                        percentage >= 75 ? 'text-blue-600' :
                        percentage >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`} style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                        {percentage.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" onClick={() => handleSave(meta.id)}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(meta)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(meta.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projection Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
          Projeção por Programa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metas.map((meta) => {
            const faltante = Math.max(0, meta.quantidadeNecessaria - meta.quantidadeAtual);
            const percentage = meta.quantidadeNecessaria > 0 
              ? (meta.quantidadeAtual / meta.quantidadeNecessaria) * 100 
              : 0;

            return (
              <div key={meta.id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  {meta.programas}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Faltante:</span>
                    <span className="font-medium text-gray-900">
                      {faltante.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso:</span>
                    <span className={`font-medium ${
                      percentage >= 100 ? 'text-green-600' :
                      percentage >= 75 ? 'text-blue-600' :
                      'text-gray-900'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

