# Prompt para Replicar Design Frontend Exato

## Contexto
Este prompt permitirá recriar exatamente o mesmo design visual e arquitetura frontend de um sistema de gestão empresarial moderno e profissional.

## Especificações do Design

### 1. Sistema de Cores
```css
/* Cores Primárias */
--primary: 262 83% 58% (Purple #8B5CF6)
--primary-dark: 262 83% 48% (Purple Escuro #7C3AED)
--secondary: 152 76% 43% (Verde #06D6A0)

/* Cores de Status */
--success: 142 76% 36% (Verde Sucesso #059669)
--warning: 38 92% 50% (Amarelo #F59E0B)
--danger: 0 84% 60% (Vermelho #EF4444)
--info: 213 94% 68% (Azul #3B82F6)

/* Tons de Cinza */
--gray-50: #F9FAFB
--gray-100: #F1F5F9
--gray-200: #E2E8F0
--gray-300: #CBD5E1
--gray-500: #64748B
--gray-600: #475569
--gray-700: #334155
--gray-800: #1E293B
--gray-900: #0F172A
```

### 2. Layout Principal
```
ESTRUTURA:
- Sidebar fixa à esquerda (280px)
- Área principal com header e conteúdo
- Background: Gradiente sutil cinza-branco
- Padding padrão: 24px (p-6)
```

### 3. Componentes de Card Padronizados

#### Metric Card (Cartões de Métricas)
```css
.metric-card {
  @apply bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow;
}

/* Layout interno */
.metric-card .flex.items-center.justify-between {
  /* Ícone à direita, conteúdo à esquerda */
}

/* Ícone circular */
.metric-card .p-3.rounded-full {
  /* Background colorido + ícone branco */
  /* Cores: bg-green-100, bg-yellow-100, bg-blue-100, bg-red-100 */
}
```

#### Main Card (Cards Principais)
```css
.main-card {
  @apply bg-white border border-gray-200 rounded-lg shadow-sm;
}

/* Header do card */
.main-card .flex.items-center.justify-between.mb-6 {
  @apply border-b border-gray-100 pb-4;
}
```

#### List Cards (Listas Padronizadas)
```css
.standard-list-container {
  @apply bg-white border border-gray-200 rounded-lg;
}

.standard-list-item {
  @apply flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors;
}

.list-item-main {
  @apply flex-1;
}

.list-item-title {
  @apply font-semibold text-gray-900 mb-1;
}

.list-item-subtitle {
  @apply text-sm text-gray-600 mb-1;
}

.list-item-meta {
  @apply text-xs text-gray-500;
}
```

### 4. Sistema de Badges de Status
```css
.list-status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.status-success { @apply bg-green-100 text-green-800; }
.status-warning { @apply bg-yellow-100 text-yellow-800; }
.status-danger { @apply bg-red-100 text-red-800; }
.status-info { @apply bg-blue-100 text-blue-800; }
.status-pending { @apply bg-orange-100 text-orange-800; }
```

### 5. Botões de Ação Padronizados
```css
/* Botões principais */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500;
}

.btn-outline {
  @apply border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-purple-500;
}

/* Botões de ação em listas */
.list-action-button {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-colors;
}

.list-action-button.view { @apply bg-blue-100 text-blue-600 hover:bg-blue-200; }
.list-action-button.edit { @apply bg-gray-100 text-gray-600 hover:bg-gray-200; }
.list-action-button.delete { @apply bg-red-100 text-red-600 hover:bg-red-200; }
.list-action-button.transfer { @apply bg-green-100 text-green-600 hover:bg-green-200; }
```

### 6. Sidebar Design
```css
.sidebar {
  @apply w-70 bg-gray-900 text-white fixed left-0 top-0 h-full overflow-y-auto;
}

/* Logo área */
.sidebar .logo-area {
  @apply p-6 border-b border-gray-800;
}

/* Menu items */
.sidebar .menu-item {
  @apply flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors;
}

.sidebar .menu-item.active {
  @apply bg-purple-600 text-white;
}
```

### 7. Header de Seções
```css
.app-section {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-white p-6;
}

.section-header {
  @apply mb-8;
}

.section-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.section-subtitle {
  @apply text-gray-600 text-lg;
}
```

### 8. Grid de Métricas
```css
.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8;
}
```

### 9. Sistema de Tabs
```css
.tab-navigation {
  @apply flex border-b border-gray-200 mb-6;
}

.tab-button {
  @apply flex items-center gap-2 px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors;
}

.tab-button.active {
  @apply border-purple-500 text-purple-600;
}
```

### 10. Formulários e Inputs
```css
.form-input {
  @apply w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
```

### 11. Modais
```css
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative;
}

.modal-header {
  @apply flex justify-between items-center mb-4 border-b border-gray-100 pb-4;
}

.modal-footer {
  @apply flex gap-3 pt-4 border-t border-gray-100 mt-6;
}
```

## Prompt de Implementação

**Use este prompt exato:**

---

"Implemente um sistema de gestão empresarial com o seguinte design frontend EXATO:

### CORES OBRIGATÓRIAS:
- Primária: Purple #8B5CF6
- Secundária: Verde #06D6A0  
- Cinzas: #F9FAFB, #F1F5F9, #E2E8F0, #64748B, #334155, #0F172A
- Status: Verde #059669, Amarelo #F59E0B, Vermelho #EF4444, Azul #3B82F6

### LAYOUT OBRIGATÓRIO:
1. Sidebar escura (280px) com logo e menu
2. Área principal com gradiente sutil cinza-branco
3. Cards brancos com bordas cinza claras
4. Grid de métricas 4 colunas em desktop

### COMPONENTES OBRIGATÓRIOS:
1. **Metric Cards**: Fundo branco, ícone colorido circular à direita, números grandes à esquerda
2. **List Items**: Hover cinza claro, botões de ação coloridos circulares, badges de status
3. **Botões**: Primários roxos, outline cinza, ações circulares coloridas
4. **Tabs**: Borda inferior roxa quando ativo
5. **Modais**: Fundo escuro semitransparente, conteúdo branco centralizado

### TIPOGRAFIA:
- Títulos: font-bold text-gray-900
- Subtítulos: text-gray-600  
- Meta info: text-xs text-gray-500
- Labels: text-sm font-medium text-gray-700

### ANIMAÇÕES:
- Hover: transition-colors, hover:shadow-md
- Cards: hover:bg-gray-50
- Botões: hover com cores mais escuras

### ESPAÇAMENTO:
- Padding padrão: p-6
- Gaps: gap-6 para grids, gap-3 para elementos
- Margins: mb-6 entre seções, mb-4 entre elementos

Implemente EXATAMENTE este design visual, usando Tailwind CSS com essas classes específicas. Mantenha a hierarquia visual, cores e espaçamentos idênticos."

---

## Arquivos CSS Complementares

Para garantir total fidelidade, inclua também:

```css
/* Adicionar ao index.css */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbars personalizadas */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

Este prompt garantirá uma replicação visual exata do design frontend atual.