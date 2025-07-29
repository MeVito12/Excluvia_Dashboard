# Configurações do Projeto - Sistema de Design

## 1. Package.json - Dependências Necessárias

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "clsx": "^1.2.1",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

## 2. Tailwind Config (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores da marca
        brand: {
          primary: 'hsl(262, 83%, 58%)',
          secondary: 'hsl(158, 89%, 53%)',
          dark: 'hsl(220, 100%, 12%)',
          darker: 'hsl(220, 100%, 8%)',
        },
        // Cores funcionais
        success: 'hsl(142, 76%, 36%)',
        warning: 'hsl(38, 92%, 50%)',
        error: 'hsl(0, 84%, 60%)',
        info: 'hsl(221, 83%, 53%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
```

## 3. PostCSS Config (postcss.config.js)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 4. Vite Config (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

## 5. Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── ui/
│   │   ├── StandardComponents.jsx
│   │   ├── FilterBar.jsx
│   │   ├── ItemList.jsx
│   │   ├── TabNavigation.jsx
│   │   └── StatusBadge.jsx
│   └── sections/
│       └── ExampleSection.jsx
├── hooks/
│   ├── useFilters.js
│   └── useCustomAlert.js
├── utils/
│   └── cn.js (classNames utility)
├── styles/
│   ├── globals.css
│   └── components.css
└── main.jsx
```

## 6. Utility para Classes CSS (src/utils/cn.js)

```javascript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

## 7. Main CSS (src/styles/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copie todo o conteúdo do arquivo EXPORT_CSS_CLASSES.css aqui */
```

## 8. Hook para Alertas Customizados

```javascript
// src/hooks/useCustomAlert.js
import { useState } from 'react';

export const useCustomAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    description: '',
    variant: 'default'
  });

  const showAlert = (data) => {
    setAlertData(data);
    setIsOpen(true);
    
    // Auto close after 5 seconds
    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  const closeAlert = () => {
    setIsOpen(false);
    setAlertData({
      title: '',
      description: '',
      variant: 'default'
    });
  };

  return {
    isOpen,
    alertData,
    showAlert,
    closeAlert
  };
};
```

## 9. Componente de Alert

```jsx
// src/components/ui/CustomAlert.jsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const CustomAlert = ({ isOpen, onClose, title, description, variant = 'default' }) => {
  if (!isOpen) return null;

  const getAlertConfig = () => {
    switch (variant) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        };
      case 'destructive':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        };
    }
  };

  const config = getAlertConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start">
          <IconComponent className={`${config.iconColor} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`} />
          <div className="flex-1">
            <h4 className={`${config.titleColor} font-medium text-sm mb-1`}>
              {title}
            </h4>
            <p className={`${config.textColor} text-sm`}>
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-70 ml-2`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 10. Comandos de Instalação

```bash
# Instalar dependências
npm install

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar ícones Lucide
npm install lucide-react

# Instalar utilitários
npm install clsx tailwind-merge

# Iniciar projeto
npm run dev
```

## 11. Scripts Package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx,ts,tsx",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}"
  }
}
```

## 12. ESLint Config (opcional)

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

## 13. Exemplo de Main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 14. Checklist de Implementação

- [ ] Instalar todas as dependências
- [ ] Configurar Tailwind CSS
- [ ] Copiar classes CSS do arquivo EXPORT_CSS_CLASSES.css
- [ ] Implementar componentes do arquivo EXPORT_COMPONENTS_EXAMPLES.jsx
- [ ] Configurar estrutura de pastas
- [ ] Testar responsividade
- [ ] Validar acessibilidade
- [ ] Configurar linting e formatação

## Notas Importantes

1. **Responsividade**: Todos os componentes são mobile-first
2. **Acessibilidade**: Componentes seguem padrões WCAG
3. **Performance**: Classes CSS otimizadas com Tailwind
4. **Manutenibilidade**: Sistema modular e reutilizável
5. **Customização**: Fácil personalização através de props e CSS variables

Este sistema garante consistência visual e funcional em qualquer projeto React!