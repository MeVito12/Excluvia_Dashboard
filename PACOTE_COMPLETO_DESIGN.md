# PACOTE COMPLETO - DESIGN SYSTEM FUNCIONAL

## ⚠️ INSTRUÇÕES CRÍTICAS PARA FUNCIONAMENTO

### PASSO 1: Verificar Estrutura do Projeto
```
meu-projeto/
├── src/
│   ├── components/
│   ├── index.css (SUBSTITUIR COMPLETAMENTE)
│   └── main.tsx (ou index.tsx)
├── tailwind.config.js (CRIAR/SUBSTITUIR)
├── postcss.config.js (CRIAR)
├── vite.config.js (VERIFICAR)
└── package.json (ATUALIZAR)
```

### PASSO 2: Dependências Obrigatórias
```bash
# INSTALAR EXATAMENTE ESSAS VERSÕES
npm install tailwindcss@^3.3.0 autoprefixer@^10.4.14 postcss@^8.4.24
npm install lucide-react clsx tailwind-merge
npm install @tailwindcss/typography tailwindcss-animate
```

### PASSO 3: Arquivo tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
```

### PASSO 4: Arquivo postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### PASSO 5: Arquivo vite.config.js (se usando Vite)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### PASSO 6: Atualizar main.tsx/index.tsx
```typescript
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'  // DEVE estar aqui

createRoot(document.getElementById("root")!).render(<App />);
```

### PASSO 7: EXECUTAR COMANDOS DE BUILD
```bash
# LIMPAR CACHE
rm -rf node_modules/.cache
rm -rf dist

# REINSTALAR
npm install

# BUILD DE DESENVOLVIMENTO
npm run dev
```

### PASSO 8: Teste com Componente Simples
```jsx
// TestComponent.jsx
function TestComponent() {
  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Teste do Design System</h1>
        <p className="section-subtitle">Se você vê este texto com fundo roxo, funcionou!</p>
      </div>
      
      <div className="main-card p-6">
        <div className="metrics-grid">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-900">Métrica 1</h3>
            <p className="text-2xl font-bold text-purple-600">1.234</p>
          </div>
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-900">Métrica 2</h3>
            <p className="text-2xl font-bold text-green-600">5.678</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="btn btn-primary mr-4">Botão Primário</button>
          <button className="btn btn-outline">Botão Outline</button>
        </div>
      </div>
    </div>
  )
}

export default TestComponent
```

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Problema 1: "Classes não funcionam"
**Solução**: Verificar se o Tailwind está processando o CSS
```bash
# No terminal, deve aparecer:
# "Rebuilding..."
# "Done in Xms"
```

### Problema 2: "Cores não aparecem"
**Solução**: Verificar se as variáveis CSS estão definidas no `:root`
- Abrir DevTools
- Verificar se `--primary: 262 83% 58%` está no `:root`

### Problema 3: "Layout quebrado"
**Solução**: Verificar importação do CSS
- O `import './index.css'` deve estar no arquivo principal
- Deve aparecer DEPOIS de outras importações

### Problema 4: "Build falha"
**Solução**: Verificar configurações
1. `tailwind.config.js` deve usar `export default`
2. `postcss.config.js` deve existir
3. Executar `npx tailwindcss init` se necessário

## ✅ VALIDAÇÃO FINAL

Se funcionou corretamente, você deve ver:
1. **Fundo roxo degradê** na seção
2. **Título branco grande** 
3. **Cards brancos com sombra**
4. **Botões roxo e verde** funcionando
5. **Hover effects** nos elementos

## 🚨 SE AINDA NÃO FUNCIONAR

1. Envie o erro exato do console
2. Envie a estrutura do seu `package.json`
3. Confirme se está usando Vite, Create React App, ou Next.js
4. Verificar se há conflitos com outros CSS frameworks