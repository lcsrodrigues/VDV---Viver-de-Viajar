import React, { useEffect, useState } from 'react';
import { Plus, ArrowUpDown, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { movimentacaoService } from '../services/MovimentacaoService';
import { Movimentacao } from '../types/Movimentacao';
import { clientService } from '../services/ClientService';
import { Client } from '../types/Client';
import { contractService } from '../services/ContractService';
import { Contract } from '../types/Contract';

export const MovimentacoesCRUD: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Movimentacao>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const movData = await movimentacaoService.list();
        const clientData = await clientService.list();
        const contractData = await contractService.list();
        setMovimentacoes(movData);
        setClients(clientData);
        setContracts(contractData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (mov: Movimentacao) => {
    setEditingId(mov.id);
    setEditValues(mov);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedMov = await movimentacaoService.update(id, editValues);
      if (updatedMov) {
        setMovimentacoes(movs => movs.map(m => m.id === id ? updatedMov : m));
      }
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating movimentacao:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAddNew = async () => {
    try {
      const newMov = await movimentacaoService.create({
        clientId: clients[0]?.id || '', // Default to first client if available
        contractId: contracts[0]?.id || '', // Default to first contract if available
        type: 'compra',
        program: 'Novo Programa',
        quantity: 0,
        value: 0,
        date: new Date().toISOString().split('T')[0],
        description: 'Nova movimentação',
      });
      setMovimentacoes(prevMovs => [...prevMovs, newMov]);
      setEditingId(newMov.id);
      setEditValues(newMov);
    } catch (error) {
      console.error('Error creating movimentacao:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta movimentação?')) {
      try {
        await movimentacaoService.delete(id);
        setMovimentacoes(movs => movs.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting movimentacao:', error);
      }
    }
  };

  const getClientName = (clientId: string) => {
    if (!clientId || !clients.length) return 'N/A';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  const getContractNumber = (contractId: string) => {
    if (!contractId || !contracts.length) return 'N/A';
    const contract = contracts.find(c => c.id === contractId);
    return contract ? contract.contractNumber : 'N/A';
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
            Movimentações
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie todas as movimentações de milhas e pontos.
          </p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Nova Movimentação
        </Button>
      </div>

      {/* Movimentacoes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Lista de Movimentações
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor (R$)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimentacoes.map((mov, index) => {
                const isEditing = editingId === mov.id;

                return (
                  <tr key={mov.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.clientId || ''}
                          onChange={(e) => setEditValues({ ...editValues, clientId: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {getClientName(mov.clientId)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.contractId || ''}
                          onChange={(e) => setEditValues({ ...editValues, contractId: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          {contracts.map(contract => (
                            <option key={contract.id} value={contract.id}>{contract.contractNumber}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {getContractNumber(mov.contractId)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.type || 'compra'}
                          onChange={(e) => setEditValues({ ...editValues, type: e.target.value as Movimentacao['type'] })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <option value="compra">Compra</option>
                          <option value="venda">Venda</option>
                          <option value="transferencia">Transferência</option>
                          <option value="bonus">Bônus</option>
                          <option value="ajuste">Ajuste</option>
                          <option value="troca">Troca</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {mov.type ? mov.type.charAt(0).toUpperCase() + mov.type.slice(1) : 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.program || ''}
                          onChange={(e) => setEditValues({ ...editValues, program: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {mov.program}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.quantity || 0}
                          onChange={(e) => setEditValues({ ...editValues, quantity: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {(mov.quantity || 0).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.value || 0}
                          onChange={(e) => setEditValues({ ...editValues, value: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {(mov.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.date || ''}
                          onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {mov.date || 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.description || ''}
                          onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {mov.description || 'N/A'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" onClick={() => handleSave(mov.id)}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(mov)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(mov.id)}
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
    </div>
  );
};

