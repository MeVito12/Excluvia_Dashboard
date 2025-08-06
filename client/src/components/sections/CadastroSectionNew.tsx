import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  Settings, 
  Shield, 
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Building,
  X
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';

const CadastroSection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Estados
  const [activeTab, setActiveTab] = useState('clientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Verificar se é usuário Master
  const isMasterUser = (user as any)?.role === 'master';
  
  if (!isMasterUser) {
    return (
      <div className="app-section">
        <div className="section-header">
          <h1 className="section-title">Acesso Negado</h1>
          <p className="section-subtitle">Área restrita para usuários Master</p>
        </div>
        <div className="main-card">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-black mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-700">
              Apenas usuários Master podem acessar o cadastro de clientes, categorias e subcategorias.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Buscar dados
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/clients'],
    enabled: activeTab === 'clientes'
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    enabled: activeTab === 'categorias' || activeTab === 'subcategorias'
  });

  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['/api/subcategories'],
    enabled: activeTab === 'subcategorias'
  });

  // Filtros e paginação
  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'clientes') data = clients;
    else if (activeTab === 'categorias') data = categories;
    else if (activeTab === 'subcategorias') data = subcategories;
    
    return data.filter((item: any) => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = activeTab === 'clientes' ? '/api/clients' : 
                     activeTab === 'categorias' ? '/api/categories' : '/api/subcategories';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao criar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${activeTab}`] });
      setShowAddModal(false);
      setEditingItem(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const endpoint = activeTab === 'clientes' ? '/api/clients' : 
                     activeTab === 'categorias' ? '/api/categories' : '/api/subcategories';
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao atualizar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${activeTab}`] });
      setShowAddModal(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const endpoint = activeTab === 'clientes' ? '/api/clients' : 
                     activeTab === 'categorias' ? '/api/categories' : '/api/subcategories';
      const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${activeTab}`] });
    }
  });

  // Formulários
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddModal(true);
  };

  const renderContent = () => {
    if (activeTab === 'clientes') {
      return (
        <div className="animate-fade-in">
          <div className="main-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Clientes ({filteredData.length})
              </h3>
              <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            {/* Barra de busca */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de clientes */}
            <div className="space-y-4">
              {paginatedData.map((client: any) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{client.name}</h4>
                        <p className="text-sm text-gray-600">
                          {client.client_type === 'company' ? 'Empresa' : 'Pessoa Física'}
                          {client.email && ` • ${client.email}`}
                        </p>
                        {client.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(client)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteMutation.mutate(client.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
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
    }

    if (activeTab === 'categorias') {
      return (
        <div className="animate-fade-in">
          <div className="main-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Categorias ({filteredData.length})
              </h3>
              <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedData.map((category: any) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        />
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteMutation.mutate(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.description || 'Sem descrição'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'subcategorias') {
      return (
        <div className="animate-fade-in">
          <div className="main-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Subcategorias ({filteredData.length})
              </h3>
              <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Subcategoria
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedData.map((subcategory: any) => {
                const parentCategory = categories.find((c: any) => c.id === subcategory.category_id);
                return (
                  <Card key={subcategory.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: subcategory.color || '#10B981' }}
                          />
                          <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(subcategory)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteMutation.mutate(subcategory.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {subcategory.description || 'Sem descrição'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Categoria: {parentCategory?.name || 'N/A'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderModal = () => {
    if (!showAddModal) return null;

    const isClient = activeTab === 'clientes';
    const isCategory = activeTab === 'categorias';
    const isSubcategory = activeTab === 'subcategorias';

    return (
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar' : 'Novo'} {
                isClient ? 'Cliente' : 
                isCategory ? 'Categoria' : 'Subcategoria'
              }
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            {isClient && (
              <>
                <div>
                  <Label htmlFor="client_type">Tipo</Label>
                  <Select 
                    value={formData.client_type || 'individual'} 
                    onValueChange={(value) => setFormData({...formData, client_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Pessoa Física</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </>
            )}

            {(isCategory || isSubcategory) && (
              <>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color || '#3B82F6'}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </>
            )}

            {isSubcategory && (
              <div>
                <Label htmlFor="category_id">Categoria</Label>
                <Select 
                  value={formData.category_id?.toString() || ''} 
                  onValueChange={(value) => setFormData({...formData, category_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingItem ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Cadastros</h1>
        <p className="section-subtitle">Cadastro de clientes, categorias e subcategorias</p>
      </div>

      {/* Navegação por Abas */}
      <div className="tab-navigation">
        <button
          onClick={() => {
            setActiveTab('clientes');
            setCurrentPage(1);
            setSearchTerm('');
          }}
          className={`tab-button ${activeTab === 'clientes' ? 'tab-active' : 'tab-inactive'}`}
        >
          <Users className="w-4 h-4" />
          <span>Clientes</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('categorias');
            setCurrentPage(1);
            setSearchTerm('');
          }}
          className={`tab-button ${activeTab === 'categorias' ? 'tab-active' : 'tab-inactive'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Categorias</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('subcategorias');
            setCurrentPage(1);
            setSearchTerm('');
          }}
          className={`tab-button ${activeTab === 'subcategorias' ? 'tab-active' : 'tab-inactive'}`}
        >
          <Settings className="w-4 h-4" />
          <span>Subcategorias</span>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="tab-content">
        {renderContent()}
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default CadastroSection;