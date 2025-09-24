import React, { useEffect, useState } from 'react';
import { Plus, User, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { clientService } from '../services/ClientService';
import { Client } from '../types/Client';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Client>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await clientService.list();
        setClients(data);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditValues(client);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedClient = await clientService.update(id, editValues);
      if (updatedClient) {
        setClients(clients => clients.map(c => c.id === id ? updatedClient : c));
      }
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAddNew = async () => {
    try {
      const newClient = await clientService.create({
        name: 'Novo Cliente',
        contractNumber: 'C000',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: 'active',
        pointsBalance: 0,
        milesBalance: 0,
      });
      setClients(prevClients => [...prevClients, newClient]);
      setEditingId(newClient.id);
      setEditValues(newClient);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientService.delete(id);
        setClients(clients => clients.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
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
            Clientes / Contratos
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie seus clientes e seus respectivos contratos de milhas e pontos.
          </p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Novo Cliente
        </Button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Lista de Clientes
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Início
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Pontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Milhas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client, index) => {
                const isEditing = editingId === client.id;

                return (
                  <tr key={client.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.name || ''}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {client.name}
                        </div>
                      )}
                    </td>
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
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {client.contractNumber}
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
                          {client.startDate}
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
                          {client.endDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValues.status || 'active'}
                          onChange={(e) => setEditValues({ ...editValues, status: e.target.value as 'active' | 'inactive' })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      ) : (
                        <div className={`text-sm font-medium ${client.status === 'active' ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {client.status === 'active' ? <CheckCircle className="inline-block h-4 w-4 mr-1" /> : <XCircle className="inline-block h-4 w-4 mr-1" />}
                          {client.status === 'active' ? 'Ativo' : 'Inativo'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.pointsBalance || 0}
                          onChange={(e) => setEditValues({ ...editValues, pointsBalance: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {client.pointsBalance.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.milesBalance || 0}
                          onChange={(e) => setEditValues({ ...editValues, milesBalance: Number(e.target.value) })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        />
                      ) : (
                        <div className="text-sm text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          {client.milesBalance.toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" onClick={() => handleSave(client.id)}>
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
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

