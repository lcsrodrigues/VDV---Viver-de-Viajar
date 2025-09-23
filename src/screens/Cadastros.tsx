import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';
import { programasService } from '../services/ProgramasService';
import { produtosService } from '../services/ProdutosService';
import { lojasService } from '../services/LojasService';
import { Program } from '../types/Program';
import { Produto } from '../types/Produto';
import { Loja } from '../types/Loja';
import { clientService } from '../services/ClientService';
import { Client } from '../types/Client';
import { Clients } from './Clients';

type ActiveTab = 'programas' | 'produtos' | 'lojas' | 'clients';

export const Cadastros: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('programas');
  const [programas, setProgramas] = useState<Program[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [progData, prodData, lojaData, clientData] = await Promise.all([
          programasService.list(),
          produtosService.list(),
          lojasService.list(),
          clientService.list()
        ]);
        setProgramas(progData);
        setProdutos(prodData);
        setLojas(lojaData);
        setClients(clientData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getService = () => {
    switch (activeTab) {
      case 'programas': return programasService;
      case 'produtos': return produtosService;
      case 'lojas': return lojasService;
      case 'clients': return clientService;
    }
  };

  const getData = () => {
    switch (activeTab) {
      case 'programas': return programas;
      case 'produtos': return produtos;
      case 'lojas': return lojas;
      case 'clients': return clients;
    }
  };

  const setData = (data: any[]) => {
    switch (activeTab) {
      case 'programas': setProgramas(data); break;
      case 'produtos': setProdutos(data); break;
      case 'lojas': setLojas(data); break;
      case 'clients': setClients(data); break;
    }
  };

  const getEmptyForm = () => {
    switch (activeTab) {
      case 'programas':
        return {
          programa: '',
          tipoPrograma: 'Milhas' as const,
          subTipoPrograma: 'Aéreo' as const,
          valor: ''
        };
      case 'produtos':
        return { titulo: '' };
      case 'lojas':
        return { titulo: '' };
      case 'clients':
        return { name: '', email: '', phone: '' };
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(getEmptyForm());
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const service = getService();
      const currentData = getData();
      
      if (editingId) {
        // Update
        const updated = await service.update(editingId, formData);
        if (updated) {
          setData(currentData.map(item => item.id === editingId ? updated : item));
        }
      } else {
        // Create
        const created = await service.create(formData);
        setData([...currentData, created]);
      }
      
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        const service = getService();
        const currentData = getData();
        
        await service.delete(id);
        setData(currentData.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
          {editingId ? 'Editar' : 'Novo'} {activeTab.slice(0, -1)}
        </h3>
        
        <div className="space-y-4">
          {activeTab === 'programas' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Programa
                </label>
                <input
                  type="text"
                  value={formData.programa || ''}
                  onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Programa
                  </label>
                  <select
                    value={formData.tipoPrograma || 'Milhas'}
                    onChange={(e) => setFormData({ ...formData, tipoPrograma: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'Segoe UI, sans-serif' }}
                  >
                    <option value="Milhas">Milhas</option>
                    <option value="Pontos">Pontos</option>
                    <option value="Cashback">Cashback</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtipo
                  </label>
                  <select
                    value={formData.subTipoPrograma || 'Aéreo'}
                    onChange={(e) => setFormData({ ...formData, subTipoPrograma: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: 'Segoe UI, sans-serif' }}
                  >
                    <option value="Aéreo">Aéreo</option>
                    <option value="Bancário">Bancário</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor/Regra
                </label>
                <input
                  type="text"
                  value={formData.valor || ''}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="Ex: 1000 milhas = R$ 20,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>
            </>
          )}
          
          {(activeTab === 'produtos' || activeTab === 'lojas') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData.id, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              />
            </div>
          )}

          {activeTab === 'clients' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Segoe UI, sans-serif' }}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3 mt-6">
          <Button onClick={handleSave}>
            {editingId ? 'Atualizar' : 'Salvar'}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    const data = getData();
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {activeTab === 'programas' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor/Regra
                    </th>
                  </>
                )}
                {(activeTab === 'produtos' || activeTab === 'lojas') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                )}
                {activeTab === 'clients' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {activeTab === 'programas' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(item as Program).programa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as Program).tipoPrograma}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as Program).subTipoPrograma}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as Program).valor}
                      </td>
                    </>
                  )}
                  {(activeTab === 'produtos' || activeTab === 'lojas') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(item as Produto | Loja).titulo}
                    </td>
                  )}
                  {activeTab === 'clients' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(item as Client).name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as Client).email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as Client).phone}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
            Cadastros
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie programas, produtos e lojas
          </p>
        </div>
        <Button icon={Plus} onClick={handleAdd}>
          Novo {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'programas', label: 'Programas' },
            { id: 'produtos', label: 'Produtos' },
            { id: 'lojas', label: 'Lojas' },
            { id: 'clients', label: 'Clientes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Form */}
      {renderForm()}

      {/* Table */}
      {renderTable()}
    </div>
  );
};

