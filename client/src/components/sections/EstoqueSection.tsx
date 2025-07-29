import { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { useCategory } from '@/contexts/CategoryContext';

const EstoqueSection = () => {
  const { selectedCategory } = useCategory();
  const { products, createProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    stock: '',
    minStock: '',
    price: '',
    isPerishable: false,
    description: '',
    barcode: ''
  });

  // Categorias que não têm sistema de estoque
  const categoriesWithoutStock = ['design', 'sites'];
  const hasStockSystem = !categoriesWithoutStock.includes(selectedCategory);

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = () => {
    if (!newProduct.name || !newProduct.stock || !newProduct.category) {
      alert('Por favor, preencha nome, estoque e categoria');
      return;
    }

    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock) || 0,
      isPerishable: newProduct.isPerishable,
      description: newProduct.description,
      barcode: newProduct.barcode
    };

    createProduct(productData);
    setNewProduct({ 
      name: '', 
      category: '', 
      stock: '', 
      minStock: '', 
      price: '', 
      isPerishable: false, 
      description: '', 
      barcode: '' 
    });
    setShowAddModal(false);
  };

  const editProduct = (product: any) => {
    alert(`Editando produto: ${product.name}`);
  };

  const deleteProduct = (product: any) => {
    if (confirm(`Confirma exclusão do produto ${product.name}?`)) {
      alert(`Produto ${product.name} excluído`);
    }
  };

  const processStockControl = (product: any) => {
    alert(`Controle de estoque para: ${product.name}`);
  };

  const processSale = (product: any) => {
    alert(`Processando venda de: ${product.name}`);
  };

  if (!hasStockSystem) {
    return (
      <div className="app-section">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          </div>
        </div>

        <div className="main-card">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestão de Portfolio
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Para empresas de {selectedCategory === 'design' ? 'design gráfico' : 'criação de sites'}, 
              utilize a seção Atendimento para gerenciar seu portfolio de projetos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="main-card">
        <div className="space-y-3">
          {filteredProducts.map((product: any) => (
            <div key={product.id} className="list-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Estoque: {product.quantity} unidades
                    </p>
                    {product.price && (
                      <p className="text-sm text-green-600">
                        Preço: R$ {product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={`${
                    product.quantity > 10 ? 'badge-success' : 
                    product.quantity > 0 ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {product.quantity > 10 ? 'Em estoque' : 
                     product.quantity > 0 ? 'Estoque baixo' : 'Sem estoque'}
                  </Badge>

                  <button
                    onClick={() => editProduct(product)}
                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => processStockControl(product)}
                    className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200"
                  >
                    <Package className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => processSale(product)}
                    className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteProduct(product)}
                    className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Adicionar Produto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Produto</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <Input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <Input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  placeholder="Categoria do produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque
                  </label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="Quantidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Mínimo
                  </label>
                  <Input
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                    placeholder="Min."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="Preço unitário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (Opcional)
                </label>
                <Input
                  type="text"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Descrição do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Barras (Opcional)
                </label>
                <Input
                  type="text"
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                  placeholder="Código de barras"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPerishable"
                  checked={newProduct.isPerishable}
                  onChange={(e) => setNewProduct({...newProduct, isPerishable: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPerishable" className="text-sm font-medium text-gray-700">
                  Produto perecível
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={addProduct}
                className="flex-1"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoqueSection;