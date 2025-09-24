import React, { useEffect, useState } from 'react';
import { Plus, Plane, Calendar, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Button } from '../components/Button';
import { cotacaoService } from '../services/CotacaoService';
import { Cotacao } from '../types/Cotacao';
import { clientService } from '../services/ClientService';
import { Client } from '../types/Client';
import { contractService } from '../services/ContractService';
import { Contract } from '../types/Contract';

export const CotacoesCRUD: React.FC = () => {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Cotacao>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const cotData = await cotacaoService.list();
        const clientData = await clientService.list();
        const contractData = await contractService.list();
        setCotacoes(cotData);
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

  const handleEdit = (cot: Cotacao) => {
    setEditingId(cot.id);
    setEditValues(cot);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedCot = await cotacaoService.update(id, editValues);
      if (updatedCot) {
        setCotacoes(cots => cots.map(c => c.id === id ? updatedCot : c));
      }
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating cotacao:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAddNew = async () => {
    try {
      const newCot = await cotacaoService.create({
        clientId: clients[0]?.id || '', // Default to first client if available
        contractId: contracts[0]?.id || '', // Default to first contract if available
        destination: 'Novo Destino',
        departureDate: new Date().toISOString().split('T')[0],
        returnDate: new Date().toISOString().split('T')[0],
        adults: 1,
        children: 0,
        status: 'pending',
        estimatedValue: 0,
        milesUsed: 0,
        notes: 'Nova cotação',
      });
      setCotacoes(prevCots => [...prevCots, newCot]);
      setEditingId(newCot.id);
      setEditValues(newCot);
    } catch (error) {
      console.error('Error creating cotacao:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta cotação?')) {
      try {
        await cotacaoService.delete(id);
        setCotacoes(cots => cots.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting cotacao:', error);
      }
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  const getContractNumber = (contractId: string) => {
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
            Cotações
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie as cotações de passagens e hospedagens para seus clientes.
          </p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Nova Cotação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Plane className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Cotações</p>
              <p className="text-2xl font-bold text-gray-900">{cotacoes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reservadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {cotacoes.filter(c => c.status === 'booked').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total Estimado</p>
              <p className="text-2xl font-bold text-gray-900">
                {cotacoes
                  .reduce((sum, c) => sum + (c.estimatedValue || 0), 0)
                  .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {cotacoes.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cotacoes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Lista de Cotações
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
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retorno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adultos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crianças
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Estimado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Milhas Usadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cotacoes.map((cot, index) => {
                const isEditing = editingId === cot.id;

                return (
                  <tr key={cot.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                          {getClientName(cot.clientId)}
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
                          {getContractNumber(cot.contractId)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.destination || ''}
                          onChange={(e) => setEditValues({ ...editValues, destination: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.destination}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.departureDate || ''}
                          onChange={(e) => setEditValues({ ...editValues, departureDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.departureDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.returnDate || ''}
                          onChange={(e) => setEditValues({ ...editValues, returnDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.returnDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.adults || 0}
                          onChange={(e) => setEditValues({ ...editValues, adults: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.adults}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.children || 0}
                          onChange={(e) => setEditValues({ ...editValues, children: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.children}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.estimatedValue || 0}
                          onChange={(e) => setEditValues({ ...editValues, estimatedValue: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {(cot.estimatedValue || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.milesUsed || 0}
                          onChange={(e) => setEditValues({ ...editValues, milesUsed: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {(cot.milesUsed || 0).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.status || 'pending'}
                          onChange={(e) => setEditValues({ ...editValues, status: e.target.value as Cotacao['status'] })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <option value="pending">Pendente</option>
                          <option value="quoted">Cotado</option>
                          <option value="booked">Reservado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      ) : (
                        <div className={`text-sm font-medium ${
                          cot.status === 'booked' ? 'text-green-600' :
                          cot.status === 'quoted' ? 'text-blue-600' :
                          cot.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.status === 'booked' && <CheckCircle className="inline-block h-4 w-4 mr-1" />}
                          {cot.status === 'cancelled' && <XCircle className="inline-block h-4 w-4 mr-1" />}
                          {cot.status.charAt(0).toUpperCase() + cot.status.slice(1)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.notes || ''}
                          onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {cot.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" onClick={() => handleSave(cot.id)}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(cot)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(cot.id)}
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

