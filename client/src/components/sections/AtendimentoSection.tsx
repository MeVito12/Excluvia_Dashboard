import React, { useState } from 'react';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { 
  MessageCircle, 
  Bot, 
  ShoppingCart, 
  Settings,
  Search,
  Send,
  Phone,
  Clock,
  Star,
  CheckCircle,
  Zap,
  CreditCard,
  Share2,
  QrCode,
  Link,
  Copy,
  Download,
  Gift,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const AtendimentoSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('mensagens');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState('link'); // 'link' ou 'qr'
  const [shareUrl, setShareUrl] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: selectedCategory === 'alimenticio' ? 'pratos' : 'produtos'
  });
  const [qrCodeData, setQrCodeData] = useState('');
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [showEditPortfolioModal, setShowEditPortfolioModal] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState(null);
  const [portfolioItem, setPortfolioItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    category: selectedCategory === 'design' ? 'branding' : 'website'
  });
  const [showAddSpecialistModal, setShowAddSpecialistModal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [newSpecialist, setNewSpecialist] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    schedule: '',
    description: ''
  });

  // Função para gerar URL de compartilhamento
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const categorySlug = selectedCategory;
    const menuType = selectedCategory === 'alimenticio' ? 'cardapio' : 'catalogo';
    return `${baseUrl}/${menuType}/${categorySlug}`;
  };

  // Estado para gerenciar itens de todas as categorias
  const [categoryItems, setCategoryItems] = useState(() => {
    return {
      'alimenticio': [
        { id: 1, name: 'Hambúrguer Artesanal', price: 28.90, category: 'pratos', description: 'Hambúrguer 180g com fritas artesanais', image: '', available: true },
        { id: 2, name: 'Pizza Margherita', price: 35.00, category: 'pratos', description: 'Pizza tradicional com manjericão fresco', image: '', available: true },
        { id: 3, name: 'Suco Natural de Laranja', price: 8.50, category: 'bebidas', description: 'Suco natural de laranja 300ml', image: '', available: true },
        { id: 4, name: 'Tiramisù', price: 15.90, category: 'sobremesas', description: 'Sobremesa italiana tradicional', image: '', available: true }
      ],
      'pet': [
        { id: 1, name: 'Ração Premium Golden', price: 89.90, category: 'racao', description: 'Ração premium para cães adultos', stock: 25, available: true },
        { id: 2, name: 'Antipulgas Frontline', price: 45.50, category: 'medicamentos', description: 'Proteção contra pulgas e carrapatos', stock: 12, available: true },
        { id: 3, name: 'Brinquedo Kong', price: 32.00, category: 'brinquedos', description: 'Brinquedo resistente para cães', stock: 8, available: true },
        { id: 4, name: 'Coleira GPS', price: 199.00, category: 'acessorios', description: 'Coleira com GPS para localização', stock: 5, available: true }
      ],
      'medico': [
        { id: 1, name: 'Dipirona 500mg', price: 15.90, category: 'analgesicos', description: 'Analgésico e antipirético', stock: 50, available: true },
        { id: 2, name: 'Amoxicilina 500mg', price: 25.00, category: 'antibioticos', description: 'Antibiótico de amplo espectro', stock: 30, available: true },
        { id: 3, name: 'Termômetro Digital', price: 89.90, category: 'equipamentos', description: 'Termômetro clínico digital', stock: 15, available: true },
        { id: 4, name: 'Vitamina C 1g', price: 18.50, category: 'suplementos', description: 'Suplemento de vitamina C', stock: 40, available: true }
      ],
      'tecnologia': [
        { id: 1, name: 'Processador Intel i7', price: 1299.00, category: 'componentes', description: 'Processador Intel Core i7 12ª geração', stock: 5, available: true },
        { id: 2, name: 'Monitor 24" Full HD', price: 699.00, category: 'monitores', description: 'Monitor LED 24 polegadas', stock: 8, available: true },
        { id: 3, name: 'SSD 1TB', price: 299.00, category: 'armazenamento', description: 'SSD interno 1TB alta velocidade', stock: 12, available: true },
        { id: 4, name: 'Placa de Vídeo RTX 4060', price: 1899.00, category: 'componentes', description: 'GPU NVIDIA RTX 4060 8GB', stock: 3, available: true }
      ],
      'vendas': [
        { id: 1, name: 'Smartphone Galaxy S24', price: 2899.99, category: 'eletronicos', description: 'Smartphone Samsung Galaxy S24', stock: 6, available: true },
        { id: 2, name: 'Camiseta Polo', price: 89.99, category: 'vestuario', description: 'Camiseta polo masculina', stock: 20, available: true },
        { id: 3, name: 'Tênis Esportivo', price: 199.99, category: 'calcados', description: 'Tênis para corrida', stock: 15, available: true },
        { id: 4, name: 'Notebook Gaming', price: 3499.99, category: 'eletronicos', description: 'Notebook para jogos', stock: 4, available: true }
      ],
      'educacao': [
        { id: 1, name: 'Livro de Matemática', price: 89.90, category: 'livros', description: 'Livro didático de matemática avançada', stock: 25, available: true },
        { id: 2, name: 'Kit de Experimentos', price: 45.50, category: 'materiais', description: 'Kit para experimentos de química', stock: 12, available: true },
        { id: 3, name: 'Calculadora Científica', price: 32.00, category: 'papelaria', description: 'Calculadora científica avançada', stock: 18, available: true },
        { id: 4, name: 'Atlas Mundial', price: 67.90, category: 'livros', description: 'Atlas geográfico mundial atualizado', stock: 8, available: true }
      ],
      'beleza': [
        { id: 1, name: 'Shampoo Hidratante', price: 35.90, category: 'cabelos', description: 'Shampoo para cabelos ressecados', stock: 30, available: true },
        { id: 2, name: 'Base Líquida FPS 30', price: 89.90, category: 'maquiagem', description: 'Base com proteção solar', stock: 15, available: true },
        { id: 3, name: 'Perfume Floral 100ml', price: 199.00, category: 'perfumaria', description: 'Perfume feminino com notas florais', stock: 12, available: true },
        { id: 4, name: 'Creme Anti-idade', price: 149.90, category: 'skincare', description: 'Creme facial anti-idade', stock: 8, available: true }
      ],
      'estetica': [
        { id: 1, name: 'Ácido Hialurônico', price: 299.00, category: 'injetaveis', description: 'Preenchimento facial com ácido hialurônico', stock: 15, available: true },
        { id: 2, name: 'Botox Allergan', price: 450.00, category: 'injetaveis', description: 'Toxina botulínica para rugas de expressão', stock: 8, available: true },
        { id: 3, name: 'Peeling Químico', price: 180.00, category: 'tratamentos', description: 'Peeling para renovação celular', stock: 25, available: true },
        { id: 4, name: 'Laser Fracionado', price: 350.00, category: 'equipamentos', description: 'Tratamento a laser para rejuvenescimento', stock: 5, available: true },
        { id: 5, name: 'Microagulhamento', price: 120.00, category: 'tratamentos', description: 'Estimulação de colágeno', stock: 20, available: true },
        { id: 6, name: 'Radiofrequência', price: 200.00, category: 'equipamentos', description: 'Tratamento para flacidez', stock: 10, available: true }
      ],
      'design': [
        { id: 1, title: 'Identidade Visual - Café Aroma', description: 'Desenvolvimento completo da identidade visual para cafeteria premium', category: 'branding', imageUrl: '', projectUrl: 'https://exemplo.com/cafe-aroma', available: true },
        { id: 2, title: 'Material Gráfico - Eventos ABC', description: 'Criação de convites, banners e cartões para empresa de eventos', category: 'impressos', imageUrl: '', projectUrl: '', available: true },
        { id: 3, title: 'Posts para Redes Sociais - Tech Start', description: 'Design de posts e stories para startup de tecnologia', category: 'digital', imageUrl: '', projectUrl: 'https://instagram.com/techstart', available: true },
        { id: 4, title: 'Campanha Publicitária - Eco Fashion', description: 'Peças publicitárias para marca de moda sustentável', category: 'publicidade', imageUrl: '', projectUrl: '', available: true }
      ],
      'sites': [
        { id: 1, title: 'Site Institucional - Dr. Silva', description: 'Website responsivo para clínica médica com agendamento online', category: 'website', imageUrl: '', projectUrl: 'https://clinicadrsilva.com.br', available: true },
        { id: 2, title: 'E-commerce - Loja Virtual Plus', description: 'Loja virtual completa com carrinho e pagamento', category: 'loja-virtual', imageUrl: '', projectUrl: 'https://lojavirtualplus.com', available: true },
        { id: 3, title: 'Landing Page - Curso Online', description: 'Página de conversão para curso de marketing digital', category: 'conversao', imageUrl: '', projectUrl: 'https://cursomarketing.com.br', available: true },
        { id: 4, title: 'Sistema Web - Gestão Escolar', description: 'Sistema completo para gestão de escola', category: 'sistema', imageUrl: '', projectUrl: '', available: true }
      ]
    };
  });

  // Estado para especialistas
  const [specialists, setSpecialists] = useState(() => {
    return {
      'medico': [
        { id: 1, name: 'Dr. João Silva', specialty: 'Cardiologia', phone: '(11) 99999-1111', email: 'joao@clinica.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Especialista em cardiologia com 15 anos de experiência', available: true },
        { id: 2, name: 'Dra. Maria Santos', specialty: 'Pediatria', phone: '(11) 99999-2222', email: 'maria@clinica.com', schedule: 'Seg-Sex: 9h às 17h', description: 'Pediatra especializada em desenvolvimento infantil', available: true },
        { id: 3, name: 'Dr. Carlos Oliveira', specialty: 'Ortopedia', phone: '(11) 99999-3333', email: 'carlos@clinica.com', schedule: 'Ter-Sáb: 8h às 16h', description: 'Ortopedista com foco em medicina esportiva', available: true }
      ],
      'pet': [
        { id: 1, name: 'Dr. Pedro Costa', specialty: 'Clínica Geral', phone: '(11) 99999-4444', email: 'pedro@vetpet.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Veterinário clínico geral com experiência em felinos', available: true },
        { id: 2, name: 'Dra. Ana Lima', specialty: 'Cirurgia', phone: '(11) 99999-5555', email: 'ana@vetpet.com', schedule: 'Seg-Sex: 7h às 15h', description: 'Especialista em cirurgias de pequenos animais', available: true },
        { id: 3, name: 'Dr. Ricardo Ferreira', specialty: 'Dermatologia', phone: '(11) 99999-6666', email: 'ricardo@vetpet.com', schedule: 'Qua-Dom: 9h às 17h', description: 'Dermatologista veterinário especializado em alergias', available: true }
      ],
      'estetica': [
        { id: 1, name: 'Dra. Fernanda Reis', specialty: 'Harmonização Facial', phone: '(11) 99999-7777', email: 'fernanda@clinicaestetica.com', schedule: 'Seg-Sex: 9h às 18h', description: 'Especialista em harmonização facial e preenchimentos', available: true },
        { id: 2, name: 'Dr. Bruno Santos', specialty: 'Medicina Estética', phone: '(11) 99999-8888', email: 'bruno@clinicaestetica.com', schedule: 'Ter-Sáb: 8h às 17h', description: 'Médico especializado em tratamentos estéticos e antienvelhecimento', available: true },
        { id: 3, name: 'Dra. Carla Mendes', specialty: 'Dermatologia Estética', phone: '(11) 99999-9999', email: 'carla@clinicaestetica.com', schedule: 'Seg-Sex: 10h às 19h', description: 'Dermatologista com foco em tratamentos estéticos', available: true },
        { id: 4, name: 'Luciana Oliveira', specialty: 'Estética Avançada', phone: '(11) 99999-0000', email: 'luciana@clinicaestetica.com', schedule: 'Qua-Dom: 9h às 18h', description: 'Esteticista especializada em tratamentos corporais e faciais', available: true }
      ]
    };
  });

  // Função para buscar itens da categoria atual
  const getCurrentCategoryItems = () => {
    return categoryItems[selectedCategory as keyof typeof categoryItems] || [];
  };

  // Funções para editar e excluir itens
  const editItem = (item: any) => {
    if (selectedCategory === 'design' || selectedCategory === 'sites') {
      // Para portfólio (design e sites)
      setEditingPortfolioItem(item);
      setPortfolioItem({
        title: item.title || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        projectUrl: item.projectUrl || '',
        category: item.category || 'branding'
      });
      setShowEditPortfolioModal(true);
    } else {
      // Para outras categorias (produtos/catálogos/cardápios)
      setIsEditingItem(true);
      setEditingItemId(item.id);
      setNewItem({
        name: item.name || item.title || '',
        description: item.description || '',
        price: item.price?.toString() || '',
        category: item.category || 'produtos'
      });
      setShowAddItemModal(true);
    }
  };

  // Função para salvar item editado (não portfolio)
  const saveEditedItem = () => {
    if (!newItem.name) {
      alert('Por favor, preencha o nome do item.');
      return;
    }

    if (isEditingItem) {
      // Editar item existente
      setCategoryItems(prev => ({
        ...prev,
        [selectedCategory]: (prev[selectedCategory as keyof typeof prev] as any[])?.map((item: any) => 
          item.id === editingItemId 
            ? { 
                ...item, 
                name: newItem.name,
                description: newItem.description,
                price: parseFloat(newItem.price) || item.price,
                category: newItem.category
              }
            : item
        ) || []
      }));
      
      alert(selectedCategory !== 'design' && selectedCategory !== 'sites' 
        ? 'Item atualizado no catálogo e estoque com sucesso!' 
        : 'Item atualizado com sucesso!');
    } else {
      // Criar novo item
      if (selectedCategory === 'alimenticio') {
        saveMenuItemWithIngredients();
        return;
      } else {
        saveNewItem();
        return;
      }
    }

    // Reset do estado
    setShowAddItemModal(false);
    setIsEditingItem(false);
    setEditingItemId(null);
    setNewItem({ name: '', description: '', price: '', category: 'produtos' });
  };

  const deleteItem = (itemId: number) => {
    const item: any = getCurrentCategoryItems().find((item: any) => item.id === itemId);
    const itemName = item?.name || item?.title || 'Item';
    
    if (confirm(`Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`)) {
      // Remove do catálogo/cardápio/portfólio
      setCategoryItems(prev => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory as keyof typeof prev]?.filter((item: any) => item.id !== itemId) || []
      }));
      
      // Mensagens específicas por categoria
      if (selectedCategory === 'design' || selectedCategory === 'sites') {
        alert(`✅ Projeto "${itemName}" foi excluído do portfólio com sucesso!`);
      } else if (selectedCategory === 'alimenticio') {
        alert(`✅ Prato "${itemName}" foi removido do cardápio e estoque atualizado!`);
      } else {
        alert(`✅ Produto "${itemName}" foi excluído do catálogo e estoque sincronizado!`);
      }
    }
  };

  // Função para desativar/ativar item e sincronizar com estoque
  const toggleItemAvailability = (itemId: number) => {
    const currentItem: any = getCurrentCategoryItems().find((item: any) => item.id === itemId);
    if (!currentItem) return;
    
    const itemName = currentItem.name || currentItem.title || 'Item';
    const newStatus = !currentItem.available;

    setCategoryItems(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory as keyof typeof prev]?.map((catItem: any) => 
        catItem.id === itemId 
          ? { ...catItem, available: newStatus }
          : catItem
      ) || []
    }));

    // Mensagens específicas por categoria e status
    if (selectedCategory === 'design' || selectedCategory === 'sites') {
      const action = newStatus ? 'ativado' : 'desativado';
      alert(`🎨 Projeto "${itemName}" foi ${action} no portfólio!`);
    } else if (selectedCategory === 'alimenticio') {
      const action = newStatus ? 'disponível' : 'indisponível';
      alert(`🍽️ Prato "${itemName}" está agora ${action} no cardápio e estoque atualizado!`);
    } else {
      const action = newStatus ? 'ativado' : 'desativado';
      alert(`📦 Produto "${itemName}" foi ${action} no catálogo e estoque sincronizado!`);
    }
  };

  const saveEditedPortfolioItem = () => {
    if (!portfolioItem.title || !portfolioItem.description) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setCategoryItems(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory as keyof typeof prev]?.map((item: any) => 
        item.id === (editingPortfolioItem as any)?.id 
          ? { ...item, ...portfolioItem }
          : item
      ) || []
    }));

    setShowEditPortfolioModal(false);
    setEditingPortfolioItem(null);
    alert('Projeto atualizado com sucesso!');
  };

  // Funções para especialistas
  const addSpecialist = () => {
    if (!newSpecialist.name || !newSpecialist.specialty) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const specialist = {
      id: Date.now(),
      ...newSpecialist,
      available: true
    };

    setSpecialists(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory as keyof typeof prev] || []), specialist]
    }));

    setNewSpecialist({
      name: '',
      specialty: '',
      phone: '',
      email: '',
      schedule: '',
      description: ''
    });
    setShowAddSpecialistModal(false);
    alert('Especialista adicionado com sucesso!');
  };

  const getCurrentSpecialists = () => {
    return specialists[selectedCategory as keyof typeof specialists] || [];
  };

  // Função para buscar ingredientes do estoque (para categoria alimentícia)
  const getStockIngredients = () => {
    const stockItems = getCurrentCategoryItems();
    return stockItems.filter((item: any) => item.stock && item.stock > 0);
  };

  // Função para salvar item alimentício com ingredientes
  const saveMenuItemWithIngredients = () => {
    if (!newItem.name || selectedIngredients.length === 0) {
      alert('Por favor, preencha o nome do produto e selecione pelo menos um ingrediente.');
      return;
    }

    const stockItems = getCurrentCategoryItems();
    const ingredients = selectedIngredients.map(id => 
      stockItems.find((item: any) => item.id === id)
    ).filter(Boolean);

    const menuItem = {
      id: Date.now(),
      name: newItem.name,
      ingredients: ingredients,
      description: `Ingredientes: ${ingredients.map((ing: any) => ing.name).join(', ')}`,
      category: newItem.category,
      available: true
    };

    setCategoryItems(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory as keyof typeof prev] || []), menuItem]
    }));

    setNewItem({ name: '', description: '', price: '', category: 'pratos' });
    setSelectedIngredients([]);
    setShowAddItemModal(false);
    alert('Item do cardápio adicionado com sucesso!');
  };

  // Função para buscar dados do portfólio (legacy - pode ser removida)
  const getPortfolioData = () => {
    if (selectedCategory === 'design') {
      return [
        {
          id: 1,
          title: 'Identidade Visual - Café Aroma',
          description: 'Criação completa de marca para cafeteria, incluindo logotipo, paleta de cores e aplicações.',
          imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
          projectUrl: 'https://portfolio.exemplo.com/cafe-aroma',
          category: 'branding',
          date: '2024-12-20'
        },
        {
          id: 2,
          title: 'Material Gráfico - Clínica Saúde+',
          description: 'Desenvolvimento de cartões de visita, folders e banners para clínica médica.',
          imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
          projectUrl: 'https://portfolio.exemplo.com/clinica-saude',
          category: 'impressos',
          date: '2024-12-15'
        },
        {
          id: 3,
          title: 'Posts Redes Sociais - Tech Solutions',
          description: 'Criação de template e posts para empresa de tecnologia no Instagram e LinkedIn.',
          imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
          projectUrl: 'https://portfolio.exemplo.com/tech-solutions',
          category: 'digital',
          date: '2024-12-10'
        }
      ];
    } else if (selectedCategory === 'sites') {
      return [
        {
          id: 1,
          title: 'E-commerce - Loja Moda Urbana',
          description: 'Desenvolvimento de loja virtual responsiva com sistema de pagamento integrado.',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          projectUrl: 'https://modaurbana.exemplo.com',
          category: 'loja-virtual',
          date: '2024-12-18'
        },
        {
          id: 2,
          title: 'Site Institucional - Escritório Advocacia',
          description: 'Website profissional com blog integrado e formulário de contato.',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          projectUrl: 'https://advocacia-silva.exemplo.com',
          category: 'institucional',
          date: '2024-12-12'
        },
        {
          id: 3,
          title: 'Landing Page - Curso Online',
          description: 'Página de conversão otimizada para curso de marketing digital.',
          imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400',
          projectUrl: 'https://curso-marketing.exemplo.com',
          category: 'conversao',
          date: '2024-12-08'
        }
      ];
    }
    return [];
  };

  // Função para compartilhar
  const handleShare = (type: 'link' | 'qr') => {
    const url = generateShareUrl();
    setShareUrl(url);
    setShareType(type);
    
    if (type === 'qr') {
      // Gerar dados do QR Code
      const qrData = `${url}?utm_source=qr&category=${selectedCategory}`;
      setQrCodeData(qrData);
    }
    
    setShowShareModal(true);
  };

  // Função para copiar link principal
  const copyShareLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copiado para área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar link');
    }
  };

  // Função para adicionar novo item
  const handleAddItem = () => {
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: selectedCategory === 'alimenticio' ? 'pratos' : 'produtos'
    });
    setShowAddItemModal(true);
  };

  // Função para adicionar item ao portfólio
  const handleAddPortfolioItem = () => {
    setShowAddPortfolioModal(true);
  };

  // Função para salvar item do portfólio
  const savePortfolioItem = () => {
    if (portfolioItem.title && portfolioItem.description) {
      alert('✅ Projeto adicionado ao portfólio com sucesso!');
      setShowAddPortfolioModal(false);
      setPortfolioItem({
        title: '',
        description: '',
        imageUrl: '',
        projectUrl: '',
        category: selectedCategory === 'design' ? 'branding' : 'website'
      });
    } else {
      alert('Por favor, preencha pelo menos o título e descrição do projeto.');
    }
  };

  // Função para salvar novo item
  const saveNewItem = () => {
    if (newItem.name && newItem.price) {
      // Aqui seria a integração com a API
      console.log('Novo item adicionado:', {
        ...newItem,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        category: selectedCategory
      });
      
      alert(`${selectedCategory === 'alimenticio' ? 'Prato' : 'Produto'} "${newItem.name}" adicionado com sucesso!`);
      setShowAddItemModal(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: selectedCategory === 'alimenticio' ? 'pratos' : 'produtos'
      });
    } else {
      alert('Por favor, preencha ao menos o nome e o preço.');
    }
  };

  // Função para gerar QR Code SVG simples
  const generateQRCodeSVG = (data: string) => {
    // QR Code simples usando SVG - em produção usaria uma biblioteca como qrcode.js
    const size = 200;
    const modules = 21; // QR Code básico 21x21
    const moduleSize = size / modules;
    
    // Padrão simplificado de QR Code (demonstrativo)
    const pattern = Array(modules).fill(null).map(() => 
      Array(modules).fill(null).map(() => Math.random() > 0.5)
    );
    
    // Adicionar padrões de detecção (cantos)
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        pattern[i][modules - 1 - j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        pattern[modules - 1 - i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
      }
    }
    
    const rects = pattern.map((row, i) =>
      row.map((cell, j) => 
        cell ? `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>` : ''
      ).join('')
    ).join('');
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        ${rects}
      </svg>
    `;
  };



  // Tabs baseadas na categoria
  const getTabs = () => {
    let catalogLabel = 'Catálogos';
    if (selectedCategory === 'alimenticio') {
      catalogLabel = 'Cardápios';
    } else if (selectedCategory === 'design' || selectedCategory === 'sites') {
      catalogLabel = 'Portfólio';
    }
    
    const baseTabs = [
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle },
      { id: 'cardapios', label: catalogLabel, icon: ShoppingCart },
      { id: 'fidelizacao', label: 'Fidelização', icon: Gift }
    ];
    
    // Adicionar aba de especialistas para categorias clínicas
    if (selectedCategory === 'medico' || selectedCategory === 'pet' || selectedCategory === 'estetica') {
      baseTabs.splice(2, 0, { id: 'especialistas', label: 'Especialistas', icon: Users });
    }
    
    // Adicionar aba de pagamento para categorias alimentícias
    if (selectedCategory === 'alimenticio') {
      baseTabs.push({ id: 'pagamento', label: 'Pagamento', icon: CreditCard });
    }
    
    return baseTabs;
  };

  // Mensagens mockadas por categoria
  const getMessages = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, name: 'João Silva', message: 'Olá! Gostaria de fazer um pedido...', time: '14:30', status: 'pending' },
        { id: 2, name: 'Maria Santos', message: 'Vocês entregam na Zona Sul?', time: '14:15', status: 'responded' },
        { id: 3, name: 'Carlos Oliveira', message: 'Quanto fica uma pizza grande?', time: '13:45', status: 'bot' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, name: 'Ana Costa', message: 'Preciso de um orçamento para notebooks...', time: '15:20', status: 'pending' },
        { id: 2, name: 'Pedro Lima', message: 'Têm smartphones Samsung em estoque?', time: '14:50', status: 'responded' },
        { id: 3, name: 'Lucia Ferreira', message: 'Quando chega o novo lote de produtos?', time: '14:30', status: 'bot' }
      ];
    }
    return [
      { id: 1, name: 'Cliente 1', message: 'Olá, preciso de ajuda...', time: '14:30', status: 'pending' },
      { id: 2, name: 'Cliente 2', message: 'Como funciona o atendimento?', time: '14:15', status: 'responded' }
    ];
  };

  // Catálogos/Cardápios por categoria
  const getCatalogs = () => {
    if (selectedCategory === 'alimenticio') {
      // Para alimentício, mantém gestão manual do cardápio
      return [
        { id: 1, name: 'Pizza Margherita', price: 'R$ 35,00', description: 'Molho de tomate, mussarela e manjericão', category: 'Pizzas' },
        { id: 2, name: 'Hambúrguer Artesanal', price: 'R$ 28,00', description: '180g de carne, queijo, alface e tomate', category: 'Hambúrgueres' },
        { id: 3, name: 'Refrigerante 350ml', price: 'R$ 5,00', description: 'Coca-Cola, Pepsi ou Guaraná', category: 'Bebidas' }
      ];
    } else {
      // Para outras categorias, puxar automaticamente do estoque
      const stockProducts = getCurrentCategoryItems();
      return stockProducts.map((product: any) => ({
        id: product.id,
        name: product.name || product.title,
        price: product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sob consulta',
        description: product.description,
        category: product.category,
        stock: product.stock,
        isFromStock: true
      }));
    }
  };

  const renderMessages = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Conversas WhatsApp</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Bot Online
            </div>
          </div>
        </div>

        <div className="item-list">
          {getMessages().map((msg) => (
            <div key={msg.id} className="list-item">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">{msg.name}</h4>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {msg.status === 'pending' && (
                  <span className="badge badge-warning">Pendente</span>
                )}
                {msg.status === 'responded' && (
                  <span className="badge badge-success">Respondido</span>
                )}
                {msg.status === 'bot' && (
                  <span className="badge badge-info">Bot</span>
                )}
                <button className="btn btn-outline p-2">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar aba de portfólio para design e sites
  const renderPortfolio = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Portfólio {selectedCategory === 'design' ? 'de Design' : 'de Desenvolvimento'}
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleShare('link')}
              className="btn btn-outline flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar Portfolio
            </button>
            <button 
              onClick={() => handleShare('qr')}
              className="btn btn-outline flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            <button 
              onClick={handleAddPortfolioItem}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Adicionar Projeto
            </button>
          </div>
        </div>

        {/* Aviso sobre portfólio */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-purple-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Portfólio Profissional</span>
          </div>
          <p className="text-sm text-purple-600 mt-1">
            Adicione seus melhores trabalhos com imagens e links para impressionar clientes. 
            Compartilhe via link direto ou QR code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getPortfolioData().map((project: any) => (
            <div key={project.id} className="content-card group hover:shadow-xl transition-all duration-300">
              <div className="relative mb-4">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200/9333ea/ffffff?text=Projeto';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="badge badge-primary">{project.category}</span>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                  >
                    <Link className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-2">{project.title}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{project.date}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => editItem(project)}
                    className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                    title="Editar projeto"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleItemAvailability(project.id)}
                    className={`p-2 border rounded-md transition-colors ${
                      project.available 
                        ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50' 
                        : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}
                    title={project.available ? 'Desativar projeto' : 'Ativar projeto'}
                  >
                    {project.available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => deleteItem(project.id)}
                    className="p-2 border border-red-300 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Excluir projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSpecialists = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === 'medico' ? 'Especialistas Médicos' : 
             selectedCategory === 'pet' ? 'Especialistas Veterinários' : 
             'Especialistas em Estética'}
          </h3>
          <button 
            onClick={() => setShowAddSpecialistModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Especialista
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentSpecialists().map((specialist: any) => (
            <div key={specialist.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{specialist.name}</h4>
                    <span className="text-sm text-gray-600">{specialist.specialty}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {specialist.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{specialist.phone}</span>
                  </div>
                )}
                {specialist.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{specialist.email}</span>
                  </div>
                )}
                {specialist.schedule && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{specialist.schedule}</span>
                  </div>
                )}
              </div>

              {specialist.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{specialist.description}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className={`badge ${specialist.available ? 'badge-success' : 'badge-secondary'}`}>
                  {specialist.available ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {getCurrentSpecialists().length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Nenhum especialista cadastrado</h4>
            <p className="text-gray-500">Adicione especialistas para gerenciar sua equipe</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCatalogs = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === 'alimenticio' ? 'Cardápio Digital' : 'Catálogo de Produtos'}
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleShare('link')}
              className="btn btn-outline flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar Link
            </button>
            <button 
              onClick={() => handleShare('qr')}
              className="btn btn-outline flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            {selectedCategory === 'alimenticio' && (
              <button 
                onClick={handleAddItem}
                className="btn btn-primary"
              >
                <ShoppingCart className="w-4 h-4" />
                Adicionar Item
              </button>
            )}
          </div>
        </div>

        {/* Aviso de integração automática */}
        {selectedCategory !== 'alimenticio' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Sincronização Automática com Estoque</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Os produtos abaixo são carregados automaticamente do seu estoque. 
              Para gerenciar produtos, vá para a seção Estoque.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCatalogs().map((item: any) => (
            <div key={item.id} className="content-card hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <span className="badge badge-primary">{item.category}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{item.price}</span>
                  {item.isFromStock && (
                    <p className="text-xs text-gray-500 mt-1">
                      Estoque: {item.stock} unidades
                    </p>
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              {item.isFromStock && item.stock <= 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                  <p className="text-xs text-yellow-700">⚠️ Estoque baixo - apenas {item.stock} unidades</p>
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => editItem(item)}
                  className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  title="Editar item"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`p-2 border rounded-md transition-colors ${
                    item.available 
                      ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50' 
                      : 'border-green-300 text-green-600 hover:bg-green-50'
                  }`}
                  title={item.available ? 'Desativar item' : 'Ativar item'}
                >
                  {item.available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 border border-red-300 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  title="Excluir item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar aba de pagamento
  const renderPayment = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Sistema de Pagamentos</h3>
            <p className="text-sm text-gray-600">Pagamentos automáticos via PIX e Cartão</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="content-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">PIX Automático</h4>
                <p className="text-sm text-gray-600">Pagamento instantâneo</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxa</span>
                <span className="font-medium text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tempo de processamento</span>
                <span className="font-medium">Instantâneo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Status</span>
                <span className="badge badge-success">Ativo</span>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Cartão de Crédito</h4>
                <p className="text-sm text-gray-600">Parcelamento disponível</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxa</span>
                <span className="font-medium text-blue-600">2.9%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Parcelamento</span>
                <span className="font-medium">Até 12x</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Status</span>
                <span className="badge badge-success">Ativo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h4 className="font-medium text-gray-800 mb-4">Transações Recentes</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pedido #1234 - João Silva</p>
                  <p className="text-xs text-gray-600">PIX • Hoje às 14:30</p>
                </div>
              </div>
              <span className="font-medium text-green-600">R$ 45,90</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pedido #1233 - Maria Santos</p>
                  <p className="text-xs text-gray-600">Cartão 3x • Hoje às 13:15</p>
                </div>
              </div>
              <span className="font-medium text-blue-600">R$ 89,70</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal de compartilhamento
  const renderShareModal = () => {
    if (!showShareModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {shareType === 'qr' ? 'QR Code para Compartilhar' : 'Link de Compartilhamento'}
            </h3>
            <button 
              onClick={() => setShowShareModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {shareType === 'qr' ? (
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Escaneie o QR Code para acessar o {selectedCategory === 'alimenticio' ? 'cardápio' : 'catálogo'}
              </p>
              <button className="btn btn-outline w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Baixar QR Code
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 break-all">{shareUrl}</span>
                </div>
              </div>
              <button 
                onClick={() => copyShareLink(shareUrl)}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Link
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar aba de fidelização
  const renderLoyalty = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Programa de Fidelização</h3>
              <p className="text-sm text-gray-600">Campanhas e promoções para retenção de clientes</p>
            </div>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>

        {/* Métricas de Fidelização */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="content-card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-800">Clientes Ativos</h4>
            <p className="text-2xl font-bold text-purple-600 mt-1">1,247</p>
            <p className="text-xs text-green-600 mt-1">+15% este mês</p>
          </div>

          <div className="content-card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-800">Taxa de Conversão</h4>
            <p className="text-2xl font-bold text-green-600 mt-1">23.5%</p>
            <p className="text-xs text-blue-600 mt-1">Campanhas ativas</p>
          </div>

          <div className="content-card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800">Retenção</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">78%</p>
            <p className="text-xs text-purple-600 mt-1">90 dias</p>
          </div>

          <div className="content-card text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-800">Mensagens Enviadas</h4>
            <p className="text-2xl font-bold text-yellow-600 mt-1">3,892</p>
            <p className="text-xs text-gray-600 mt-1">Este mês</p>
          </div>
        </div>

        {/* Campanhas Ativas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-4">Campanhas Ativas</h4>
          <div className="space-y-4">
            <div className="content-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">
                      {selectedCategory === 'alimenticio' ? 'Desconto 20% - Pizza Margherita' : 'Black Friday - Eletrônicos'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedCategory === 'alimenticio' 
                        ? 'Promoção especial para novos clientes' 
                        : 'Descontos em smartphones e notebooks'
                      }
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Enviado para 856 clientes</span>
                      <span className="text-xs text-green-600">142 conversões</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-success">Ativa</span>
                  <p className="text-sm text-gray-600 mt-1">Expira em 5 dias</p>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">
                      {selectedCategory === 'alimenticio' ? 'Cliente VIP - Frete Grátis' : 'Programa VIP - Desconto Progressivo'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedCategory === 'alimenticio' 
                        ? 'Entrega gratuita para pedidos acima de R$ 50' 
                        : 'Descontos crescentes baseados em compras'
                      }
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Enviado para 234 clientes VIP</span>
                      <span className="text-xs text-blue-600">78 utilizações</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-info">Permanente</span>
                  <p className="text-sm text-gray-600 mt-1">Sempre ativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipos de Campanha */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Criar Nova Campanha</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="content-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Desconto por Categoria</h5>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedCategory === 'alimenticio' 
                    ? 'Promoções em pizzas, bebidas e sobremesas' 
                    : 'Descontos em eletrônicos, roupas e casa'
                  }
                </p>
                <button className="btn btn-outline w-full">Criar Campanha</button>
              </div>
            </div>

            <div className="content-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Promoção Sazonal</h5>
                <p className="text-sm text-gray-600 mb-4">Campanhas para datas especiais e feriados</p>
                <button className="btn btn-outline w-full">Criar Campanha</button>
              </div>
            </div>

            <div className="content-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Reativação de Clientes</h5>
                <p className="text-sm text-gray-600 mb-4">Ofertas especiais para clientes inativos</p>
                <button className="btn btn-outline w-full">Criar Campanha</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mensagens':
        return renderMessages();
      case 'cardapios':
        // Para design e sites, mostrar portfólio ao invés de catálogo
        if (selectedCategory === 'design' || selectedCategory === 'sites') {
          return renderPortfolio();
        }
        return renderCatalogs();
      case 'especialistas':
        return renderSpecialists();
      case 'fidelizacao':
        return renderLoyalty();
      case 'pagamento':
        return renderPayment();
      default:
        return renderMessages();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Atendimento ao Cliente</h1>
        <p className="section-subtitle">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - 
          Sistema completo de atendimento WhatsApp com IA
        </p>
      </div>

      {/* Métricas de Atendimento */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversas Ativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              <p className="text-xs text-green-600 mt-1">+12% hoje</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bot Ativo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89%</p>
              <p className="text-xs text-blue-600 mt-1">Taxa de resolução</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
              <p className="text-xs text-purple-600 mt-1">+23% semana</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2min</p>
              <p className="text-xs text-yellow-600 mt-1">Resposta IA</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="tab-navigation">
        {getTabs().map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Tab clicked:', tab.id);
              setActiveTab(tab.id);
            }}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            type="button"
            style={{ 
              cursor: 'pointer',
              pointerEvents: 'auto',
              userSelect: 'none'
            }}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {renderTabContent()}
      
      {/* Modal de Compartilhamento */}
      {renderShareModal()}
      
      {/* Modal de Adicionar Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditingItem ? 'Editar' : 'Adicionar'} {selectedCategory === 'alimenticio' ? 'Prato' : 'Produto'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddItemModal(false);
                  setIsEditingItem(false);
                  setEditingItemId(null);
                  setNewItem({ name: '', description: '', price: '', category: 'produtos' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={selectedCategory === 'alimenticio' ? 'Ex: Pizza Margherita' : 'Ex: Smartphone XYZ'}
                />
              </div>
              
              {selectedCategory === 'alimenticio' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredientes *
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                    {getStockIngredients().map((ingredient: any) => (
                      <label key={ingredient.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedIngredients.includes(ingredient.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIngredients([...selectedIngredients, ingredient.id]);
                            } else {
                              setSelectedIngredients(selectedIngredients.filter(id => id !== ingredient.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{ingredient.name}</span>
                        <span className="text-xs text-gray-500">(Estoque: {ingredient.stock})</span>
                      </label>
                    ))}
                  </div>
                  {getStockIngredients().length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">Nenhum ingrediente disponível no estoque</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Características e especificações..."
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço *
                </label>
                <input
                  type="text"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {selectedCategory === 'alimenticio' ? (
                    <>
                      <option value="pratos">Pratos Principais</option>
                      <option value="bebidas">Bebidas</option>
                      <option value="sobremesas">Sobremesas</option>
                      <option value="entradas">Entradas</option>
                    </>
                  ) : (
                    <>
                      <option value="produtos">Produtos Gerais</option>
                      <option value="promocoes">Promoções</option>
                      <option value="lancamentos">Lançamentos</option>
                      <option value="destaque">Em Destaque</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddItemModal(false);
                  setIsEditingItem(false);
                  setEditingItemId(null);
                  setNewItem({ name: '', description: '', price: '', category: 'produtos' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveEditedItem}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {isEditingItem ? 'Salvar Alterações' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Projeto ao Portfólio */}
      {showAddPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Adicionar Projeto ao Portfólio
              </h3>
              <button 
                onClick={() => setShowAddPortfolioModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  value={portfolioItem.title}
                  onChange={(e) => setPortfolioItem({ ...portfolioItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Identidade Visual - Empresa ABC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  value={portfolioItem.description}
                  onChange={(e) => setPortfolioItem({ ...portfolioItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Descreva o projeto e os resultados alcançados..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={portfolioItem.imageUrl}
                  onChange={(e) => setPortfolioItem({ ...portfolioItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link do Projeto
                </label>
                <input
                  type="url"
                  value={portfolioItem.projectUrl}
                  onChange={(e) => setPortfolioItem({ ...portfolioItem, projectUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://projeto.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={portfolioItem.category}
                  onChange={(e) => setPortfolioItem({ ...portfolioItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {selectedCategory === 'design' ? (
                    <>
                      <option value="branding">Identidade Visual</option>
                      <option value="impressos">Material Gráfico</option>
                      <option value="digital">Design Digital</option>
                      <option value="publicidade">Publicidade</option>
                    </>
                  ) : (
                    <>
                      <option value="website">Site Institucional</option>
                      <option value="loja-virtual">E-commerce</option>
                      <option value="conversao">Landing Page</option>
                      <option value="sistema">Sistema Web</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPortfolioModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={savePortfolioItem}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Adicionar Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Especialista */}
      {showAddSpecialistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Adicionar Especialista {selectedCategory === 'medico' ? 'Médico' : 
                                       selectedCategory === 'pet' ? 'Veterinário' : 
                                       'em Estética'}
              </h3>
              <button 
                onClick={() => setShowAddSpecialistModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={newSpecialist.name}
                  onChange={(e) => setNewSpecialist({ ...newSpecialist, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Dr. João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade *
                </label>
                <input
                  type="text"
                  value={newSpecialist.specialty}
                  onChange={(e) => setNewSpecialist({ ...newSpecialist, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={selectedCategory === 'medico' ? 'Cardiologia' : 
                              selectedCategory === 'pet' ? 'Clínica Geral' : 
                              'Harmonização Facial'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={newSpecialist.phone}
                  onChange={(e) => setNewSpecialist({ ...newSpecialist, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={newSpecialist.email}
                  onChange={(e) => setNewSpecialist({ ...newSpecialist, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="doutor@clinica.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Atendimento
                </label>
                <input
                  type="text"
                  value={newSpecialist.schedule}
                  onChange={(e) => setNewSpecialist({ ...newSpecialist, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Seg-Sex: 8h às 18h"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição/Experiência
                </label>
                <textarea
                  value={newSpecialist.description}
                  onChange={(e) => setNewSpecialist({ ...newSpecialist, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Experiência e especialidades do profissional..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddSpecialistModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={addSpecialist}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Adicionar Especialista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtendimentoSection;