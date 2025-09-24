import React, { useEffect, useState } from 'react';
import { Plus, FileText, DollarSign, Calendar, User } from 'lucide-react';
import { Button } from '../components/Button';
import { contractService } from '../services/ContractService';
import { Contract } from '../types/Contract';
import { clientService } from '../services/ClientService';
import { Client } from '../types/Client';

export const ContractsCRUD: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Contract>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const contractData = await contractService.list();
        const clientData = await clientService.list();
        setContracts(contractData);
        setClients(clientData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (contract: Contract) => {
    setEditingId(contract.id);
    setEditValues(contract);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedContract = await contractService.update(id, editValues);
      if (updatedContract) {
        setContracts(contracts => contracts.map(c => c.id === id ? updatedContract : c));
      }
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAddNew = async () => {
    try {
      const newContract = await contractService.create({
        contractNumber: `VDV-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
        clientId: clients[0]?.id || '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        serviceType: 'gestao_milhas',
        monthlyFee: 299.90,
        commissionRate: 5.0,
        notes: 'Novo contrato',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setContracts(prevContracts => [...prevContracts, newContract]);
      setEditingId(newContract.id);
      setEditValues(newContract);
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      try {
        await contractService.delete(id);
        setContracts(contracts => contracts.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  const getStatusBadge = (status: Contract['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inativo' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspenso' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expirado' },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getServiceTypeLabel = (serviceType: Contract['serviceType']) => {
    const labels = {
      gestao_milhas: 'Gestão de Milhas',
      consultoria: 'Consultoria',
      premium: 'Premium',
      basico: 'Básico',
    };
    return labels[serviceType];
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
            Contratos
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie todos os contratos de clientes e serviços.
          </p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Novo Contrato
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Contratos</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Contratos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-500">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts
                  .filter(c => c.status === 'active')
                  .reduce((sum, c) => sum + c.monthlyFee, 0)
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
              <p className="text-sm font-medium text-gray-500">Vencendo em 30 dias</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => {
                  const endDate = new Date(c.endDate);
                  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  return endDate <= thirtyDaysFromNow && endDate >= new Date();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Lista de Contratos
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número do Contrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Mensal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comissão (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Início
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fim
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract, index) => {
                const isEditing = editingId === contract.id;

                return (
                  <tr key={contract.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.contractNumber || ''}
                          onChange={(e) => setEditValues({ ...editValues, contractNumber: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {contract.contractNumber}
                        </div>
                      )}
                    </td>
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
                          {getClientName(contract.clientId)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.serviceType || 'gestao_milhas'}
                          onChange={(e) => setEditValues({ ...editValues, serviceType: e.target.value as Contract['serviceType'] })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <option value="gestao_milhas">Gestão de Milhas</option>
                          <option value="consultoria">Consultoria</option>
                          <option value="premium">Premium</option>
                          <option value="basico">Básico</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {getServiceTypeLabel(contract.serviceType)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.status || 'active'}
                          onChange={(e) => setEditValues({ ...editValues, status: e.target.value as Contract['status'] })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                          <option value="suspended">Suspenso</option>
                          <option value="expired">Expirado</option>
                        </select>
                      ) : (
                        getStatusBadge(contract.status)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editValues.monthlyFee || 0}
                          onChange={(e) => setEditValues({ ...editValues, monthlyFee: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {contract.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editValues.commissionRate || 0}
                          onChange={(e) => setEditValues({ ...editValues, commissionRate: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {contract.commissionRate}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.startDate || ''}
                          onChange={(e) => setEditValues({ ...editValues, startDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {contract.startDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.endDate || ''}
                          onChange={(e) => setEditValues({ ...editValues, endDate: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {contract.endDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" onClick={() => handleSave(contract.id)}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(contract)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(contract.id)}
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
