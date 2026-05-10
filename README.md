# 🍔 Ogs Burguer - Landing Page

Uma landing page moderna e profissional para a Ogs Burguer, uma hamburgueria artesanal premium. Desenvolvida com as melhores práticas de UI/UX design e engenharia de software.

## ✨ Características Principais

- ✅ **Design Responsivo**: Totalmente otimizado para mobile, tablet e desktop
- ✅ **Catálogo Dinâmico**: 24 produtos com filtro por categoria
- ✅ **Carrinho de Compras**: Modal inteligente com gestão de quantidades
- ✅ **Integração WhatsApp**: Pedidos diretos via WhatsApp Web
- ✅ **Animações Profissionais**: Transições suaves com Framer Motion
- ✅ **Acessibilidade**: WCAG 2.1 compliant com suporte a navegação por teclado
- ✅ **Performance**: Otimizado com Vite e lazy loading
- ✅ **TypeScript**: Type-safe com interfaces bem definidas

## 🛠 Stack Tecnológico

- **React 18.2** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling com custom theme
- **Framer Motion** - Animations
- **Vite** - Build tool rápido
- **Lucide React** - Icons
- **React Hooks** - State management

## 🚀 Quick Start

### Pré-requisitos
- Node.js 16.x ou superior
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd ogs-burguer

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Abra no navegador
# http://localhost:5173
```

### Build para Produção

```bash
# Build
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React reutilizáveis
├── hooks/            # Custom hooks (useCart)
├── utils/            # Funções utilitárias (WhatsApp)
├── types/            # Interfaces TypeScript
├── data/             # Dados: produtos, avaliações, promoções
├── App.tsx           # Componente principal
├── main.tsx          # Entry point React
└── index.css         # Estilos globais
```

## 🎨 Paleta de Cores

| Cor | Código | Uso |
|-----|--------|-----|
| Coal | #1a1a1a | Background primário |
| Ketchup | #e63946 | Accent primário |
| Cheese | #ffd60a | Highlights |
| Ice | #f8f9fa | Text e elementos claros |
| Fire | #ff8c42 | Accent secundário |

## 📱 Seções da Página

### Hero
- Full-screen com imagem destaque
- CTAs para começar a comprar
- Scroll indicator animado

### Catálogo
- Grid responsivo de produtos
- Filtro por categoria
- Cards com informações e preço
- Botões: Adicionar ao carrinho / Pedir via WhatsApp

### Promoções
- Cards com descontos
- Banner destaque com código de primeira compra
- Stats de satisfação dos clientes

### Avaliações
- Top 3 testimoniais com melhor rating
- Avaliações em estrelas
- Stats agregadas

### Sobre
- História da marca
- Valores da empresa
- Stats: clientes, receitas, tempo entrega

### Footer
- Logo e descrição
- Links rápidos
- Informações de contato
- Newsletter signup
- Métodos de pagamento

## 💳 Integração WhatsApp

Os pedidos são enviados via WhatsApp Web usando a URL scheme `https://wa.me/`. Não requer backend, totalmente client-side.

**Número**: (18) 98114-2927

### Funcionalidades:
- Pedir diretamente de um produto
- Adicionar itens do carrinho
- Informações de cliente são incluídas

## 🛒 Gestão do Carrinho

O hook `useCart` cuida de:
- Adicionar produtos ao carrinho
- Atualizar quantidades
- Remover itens
- Limpar carrinho após checkout

Dados persistem na sessão (sessão storage para futuro).

## ♿ Acessibilidade

- Navegação por teclado suportada
- ARIA labels em componentes interativos
- Contraste de cor WCAG AA compliant
- Focus visible em inputs
- Suporte a preferências de movimento reduzido

## 📊 TypeScript Types

Todos os tipos estão centralizados em `src/types/index.ts`:

```typescript
ProductCategory | Product | CartItem | Order | Testimonial | Promotion
```

## 🔐 Segurança

- Sem backend exposição de dados sensíveis
- Inputs sanitizados
- HTTPS recomendado para produção

## 📈 Próximos Passos

- [ ] Admin panel para gerenciar produtos
- [ ] Sistema de pedidos com histórico
- [ ] Autenticação de usuário
- [ ] Integração com gateway de pagamento real
- [ ] Email confirmação de pedido
- [ ] Analytics (Google Analytics/Mixpanel)
- [ ] Multi-idioma (EN, ES, PT)
- [ ] PWA (Progressive Web App)

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```env
VITE_WHATSAPP_NUMBER=5518981142927
VITE_BUSINESS_EMAIL=contato@ogsburger.com.br
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado. Todos os direitos reservados © 2026 Ogs Burguer.

## 📞 Suporte

**WhatsApp**: (18) 98114-2927
**Email**: contato@ogsburger.com.br
**Endereço**: Rua das Flores, 123 - Guaraí, SP

---

Feito com ❤️ por Ogs Burger Team

**⭐ Se você gostou do projeto, considere deixar uma estrela!**
