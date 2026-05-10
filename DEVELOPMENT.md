# 🛠️ Guia de Desenvolvimento - Ogs Burguer

Documentação para desenvolvedores que trabalham no projeto Ogs Burguer.

## Ambiente de Desenvolvimento

### Setup Inicial

```bash
# 1. Clone o repositório
git clone <repository-url>
cd ogs-burguer

# 2. Instale Node.js 16.x ou superior
# Verifique com: node --version && npm --version

# 3. Instale dependências
npm install

# 4. Inicie o servidor dev
npm run dev

# 5. Abra http://localhost:5173 no navegador
```

## Arquitetura e Padrões

### Estrutura de Componentes

Todos os componentes seguem este padrão:

```tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

export function MyComponent({ prop1, prop2 = 0 }: MyComponentProps) {
  // Hooks
  const [state, setState] = React.useState('');

  // Handlers
  const handleAction = () => {
    // Logic here
  };

  // Render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Padrões de Framer Motion

**Entrance Animation**:
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

**Staggered Children**:
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};
```

**Hover Effects**:
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

## Convenções de Código

### TypeScript
- Use `interface` para contracts, `type` para unions/aliases
- Sempre adicione tipos explícitos para props
- Prefira tipos sobre `any`

```tsx
// ✅ Bom
interface ProductProps {
  product: Product;
  onSelect: (id: string) => void;
}

// ❌ Evitar
interface ProductProps {
  product: any;
  onSelect: Function;
}
```

### React Hooks
- Sempre declare dependências em hooks
- Use `useMemo` para computações pesadas
- Prefira `useCallback` para handlers

```tsx
// ✅ Bom
const memoizedValue = useMemo(
  () => expensiveComputation(a, b),
  [a, b]
);

// ❌ Evitar
const value = expensiveComputation(a, b);
```

### Tailwind CSS
- Use a paleta customizada (coal, ketchup, cheese, ice, fire)
- Prefira classes Tailwind a CSS inline
- Use breakpoints: `md:` (tablet), `lg:` (desktop)

```tsx
// ✅ Bom
<div className="text-base md:text-lg lg:text-xl text-ice">

// ❌ Evitar
<div style={{ fontSize: isMobile ? '16px' : '20px' }}>
```

### Nomes
- Componentes: PascalCase
- Funções/variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE

```tsx
// ✅ Bom
const MAX_QUANTITY = 100;
function handleAddToCart() {}
const ProductCard = () => {};

// ❌ Evitar
const maxQuantity = 100;
function HandleAddToCart() {}
const product_card = () => {};
```

## Fluxo de Dados

```
App.tsx (State Manager)
   ↓
Props Down → Components
   ↑
Callbacks Up → Event Handlers
```

### Adicionar um Novo Produto

1. **Update `src/data/products.ts`**:
```tsx
{
  id: 'new-product-id',
  name: 'Nome do Produto',
  description: 'Descrição curta',
  price: 35.90,
  category: 'burgers',
  image: 'https://images.unsplash.com/...',
  ingredients: ['ingredient1', 'ingredient2'],
}
```

2. **Nenhuma mudança necessária em outros arquivos** - o sistema é completamente dinâmico!

### Adicionar uma Nova Categoria

1. **Update `src/types/index.ts`**:
```tsx
type ProductCategory = 'all' | 'burgers' | 'combos' | 'new-category';
```

2. **Add in `CategoryFilter.tsx`**:
```tsx
{ id: 'new-category', label: 'Nova Categoria', icon: IconComponent }
```

3. **Update products in `src/data/products.ts`** com a nova categoria

## Estilo e CSS

### Cores Customizadas

```js
// tailwind.config.js
extend: {
  colors: {
    coal: '#1a1a1a',
    ketchup: '#e63946',
    cheese: '#ffd60a',
    ice: '#f8f9fa',
    fire: '#ff8c42',
    'burger-dark': '#0d0d0d',
  },
}
```

### Fonte Customizada

```js
// tailwind.config.js
fontFamily: {
  heading: ['Poppins', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

### Variáveis Úteis

```tailwind
/* Em componentes */
<div className="font-heading">           {/* Poppins */}
<div className="text-ketchup">           {/* #e63946 */}
<div className="border-ketchup/20">      {/* com 20% opacity */}
<div className="bg-coal/50">             {/* com 50% opacity */}
```

## Performance

### Code Splitting

Vite já faz code splitting automático. Você pode importar dinâmicamente se necessário:

```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<React.Suspense fallback={<div>Carregando...</div>}>
  <HeavyComponent />
</React.Suspense>
```

### Memoization

Use para componentes que recebem muitas props:

```tsx
const ProductCard = React.memo(function ProductCard({ product }) {
  return (/* ... */);
});
```

### Image Optimization

Todas as imagens são do Unsplash (otimizado). Para adicionar imagens locais:

```tsx
// Vite suporta import direto
import myImage from './assets/my-image.jpg';
```

## Testing (Futuro)

Quando implementar testes:

```bash
npm install --save-dev vitest @testing-library/react jsdom
```

```tsx
// src/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product name', () => {
    const product = { id: '1', name: 'Burger Test' /* ... */ };
    render(<ProductCard product={product} onAddToCart={() => {}} />);
    expect(screen.getByText('Burger Test')).toBeInTheDocument();
  });
});
```

## Debugging

### Console Logging

```tsx
// ✅ Use em desenvolvimento
console.log('[DEBUG] Product added:', product);

// Remova antes de produção ou use:
if (process.env.NODE_ENV === 'development') {
  console.log('[DEBUG]', data);
}
```

### Browser DevTools

1. **React DevTools**: Extension do Chrome/Firefox
2. **Framer Motion DevTools**: Inspecione animações
3. **Tailwind IntelliSense**: VS Code extension

## Build e Deployment

### Build para Produção

```bash
npm run build
```

Gera:
- `dist/index.html` - HTML minificado
- `dist/assets/` - JS/CSS bundled

### Preview da Build

```bash
npm run preview
```

Simula a build em produção localmente.

### Deploy (Exemplos)

**Vercel** (Recomendado):
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages**:
```bash
# Adicione ao vite.config.ts: base: '/ogs-burguer/',
npm run build
```

## Troubleshooting

### Problema: "Cannot find module"
```bash
# Limpe node_modules
rm -rf node_modules package-lock.json
npm install
```

### Problema: Porta 5173 já em uso
```bash
# Use outra porta
npm run dev -- --port 3000
```

### Problema: Estilos Tailwind não funcionam
1. Verifique `tailwind.config.js` tem `content: ['./src/**/*.tsx']`
2. Verifique `index.css` tem `@tailwind` directives
3. Restart dev server

### Problema: Imagens Unsplash não carregam
1. Verifique conexão internet
2. Verifique URL é válida com `?w=` e `?h=` params
3. Considere usar image CDN alternativo

## Git Workflow

```bash
# Branch para nova feature
git checkout -b feature/feature-name

# Faça commits com mensagens descritivas
git commit -m "feat: add new product category"

# Push
git push origin feature/feature-name

# Abra PR no GitHub
```

### Commit Message Convention

```
feat: add new feature
fix: bug fix
refactor: code refactoring
docs: documentation updates
style: formatting changes
perf: performance improvements
```

## Resources Úteis

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Vite Docs](https://vitejs.dev)

## Contato & Suporte

Para dúvidas durante o desenvolvimento:
- WhatsApp: (18) 98114-2927
- Email: contato@ogsburger.com.br

---

**Última atualização**: Maio 2026
**Mantido por**: Ogs Burger Team
