# Ogs Burguer - Landing Page Project Structure

## Project Overview
A modern, professional landing page for Ogs Burguer - an artisanal hamburger restaurant. Built with React 18, TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## Technology Stack
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+ with custom color theme
- **Animations**: Framer Motion 10+
- **Icons**: Lucide React
- **Font**: Poppins (headings), Inter (body)

## Project Structure

```
ogs-burguer/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Fixed header with navigation, cart, WhatsApp button
│   │   ├── Hero.tsx                # Full-screen hero section
│   │   ├── CategoryFilter.tsx       # Product category filter buttons
│   │   ├── Catalog.tsx             # Product grid display
│   │   ├── ProductCard.tsx         # Reusable product card component
│   │   ├── CartModal.tsx           # Shopping cart modal
│   │   ├── Promotions.tsx          # Promotional offers section
│   │   ├── Testimonials.tsx        # Customer reviews section
│   │   ├── About.tsx               # Company information section
│   │   └── Footer.tsx              # Footer with contact info
│   │
│   ├── hooks/
│   │   └── useCart.ts              # Custom hook for cart state management
│   │
│   ├── utils/
│   │   └── whatsapp.ts             # WhatsApp integration utilities
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces and types
│   │
│   ├── data/
│   │   └── products.ts             # Products, testimonials, and promotions data
│   │
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Global styles with Tailwind directives
│   └── vite-env.d.ts              # Vite TypeScript definitions
│
├── index.html                      # HTML entry point for Vite
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration with custom theme
├── postcss.config.js               # PostCSS configuration
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables template
└── README.md                       # Project documentation

```

## Key Features

### 1. **Responsive Design**
- Mobile-first approach
- Breakpoints: Mobile (default), Tablet (md: 768px), Desktop (lg: 1024px)
- Sticky header with hamburger menu for mobile

### 2. **Product Catalog**
- 24 products across 6 categories
- Dynamic filtering by category
- High-quality product images from Unsplash
- Add to cart functionality
- Direct WhatsApp ordering option

### 3. **Shopping Cart**
- Right-slide modal
- Quantity adjustment
- Customer information form
- Order total calculation
- Integrated WhatsApp checkout

### 4. **Animations & Interactions**
- Smooth scroll behavior
- Staggered entrance animations
- Hover effects on cards and buttons
- Framer Motion for professional motion design
- Floating WhatsApp button with tooltip

### 5. **Sections**
- **Hero**: Eye-catching introduction with CTA buttons
- **Catalog**: Product grid with category filtering
- **Promotions**: Special offers and first-purchase discount
- **Testimonials**: Customer reviews with ratings (top 3 featured)
- **About**: Company story and values
- **Footer**: Contact info, social links, newsletter signup

### 6. **WhatsApp Integration**
- Direct messaging from product cards
- Cart summary to WhatsApp
- Quick contact button
- Phone number: (18) 98114-2927

## Color Theme
- **Coal** (#1a1a1a): Primary dark background
- **Ketchup** (#e63946): Primary accent color
- **Cheese** (#ffd60a): Highlight color
- **Ice** (#f8f9fa): Text and light elements
- **Fire** (#ff8c42): Secondary accent
- **Burger Dark** (#0d0d0d): Darker backgrounds

## Component Communication

```
App.tsx (Main state manager)
├── Header (displays cart count, handles cart open)
├── Hero (CTA buttons)
├── CategoryFilter (updates active category)
├── Catalog (displays filtered products, handles add to cart)
├── Promotions (display only)
├── Testimonials (display only)
├── About (display only)
├── CartModal (form submission, order finalization)
└── Footer (display only)
```

## State Management
- **useCart Hook**: Manages cart items, quantities, and operations
- **App Level**: Manages activeCategory and cartOpen states
- **Props**: Components communicate through props and callbacks

## TypeScript Interfaces

```typescript
// Product Category Types
type ProductCategory = 'all' | 'burgers' | 'combos' | 'portions' | 'drinks' | 'desserts' | 'promotions'

// Product
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  ingredients: string[]
}

// Cart Item
interface CartItem {
  product: Product
  quantity: number
}

// Order
interface Order {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: CartItem[]
  total: number
  timestamp: Date
}

// Testimonial
interface Testimonial {
  id: string
  author: string
  role: string
  text: string
  rating: number
  image: string
}

// Promotion
interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  validUntil: Date
}
```

## Setup & Installation

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables
Create a `.env` file based on `.env.example` if needed for future backend integration.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations
- Code splitting with Vite
- Lazy loading for images
- Optimized animations
- Memoization for filtered products
- CSS bundling with Tailwind

## Future Enhancements
- Admin panel for product management
- Order history and tracking
- User authentication
- Real payment gateway integration
- Email confirmation system
- Analytics integration
- Multi-language support

## Contact Information
**Location**: Rua das Flores, 123 - Guaraí, SP
**Phone**: (18) 98114-2927
**Email**: contato@ogsburger.com.br
**Hours**: Seg-Dom: 11h às 23h

## Notes for Developers
1. All components use Framer Motion for smooth animations
2. Tailwind CSS is configured with custom colors in tailwind.config.js
3. All TypeScript types are centralized in src/types/index.ts
4. WhatsApp integration uses URL scheme (no external API needed)
5. Images are hosted on Unsplash (free tier)
6. Font loading is optimized with Google Fonts preconnect
