// Comprehensive Mock Data System for All Business Categories
// This file contains realistic and varied data for each business category

export interface Product {
  id: number;
  name: string;
  category: string;
  stock?: number;
  minStock?: number;
  price: number;
  description?: string;
  isPerishable?: boolean;
  expiryDate?: string;
  manufacturingDate?: string;
  status?: string;
  available: boolean;
  image?: string;
}

export interface Sale {
  id: number;
  date: string;
  client: string;
  items: string[];
  total: number;
  status: string;
  category?: string;
  paymentMethod?: string;
  quantity?: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastOrder: string;
  totalSpent: number;
  status: string;
  category?: string;
  address?: string;
  type?: string;
}

export interface Appointment {
  id: number;
  title: string;
  client: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
  service?: string;
}

export interface Specialist {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  schedule: string;
  description: string;
  available: boolean;
  rating?: number;
  experience?: string;
}

export interface WhatsAppConversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  category?: string;
  avatar?: string;
}

export interface Activity {
  id: number;
  timestamp: Date;
  type: string;
  action: string;
  description: string;
  category: string;
  status: string;
  user: string;
  details?: any;
}

// Products for each category
export const categoryProducts: Record<string, Product[]> = {
  alimenticio: [
    { id: 1, name: 'Pizza Margherita', category: 'pizzas', stock: 50, minStock: 10, price: 35.00, description: 'Pizza tradicional com manjericão fresco', isPerishable: true, expiryDate: '2025-02-15', available: true },
    { id: 2, name: 'Hambúrguer Artesanal', category: 'hamburgueres', stock: 25, minStock: 8, price: 28.90, description: 'Hambúrguer 180g com fritas artesanais', isPerishable: true, expiryDate: '2025-01-05', available: true },
    { id: 3, name: 'Lasanha Bolonhesa', category: 'massas', stock: 15, minStock: 5, price: 32.50, description: 'Lasanha tradicional com molho bolonhesa', isPerishable: true, expiryDate: '2025-01-08', available: true },
    { id: 4, name: 'Salmão Grelhado', category: 'peixes', stock: 8, minStock: 3, price: 45.00, description: 'Salmão fresco grelhado com legumes', isPerishable: true, expiryDate: '2024-12-28', available: true },
    { id: 5, name: 'Suco Natural de Laranja', category: 'bebidas', stock: 30, minStock: 15, price: 8.50, description: 'Suco natural de laranja 300ml', isPerishable: true, expiryDate: '2025-01-15', available: true },
    { id: 6, name: 'Refrigerante Cola 350ml', category: 'bebidas', stock: 3, minStock: 20, price: 5.00, description: 'Refrigerante sabor cola gelado', isPerishable: true, expiryDate: '2025-06-15', available: true },
    { id: 7, name: 'Água Mineral 500ml', category: 'bebidas', stock: 45, minStock: 25, price: 3.50, description: 'Água mineral natural sem gás', isPerishable: false, available: true },
    { id: 8, name: 'Tiramisù', category: 'sobremesas', stock: 12, minStock: 4, price: 15.90, description: 'Sobremesa italiana tradicional', isPerishable: true, expiryDate: '2025-01-02', available: true },
    { id: 9, name: 'Sorvete Chocolate', category: 'sobremesas', stock: 0, minStock: 5, price: 12.00, description: 'Sorvete artesanal de chocolate', isPerishable: true, expiryDate: '2025-03-20', available: false },
    { id: 10, name: 'Torta de Limão', category: 'sobremesas', stock: 8, minStock: 3, price: 18.50, description: 'Torta cremosa de limão siciliano', isPerishable: true, expiryDate: '2025-01-10', available: true }
  ],

  pet: [
    { id: 1, name: 'Ração Premium Golden Adulto', category: 'racao', stock: 25, minStock: 10, price: 89.90, description: 'Ração premium para cães adultos de grande porte', available: true },
    { id: 2, name: 'Ração Royal Canin Filhote', category: 'racao', stock: 18, minStock: 8, price: 125.00, description: 'Ração específica para filhotes até 12 meses', available: true },
    { id: 3, name: 'Ração Whiskas Gatos', category: 'racao', stock: 32, minStock: 15, price: 65.50, description: 'Ração para gatos adultos sabor peixe', available: true },
    { id: 4, name: 'Antipulgas Frontline Plus', category: 'medicamentos', stock: 12, minStock: 5, price: 45.50, description: 'Proteção contra pulgas e carrapatos por 30 dias', available: true },
    { id: 5, name: 'Vermífugo Drontal Plus', category: 'medicamentos', stock: 8, minStock: 4, price: 28.90, description: 'Vermífugo de amplo espectro para cães', available: true },
    { id: 6, name: 'Vitamina Pet Tabs', category: 'medicamentos', stock: 15, minStock: 6, price: 35.00, description: 'Complexo vitamínico para pets', available: true },
    { id: 7, name: 'Brinquedo Kong Classic', category: 'brinquedos', stock: 20, minStock: 8, price: 32.00, description: 'Brinquedo resistente para cães', available: true },
    { id: 8, name: 'Bolinha de Tênis', category: 'brinquedos', stock: 45, minStock: 20, price: 8.50, description: 'Bolinha de tênis para cães', available: true },
    { id: 9, name: 'Arranhador para Gatos', category: 'acessorios', stock: 6, minStock: 3, price: 85.00, description: 'Arranhador vertical para gatos', available: true },
    { id: 10, name: 'Coleira GPS PetTracker', category: 'acessorios', stock: 4, minStock: 2, price: 199.00, description: 'Coleira com GPS para localização em tempo real', available: true },
    { id: 11, name: 'Shampoo Neutro Sanol', category: 'higiene', stock: 22, minStock: 10, price: 18.90, description: 'Shampoo neutro para todos os tipos de pelo', available: true },
    { id: 12, name: 'Petisco Natural Ossinho', category: 'petiscos', stock: 35, minStock: 15, price: 12.50, description: 'Ossinhos naturais para cães', available: true }
  ],

  medico: [
    { id: 1, name: 'Dipirona 500mg', category: 'analgesicos', stock: 150, minStock: 50, price: 15.90, description: 'Analgésico e antipirético', available: true },
    { id: 2, name: 'Ibuprofeno 600mg', category: 'analgesicos', stock: 80, minStock: 30, price: 22.50, description: 'Anti-inflamatório não esteroidal', available: true },
    { id: 3, name: 'Paracetamol 750mg', category: 'analgesicos', stock: 120, minStock: 40, price: 18.90, description: 'Analgésico e antitérmico', available: true },
    { id: 4, name: 'Amoxicilina 500mg', category: 'antibioticos', stock: 60, minStock: 25, price: 25.00, description: 'Antibiótico de amplo espectro', available: true },
    { id: 5, name: 'Azitromicina 500mg', category: 'antibioticos', stock: 45, minStock: 20, price: 35.50, description: 'Antibiótico macrolídeo', available: true },
    { id: 6, name: 'Cefalexina 500mg', category: 'antibioticos', stock: 35, minStock: 15, price: 28.90, description: 'Antibiótico cefalosporínico', available: true },
    { id: 7, name: 'Termômetro Digital', category: 'equipamentos', stock: 25, minStock: 10, price: 89.90, description: 'Termômetro clínico digital preciso', available: true },
    { id: 8, name: 'Esfigmomanômetro', category: 'equipamentos', stock: 8, minStock: 3, price: 185.00, description: 'Aparelho para medir pressão arterial', available: true },
    { id: 9, name: 'Estetoscópio Duplo', category: 'equipamentos', stock: 12, minStock: 5, price: 125.00, description: 'Estetoscópio para ausculta cardíaca', available: true },
    { id: 10, name: 'Vitamina C 1g', category: 'suplementos', stock: 200, minStock: 80, price: 18.50, description: 'Suplemento de vitamina C', available: true },
    { id: 11, name: 'Vitamina D3 2000ui', category: 'suplementos', stock: 85, minStock: 30, price: 32.90, description: 'Suplemento de vitamina D3', available: true },
    { id: 12, name: 'Ômega 3 1000mg', category: 'suplementos', stock: 95, minStock: 35, price: 45.00, description: 'Suplemento de ácidos graxos ômega 3', available: true }
  ],

  tecnologia: [
    { id: 1, name: 'Processador Intel Core i7-13700K', category: 'componentes', stock: 8, minStock: 3, price: 1899.00, description: 'Processador Intel Core i7 13ª geração', available: true },
    { id: 2, name: 'Placa de Vídeo RTX 4070', category: 'componentes', stock: 5, minStock: 2, price: 2899.00, description: 'GPU NVIDIA RTX 4070 12GB GDDR6X', available: true },
    { id: 3, name: 'Placa-Mãe ASUS ROG Strix', category: 'componentes', stock: 12, minStock: 5, price: 899.00, description: 'Placa-mãe para processadores Intel', available: true },
    { id: 4, name: 'Memória RAM 32GB DDR5', category: 'componentes', stock: 15, minStock: 6, price: 649.00, description: 'Kit memória DDR5 5600MHz 32GB', available: true },
    { id: 5, name: 'SSD NVMe 1TB Samsung 980', category: 'armazenamento', stock: 25, minStock: 10, price: 389.00, description: 'SSD NVMe M.2 1TB alta velocidade', available: true },
    { id: 6, name: 'HD Seagate 2TB 7200rpm', category: 'armazenamento', stock: 18, minStock: 8, price: 299.00, description: 'HD interno 2TB para armazenamento', available: true },
    { id: 7, name: 'Monitor LG 27" 4K UltraWide', category: 'monitores', stock: 6, minStock: 2, price: 1299.00, description: 'Monitor 27 polegadas 4K UltraWide', available: true },
    { id: 8, name: 'Monitor Gamer 24" 144Hz', category: 'monitores', stock: 12, minStock: 5, price: 899.00, description: 'Monitor gamer 24" Full HD 144Hz', available: true },
    { id: 9, name: 'Teclado Mecânico RGB', category: 'perifericos', stock: 20, minStock: 8, price: 289.00, description: 'Teclado mecânico com iluminação RGB', available: true },
    { id: 10, name: 'Mouse Gamer Logitech G502', category: 'perifericos', stock: 28, minStock: 12, price: 189.00, description: 'Mouse gamer com sensor de alta precisão', available: true },
    { id: 11, name: 'Fonte 850W 80+ Gold', category: 'componentes', stock: 10, minStock: 4, price: 599.00, description: 'Fonte modular 850W certificação 80+ Gold', available: true },
    { id: 12, name: 'Gabinete Gamer RGB', category: 'gabinetes', stock: 7, minStock: 3, price: 459.00, description: 'Gabinete gamer com iluminação RGB', available: true }
  ],

  vendas: [
    { id: 1, name: 'iPhone 15 Pro 256GB', category: 'eletronicos', stock: 4, minStock: 2, price: 6999.99, description: 'Smartphone Apple iPhone 15 Pro', available: true },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'eletronicos', stock: 6, minStock: 3, price: 5299.99, description: 'Smartphone Samsung Galaxy S24 Ultra', available: true },
    { id: 3, name: 'MacBook Air M3', category: 'eletronicos', stock: 3, minStock: 1, price: 8999.99, description: 'Notebook Apple MacBook Air com chip M3', available: true },
    { id: 4, name: 'Notebook Dell Inspiron', category: 'eletronicos', stock: 8, minStock: 4, price: 2899.99, description: 'Notebook Dell Inspiron i5 16GB', available: true },
    { id: 5, name: 'Smart TV 65" OLED LG', category: 'eletronicos', stock: 2, minStock: 1, price: 4599.99, description: 'Smart TV OLED 65 polegadas 4K', available: true },
    { id: 6, name: 'Camiseta Polo Lacoste', category: 'vestuario', stock: 35, minStock: 15, price: 299.99, description: 'Camiseta polo masculina original', available: true },
    { id: 7, name: 'Jeans Premium Diesel', category: 'vestuario', stock: 28, minStock: 12, price: 459.99, description: 'Calça jeans premium masculina', available: true },
    { id: 8, name: 'Vestido Social Feminino', category: 'vestuario', stock: 22, minStock: 10, price: 189.99, description: 'Vestido social feminino elegante', available: true },
    { id: 9, name: 'Tênis Nike Air Max', category: 'calcados', stock: 15, minStock: 6, price: 599.99, description: 'Tênis Nike Air Max original', available: true },
    { id: 10, name: 'Sapato Social Couro', category: 'calcados', stock: 18, minStock: 8, price: 389.99, description: 'Sapato social masculino em couro', available: true },
    { id: 11, name: 'Relógio Rolex Submariner', category: 'acessorios', stock: 1, minStock: 1, price: 45999.99, description: 'Relógio de luxo Rolex Submariner', available: true },
    { id: 12, name: 'Bolsa Louis Vuitton', category: 'acessorios', stock: 3, minStock: 1, price: 8999.99, description: 'Bolsa feminina Louis Vuitton original', available: true }
  ],

  educacao: [
    { id: 1, name: 'Livro Cálculo Vol. 1 - Stewart', category: 'livros', stock: 45, minStock: 20, price: 189.90, description: 'Livro de cálculo diferencial e integral', available: true },
    { id: 2, name: 'Atlas Geográfico Mundial', category: 'livros', stock: 32, minStock: 15, price: 87.90, description: 'Atlas geográfico mundial atualizado', available: true },
    { id: 3, name: 'Dicionário Michaelis Inglês', category: 'livros', stock: 28, minStock: 12, price: 65.90, description: 'Dicionário inglês-português completo', available: true },
    { id: 4, name: 'Kit Experimentos Química', category: 'materiais', stock: 15, minStock: 6, price: 145.50, description: 'Kit completo para experimentos de química', available: true },
    { id: 5, name: 'Microscópio Escolar 400x', category: 'materiais', stock: 8, minStock: 3, price: 289.00, description: 'Microscópio para uso educacional', available: true },
    { id: 6, name: 'Kit Robótica Arduino', category: 'materiais', stock: 12, minStock: 5, price: 199.90, description: 'Kit educacional de robótica com Arduino', available: true },
    { id: 7, name: 'Calculadora Científica HP', category: 'papelaria', stock: 35, minStock: 15, price: 125.00, description: 'Calculadora científica HP-12C', available: true },
    { id: 8, name: 'Régua T Técnica 60cm', category: 'papelaria', stock: 50, minStock: 20, price: 28.50, description: 'Régua T para desenho técnico', available: true },
    { id: 9, name: 'Compasso Técnico Staedtler', category: 'papelaria', stock: 42, minStock: 18, price: 45.90, description: 'Compasso profissional para desenho', available: true },
    { id: 10, name: 'Tablet Educacional 10"', category: 'tecnologia', stock: 6, minStock: 3, price: 899.99, description: 'Tablet com aplicativos educacionais', available: true },
    { id: 11, name: 'Projetor Multimídia', category: 'tecnologia', stock: 4, minStock: 2, price: 1299.99, description: 'Projetor para apresentações escolares', available: true },
    { id: 12, name: 'Lousa Digital Interativa', category: 'tecnologia', stock: 2, minStock: 1, price: 2899.99, description: 'Lousa digital interativa para salas de aula', available: true }
  ],

  beleza: [
    { id: 1, name: 'Shampoo L\'Oréal Profissional', category: 'cabelos', stock: 48, minStock: 20, price: 89.90, description: 'Shampoo profissional para cabelos danificados', available: true },
    { id: 2, name: 'Condicionador Kerastase', category: 'cabelos', stock: 35, minStock: 15, price: 125.90, description: 'Condicionador reparador intensivo', available: true },
    { id: 3, name: 'Máscara Capilar Olaplex', category: 'cabelos', stock: 22, minStock: 10, price: 179.90, description: 'Máscara reparadora de vínculos capilares', available: true },
    { id: 4, name: 'Base Líquida Fenty Beauty', category: 'maquiagem', stock: 28, minStock: 12, price: 159.90, description: 'Base líquida com 40 tons', available: true },
    { id: 5, name: 'Paleta de Sombras Urban Decay', category: 'maquiagem', stock: 18, minStock: 8, price: 289.90, description: 'Paleta com 12 sombras profissionais', available: true },
    { id: 6, name: 'Batom Líquido MAC', category: 'maquiagem', stock: 45, minStock: 18, price: 98.90, description: 'Batom líquido matte de longa duração', available: true },
    { id: 7, name: 'Perfume Chanel No. 5', category: 'perfumaria', stock: 8, minStock: 3, price: 899.90, description: 'Perfume feminino clássico Chanel', available: true },
    { id: 8, name: 'Perfume Dior Sauvage', category: 'perfumaria', stock: 12, minStock: 5, price: 459.90, description: 'Perfume masculino Dior Sauvage', available: true },
    { id: 9, name: 'Água de Colônia Natura', category: 'perfumaria', stock: 25, minStock: 10, price: 89.90, description: 'Água de colônia nacional', available: true },
    { id: 10, name: 'Sérum Vitamina C Skinceuticals', category: 'skincare', stock: 15, minStock: 6, price: 289.90, description: 'Sérum antioxidante com vitamina C', available: true },
    { id: 11, name: 'Protetor Solar La Roche-Posay', category: 'skincare', stock: 38, minStock: 15, price: 78.90, description: 'Protetor solar facial FPS 60', available: true },
    { id: 12, name: 'Creme Anti-idade Estée Lauder', category: 'skincare', stock: 20, minStock: 8, price: 459.90, description: 'Creme facial anti-idade premium', available: true }
  ],

  estetica: [
    { id: 1, name: 'Ácido Hialurônico Juvederm', category: 'injetaveis', stock: 15, minStock: 5, price: 899.00, description: 'Preenchimento facial de alta qualidade', available: true },
    { id: 2, name: 'Botox Allergan 100ui', category: 'injetaveis', stock: 8, minStock: 3, price: 1250.00, description: 'Toxina botulínica para rugas de expressão', available: true },
    { id: 3, name: 'Sculptra Poly-L-Láctico', category: 'injetaveis', stock: 6, minStock: 2, price: 1899.00, description: 'Bioestimulador de colágeno', available: true },
    { id: 4, name: 'Peeling TCA 35%', category: 'tratamentos', stock: 25, minStock: 10, price: 180.00, description: 'Peeling químico para renovação celular', available: true },
    { id: 5, name: 'Microagulhamento Facial', category: 'tratamentos', stock: 30, minStock: 12, price: 120.00, description: 'Estimulação natural de colágeno', available: true },
    { id: 6, name: 'Hydrafacial Completo', category: 'tratamentos', stock: 20, minStock: 8, price: 350.00, description: 'Limpeza profunda e hidratação facial', available: true },
    { id: 7, name: 'Laser CO2 Fracionado', category: 'equipamentos', stock: 1, minStock: 1, price: 89999.00, description: 'Equipamento para rejuvenescimento', available: true },
    { id: 8, name: 'Radiofrequência Accent', category: 'equipamentos', stock: 1, minStock: 1, price: 45999.00, description: 'Equipamento para flacidez', available: true },
    { id: 9, name: 'Criolipólise CoolSculpting', category: 'equipamentos', stock: 1, minStock: 1, price: 125999.00, description: 'Equipamento para redução de gordura', available: true },
    { id: 10, name: 'Fios de PDO Mono', category: 'fios', stock: 50, minStock: 20, price: 45.00, description: 'Fios de sustentação facial', available: true },
    { id: 11, name: 'Fios de PDO Espira', category: 'fios', stock: 35, minStock: 15, price: 65.00, description: 'Fios lifting facial', available: true },
    { id: 12, name: 'Anestésico Tópico EMLA', category: 'anestesicos', stock: 28, minStock: 12, price: 35.90, description: 'Anestésico tópico para procedimentos', available: true }
  ]
};

// Sales data for each category
export const categorySales: Record<string, Sale[]> = {
  alimenticio: [
    { id: 1, date: '2024-12-26', client: 'Mesa 5', items: ['Pizza Margherita x2', 'Refrigerante x2'], total: 81.00, status: 'Concluída', paymentMethod: 'Dinheiro' },
    { id: 2, date: '2024-12-26', client: 'Delivery - João Silva', items: ['Hambúrguer Artesanal x1', 'Batata Frita x1'], total: 38.90, status: 'Entregue', paymentMethod: 'PIX' },
    { id: 3, date: '2024-12-25', client: 'Mesa 12', items: ['Lasanha Bolonhesa x1', 'Suco Laranja x1'], total: 41.00, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 4, date: '2024-12-25', client: 'Balcão - Maria Santos', items: ['Salmão Grelhado x1', 'Água Mineral x1'], total: 48.50, status: 'Concluída', paymentMethod: 'Débito' },
    { id: 5, date: '2024-12-24', client: 'Delivery - Pedro Costa', items: ['Tiramisù x2', 'Pizza Margherita x1'], total: 66.80, status: 'Entregue', paymentMethod: 'PIX' }
  ],

  pet: [
    { id: 1, date: '2024-12-26', client: 'Ana Silva', items: ['Ração Premium Golden x1', 'Antipulgas Frontline x1'], total: 135.40, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 2, date: '2024-12-26', client: 'Carlos Oliveira', items: ['Brinquedo Kong x2', 'Bolinha de Tênis x3'], total: 89.50, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 3, date: '2024-12-25', client: 'Marina Costa', items: ['Ração Royal Canin x1', 'Vitamina Pet Tabs x1'], total: 160.00, status: 'Concluída', paymentMethod: 'Débito' },
    { id: 4, date: '2024-12-25', client: 'Roberto Lima', items: ['Coleira GPS x1'], total: 199.00, status: 'Pendente', paymentMethod: 'Cartão' },
    { id: 5, date: '2024-12-24', client: 'Fernanda Santos', items: ['Shampoo Neutro x2', 'Petisco Ossinho x3'], total: 75.30, status: 'Concluída', paymentMethod: 'Dinheiro' }
  ],

  medico: [
    { id: 1, date: '2024-12-26', client: 'Farmácia Central', items: ['Dipirona 500mg x50', 'Paracetamol x30'], total: 1362.00, status: 'Concluída', paymentMethod: 'Transferência' },
    { id: 2, date: '2024-12-26', client: 'Hospital São Lucas', items: ['Termômetro Digital x10', 'Estetoscópio x5'], total: 1524.00, status: 'Concluída', paymentMethod: 'Boleto' },
    { id: 3, date: '2024-12-25', client: 'Clínica Vida', items: ['Amoxicilina x20', 'Vitamina C x15'], total: 777.50, status: 'Pendente', paymentMethod: 'Cartão' },
    { id: 4, date: '2024-12-25', client: 'UBS Centro', items: ['Ibuprofeno x25', 'Azitromicina x10'], total: 917.50, status: 'Concluída', paymentMethod: 'Transferência' },
    { id: 5, date: '2024-12-24', client: 'Drogaria Popular', items: ['Vitamina D3 x30', 'Ômega 3 x20'], total: 1887.00, status: 'Concluída', paymentMethod: 'PIX' }
  ],

  tecnologia: [
    { id: 1, date: '2024-12-26', client: 'TechBuilder Ltda', items: ['Processador i7 x1', 'Placa de Vídeo RTX x1'], total: 4798.00, status: 'Concluída', paymentMethod: 'Transferência' },
    { id: 2, date: '2024-12-26', client: 'Gaming Setup', items: ['Monitor Gamer x2', 'Teclado RGB x2'], total: 2376.00, status: 'Pendente', paymentMethod: 'Cartão' },
    { id: 3, date: '2024-12-25', client: 'João Gamer', items: ['SSD NVMe x1', 'Memória DDR5 x1'], total: 1038.00, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 4, date: '2024-12-25', client: 'Empresa InfoTech', items: ['HD Seagate x5', 'Monitor LG x2'], total: 4093.00, status: 'Concluída', paymentMethod: 'Boleto' },
    { id: 5, date: '2024-12-24', client: 'Carlos Silva', items: ['Mouse Gamer x1', 'Gabinete RGB x1'], total: 648.00, status: 'Concluída', paymentMethod: 'Débito' }
  ],

  vendas: [
    { id: 1, date: '2024-12-26', client: 'Maria Executiva', items: ['iPhone 15 Pro x1', 'Camiseta Polo x2'], total: 7599.97, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 2, date: '2024-12-26', client: 'Empresa TechCorp', items: ['MacBook Air M3 x5'], total: 44999.95, status: 'Pendente', paymentMethod: 'Transferência' },
    { id: 3, date: '2024-12-25', client: 'Pedro Santos', items: ['Samsung Galaxy S24 x1', 'Tênis Nike x1'], total: 5899.98, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 4, date: '2024-12-25', client: 'Loja Varejo Plus', items: ['Smart TV OLED x2', 'Notebook Dell x3'], total: 17899.95, status: 'Concluída', paymentMethod: 'Boleto' },
    { id: 5, date: '2024-12-24', client: 'Ana Fashion', items: ['Jeans Diesel x3', 'Vestido Social x2'], total: 1759.95, status: 'Concluída', paymentMethod: 'Cartão' }
  ],

  educacao: [
    { id: 1, date: '2024-12-26', client: 'Universidade Federal', items: ['Kit Robótica x10', 'Microscópio x5'], total: 3444.00, status: 'Concluída', paymentMethod: 'Transferência' },
    { id: 2, date: '2024-12-26', client: 'Escola Particular Elite', items: ['Livro Cálculo x20', 'Atlas Mundial x15'], total: 5117.50, status: 'Pendente', paymentMethod: 'Boleto' },
    { id: 3, date: '2024-12-25', client: 'Colégio Técnico', items: ['Kit Química x8', 'Calculadora HP x25'], total: 4289.00, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 4, date: '2024-12-25', client: 'Instituto de Idiomas', items: ['Dicionário Inglês x30', 'Tablet Educacional x5'], total: 6476.70, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 5, date: '2024-12-24', client: 'Escola Municipal', items: ['Projetor x2', 'Lousa Digital x1'], total: 8498.97, status: 'Concluída', paymentMethod: 'Transferência' }
  ],

  beleza: [
    { id: 1, date: '2024-12-26', client: 'Salão Glamour', items: ['Shampoo L\'Oréal x5', 'Condicionador Kerastase x3'], total: 827.20, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 2, date: '2024-12-26', client: 'Marina Bella', items: ['Perfume Chanel x1', 'Base Fenty x2'], total: 1219.70, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 3, date: '2024-12-25', client: 'Loja Beauty Store', items: ['Paleta Urban Decay x3', 'Batom MAC x10'], total: 1858.70, status: 'Pendente', paymentMethod: 'Transferência' },
    { id: 4, date: '2024-12-25', client: 'Ana Maquiadora', items: ['Sérum Vitamina C x2', 'Creme Anti-idade x1'], total: 1039.70, status: 'Concluída', paymentMethod: 'Débito' },
    { id: 5, date: '2024-12-24', client: 'Spa Relax', items: ['Máscara Olaplex x4', 'Protetor Solar x8'], total: 1351.80, status: 'Concluída', paymentMethod: 'PIX' }
  ],

  estetica: [
    { id: 1, date: '2024-12-26', client: 'Clínica Estética Premium', items: ['Ácido Hialurônico x3', 'Botox x2'], total: 5197.00, status: 'Concluída', paymentMethod: 'Transferência' },
    { id: 2, date: '2024-12-26', client: 'Dra. Fernanda Reis', items: ['Sculptra x1', 'Fios PDO Mono x20'], total: 2799.00, status: 'Pendente', paymentMethod: 'PIX' },
    { id: 3, date: '2024-12-25', client: 'Centro de Beleza Avançada', items: ['Peeling TCA x5', 'Microagulhamento x8'], total: 1860.00, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 4, date: '2024-12-25', client: 'Spa Medical', items: ['Hydrafacial x3', 'Fios PDO Espira x10'], total: 1700.00, status: 'Concluída', paymentMethod: 'Débito' },
    { id: 5, date: '2024-12-24', client: 'Clínica Renovar', items: ['Anestésico EMLA x15', 'Fios PDO Mono x25'], total: 1663.50, status: 'Concluída', paymentMethod: 'PIX' }
  ]
};

// Clients data for each category
export const categoryClients: Record<string, Client[]> = {
  alimenticio: [
    { id: 1, name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 99999-1111', lastOrder: '2024-12-26', totalSpent: 234.50, status: 'Ativo', type: 'Delivery', address: 'Rua das Flores, 123' },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', phone: '(11) 99999-2222', lastOrder: '2024-12-25', totalSpent: 456.80, status: 'Ativo', type: 'Balcão', address: 'Av. Principal, 456' },
    { id: 3, name: 'Pedro Costa', email: 'pedro.costa@email.com', phone: '(11) 99999-3333', lastOrder: '2024-12-24', totalSpent: 189.90, status: 'Ativo', type: 'Delivery', address: 'Rua do Comércio, 789' },
    { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@email.com', phone: '(11) 99999-4444', lastOrder: '2024-12-23', totalSpent: 567.30, status: 'VIP', type: 'Mesa', address: 'Av. Central, 321' },
    { id: 5, name: 'Carlos Lima', email: 'carlos.lima@email.com', phone: '(11) 99999-5555', lastOrder: '2024-12-20', totalSpent: 123.45, status: 'Inativo', type: 'Delivery', address: 'Rua Secundária, 654' }
  ],

  pet: [
    { id: 1, name: 'Ana Silva (Buddy)', email: 'ana.silva@email.com', phone: '(11) 99999-1111', lastOrder: '2024-12-26', totalSpent: 890.50, status: 'Ativo', type: 'Cão', address: 'Rua Pet Friendly, 123' },
    { id: 2, name: 'Carlos Oliveira (Mimi)', email: 'carlos.oliveira@email.com', phone: '(11) 99999-2222', lastOrder: '2024-12-26', totalSpent: 456.80, status: 'Ativo', type: 'Gato', address: 'Av. dos Animais, 456' },
    { id: 3, name: 'Marina Costa (Rex)', email: 'marina.costa@email.com', phone: '(11) 99999-3333', lastOrder: '2024-12-25', totalSpent: 678.90, status: 'VIP', type: 'Cão', address: 'Rua Verde, 789' },
    { id: 4, name: 'Roberto Lima (Bella)', email: 'roberto.lima@email.com', phone: '(11) 99999-4444', lastOrder: '2024-12-25', totalSpent: 234.50, status: 'Ativo', type: 'Cão', address: 'Av. das Palmeiras, 321' },
    { id: 5, name: 'Fernanda Santos (Felix)', email: 'fernanda.santos@email.com', phone: '(11) 99999-5555', lastOrder: '2024-12-24', totalSpent: 345.60, status: 'Ativo', type: 'Gato', address: 'Rua dos Pets, 654' }
  ],

  medico: [
    { id: 1, name: 'Farmácia Central', email: 'compras@farmaciacentral.com', phone: '(11) 3333-1111', lastOrder: '2024-12-26', totalSpent: 15680.00, status: 'Ativo', type: 'Farmácia', address: 'Av. Principal, 1000' },
    { id: 2, name: 'Hospital São Lucas', email: 'suprimentos@hsaolucas.com', phone: '(11) 3333-2222', lastOrder: '2024-12-26', totalSpent: 32450.00, status: 'VIP', type: 'Hospital', address: 'Rua da Saúde, 500' },
    { id: 3, name: 'Clínica Vida', email: 'compras@clinicavida.com', phone: '(11) 3333-3333', lastOrder: '2024-12-25', totalSpent: 8920.50, status: 'Ativo', type: 'Clínica', address: 'Av. Médica, 250' },
    { id: 4, name: 'UBS Centro', email: 'admin@ubscentro.gov.br', phone: '(11) 3333-4444', lastOrder: '2024-12-25', totalSpent: 12340.00, status: 'Ativo', type: 'UBS', address: 'Praça Central, s/n' },
    { id: 5, name: 'Drogaria Popular', email: 'gerencia@drogariapopular.com', phone: '(11) 3333-5555', lastOrder: '2024-12-24', totalSpent: 18760.00, status: 'VIP', type: 'Drogaria', address: 'Rua do Povo, 150' }
  ],

  tecnologia: [
    { id: 1, name: 'TechBuilder Ltda', email: 'vendas@techbuilder.com', phone: '(11) 4444-1111', lastOrder: '2024-12-26', totalSpent: 45780.00, status: 'VIP', type: 'Empresa', address: 'Av. Tecnológica, 1500' },
    { id: 2, name: 'Gaming Setup', email: 'contato@gamingsetup.com', phone: '(11) 4444-2222', lastOrder: '2024-12-26', totalSpent: 12340.00, status: 'Ativo', type: 'Loja', address: 'Rua dos Gamers, 200' },
    { id: 3, name: 'João Gamer', email: 'joao.gamer@email.com', phone: '(11) 99999-6666', lastOrder: '2024-12-25', totalSpent: 5670.00, status: 'Ativo', type: 'Pessoa Física', address: 'Av. Central, 789' },
    { id: 4, name: 'Empresa InfoTech', email: 'ti@infotech.com.br', phone: '(11) 4444-3333', lastOrder: '2024-12-25', totalSpent: 67890.00, status: 'VIP', type: 'Empresa', address: 'Complexo Empresarial, 300' },
    { id: 5, name: 'Carlos Silva', email: 'carlos.tech@email.com', phone: '(11) 99999-7777', lastOrder: '2024-12-24', totalSpent: 3450.00, status: 'Ativo', type: 'Pessoa Física', address: 'Rua Moderna, 456' }
  ],

  vendas: [
    { id: 1, name: 'Maria Executiva', email: 'maria.exec@empresa.com', phone: '(11) 99999-8888', lastOrder: '2024-12-26', totalSpent: 45670.00, status: 'VIP', type: 'Executiva', address: 'Av. Empresarial, 1200' },
    { id: 2, name: 'Empresa TechCorp', email: 'compras@techcorp.com', phone: '(11) 5555-1111', lastOrder: '2024-12-26', totalSpent: 156780.00, status: 'VIP', type: 'Corporativo', address: 'Torre Empresarial, 5000' },
    { id: 3, name: 'Pedro Santos', email: 'pedro.santos@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 12340.00, status: 'Ativo', type: 'Pessoa Física', address: 'Rua Residencial, 678' },
    { id: 4, name: 'Loja Varejo Plus', email: 'vendas@varejoplus.com', phone: '(11) 5555-2222', lastOrder: '2024-12-25', totalSpent: 78950.00, status: 'VIP', type: 'Varejo', address: 'Centro Comercial, 800' },
    { id: 5, name: 'Ana Fashion', email: 'ana.fashion@email.com', phone: '(11) 99999-0000', lastOrder: '2024-12-24', totalSpent: 8760.00, status: 'Ativo', type: 'Pessoa Física', address: 'Av. Moda, 234' }
  ],

  educacao: [
    { id: 1, name: 'Universidade Federal', email: 'compras@universidade.edu.br', phone: '(11) 6666-1111', lastOrder: '2024-12-26', totalSpent: 234560.00, status: 'VIP', type: 'Universidade', address: 'Campus Universitário, s/n' },
    { id: 2, name: 'Escola Particular Elite', email: 'admin@escolaelite.com.br', phone: '(11) 6666-2222', lastOrder: '2024-12-26', totalSpent: 89750.00, status: 'VIP', type: 'Escola', address: 'Av. Educação, 500' },
    { id: 3, name: 'Colégio Técnico', email: 'secretaria@colegiotecnico.edu.br', phone: '(11) 6666-3333', lastOrder: '2024-12-25', totalSpent: 45680.00, status: 'Ativo', type: 'Colégio', address: 'Rua Técnica, 300' },
    { id: 4, name: 'Instituto de Idiomas', email: 'direcao@institutoidiomas.com', phone: '(11) 6666-4444', lastOrder: '2024-12-25', totalSpent: 67890.00, status: 'VIP', type: 'Instituto', address: 'Centro de Ensino, 150' },
    { id: 5, name: 'Escola Municipal', email: 'diretoria@escolamunicipal.gov.br', phone: '(11) 6666-5555', lastOrder: '2024-12-24', totalSpent: 123450.00, status: 'Ativo', type: 'Pública', address: 'Praça da Educação, 100' }
  ],

  beleza: [
    { id: 1, name: 'Salão Glamour', email: 'contato@salaoglamour.com', phone: '(11) 7777-1111', lastOrder: '2024-12-26', totalSpent: 23450.00, status: 'VIP', type: 'Salão', address: 'Av. Beleza, 200' },
    { id: 2, name: 'Marina Bella', email: 'marina.bella@email.com', phone: '(11) 99999-1234', lastOrder: '2024-12-26', totalSpent: 5670.00, status: 'Ativo', type: 'Pessoa Física', address: 'Rua Elegante, 456' },
    { id: 3, name: 'Loja Beauty Store', email: 'vendas@beautystore.com', phone: '(11) 7777-2222', lastOrder: '2024-12-25', totalSpent: 34680.00, status: 'VIP', type: 'Loja', address: 'Shopping Center, Loja 89' },
    { id: 4, name: 'Ana Maquiadora', email: 'ana.maquiadora@email.com', phone: '(11) 99999-5678', lastOrder: '2024-12-25', totalSpent: 8920.00, status: 'Ativo', type: 'Profissional', address: 'Studio Maquiagem, 123' },
    { id: 5, name: 'Spa Relax', email: 'reservas@sparelax.com', phone: '(11) 7777-3333', lastOrder: '2024-12-24', totalSpent: 12340.00, status: 'Ativo', type: 'Spa', address: 'Resort Wellness, 789' }
  ],

  estetica: [
    { id: 1, name: 'Clínica Estética Premium', email: 'admin@clinicapremium.com', phone: '(11) 8888-1111', lastOrder: '2024-12-26', totalSpent: 156780.00, status: 'VIP', type: 'Clínica', address: 'Av. Estética, 1000' },
    { id: 2, name: 'Dra. Fernanda Reis', email: 'dra.fernanda@clinica.com', phone: '(11) 99999-9876', lastOrder: '2024-12-26', totalSpent: 89450.00, status: 'VIP', type: 'Médica', address: 'Consultório Premium, 250' },
    { id: 3, name: 'Centro de Beleza Avançada', email: 'contato@centrobeleza.com', phone: '(11) 8888-2222', lastOrder: '2024-12-25', totalSpent: 67890.00, status: 'Ativo', type: 'Centro', address: 'Complexo Beleza, 500' },
    { id: 4, name: 'Spa Medical', email: 'recepcao@spamedical.com', phone: '(11) 8888-3333', lastOrder: '2024-12-25', totalSpent: 45670.00, status: 'Ativo', type: 'Spa', address: 'Resort Medical, 300' },
    { id: 5, name: 'Clínica Renovar', email: 'atendimento@clinicarenovar.com', phone: '(11) 8888-4444', lastOrder: '2024-12-24', totalSpent: 78920.00, status: 'VIP', type: 'Clínica', address: 'Centro Médico, 150' }
  ]
};

// Appointments for each category
export const categoryAppointments: Record<string, Appointment[]> = {
  alimenticio: [
    { id: 1, title: 'Reserva Mesa para 6 pessoas', client: 'João Silva', date: '2024-12-30', time: '19:30', type: 'reserva', status: 'scheduled', service: 'Jantar Especial' },
    { id: 2, title: 'Evento Corporativo', client: 'Empresa ABC', date: '2024-12-31', time: '18:00', type: 'evento', status: 'confirmed', service: 'Buffet Executivo' },
    { id: 3, title: 'Degustação de Vinhos', client: 'Maria Santos', date: '2025-01-05', time: '20:00', type: 'degustacao', status: 'scheduled', service: 'Harmonização' },
    { id: 4, title: 'Aula de Culinária', client: 'Pedro Costa', date: '2025-01-08', time: '15:00', type: 'aula', status: 'scheduled', service: 'Workshop Massas' }
  ],

  pet: [
    { id: 1, title: 'Consulta Veterinária - Buddy', client: 'Ana Silva', date: '2024-12-28', time: '09:00', type: 'consulta', status: 'scheduled', service: 'Check-up' },
    { id: 2, title: 'Vacinação - Mimi', client: 'Carlos Oliveira', date: '2024-12-29', time: '10:30', type: 'vacina', status: 'scheduled', service: 'Vacina Antirrábica' },
    { id: 3, title: 'Cirurgia - Rex', client: 'Marina Costa', date: '2025-01-02', time: '08:00', type: 'cirurgia', status: 'confirmed', service: 'Castração' },
    { id: 4, title: 'Banho e Tosa - Bella', client: 'Roberto Lima', date: '2025-01-03', time: '14:00', type: 'estetica', status: 'scheduled', service: 'Banho Completo' }
  ],

  medico: [
    { id: 1, title: 'Consulta Cardiológica', client: 'João Silva', date: '2024-12-28', time: '08:30', type: 'consulta', status: 'scheduled', service: 'Cardiologia' },
    { id: 2, title: 'Exame de Sangue', client: 'Maria Santos', date: '2024-12-29', time: '07:00', type: 'exame', status: 'scheduled', service: 'Laboratório' },
    { id: 3, title: 'Cirurgia Ortopédica', client: 'Pedro Costa', date: '2025-01-02', time: '09:00', type: 'cirurgia', status: 'confirmed', service: 'Ortopedia' },
    { id: 4, title: 'Consulta Pediátrica', client: 'Ana Oliveira', date: '2025-01-03', time: '15:30', type: 'consulta', status: 'scheduled', service: 'Pediatria' }
  ],

  tecnologia: [
    { id: 1, title: 'Entrega PC Gamer', client: 'João Gamer', date: '2024-12-28', time: '14:00', type: 'entrega', status: 'scheduled', service: 'Montagem PC' },
    { id: 2, title: 'Suporte Técnico', client: 'Empresa InfoTech', date: '2024-12-30', time: '09:00', type: 'suporte', status: 'scheduled', service: 'Manutenção' },
    { id: 3, title: 'Instalação de Rede', client: 'TechBuilder Ltda', date: '2025-01-02', time: '08:00', type: 'instalacao', status: 'confirmed', service: 'Infraestrutura' },
    { id: 4, title: 'Treinamento Software', client: 'Carlos Silva', date: '2025-01-05', time: '16:00', type: 'treinamento', status: 'scheduled', service: 'Capacitação' }
  ],

  vendas: [
    { id: 1, title: 'Reunião Comercial', client: 'Empresa TechCorp', date: '2024-12-28', time: '10:00', type: 'reuniao', status: 'scheduled', service: 'Proposta Comercial' },
    { id: 2, title: 'Demonstração de Produto', client: 'Maria Executiva', date: '2024-12-30', time: '14:30', type: 'demo', status: 'scheduled', service: 'Apresentação' },
    { id: 3, title: 'Entrega de Mercadoria', client: 'Loja Varejo Plus', date: '2025-01-02', time: '11:00', type: 'entrega', status: 'confirmed', service: 'Logística' },
    { id: 4, title: 'Follow-up de Vendas', client: 'Pedro Santos', date: '2025-01-04', time: '09:30', type: 'followup', status: 'scheduled', service: 'Pós-venda' }
  ],

  educacao: [
    { id: 1, title: 'Entrega Material Didático', client: 'Universidade Federal', date: '2024-12-28', time: '08:00', type: 'entrega', status: 'scheduled', service: 'Logística' },
    { id: 2, title: 'Treinamento Equipamentos', client: 'Escola Particular Elite', date: '2024-12-30', time: '13:00', type: 'treinamento', status: 'scheduled', service: 'Capacitação' },
    { id: 3, title: 'Instalação Laboratório', client: 'Colégio Técnico', date: '2025-01-02', time: '07:30', type: 'instalacao', status: 'confirmed', service: 'Setup' },
    { id: 4, title: 'Manutenção Projetores', client: 'Instituto de Idiomas', date: '2025-01-05', time: '15:00', type: 'manutencao', status: 'scheduled', service: 'Suporte Técnico' }
  ],

  beleza: [
    { id: 1, title: 'Entrega Produtos Salão', client: 'Salão Glamour', date: '2024-12-28', time: '10:00', type: 'entrega', status: 'scheduled', service: 'Fornecimento' },
    { id: 2, title: 'Consultoria de Produtos', client: 'Marina Bella', date: '2024-12-30', time: '16:00', type: 'consultoria', status: 'scheduled', service: 'Personal Beauty' },
    { id: 3, title: 'Treinamento Maquiagem', client: 'Ana Maquiadora', date: '2025-01-02', time: '14:00', type: 'treinamento', status: 'confirmed', service: 'Curso Avançado' },
    { id: 4, title: 'Demonstração Skincare', client: 'Spa Relax', date: '2025-01-04', time: '11:30', type: 'demo', status: 'scheduled', service: 'Workshop' }
  ],

  estetica: [
    { id: 1, title: 'Aplicação Botox', client: 'Dra. Fernanda Reis', date: '2024-12-28', time: '09:00', type: 'procedimento', status: 'scheduled', service: 'Harmonização' },
    { id: 2, title: 'Preenchimento Facial', client: 'Clínica Premium', date: '2024-12-30', time: '11:00', type: 'procedimento', status: 'scheduled', service: 'Estética Facial' },
    { id: 3, title: 'Treinamento Fios PDO', client: 'Centro de Beleza', date: '2025-01-02', time: '08:30', type: 'treinamento', status: 'confirmed', service: 'Capacitação' },
    { id: 4, title: 'Entrega Equipamentos', client: 'Spa Medical', date: '2025-01-03', time: '13:00', type: 'entrega', status: 'scheduled', service: 'Instalação' }
  ]
};

// Specialists for each category
export const categorySpecialists: Record<string, Specialist[]> = {
  medico: [
    { id: 1, name: 'Dr. João Silva', specialty: 'Cardiologia', phone: '(11) 99999-1111', email: 'joao@clinica.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Especialista em cardiologia com 15 anos de experiência', available: true, rating: 4.9, experience: '15 anos' },
    { id: 2, name: 'Dra. Maria Santos', specialty: 'Pediatria', phone: '(11) 99999-2222', email: 'maria@clinica.com', schedule: 'Seg-Sex: 9h às 17h', description: 'Pediatra especializada em desenvolvimento infantil', available: true, rating: 4.8, experience: '12 anos' },
    { id: 3, name: 'Dr. Carlos Oliveira', specialty: 'Ortopedia', phone: '(11) 99999-3333', email: 'carlos@clinica.com', schedule: 'Ter-Sáb: 8h às 16h', description: 'Ortopedista com foco em medicina esportiva', available: true, rating: 4.7, experience: '18 anos' },
    { id: 4, name: 'Dra. Ana Costa', specialty: 'Ginecologia', phone: '(11) 99999-4444', email: 'ana@clinica.com', schedule: 'Seg-Sex: 7h às 15h', description: 'Ginecologista especializada em saúde da mulher', available: true, rating: 4.9, experience: '20 anos' }
  ],

  pet: [
    { id: 1, name: 'Dr. Pedro Costa', specialty: 'Clínica Geral', phone: '(11) 99999-4444', email: 'pedro@vetpet.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Veterinário clínico geral com experiência em felinos', available: true, rating: 4.8, experience: '10 anos' },
    { id: 2, name: 'Dra. Ana Lima', specialty: 'Cirurgia', phone: '(11) 99999-5555', email: 'ana@vetpet.com', schedule: 'Seg-Sex: 7h às 15h', description: 'Especialista em cirurgias de pequenos animais', available: true, rating: 4.9, experience: '14 anos' },
    { id: 3, name: 'Dr. Ricardo Ferreira', specialty: 'Dermatologia', phone: '(11) 99999-6666', email: 'ricardo@vetpet.com', schedule: 'Qua-Dom: 9h às 17h', description: 'Dermatologista veterinário especializado em alergias', available: true, rating: 4.7, experience: '8 anos' },
    { id: 4, name: 'Dra. Carla Mendes', specialty: 'Exóticos', phone: '(11) 99999-7777', email: 'carla@vetpet.com', schedule: 'Ter-Sáb: 10h às 18h', description: 'Especialista em animais silvestres e exóticos', available: true, rating: 4.6, experience: '12 anos' }
  ],

  estetica: [
    { id: 1, name: 'Dra. Fernanda Reis', specialty: 'Harmonização Facial', phone: '(11) 99999-7777', email: 'fernanda@clinicaestetica.com', schedule: 'Seg-Sex: 9h às 18h', description: 'Especialista em harmonização facial e preenchimentos', available: true, rating: 4.9, experience: '12 anos' },
    { id: 2, name: 'Dr. Bruno Santos', specialty: 'Medicina Estética', phone: '(11) 99999-8888', email: 'bruno@clinicaestetica.com', schedule: 'Ter-Sáb: 8h às 17h', description: 'Médico especializado em tratamentos estéticos e antienvelhecimento', available: true, rating: 4.8, experience: '15 anos' },
    { id: 3, name: 'Dra. Carla Mendes', specialty: 'Dermatologia Estética', phone: '(11) 99999-9999', email: 'carla@clinicaestetica.com', schedule: 'Seg-Sex: 10h às 19h', description: 'Dermatologista com foco em tratamentos estéticos', available: true, rating: 4.7, experience: '18 anos' },
    { id: 4, name: 'Luciana Oliveira', specialty: 'Estética Avançada', phone: '(11) 99999-0000', email: 'luciana@clinicaestetica.com', schedule: 'Qua-Dom: 9h às 18h', description: 'Esteticista especializada em tratamentos corporais e faciais', available: true, rating: 4.6, experience: '10 anos' }
  ]
};

// WhatsApp conversations for each category
export const categoryWhatsAppConversations: Record<string, WhatsAppConversation[]> = {
  alimenticio: [
    { id: 1, name: 'João Silva', lastMessage: 'Gostaria de fazer um pedido para delivery', time: '14:30', unread: 2, status: 'online', category: 'alimenticio' },
    { id: 2, name: 'Maria Santos', lastMessage: 'Qual o horário de funcionamento hoje?', time: '13:45', unread: 1, status: 'offline', category: 'alimenticio' },
    { id: 3, name: 'Pedro Costa', lastMessage: 'Vocês têm pratos vegetarianos?', time: '12:20', unread: 0, status: 'away', category: 'alimenticio' },
    { id: 4, name: 'Ana Oliveira', lastMessage: 'Obrigada pela refeição deliciosa!', time: '11:15', unread: 0, status: 'offline', category: 'alimenticio' }
  ],

  pet: [
    { id: 1, name: 'Ana Silva', lastMessage: 'Meu cachorro está com alergia, podem ajudar?', time: '15:20', unread: 3, status: 'online', category: 'pet' },
    { id: 2, name: 'Carlos Oliveira', lastMessage: 'Preciso agendar banho e tosa', time: '14:10', unread: 1, status: 'offline', category: 'pet' },
    { id: 3, name: 'Marina Costa', lastMessage: 'Vocês têm ração para filhotes?', time: '13:30', unread: 0, status: 'away', category: 'pet' },
    { id: 4, name: 'Roberto Lima', lastMessage: 'Quando sai o resultado do exame?', time: '12:45', unread: 0, status: 'online', category: 'pet' }
  ],

  medico: [
    { id: 1, name: 'Farmácia Central', lastMessage: 'Precisamos de mais dipirona urgente', time: '16:00', unread: 2, status: 'online', category: 'medico' },
    { id: 2, name: 'Hospital São Lucas', lastMessage: 'Pedido de orçamento para termômetros', time: '15:30', unread: 1, status: 'offline', category: 'medico' },
    { id: 3, name: 'Clínica Vida', lastMessage: 'Entrega confirmada para amanhã?', time: '14:45', unread: 0, status: 'away', category: 'medico' },
    { id: 4, name: 'UBS Centro', lastMessage: 'Obrigado pela agilidade na entrega', time: '13:20', unread: 0, status: 'offline', category: 'medico' }
  ],

  tecnologia: [
    { id: 1, name: 'TechBuilder Ltda', lastMessage: 'Precisamos de 10 processadores i7', time: '15:45', unread: 2, status: 'online', category: 'tecnologia' },
    { id: 2, name: 'Gaming Setup', lastMessage: 'Têm placa de vídeo RTX em estoque?', time: '14:20', unread: 1, status: 'offline', category: 'tecnologia' },
    { id: 3, name: 'João Gamer', lastMessage: 'Meu PC está com problema, podem ajudar?', time: '13:15', unread: 0, status: 'away', category: 'tecnologia' },
    { id: 4, name: 'Empresa InfoTech', lastMessage: 'Orçamento aprovado, podem entregar', time: '12:30', unread: 0, status: 'online', category: 'tecnologia' }
  ],

  vendas: [
    { id: 1, name: 'Maria Executiva', lastMessage: 'Interesse no iPhone 15 Pro, qual o melhor preço?', time: '16:15', unread: 3, status: 'online', category: 'vendas' },
    { id: 2, name: 'Empresa TechCorp', lastMessage: 'Podem enviar proposta para 50 notebooks?', time: '15:40', unread: 2, status: 'offline', category: 'vendas' },
    { id: 3, name: 'Pedro Santos', lastMessage: 'Tênis Nike ainda está disponível?', time: '14:25', unread: 0, status: 'away', category: 'vendas' },
    { id: 4, name: 'Loja Varejo Plus', lastMessage: 'Entrega realizada com sucesso!', time: '13:50', unread: 0, status: 'online', category: 'vendas' }
  ],

  educacao: [
    { id: 1, name: 'Universidade Federal', lastMessage: 'Precisamos de mais 20 kits de robótica', time: '15:30', unread: 2, status: 'online', category: 'educacao' },
    { id: 2, name: 'Escola Particular Elite', lastMessage: 'Quando chegam os livros de matemática?', time: '14:45', unread: 1, status: 'offline', category: 'educacao' },
    { id: 3, name: 'Colégio Técnico', lastMessage: 'Laboratório montado perfeitamente!', time: '13:20', unread: 0, status: 'away', category: 'educacao' },
    { id: 4, name: 'Instituto de Idiomas', lastMessage: 'Tablets funcionando muito bem', time: '12:10', unread: 0, status: 'offline', category: 'educacao' }
  ],

  beleza: [
    { id: 1, name: 'Salão Glamour', lastMessage: 'Produtos L\'Oréal chegaram hoje?', time: '16:20', unread: 2, status: 'online', category: 'beleza' },
    { id: 2, name: 'Marina Bella', lastMessage: 'Qual o melhor sérum para minha pele?', time: '15:15', unread: 1, status: 'offline', category: 'beleza' },
    { id: 3, name: 'Loja Beauty Store', lastMessage: 'Precisamos repor o estoque de batons', time: '14:30', unread: 0, status: 'away', category: 'beleza' },
    { id: 4, name: 'Ana Maquiadora', lastMessage: 'Paleta Urban Decay é perfeita!', time: '13:45', unread: 0, status: 'online', category: 'beleza' }
  ],

  estetica: [
    { id: 1, name: 'Clínica Premium', lastMessage: 'Ácido hialurônico chegou dentro do prazo', time: '16:10', unread: 2, status: 'online', category: 'estetica' },
    { id: 2, name: 'Dra. Fernanda Reis', lastMessage: 'Preciso de mais Botox para semana que vem', time: '15:25', unread: 1, status: 'offline', category: 'estetica' },
    { id: 3, name: 'Centro de Beleza', lastMessage: 'Treinamento foi excelente!', time: '14:40', unread: 0, status: 'away', category: 'estetica' },
    { id: 4, name: 'Spa Medical', lastMessage: 'Equipamento instalado perfeitamente', time: '13:55', unread: 0, status: 'online', category: 'estetica' }
  ]
};

// Activity logs for each category
export const categoryActivities: Record<string, Activity[]> = {
  alimenticio: [
    { id: 1, timestamp: new Date('2024-12-26T14:30:00'), type: 'order', action: 'Novo Pedido', description: 'Pedido #123 - Pizza Margherita x2', category: 'alimenticio', status: 'success', user: 'João Silva' },
    { id: 2, timestamp: new Date('2024-12-26T13:45:00'), type: 'delivery', action: 'Entrega Realizada', description: 'Delivery para Rua das Flores, 123', category: 'alimenticio', status: 'success', user: 'Sistema' },
    { id: 3, timestamp: new Date('2024-12-26T12:20:00'), type: 'payment', action: 'Pagamento PIX', description: 'Pagamento recebido - R$ 81,00', category: 'alimenticio', status: 'success', user: 'Sistema PIX' },
    { id: 4, timestamp: new Date('2024-12-26T11:15:00'), type: 'reservation', action: 'Reserva Confirmada', description: 'Mesa para 6 pessoas - 31/12 às 19:30', category: 'alimenticio', status: 'success', user: 'Ana Oliveira' }
  ],

  pet: [
    { id: 1, timestamp: new Date('2024-12-26T15:20:00'), type: 'appointment', action: 'Consulta Agendada', description: 'Consulta veterinária para Buddy - 28/12', category: 'pet', status: 'success', user: 'Ana Silva' },
    { id: 2, timestamp: new Date('2024-12-26T14:10:00'), type: 'service', action: 'Banho e Tosa', description: 'Serviço realizado para Mimi', category: 'pet', status: 'success', user: 'Carlos Oliveira' },
    { id: 3, timestamp: new Date('2024-12-26T13:30:00'), type: 'sale', action: 'Venda Realizada', description: 'Ração Premium Golden - R$ 89,90', category: 'pet', status: 'success', user: 'Sistema' },
    { id: 4, timestamp: new Date('2024-12-26T12:45:00'), type: 'exam', action: 'Exame Concluído', description: 'Resultado do exame de sangue disponível', category: 'pet', status: 'success', user: 'Dr. Pedro Costa' }
  ],

  medico: [
    { id: 1, timestamp: new Date('2024-12-26T16:00:00'), type: 'order', action: 'Pedido Urgente', description: 'Farmácia Central solicitou dipirona', category: 'medico', status: 'warning', user: 'Farmácia Central' },
    { id: 2, timestamp: new Date('2024-12-26T15:30:00'), type: 'quote', action: 'Orçamento Enviado', description: 'Orçamento para Hospital São Lucas', category: 'medico', status: 'success', user: 'Sistema' },
    { id: 3, timestamp: new Date('2024-12-26T14:45:00'), type: 'delivery', action: 'Entrega Confirmada', description: 'Medicamentos entregues na Clínica Vida', category: 'medico', status: 'success', user: 'Transportadora' },
    { id: 4, timestamp: new Date('2024-12-26T13:20:00'), type: 'payment', action: 'Pagamento Recebido', description: 'UBS Centro - R$ 917,50', category: 'medico', status: 'success', user: 'Sistema Bancário' }
  ],

  tecnologia: [
    { id: 1, timestamp: new Date('2024-12-26T15:45:00'), type: 'order', action: 'Pedido Corporativo', description: 'TechBuilder - 10 processadores i7', category: 'tecnologia', status: 'success', user: 'TechBuilder Ltda' },
    { id: 2, timestamp: new Date('2024-12-26T14:20:00'), type: 'stock', action: 'Consulta Estoque', description: 'Gaming Setup verificou RTX 4070', category: 'tecnologia', status: 'info', user: 'Gaming Setup' },
    { id: 3, timestamp: new Date('2024-12-26T13:15:00'), type: 'support', action: 'Suporte Técnico', description: 'Atendimento para João Gamer', category: 'tecnologia', status: 'success', user: 'Suporte Técnico' },
    { id: 4, timestamp: new Date('2024-12-26T12:30:00'), type: 'delivery', action: 'Entrega Autorizada', description: 'Empresa InfoTech aprovou orçamento', category: 'tecnologia', status: 'success', user: 'Empresa InfoTech' }
  ],

  vendas: [
    { id: 1, timestamp: new Date('2024-12-26T16:15:00'), type: 'inquiry', action: 'Consulta de Preço', description: 'Maria Executiva interessada em iPhone 15 Pro', category: 'vendas', status: 'success', user: 'Maria Executiva' },
    { id: 2, timestamp: new Date('2024-12-26T15:40:00'), type: 'proposal', action: 'Proposta Solicitada', description: 'TechCorp - 50 notebooks corporativos', category: 'vendas', status: 'warning', user: 'Empresa TechCorp' },
    { id: 3, timestamp: new Date('2024-12-26T14:25:00'), type: 'availability', action: 'Consulta Disponibilidade', description: 'Pedro Santos verificou tênis Nike', category: 'vendas', status: 'info', user: 'Pedro Santos' },
    { id: 4, timestamp: new Date('2024-12-26T13:50:00'), type: 'delivery', action: 'Entrega Confirmada', description: 'Loja Varejo Plus recebeu mercadorias', category: 'vendas', status: 'success', user: 'Loja Varejo Plus' }
  ],

  educacao: [
    { id: 1, timestamp: new Date('2024-12-26T15:30:00'), type: 'order', action: 'Pedido Adicional', description: 'Universidade Federal - 20 kits robótica', category: 'educacao', status: 'success', user: 'Universidade Federal' },
    { id: 2, timestamp: new Date('2024-12-26T14:45:00'), type: 'delivery', action: 'Consulta Entrega', description: 'Escola Elite perguntou sobre livros', category: 'educacao', status: 'info', user: 'Escola Elite' },
    { id: 3, timestamp: new Date('2024-12-26T13:20:00'), type: 'installation', action: 'Instalação Concluída', description: 'Laboratório do Colégio Técnico pronto', category: 'educacao', status: 'success', user: 'Equipe Técnica' },
    { id: 4, timestamp: new Date('2024-12-26T12:10:00'), type: 'feedback', action: 'Feedback Positivo', description: 'Instituto de Idiomas elogiou tablets', category: 'educacao', status: 'success', user: 'Instituto de Idiomas' }
  ],

  beleza: [
    { id: 1, timestamp: new Date('2024-12-26T16:20:00'), type: 'delivery', action: 'Consulta Entrega', description: 'Salão Glamour perguntou sobre L\'Oréal', category: 'beleza', status: 'info', user: 'Salão Glamour' },
    { id: 2, timestamp: new Date('2024-12-26T15:15:00'), type: 'consultation', action: 'Consultoria Solicitada', description: 'Marina Bella pediu recomendação de sérum', category: 'beleza', status: 'success', user: 'Marina Bella' },
    { id: 3, timestamp: new Date('2024-12-26T14:30:00'), type: 'restock', action: 'Pedido Reposição', description: 'Beauty Store precisa de batons MAC', category: 'beleza', status: 'warning', user: 'Loja Beauty Store' },
    { id: 4, timestamp: new Date('2024-12-26T13:45:00'), type: 'feedback', action: 'Avaliação Positiva', description: 'Ana Maquiadora elogiou paleta Urban Decay', category: 'beleza', status: 'success', user: 'Ana Maquiadora' }
  ],

  estetica: [
    { id: 1, timestamp: new Date('2024-12-26T16:10:00'), type: 'delivery', action: 'Entrega Confirmada', description: 'Clínica Premium recebeu ácido hialurônico', category: 'estetica', status: 'success', user: 'Clínica Premium' },
    { id: 2, timestamp: new Date('2024-12-26T15:25:00'), type: 'order', action: 'Pedido Antecipado', description: 'Dra. Fernanda precisa de Botox', category: 'estetica', status: 'warning', user: 'Dra. Fernanda Reis' },
    { id: 3, timestamp: new Date('2024-12-26T14:40:00'), type: 'training', action: 'Treinamento Concluído', description: 'Centro de Beleza finalizou capacitação', category: 'estetica', status: 'success', user: 'Centro de Beleza' },
    { id: 4, timestamp: new Date('2024-12-26T13:55:00'), type: 'installation', action: 'Equipamento Instalado', description: 'Spa Medical com novo equipamento', category: 'estetica', status: 'success', user: 'Equipe Técnica' }
  ]
};

// Design and Sites portfolio data (special case)
export const designPortfolio = [
  { id: 1, title: 'Identidade Visual - Café Premium', description: 'Desenvolvimento completo da marca para cafeteria de alta qualidade', category: 'branding', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', projectUrl: 'https://portfolio.exemplo.com/cafe-premium', available: true },
  { id: 2, title: 'Material Gráfico - Clínica Excellence', description: 'Criação de cartões, folders e banners para clínica médica', category: 'impressos', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', projectUrl: 'https://portfolio.exemplo.com/clinica-excellence', available: true },
  { id: 3, title: 'Campanha Digital - Tech Innovations', description: 'Posts e stories para empresa de tecnologia', category: 'digital', imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400', projectUrl: 'https://portfolio.exemplo.com/tech-innovations', available: true },
  { id: 4, title: 'Branding Completo - EcoFashion', description: 'Identidade visual para marca de moda sustentável', category: 'branding', imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400', projectUrl: 'https://portfolio.exemplo.com/eco-fashion', available: true }
];

export const sitesPortfolio = [
  { id: 1, title: 'E-commerce Premium - Loja Fashion', description: 'Loja virtual completa com sistema de pagamento integrado', category: 'loja-virtual', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', projectUrl: 'https://lojafashion.exemplo.com', available: true },
  { id: 2, title: 'Site Institucional - Advocacia Silva', description: 'Website profissional com blog e formulário de contato', category: 'website', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', projectUrl: 'https://advocaciasilva.exemplo.com', available: true },
  { id: 3, title: 'Landing Page - Curso Marketing', description: 'Página de conversão otimizada para curso online', category: 'conversao', imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400', projectUrl: 'https://cursomarketing.exemplo.com', available: true },
  { id: 4, title: 'Sistema Web - Gestão Hospitalar', description: 'Sistema completo para gestão de clínica médica', category: 'sistema', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', projectUrl: 'https://gestaohospitalar.exemplo.com', available: true }
];

// Helper functions to get data by category
export const getProductsByCategory = (category: string): Product[] => {
  return categoryProducts[category] || [];
};

export const getSalesByCategory = (category: string): Sale[] => {
  return categorySales[category] || [];
};

export const getClientsByCategory = (category: string): Client[] => {
  return categoryClients[category] || [];
};

export const getAppointmentsByCategory = (category: string): Appointment[] => {
  return categoryAppointments[category] || [];
};

export const getSpecialistsByCategory = (category: string): Specialist[] => {
  return categorySpecialists[category] || [];
};

export const getWhatsAppConversationsByCategory = (category: string): WhatsAppConversation[] => {
  return categoryWhatsAppConversations[category] || [];
};

export const getActivitiesByCategory = (category: string): Activity[] => {
  return categoryActivities[category] || [];
};

// Export default data structure
export default {
  categoryProducts,
  categorySales,
  categoryClients,
  categoryAppointments,
  categorySpecialists,
  categoryWhatsAppConversations,
  categoryActivities,
  designPortfolio,
  sitesPortfolio
};