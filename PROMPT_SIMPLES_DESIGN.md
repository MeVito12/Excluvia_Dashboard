# PROMPT DIRETO PARA REPLICAR DESIGN

## PROMPT PARA COPIAR E COLAR:

---

**Crie um sistema de gestão empresarial com este design EXATO:**

### CORES OBRIGATÓRIAS:
- Roxo: #8B5CF6 (primária)
- Cinzas: #F9FAFB, #E2E8F0, #64748B, #334155, #0F172A
- Verde: #16a34a, Amarelo: #ca8a04, Vermelho: #dc2626, Azul: #2563eb

### LAYOUT:
1. **Sidebar**: 280px, fundo #1E293B, menu roxo quando ativo
2. **Área principal**: gradiente cinza claro, padding 24px
3. **Cards**: fundo branco, bordas #E2E8F0, sombra sutil

### COMPONENTES:

**Metric Cards:**
```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Título</p>
      <p className="text-2xl font-bold text-black mt-1">Valor</p>
      <p className="text-xs text-green-600 mt-1">Mudança</p>
    </div>
    <div className="p-3 rounded-full bg-green-100">
      <Icon className="h-6 w-6 text-green-600" />
    </div>
  </div>
</div>
```

**Lista Items:**
```jsx
<div className="bg-white border border-gray-200 rounded-lg">
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
    <div className="flex-1">
      <div className="font-semibold text-gray-900 mb-1">Título</div>
      <div className="text-sm text-gray-600 mb-1">Subtítulo</div>
      <div className="text-xs text-gray-500">Meta info</div>
    </div>
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Status
      </span>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</div>
```

**Botões:**
```jsx
// Primário
<button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2">
// Outline  
<button className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2 rounded-md">
```

**Grid de Métricas:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {/* Metric cards aqui */}
</div>
```

### CSS ESSENCIAL:
```css
.app-section {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #F9FAFB, white);
  padding: 24px;
  margin-left: 280px;
}

.sidebar {
  width: 280px;
  background-color: #1E293B;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
}

.sidebar .menu-item.active {
  background-color: #8B5CF6;
}
```

### RESULTADO ESPERADO:
- Sidebar escura à esquerda
- Cards métricos em grid 4 colunas
- Listas com hover cinza claro
- Botões roxos para ações principais
- Badges coloridas para status
- Ícones circulares coloridos nos botões de ação

**Use essas classes e componentes EXATAMENTE como mostrado.**

---

## PROMPT AINDA MAIS SIMPLES:

"Implemente um dashboard empresarial com:
- Sidebar 280px cinza escuro (#1E293B) 
- Cards brancos com bordas cinza claras
- Botões roxos (#8B5CF6) 
- Grid 4 colunas de métricas
- Listas com hover cinza claro
- Badges coloridas de status
- Layout: sidebar + área principal com gradiente cinza claro

Use Tailwind CSS com essas cores exatas e estrutura de cards/listas como mostrado nos exemplos."