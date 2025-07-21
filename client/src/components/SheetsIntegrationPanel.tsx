import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useSheetsIntegration } from '@/hooks/useSheetsIntegration';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  Table, 
  Plus, 
  Loader2, 
  RefreshCw, 
  ExternalLink,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

interface SheetsIntegrationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SheetsIntegrationPanel: React.FC<SheetsIntegrationPanelProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const { toast } = useToast();
  const {
    isInitialized,
    sheetsProducts,
    sheetsStats,
    isLoadingProducts,
    isInitializing,
    isAddingProduct,
    initializeSheets,
    addProductToSheets,
    refreshProducts,
    initError,
    addError
  } = useSheetsIntegration();

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    unit: 'Unidade',
    supplier: '',
    location: 'Centro Hub'
  });

  const handleInitialize = () => {
    initializeSheets(undefined, {
      onSuccess: () => {
        toast({
          title: "Planilha Inicializada",
          description: "Google Sheets configurado com sucesso!"
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro na Inicialização", 
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        title: "Campos Obrigatórios",
        description: "Nome e categoria são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    addProductToSheets(newProduct, {
      onSuccess: () => {
        toast({
          title: "Produto Adicionado",
          description: "Produto sincronizado com Google Sheets!"
        });
        setNewProduct({
          name: '',
          category: '',
          quantity: 0,
          price: 0,
          unit: 'Unidade',
          supplier: '',
          location: 'Centro Hub'
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao Adicionar",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sheet className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Integração Google Sheets
              </h2>
              <p className="text-gray-600">
                Gestão de estoque sincronizada com planilha
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            Fechar
          </Button>
        </div>

        {/* Status da Integração */}
        <Card className="p-4 mb-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isInitialized ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              )}
              <span className="font-medium">
                Status: {isInitialized ? 'Conectado' : 'Não Inicializado'}
              </span>
            </div>
            {!isInitialized && (
              <Button 
                onClick={handleInitialize}
                disabled={isInitializing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isInitializing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Sheet className="w-4 h-4 mr-2" />
                )}
                Inicializar Planilha
              </Button>
            )}
          </div>
          {initError && (
            <p className="text-red-600 text-sm mt-2">
              Erro: {initError.message}
            </p>
          )}
        </Card>

        {isInitialized && (
          <>
            {/* Estatísticas */}
            {sheetsStats && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {sheetsStats.totalProducts}
                  </div>
                  <p className="text-sm text-gray-600">Total Produtos</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sheetsStats.inStock}
                  </div>
                  <p className="text-sm text-gray-600">Em Estoque</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {sheetsStats.lowStock}
                  </div>
                  <p className="text-sm text-gray-600">Estoque Baixo</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {sheetsStats.outOfStock}
                  </div>
                  <p className="text-sm text-gray-600">Esgotado</p>
                </Card>
              </div>
            )}

            {/* Formulário Adicionar Produto */}
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar Produto à Planilha
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Smartphone Samsung"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="Ex: Eletrônicos"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    placeholder="Ex: Fornecedor ABC"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                    placeholder="Ex: Centro Hub - A1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button 
                  onClick={handleAddProduct}
                  disabled={isAddingProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAddingProduct ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Adicionar Produto
                </Button>
              </div>
              {addError && (
                <p className="text-red-600 text-sm mt-2">
                  Erro: {addError.message}
                </p>
              )}
            </Card>

            {/* Lista de Produtos */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  Produtos na Planilha ({sheetsProducts.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshProducts()}
                    disabled={isLoadingProducts}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://docs.google.com/spreadsheets/d/12cUdtJLqezMZa75wz_N3zn5OIXW0wT1OxW1y9Q0v2_g`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Planilha
                  </Button>
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2">Carregando produtos...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Categoria</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Quantidade</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Preço</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Localização</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheetsProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{product.quantity}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            R$ {product.price.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge 
                              variant={product.quantity > 0 ? 'default' : 'destructive'}
                              className={product.quantity > 0 ? 'bg-green-100 text-green-800' : ''}
                            >
                              {product.status}
                            </Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{product.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </Card>
    </div>
  );
};