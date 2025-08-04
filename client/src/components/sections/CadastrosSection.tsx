import { useClients, useProducts, useCreateClient } from "@/hooks/useData";
import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { formatDateBR } from '@/utils/dateFormat';
import { useAuth } from '@/contexts/AuthContext';
import type { Client } from '@shared/schema';

import { 
  Users, 
  Tags,
  Layers,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building
} from 'lucide-react';

const CadastrosSection = () => {
  const { selectedCategory } = useCategory();
  const { user } = useAuth();
  const { 
    data: clients = [], 
    isLoading: clientsLoading 
  } = useClients();
  
  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useProducts();
  
  const { mutateAsync: createClient } = useCreateClient();
  
  const [activeTab, setActiveTab] = useState('clientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Estados para formulários
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    client_type: 'individual' as 'individual' | 'company',
    document: '',
    notes: ''
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: '',
    category_id: '',
    color: '#10B981'
  });

  // Função para resetar formulários
  const resetForms = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      client_type: 'individual',
      document: '',
      notes: ''
    });
    setCategoryForm({
      name: '',
      description: '',
      color: '#3B82F6'
    });
    setSubcategoryForm({
      name: '',
      description: '',
      category_id: '',
      color: '#10B981'
    });
  };

  // Função para lidar com criação/edição de clientes
  const handleClientSubmit = async () => {
    try {
      const clientData = {
        ...clientForm,
        user_id: (user as any)?.id,
        company_id: (user as any)?.companyId
      };

      if (editingItem) {
        // TODO: Implementar updateClient quando disponível
        console.log('Edição de cliente ainda não implementada');
      } else {
        await createClient(clientData);
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setEditingItem(null);
      resetForms();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  // Função para lidar com exclusão de clientes
  const handleClientDelete = async (clientId: number) => {
    try {
      // TODO: Implementar deleteClient quando disponível
      console.log('Exclusão de cliente ainda não implementada', clientId);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  // Função para abrir modal de edição
  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'clientes') {
      setClientForm({
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || '',
        client_type: item.client_type || 'individual',
        document: item.document || '',
        notes: item.notes || ''
      });
    }
    setShowEditModal(true);
  };

  // Filtrar dados baseado na busca
  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  // Extrair categorias únicas dos produtos
  const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
  
  // Extrair subcategorias únicas dos produtos (simuladas)
  const subcategories = [...new Set(products.map((p: any) => p.subcategory).filter(Boolean))];

  // Renderizar conteúdo baseado na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'clientes':
        return (
          <div className="animate-fade-in">
            <div className="main-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Clientes ({filteredClients.length})
                </h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    resetForms();
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Novo Cliente
                </button>
              </div>

              {/* Barra de busca */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Lista de clientes */}
              <div className="standard-list-container">
                <div className="standard-list-content">
                  {filteredClients.map((client: any) => (
                    <div key={client.id} className="standard-list-item group">
                      <div className="list-item-main">
                        <div className="list-item-title">{client.name}</div>
                        <div className="list-item-subtitle">
                          {client.client_type === 'company' ? 'Empresa' : 'Pessoa Física'}
                          {client.email && ` • ${client.email}`}
                        </div>
                        <div className="list-item-meta">
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                          )}
                          {client.address && (
                            <span className="flex items-center gap-1 ml-4">
                              <Building className="w-3 h-3" />
                              {client.address}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`list-status-badge status-success`}>
                          Ativo
                        </span>
                        
                        <div className="list-item-actions">
                          <button 
                            onClick={() => console.log('Visualizar cliente:', client.id)}
                            className="list-action-button view"
                            title="Visualizar cliente"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Tente alterar os termos de busca' : 'Comece adicionando seu primeiro cliente'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'categorias':
        return (
          <div className="animate-fade-in">
            <div className="main-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Categorias ({categories.length})
                </h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    resetForms();
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Nova Categoria
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: '#3B82F6' }}
                        ></div>
                        <h4 className="font-medium text-gray-900">{category}</h4>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {products.filter((p: any) => p.category === category).length} produtos
                    </p>
                  </div>
                ))}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-8">
                  <Tags className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma categoria cadastrada</h3>
                  <p className="text-gray-500">As categorias aparecerão automaticamente conforme você cadastra produtos</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'subcategorias':
        return (
          <div className="animate-fade-in">
            <div className="main-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subcategorias ({subcategories.length})
                </h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    resetForms();
                    setEditingItem(null);
                    setShowAddModal(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Nova Subcategoria
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subcategories.map((subcategory, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: '#10B981' }}
                        ></div>
                        <h4 className="font-medium text-gray-900">{subcategory}</h4>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {products.filter((p: any) => p.subcategory === subcategory).length} produtos
                    </p>
                  </div>
                ))}
              </div>

              {subcategories.length === 0 && (
                <div className="text-center py-8">
                  <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma subcategoria cadastrada</h3>
                  <p className="text-gray-500">As subcategorias aparecerão automaticamente conforme você cadastra produtos</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Cadastros</h1>
        <p className="section-subtitle">
          Gerencie clientes, categorias e subcategorias de produtos
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-black mt-1">
                {clients.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {clients.filter((c: any) => c.client_type === 'company').length} empresas, {clients.filter((c: any) => c.client_type === 'individual').length} pessoas físicas
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-black mt-1">
                {categories.length}
              </p>
              <p className="text-xs text-green-600 mt-1">Categorias de produtos</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Tags className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subcategorias</p>
              <p className="text-2xl font-bold text-black mt-1">
                {subcategories.length}
              </p>
              <p className="text-xs text-purple-600 mt-1">Subcategorias de produtos</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação das abas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('clientes')}
          className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`}
        >
          <Users className="w-4 h-4" />
          Clientes
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          className={`tab-button ${activeTab === 'categorias' ? 'active' : ''}`}
        >
          <Tags className="w-4 h-4" />
          Categorias
        </button>
        <button
          onClick={() => setActiveTab('subcategorias')}
          className={`tab-button ${activeTab === 'subcategorias' ? 'active' : ''}`}
        >
          <Layers className="w-4 h-4" />
          Subcategorias
        </button>
      </div>

      {/* Conteúdo das abas */}
      {renderTabContent()}

      {/* Modal para adicionar/editar cliente */}
      {(showAddModal || showEditModal) && activeTab === 'clientes' && (
        <div 
          className="modal-overlay bg-black bg-opacity-60 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              setShowEditModal(false);
              setEditingItem(null);
              resetForms();
            }
          }}
        >
          <div 
            className="modal-content bg-white rounded-lg p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome completo ou razão social"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={clientForm.client_type}
                  onChange={(e) => setClientForm({...clientForm, client_type: e.target.value as 'individual' | 'company'})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Pessoa Física</option>
                  <option value="company">Empresa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {clientForm.client_type === 'company' ? 'CNPJ' : 'CPF'}
                </label>
                <input
                  type="text"
                  value={clientForm.document}
                  onChange={(e) => setClientForm({...clientForm, document: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={clientForm.client_type === 'company' ? 'XX.XXX.XXX/XXXX-XX' : 'XXX.XXX.XXX-XX'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({...clientForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingItem(null);
                  resetForms();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClientSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={!clientForm.name}
              >
                {editingItem ? 'Salvar' : 'Criar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastrosSection;