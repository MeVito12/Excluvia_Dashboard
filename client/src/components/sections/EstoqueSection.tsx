import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UnifiedFilters from '@/components/UnifiedFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategory, categories } from '@/contexts/CategoryContext';
import ModernIcon from '@/components/ui/modern-icon';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Users,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';

const EstoqueSection = () => {
  const { selectedCategory } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('produtos');

  // Filtros específicos baseados na categoria selecionada
  const getCategorySpecificFilters = () => {
    switch (selectedCategory) {
      case 'pet':
        return {
          productTypes: [
            { value: 'all', label: 'Todos os Tipos' },
            { value: 'racao', label: 'Ração' },
            { value: 'medicamentos', label: 'Medicamentos' },
            { value: 'brinquedos', label: 'Brinquedos' },
            { value: 'higiene', label: 'Higiene & Beleza' },
            { value: 'acessorios', label: 'Acessórios' }
          ],
          clientSegments: [
            { value: 'all', label: 'Todos os Clientes' },
            { value: 'cao', label: 'Donos de Cães' },
            { value: 'gato', label: 'Donos de Gatos' },
            { value: 'exoticos', label: 'Pets Exóticos' },
            { value: 'criadores', label: 'Criadores' }
          ]
        };
      case 'saude':
        return {
          productTypes: [
            { value: 'all', label: 'Todos os Tipos' },
            { value: 'medicamentos', label: 'Medicamentos' },
            { value: 'suplementos', label: 'Suplementos' },
            { value: 'equipamentos', label: 'Equipamentos' },
            { value: 'higiene', label: 'Higiene Pessoal' },
            { value: 'cosmeticos', label: 'Cosméticos' }
          ],
          clientSegments: [
            { value: 'all', label: 'Todos os Clientes' },
            { value: 'cronic', label: 'Pacientes Crônicos' },
            { value: 'elderly', label: 'Idosos' },
            { value: 'family', label: 'Famílias' },
            { value: 'athletes', label: 'Atletas' }
          ]
        };
      case 'alimenticio':
        return {
          productTypes: [
            { value: 'all', label: 'Todos os Tipos' },
            { value: 'pratos', label: 'Pratos Principais' },
            { value: 'bebidas', label: 'Bebidas' },
            { value: 'sobremesas', label: 'Sobremesas' },
            { value: 'entradas', label: 'Entradas' },
            { value: 'lanches', label: 'Lanches' }
          ],
          clientSegments: [
            { value: 'all', label: 'Todos os Clientes' },
            { value: 'delivery', label: 'Delivery' },
            { value: 'local', label: 'Presencial' },
            { value: 'corporativo', label: 'Corporativo' },
            { value: 'eventos', label: 'Eventos' }
          ]
        };
      case 'vendas':
        return {
          productTypes: [
            { value: 'all', label: 'Todos os Tipos' },
            { value: 'eletronicos', label: 'Eletrônicos' },
            { value: 'vestuario', label: 'Vestuário' },
            { value: 'casa_jardim', label: 'Casa e Jardim' },
            { value: 'esportes', label: 'Esportes' },
            { value: 'livros', label: 'Livros' },
            { value: 'automotivo', label: 'Automotivo' }
          ],
          clientSegments: [
            { value: 'all', label: 'Todos os Clientes' },
            { value: 'varejo', label: 'Varejo' },
            { value: 'atacado', label: 'Atacado' },
            { value: 'corporativo', label: 'Corporativo' },
            { value: 'revendedor', label: 'Revendedores' }
          ]
        };
      case 'design':
        return {
          productTypes: [
            { value: 'all', label: 'Todos os Tipos' },
            { value: 'logos', label: 'Logotipos' },
            { value: 'materiais', label: 'Material Gráfico' },
            { value: 'branding', label: 'Branding' },
            { value: 'digital', label: 'Design Digital' },
            { value: 'impressos', label: 'Impressos' }
          ],
          clientSegments: [
            { value: 'all', label: 'Todos os Clientes' },
            { value: 'startup', label: 'Startups' },
            { value: 'pme', label: 'PMEs' },
            { value: 'corporativo', label: 'Corporativo' },
            { value: 'individual', label: 'Pessoa Física' }
          ]
        };
      case 'sites':
        return {
          productTypes: [
            { value: 'all', label: 'Todos os Tipos' },
            { value: 'websites', label: 'Sites Institucionais' },
            { value: 'ecommerce', label: 'E-commerce' },
            { value: 'landing', label: 'Landing Pages' },
            { value: 'apps', label: 'Aplicativos' },
            { value: 'seo', label: 'SEO & Marketing' }
          ],
          clientSegments: [
            { value: 'all', label: 'Todos os Clientes' },
            { value: 'pequenos', label: 'Pequenos Negócios' },
            { value: 'medios', label: 'Médias Empresas' },
            { value: 'freelancers', label: 'Freelancers' },
            { value: 'agencias', label: 'Agências' }
          ]
        };
      default:
        return {
          productTypes: [{ value: 'all', label: 'Todos os Tipos' }],
          clientSegments: [{ value: 'all', label: 'Todos os Clientes' }]
        };
    }
  };

  const { productTypes, clientSegments } = getCategorySpecificFilters();

  // Mock data para produtos diversificados
  const products = [
    // Pet & Veterinário
    {
      id: 1,
      name: 'Ração Premium Golden para Cães',
      sku: 'PET001',
      category: 'pet',
      currentStock: 12,
      minimumStock: 5,
      price: 89.90,
      supplier: 'Premier Pet',
      expirationDate: new Date('2024-10-15'),
      status: 'normal'
    },
    {
      id: 2,
      name: 'Vacina V10 Canina',
      sku: 'PET002',
      category: 'pet',
      currentStock: 3,
      minimumStock: 8,
      price: 45.00,
      supplier: 'Zoetis',
      expirationDate: new Date('2024-08-30'),
      status: 'low_stock'
    },
    {
      id: 3,
      name: 'Brinquedo Kong Classic',
      sku: 'PET003',
      category: 'pet',
      currentStock: 25,
      minimumStock: 10,
      price: 35.50,
      supplier: 'Kong Company',
      expirationDate: null,
      status: 'normal'
    },
    // Saúde & Medicamentos
    {
      id: 4,
      name: 'Dipirona 500mg',
      sku: 'MED001',
      category: 'saude',
      currentStock: 150,
      minimumStock: 50,
      price: 8.90,
      supplier: 'EMS',
      expirationDate: new Date('2025-03-20'),
      status: 'normal'
    },
    {
      id: 5,
      name: 'Seringa Descartável 5ml',
      sku: 'MED002',
      category: 'saude',
      currentStock: 20,
      minimumStock: 100,
      price: 0.85,
      supplier: 'BD',
      expirationDate: new Date('2026-12-31'),
      status: 'low_stock'
    },
    {
      id: 6,
      name: 'Termômetro Digital',
      sku: 'MED003',
      category: 'saude',
      currentStock: 8,
      minimumStock: 5,
      price: 25.90,
      supplier: 'G-Tech',
      expirationDate: null,
      status: 'normal'
    },
    // Alimentício
    {
      id: 7,
      name: 'Leite Integral 1L',
      sku: 'ALI001',
      category: 'alimenticio',
      currentStock: 45,
      minimumStock: 20,
      price: 4.50,
      supplier: 'Nestlé',
      expirationDate: new Date('2024-07-15'),
      status: 'expiring_soon'
    },
    {
      id: 8,
      name: 'Pão de Forma Integral',
      sku: 'ALI002',
      category: 'alimenticio',
      currentStock: 8,
      minimumStock: 15,
      price: 6.90,
      supplier: 'Wickbold',
      expirationDate: new Date('2024-07-05'),
      status: 'low_stock'
    },
    {
      id: 9,
      name: 'Macarrão Espaguete 500g',
      sku: 'ALI003',
      category: 'alimenticio',
      currentStock: 35,
      minimumStock: 10,
      price: 3.20,
      supplier: 'Barilla',
      expirationDate: new Date('2025-12-31'),
      status: 'normal'
    },
    // Vendas - Eletrônicos
    {
      id: 10,
      name: 'iPhone 15 Pro Max 256GB',
      sku: 'VEN001',
      category: 'vendas',
      currentStock: 8,
      minimumStock: 5,
      price: 9999.00,
      supplier: 'Apple Brasil',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 11,
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'VEN002',
      category: 'vendas',
      currentStock: 12,
      minimumStock: 10,
      price: 7200.00,
      supplier: 'Samsung',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 12,
      name: 'Notebook Dell Inspiron 15',
      sku: 'VEN003',
      category: 'vendas',
      currentStock: 15,
      minimumStock: 8,
      price: 2450.00,
      supplier: 'Dell Brasil',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 13,
      name: 'MacBook Air M3 13"',
      sku: 'VEN004',
      category: 'vendas',
      currentStock: 6,
      minimumStock: 4,
      price: 9500.00,
      supplier: 'Apple Brasil',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 14,
      name: 'iPad Pro 12.9" M2',
      sku: 'VEN005',
      category: 'vendas',
      currentStock: 9,
      minimumStock: 6,
      price: 6800.00,
      supplier: 'Apple Brasil',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 15,
      name: 'Smart TV Samsung 65" QLED',
      sku: 'VEN006',
      category: 'vendas',
      currentStock: 4,
      minimumStock: 3,
      price: 4200.00,
      supplier: 'Samsung',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 16,
      name: 'PlayStation 5 Digital',
      sku: 'VEN007',
      category: 'vendas',
      currentStock: 2,
      minimumStock: 5,
      price: 3800.00,
      supplier: 'Sony Brasil',
      expirationDate: null,
      status: 'low_stock'
    },
    {
      id: 17,
      name: 'Xbox Series X',
      sku: 'VEN008',
      category: 'vendas',
      currentStock: 3,
      minimumStock: 4,
      price: 4200.00,
      supplier: 'Microsoft',
      expirationDate: null,
      status: 'low_stock'
    },
    {
      id: 18,
      name: 'AirPods Pro 2ª Geração',
      sku: 'VEN009',
      category: 'vendas',
      currentStock: 25,
      minimumStock: 15,
      price: 1800.00,
      supplier: 'Apple Brasil',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 19,
      name: 'Monitor LG UltraWide 34"',
      sku: 'VEN010',
      category: 'vendas',
      currentStock: 7,
      minimumStock: 5,
      price: 1950.00,
      supplier: 'LG Electronics',
      expirationDate: null,
      status: 'normal'
    },
    // Vendas - Vestuário
    {
      id: 20,
      name: 'Camiseta Nike Dri-FIT',
      sku: 'VEN011',
      category: 'vendas',
      currentStock: 45,
      minimumStock: 20,
      price: 89.90,
      supplier: 'Nike Brasil',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 21,
      name: 'Tênis Adidas Ultraboost',
      sku: 'VEN012',
      category: 'vendas',
      currentStock: 18,
      minimumStock: 12,
      price: 650.00,
      supplier: 'Adidas',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 22,
      name: 'Jaqueta Jeans Levi\'s',
      sku: 'VEN013',
      category: 'vendas',
      currentStock: 22,
      minimumStock: 15,
      price: 280.00,
      supplier: 'Levi\'s',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 23,
      name: 'Relógio Casio G-Shock',
      sku: 'VEN014',
      category: 'vendas',
      currentStock: 14,
      minimumStock: 8,
      price: 450.00,
      supplier: 'Casio',
      expirationDate: null,
      status: 'normal'
    },
    // Vendas - Casa e Jardim
    {
      id: 24,
      name: 'Cafeteira Nespresso Vertuo',
      sku: 'VEN015',
      category: 'vendas',
      currentStock: 12,
      minimumStock: 6,
      price: 800.00,
      supplier: 'Nespresso',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 25,
      name: 'Aspirador Robô iRobot',
      sku: 'VEN016',
      category: 'vendas',
      currentStock: 5,
      minimumStock: 3,
      price: 2200.00,
      supplier: 'iRobot',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 26,
      name: 'Air Fryer Philips 4L',
      sku: 'VEN017',
      category: 'vendas',
      currentStock: 20,
      minimumStock: 10,
      price: 380.00,
      supplier: 'Philips',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 27,
      name: 'Kit Ferramentas Bosch',
      sku: 'VEN018',
      category: 'vendas',
      currentStock: 8,
      minimumStock: 5,
      price: 320.00,
      supplier: 'Bosch',
      expirationDate: null,
      status: 'normal'
    },
    // Vendas - Livros e Cultura
    {
      id: 28,
      name: 'Livro "Pai Rico, Pai Pobre"',
      sku: 'VEN019',
      category: 'vendas',
      currentStock: 35,
      minimumStock: 20,
      price: 45.00,
      supplier: 'Alta Books',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 29,
      name: 'Box Harry Potter Completo',
      sku: 'VEN020',
      category: 'vendas',
      currentStock: 12,
      minimumStock: 8,
      price: 180.00,
      supplier: 'Rocco',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 30,
      name: 'Kindle Paperwhite 11ª Geração',
      sku: 'VEN021',
      category: 'vendas',
      currentStock: 15,
      minimumStock: 10,
      price: 450.00,
      supplier: 'Amazon',
      expirationDate: null,
      status: 'normal'
    }
  ];

  // Mock data para vendas diversificadas
  const sales = [
    // Pet & Veterinário
    {
      id: 1,
      productName: 'Ração Premium Golden para Cães',
      category: 'pet',
      clientName: 'Ana Maria Oliveira',
      clientType: 'Particular',
      quantity: 2,
      unitPrice: 89.90,
      totalPrice: 179.80,
      saleDate: new Date('2024-06-30'),
      status: 'delivered'
    },
    {
      id: 2,
      productName: 'Vacina V10 Canina',
      category: 'pet',
      clientName: 'Clínica Veterinária Bichos & Cia',
      clientType: 'Empresa',
      quantity: 5,
      unitPrice: 45.00,
      totalPrice: 225.00,
      saleDate: new Date('2024-06-29'),
      status: 'confirmed'
    },
    // Saúde & Medicamentos
    {
      id: 3,
      productName: 'Dipirona 500mg',
      category: 'saude',
      clientName: 'Hospital São Lucas',
      clientType: 'Empresa',
      quantity: 50,
      unitPrice: 8.90,
      totalPrice: 445.00,
      saleDate: new Date('2024-06-30'),
      status: 'preparing'
    },
    {
      id: 4,
      productName: 'Termômetro Digital',
      category: 'saude',
      clientName: 'Dr. Carlos Mendes',
      clientType: 'Profissional',
      quantity: 3,
      unitPrice: 25.90,
      totalPrice: 77.70,
      saleDate: new Date('2024-06-28'),
      status: 'delivered'
    },
    // Alimentício
    {
      id: 5,
      productName: 'Leite Integral 1L',
      category: 'alimenticio',
      clientName: 'Supermercado Central',
      clientType: 'Empresa',
      quantity: 24,
      unitPrice: 4.50,
      totalPrice: 108.00,
      saleDate: new Date('2024-06-30'),
      status: 'shipped'
    },
    {
      id: 6,
      productName: 'Macarrão Espaguete 500g',
      category: 'alimenticio',
      clientName: 'Restaurante Bella Vista',
      clientType: 'Empresa',
      quantity: 10,
      unitPrice: 3.20,
      totalPrice: 32.00,
      saleDate: new Date('2024-06-29'),
      status: 'delivered'
    },
    // Vendas - Transações comerciais extensas
    {
      id: 7,
      productName: 'iPhone 15 Pro Max 256GB',
      category: 'vendas',
      clientName: 'Pedro Santos Silva',
      clientType: 'Particular',
      quantity: 1,
      unitPrice: 9999.00,
      totalPrice: 9999.00,
      saleDate: new Date('2024-07-02'),
      status: 'confirmed'
    },
    {
      id: 8,
      productName: 'Notebook Dell Inspiron 15',
      category: 'vendas',
      clientName: 'TechFix Informática Ltda',
      clientType: 'Empresa',
      quantity: 5,
      unitPrice: 2450.00,
      totalPrice: 12250.00,
      saleDate: new Date('2024-07-01'),
      status: 'delivered'
    },
    {
      id: 9,
      productName: 'Samsung Galaxy S24 Ultra',
      category: 'vendas',
      clientName: 'Maria Fernanda Costa',
      clientType: 'Particular',
      quantity: 2,
      unitPrice: 7200.00,
      totalPrice: 14400.00,
      saleDate: new Date('2024-07-02'),
      status: 'preparing'
    },
    {
      id: 10,
      productName: 'MacBook Air M3 13"',
      category: 'vendas',
      clientName: 'Digital Solutions Corp',
      clientType: 'Corporativo',
      quantity: 3,
      unitPrice: 9500.00,
      totalPrice: 28500.00,
      saleDate: new Date('2024-06-30'),
      status: 'shipped'
    },
    {
      id: 11,
      productName: 'Smart TV Samsung 65" QLED',
      category: 'vendas',
      clientName: 'Hotel Presidente',
      clientType: 'Empresa',
      quantity: 8,
      unitPrice: 4200.00,
      totalPrice: 33600.00,
      saleDate: new Date('2024-06-29'),
      status: 'delivered'
    },
    {
      id: 12,
      productName: 'PlayStation 5 Digital',
      category: 'vendas',
      clientName: 'GameZone Loja de Games',
      clientType: 'Revendedor',
      quantity: 10,
      unitPrice: 3800.00,
      totalPrice: 38000.00,
      saleDate: new Date('2024-07-01'),
      status: 'confirmed'
    },
    {
      id: 13,
      productName: 'iPad Pro 12.9" M2',
      category: 'vendas',
      clientName: 'Escola Técnica Moderna',
      clientType: 'Educacional',
      quantity: 15,
      unitPrice: 6800.00,
      totalPrice: 102000.00,
      saleDate: new Date('2024-06-28'),
      status: 'delivered'
    },
    {
      id: 14,
      productName: 'AirPods Pro 2ª Geração',
      category: 'vendas',
      clientName: 'João Carlos Machado',
      clientType: 'Particular',
      quantity: 1,
      unitPrice: 1800.00,
      totalPrice: 1800.00,
      saleDate: new Date('2024-07-02'),
      status: 'shipped'
    },
    {
      id: 15,
      productName: 'Monitor LG UltraWide 34"',
      category: 'vendas',
      clientName: 'Agência de Publicidade Criativa',
      clientType: 'Empresa',
      quantity: 6,
      unitPrice: 1950.00,
      totalPrice: 11700.00,
      saleDate: new Date('2024-07-01'),
      status: 'confirmed'
    },
    {
      id: 16,
      productName: 'Xbox Series X',
      category: 'vendas',
      clientName: 'Roberto Silva Junior',
      clientType: 'Particular',
      quantity: 1,
      unitPrice: 4200.00,
      totalPrice: 4200.00,
      saleDate: new Date('2024-06-30'),
      status: 'delivered'
    },
    {
      id: 17,
      productName: 'Camiseta Nike Dri-FIT',
      category: 'vendas',
      clientName: 'Academia Fit Life',
      clientType: 'Empresa',
      quantity: 50,
      unitPrice: 89.90,
      totalPrice: 4495.00,
      saleDate: new Date('2024-07-01'),
      status: 'preparing'
    },
    {
      id: 18,
      productName: 'Tênis Adidas Ultraboost',
      category: 'vendas',
      clientName: 'SportMax Artigos Esportivos',
      clientType: 'Revendedor',
      quantity: 20,
      unitPrice: 650.00,
      totalPrice: 13000.00,
      saleDate: new Date('2024-06-29'),
      status: 'shipped'
    },
    {
      id: 19,
      productName: 'Cafeteira Nespresso Vertuo',
      category: 'vendas',
      clientName: 'Café Central Escritórios',
      clientType: 'Corporativo',
      quantity: 12,
      unitPrice: 800.00,
      totalPrice: 9600.00,
      saleDate: new Date('2024-07-02'),
      status: 'confirmed'
    },
    {
      id: 20,
      productName: 'Aspirador Robô iRobot',
      category: 'vendas',
      clientName: 'Condomínio Residencial Jardins',
      clientType: 'Empresa',
      quantity: 4,
      unitPrice: 2200.00,
      totalPrice: 8800.00,
      saleDate: new Date('2024-06-30'),
      status: 'delivered'
    },
    {
      id: 21,
      productName: 'Air Fryer Philips 4L',
      category: 'vendas',
      clientName: 'Casa & Decoração Ltda',
      clientType: 'Revendedor',
      quantity: 25,
      unitPrice: 380.00,
      totalPrice: 9500.00,
      saleDate: new Date('2024-07-01'),
      status: 'preparing'
    },
    {
      id: 22,
      productName: 'Kit Ferramentas Bosch',
      category: 'vendas',
      clientName: 'Construtora Moderna',
      clientType: 'Empresa',
      quantity: 15,
      unitPrice: 320.00,
      totalPrice: 4800.00,
      saleDate: new Date('2024-06-28'),
      status: 'delivered'
    },
    {
      id: 23,
      productName: 'Livro "Pai Rico, Pai Pobre"',
      category: 'vendas',
      clientName: 'Livraria Conhecimento',
      clientType: 'Revendedor',
      quantity: 40,
      unitPrice: 45.00,
      totalPrice: 1800.00,
      saleDate: new Date('2024-07-02'),
      status: 'confirmed'
    },
    {
      id: 24,
      productName: 'Box Harry Potter Completo',
      category: 'vendas',
      clientName: 'Ana Paula Rodrigues',
      clientType: 'Particular',
      quantity: 1,
      unitPrice: 180.00,
      totalPrice: 180.00,
      saleDate: new Date('2024-07-01'),
      status: 'shipped'
    },
    {
      id: 25,
      productName: 'Kindle Paperwhite 11ª Geração',
      category: 'vendas',
      clientName: 'Universidade Federal TechnoSul',
      clientType: 'Educacional',
      quantity: 30,
      unitPrice: 450.00,
      totalPrice: 13500.00,
      saleDate: new Date('2024-06-29'),
      status: 'delivered'
    }
  ];

  // Mock data para clientes diversificados
  const clients = [
    // Pet & Veterinário
    {
      id: 1,
      name: 'Ana Maria Oliveira',
      email: 'ana.oliveira@email.com',
      type: 'Particular',
      segment: 'pet',
      totalPurchases: 8,
      totalSpent: 1450.25,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 2,
      name: 'Clínica Veterinária Bichos & Cia',
      email: 'contato@bichosecia.com.br',
      type: 'Empresa',
      segment: 'pet',
      totalPurchases: 25,
      totalSpent: 12500.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Rio de Janeiro'
    },
    // Saúde & Medicamentos
    {
      id: 3,
      name: 'Hospital São Lucas',
      email: 'compras@saolucas.com.br',
      type: 'Empresa',
      segment: 'saude',
      totalPurchases: 45,
      totalSpent: 35000.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'Belo Horizonte'
    },
    {
      id: 4,
      name: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@clinica.com',
      type: 'Profissional',
      segment: 'saude',
      totalPurchases: 12,
      totalSpent: 2800.50,
      lastPurchaseDate: new Date('2024-06-28'),
      status: 'active',
      city: 'São Paulo'
    },
    // Alimentício
    {
      id: 5,
      name: 'Supermercado Central',
      email: 'compras@central.com.br',
      type: 'Empresa',
      segment: 'alimenticio',
      totalPurchases: 156,
      totalSpent: 45600.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'Salvador'
    },
    {
      id: 6,
      name: 'Restaurante Bella Vista',
      email: 'pedidos@bellavista.com.br',
      type: 'Empresa',
      segment: 'Alimentício',
      totalPurchases: 89,
      totalSpent: 18950.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Florianópolis'
    },
    // Vendas - Base de clientes comerciais extensa
    {
      id: 7,
      name: 'Pedro Santos Silva',
      email: 'pedro.santos@email.com',
      type: 'Particular',
      segment: 'vendas',
      totalPurchases: 5,
      totalSpent: 25500.00,
      lastPurchaseDate: new Date('2024-07-02'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 8,
      name: 'TechFix Informática Ltda',
      email: 'vendas@techfix.com.br',
      type: 'Empresa',
      segment: 'vendas',
      totalPurchases: 85,
      totalSpent: 145000.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Porto Alegre'
    },
    {
      id: 9,
      name: 'Maria Fernanda Costa',
      email: 'mf.costa@gmail.com',
      type: 'Particular',
      segment: 'vendas',
      totalPurchases: 8,
      totalSpent: 42300.00,
      lastPurchaseDate: new Date('2024-07-02'),
      status: 'active',
      city: 'Rio de Janeiro'
    },
    {
      id: 10,
      name: 'Digital Solutions Corp',
      email: 'compras@digitalsolutions.com.br',
      type: 'Corporativo',
      segment: 'vendas',
      totalPurchases: 45,
      totalSpent: 280000.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 11,
      name: 'Hotel Presidente',
      email: 'suprimentos@presidente.com.br',
      type: 'Empresa',
      segment: 'vendas',
      totalPurchases: 25,
      totalSpent: 125000.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Brasília'
    },
    {
      id: 12,
      name: 'GameZone Loja de Games',
      email: 'compras@gamezone.com.br',
      type: 'Revendedor',
      segment: 'vendas',
      totalPurchases: 156,
      totalSpent: 465000.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Curitiba'
    },
    {
      id: 13,
      name: 'Escola Técnica Moderna',
      email: 'ti@tecnicamoderna.edu.br',
      type: 'Educacional',
      segment: 'vendas',
      totalPurchases: 35,
      totalSpent: 380000.00,
      lastPurchaseDate: new Date('2024-06-28'),
      status: 'active',
      city: 'Belo Horizonte'
    },
    {
      id: 14,
      name: 'João Carlos Machado',
      email: 'joao.machado@email.com',
      type: 'Particular',
      segment: 'vendas',
      totalPurchases: 12,
      totalSpent: 18500.00,
      lastPurchaseDate: new Date('2024-07-02'),
      status: 'active',
      city: 'Salvador'
    },
    {
      id: 15,
      name: 'Agência de Publicidade Criativa',
      email: 'equipamentos@criativa.com.br',
      type: 'Empresa',
      segment: 'vendas',
      totalPurchases: 28,
      totalSpent: 95000.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Florianópolis'
    },
    {
      id: 16,
      name: 'Roberto Silva Junior',
      email: 'roberto.junior@email.com',
      type: 'Particular',
      segment: 'vendas',
      totalPurchases: 6,
      totalSpent: 12800.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'Fortaleza'
    },
    {
      id: 17,
      name: 'Academia Fit Life',
      email: 'compras@fitlife.com.br',
      type: 'Empresa',
      segment: 'vendas',
      totalPurchases: 18,
      totalSpent: 25000.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Recife'
    },
    {
      id: 18,
      name: 'SportMax Artigos Esportivos',
      email: 'vendas@sportmax.com.br',
      type: 'Revendedor',
      segment: 'vendas',
      totalPurchases: 95,
      totalSpent: 185000.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Goiânia'
    },
    {
      id: 19,
      name: 'Café Central Escritórios',
      email: 'compras@cafecentral.com.br',
      type: 'Corporativo',
      segment: 'vendas',
      totalPurchases: 42,
      totalSpent: 78000.00,
      lastPurchaseDate: new Date('2024-07-02'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 20,
      name: 'Condomínio Residencial Jardins',
      email: 'administracao@jardins.com.br',
      type: 'Empresa',
      segment: 'vendas',
      totalPurchases: 15,
      totalSpent: 45000.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'Santos'
    },
    {
      id: 21,
      name: 'Casa & Decoração Ltda',
      email: 'compras@casadecoração.com.br',
      type: 'Revendedor',
      segment: 'vendas',
      totalPurchases: 75,
      totalSpent: 125000.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Campinas'
    },
    {
      id: 22,
      name: 'Construtora Moderna',
      email: 'suprimentos@moderna.com.br',
      type: 'Empresa',
      segment: 'vendas',
      totalPurchases: 65,
      totalSpent: 155000.00,
      lastPurchaseDate: new Date('2024-06-28'),
      status: 'active',
      city: 'Ribeirão Preto'
    },
    {
      id: 23,
      name: 'Livraria Conhecimento',
      email: 'compras@conhecimento.com.br',
      type: 'Revendedor',
      segment: 'vendas',
      totalPurchases: 125,
      totalSpent: 85000.00,
      lastPurchaseDate: new Date('2024-07-02'),
      status: 'active',
      city: 'Vitória'
    },
    {
      id: 24,
      name: 'Ana Paula Rodrigues',
      email: 'ana.rodrigues@email.com',
      type: 'Particular',
      segment: 'vendas',
      totalPurchases: 15,
      totalSpent: 8500.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Natal'
    },
    {
      id: 25,
      name: 'Universidade Federal TechnoSul',
      email: 'licitacoes@technosul.edu.br',
      type: 'Educacional',
      segment: 'vendas',
      totalPurchases: 28,
      totalSpent: 456000.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Pelotas'
    },
    {
      id: 26,
      name: 'MegaTech Distribuidora',
      email: 'vendas@megatech.com.br',
      type: 'Revendedor',
      segment: 'vendas',
      totalPurchases: 245,
      totalSpent: 890000.00,
      lastPurchaseDate: new Date('2024-07-02'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 27,
      name: 'Startup InnovaTech',
      email: 'compras@innovatech.com.br',
      type: 'Corporativo',
      segment: 'vendas',
      totalPurchases: 32,
      totalSpent: 185000.00,
      lastPurchaseDate: new Date('2024-07-01'),
      status: 'active',
      city: 'Florianópolis'
    },
    // Cliente inativo
    {
      id: 9,
      name: 'Farmácia Popular',
      email: 'contato@popular.com.br',
      type: 'Empresa',
      segment: 'Saúde',
      totalPurchases: 28,
      totalSpent: 12500.00,
      lastPurchaseDate: new Date('2024-03-15'),
      status: 'inactive',
      city: 'Recife'
    }
  ];

  // Filter functions - apenas dados da categoria selecionada
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = product.category === selectedCategory; // Apenas da categoria selecionada
    const matchesType = selectedSegment === 'all' || product.sku.toLowerCase().includes(selectedSegment);
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = sale.category === selectedCategory; // Apenas da categoria selecionada
    return matchesSearch && matchesCategory;
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = client.segment === selectedCategory; // Apenas da categoria selecionada
    const matchesClientType = selectedSegment === 'all' || clientSegments.some(seg => seg.value === selectedSegment && client.type.toLowerCase().includes(seg.value));
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    return matchesSearch && matchesSegment && matchesClientType && matchesStatus;
  });

  const getStockStatus = (product: any) => {
    if (product.currentStock <= product.minimumStock) {
      return { label: 'Estoque Baixo', color: 'bg-red-500' };
    }
    return { label: 'Normal', color: 'bg-green-500' };
  };

  const getExpirationStatus = (expirationDate: Date | null) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration <= 30) {
      return { label: 'Vence em breve', color: 'bg-orange-500', days: daysUntilExpiration };
    }
    return null;
  };

  const getSaleStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Controle de Estoque</h2>
        <p className="text-gray-300">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - Gerencie produtos, vendas e clientes
        </p>
      </div>

      {/* Alertas de Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos em Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <ModernIcon 
                icon={AlertTriangle}
                size="xl"
                background={true}
                contextual={true}
                animated={true}
                glow={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Vencendo</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <ModernIcon 
                icon={Clock}
                size="xl"
                background={true}
                contextual={true}
                animated={true}
                glow={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Hoje</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <ModernIcon 
                icon={TrendingUp}
                size="xl"
                background={true}
                contextual={true}
                animated={true}
                glow={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faturamento Hoje</p>
                <p className="text-2xl font-bold text-blue-600">R$ 8.999</p>
              </div>
              <ModernIcon 
                icon={DollarSign}
                size="xl"
                background={true}
                contextual={true}
                animated={true}
                glow={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="tabs-scrollable w-full bg-white">
          <TabsTrigger value="produtos" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="vendas" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="clientes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Tab de Produtos */}
        <TabsContent value="produtos" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-black">Produtos</CardTitle>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros Específicos da Categoria */}
              <div className="mb-4">
                <div className="bg-white border border-border/50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar produtos, SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white text-gray-900 border-border/50"
                      />
                    </div>

                    {/* Product Type Filter */}
                    <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                      <SelectTrigger className="text-gray-900 bg-white">
                        <SelectValue placeholder="Tipo de Produto" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        {productTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-gray-50">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="text-gray-900 bg-white">
                        <SelectValue placeholder="Status" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">Todos os Status</SelectItem>
                        <SelectItem value="normal" className="text-gray-900 hover:bg-gray-50">Normal</SelectItem>
                        <SelectItem value="low_stock" className="text-gray-900 hover:bg-gray-50">Estoque Baixo</SelectItem>
                        <SelectItem value="out_of_stock" className="text-gray-900 hover:bg-gray-50">Sem Estoque</SelectItem>
                        <SelectItem value="expiring" className="text-gray-900 hover:bg-gray-50">Próximo ao Vencimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Lista de produtos */}
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const expirationStatus = getExpirationStatus(product.expirationDate);
                  
                  return (
                    <div key={product.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <Badge className={`${stockStatus.color} text-white`}>
                              {stockStatus.label}
                            </Badge>
                            {expirationStatus && (
                              <Badge className={`${expirationStatus.color} text-white`}>
                                {expirationStatus.label} ({expirationStatus.days} dias)
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <span><strong>SKU:</strong> {product.sku}</span>
                            <span><strong>Categoria:</strong> {product.category}</span>
                            <span><strong>Estoque:</strong> {product.currentStock} / {product.minimumStock} min</span>
                            <span><strong>Preço:</strong> R$ {product.price.toFixed(2)}</span>
                          </div>
                          
                          {/* Barra de progresso do estoque */}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Nível de Estoque</span>
                              <span>{Math.round((product.currentStock / (product.minimumStock * 2)) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(product.currentStock / (product.minimumStock * 2)) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" className="bg-white text-gray-900">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="bg-white text-gray-900">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Vendas */}
        <TabsContent value="vendas" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-black">Vendas</CardTitle>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Venda
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros Unificados para Vendas */}
              <div className="mb-4">
                <div className="bg-white border border-border/50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar vendas, clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white text-gray-900 border-border/50"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="text-gray-900 bg-white">
                        <SelectValue placeholder="Status" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">Todos os Status</SelectItem>
                        <SelectItem value="pending" className="text-gray-900 hover:bg-gray-50">Pendente</SelectItem>
                        <SelectItem value="confirmed" className="text-gray-900 hover:bg-gray-50">Confirmado</SelectItem>
                        <SelectItem value="delivered" className="text-gray-900 hover:bg-gray-50">Entregue</SelectItem>
                        <SelectItem value="cancelled" className="text-gray-900 hover:bg-gray-50">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredSales.map((sale) => (
                  <div key={sale.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{sale.productName}</h4>
                          <Badge className={`${getSaleStatusColor(sale.status)} text-white`}>
                            {sale.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <span><strong>Cliente:</strong> {sale.clientName}</span>
                          <span><strong>Categoria:</strong> {sale.category}</span>
                          <span><strong>Tipo:</strong> {sale.clientType}</span>
                          <span><strong>Quantidade:</strong> {sale.quantity}</span>
                          <span><strong>Preço Unit.:</strong> R$ {sale.unitPrice.toFixed(2)}</span>
                          <span><strong>Total:</strong> R$ {sale.totalPrice.toFixed(2)}</span>
                          <span><strong>Data:</strong> {sale.saleDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-black">Clientes</CardTitle>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros Unificados para Clientes */}
              <div className="mb-4">
                <div className="bg-white border border-border/50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar clientes, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white text-gray-900 border-border/50"
                      />
                    </div>

                    {/* Client Type Filter */}
                    <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                      <SelectTrigger className="text-gray-900 bg-white">
                        <SelectValue placeholder="Tipo de Cliente" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        {clientSegments.map((segment) => (
                          <SelectItem key={segment.value} value={segment.value} className="text-gray-900 hover:bg-gray-50">
                            {segment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="text-gray-900 bg-white">
                        <SelectValue placeholder="Status" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">Todos</SelectItem>
                        <SelectItem value="active" className="text-gray-900 hover:bg-gray-50">Ativos</SelectItem>
                        <SelectItem value="inactive" className="text-gray-900 hover:bg-gray-50">Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{client.name}</h4>
                          <Badge className={`${getClientStatusColor(client.status)} text-white`}>
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <span><strong>Email:</strong> {client.email}</span>
                          <span><strong>Tipo:</strong> {client.type}</span>
                          <span><strong>Segmento:</strong> {client.segment}</span>
                          <span><strong>Cidade:</strong> {client.city}</span>
                          <span><strong>Compras:</strong> {client.totalPurchases}</span>
                          <span><strong>Total Gasto:</strong> R$ {client.totalSpent.toFixed(2)}</span>
                          <span><strong>Ticket Médio:</strong> R$ {(client.totalSpent / client.totalPurchases).toFixed(2)}</span>
                          <span><strong>Última Compra:</strong> {client.lastPurchaseDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Relatórios */}
        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black">Relatórios de Vendas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <ModernIcon 
                    icon={Download}
                    variant="category"
                    category={selectedCategory as any}
                    size="sm"
                    background={true}
                    animated={true}
                    className="mr-2"
                  />
                  Relatório Diário de Vendas
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <ModernIcon 
                    icon={Download}
                    variant="category"
                    category={selectedCategory as any}
                    size="sm"
                    background={true}
                    animated={true}
                    className="mr-2"
                  />
                  Relatório Semanal de Vendas
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <ModernIcon 
                    icon={Download}
                    variant="category"
                    category={selectedCategory as any}
                    size="sm"
                    background={true}
                    animated={true}
                    className="mr-2"
                  />
                  Relatório Mensal de Vendas
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black">Relatórios de Clientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <ModernIcon 
                    icon={Download}
                    variant="category"
                    category={selectedCategory as any}
                    size="sm"
                    background={true}
                    animated={true}
                    className="mr-2"
                  />
                  Clientes Novos (30 dias)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <ModernIcon 
                    icon={Download}
                    variant="category"
                    category={selectedCategory as any}
                    size="sm"
                    background={true}
                    animated={true}
                    className="mr-2"
                  />
                  Clientes Inativos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <ModernIcon 
                    icon={Download}
                    variant="category"
                    category={selectedCategory as any}
                    size="sm"
                    background={true}
                    animated={true}
                    className="mr-2"
                  />
                  Top Clientes por Compras
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Notificações */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-gray-700">
              <strong>Notificações Instantâneas:</strong> Você receberá alertas automáticos para:
              estoque baixo, produtos vencendo, novas vendas e clientes inativos.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueSection;