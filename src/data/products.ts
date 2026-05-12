import type { Product, Testimonial, Promotion } from '../types';

export const products: Product[] = [
  {
    id: 'chapa-lanche',
    name: 'Char Broiler Profissional Croydon CCP3 - 75 cm a Gás',
    description:
      'Char Broiler profissional 75 cm com 3 queimadores independentes, grelhas em ferro fundido e estrutura em aço inox. Ideal para hamburguerias, lanchonetes e churrascos profissionais.',
    price: 2000,
    category: 'cozinha',
    image: '/equipamentos/chapa-lanche/download-1.jpg',
    gallery: [
      '/equipamentos/chapa-lanche/download-1.jpg',
      '/equipamentos/chapa-lanche/download-2.jpg',
      '/equipamentos/chapa-lanche/foto-3.png',
      '/equipamentos/chapa-lanche/foto-4.png',
      '/equipamentos/chapa-lanche/foto-5.1.png',
      '/equipamentos/chapa-lanche/foto-6.jpg',
      '/equipamentos/chapa-lanche/foto-8.jpg',
      '/equipamentos/chapa-lanche/foto-9.jpg',
    ],
    features: [
      'Estrutura em aço inox',
      'Grelhas em ferro fundido',
      '3 queimadores independentes (11.000 BTU/h cada)',
      'Acompanha pedras cerâmicas e chapa bifeteira',
      'Gaveta coletora de gordura removível',
      'Pés ajustáveis para nivelamento',
      'Regulado para Gás GLP (botijão)',
      'Dimensões: 41 × 75 × 74 cm - Peso: 48 kg',
    ],
    condition: 'Usada - pronta para uso',
    status: 'disponivel',
    badge: 'DESTAQUE',
  },
  {
    id: 'fritadeira-eletrica',
    name: 'Fritadeira Elétrica Industrial',
    description:
      'Fritadeira elétrica para batatas, salgados, porções e uso intenso em cozinha comercial. Aquecimento rápido e cuba resistente.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'cozinha',
    image: '/equipamentos/fritadeira-eletrica/foto-1.jpg',
    gallery: [
      '/equipamentos/fritadeira-eletrica/foto-1.jpg',
      '/equipamentos/fritadeira-eletrica/foto-2.jpg',
      '/equipamentos/fritadeira-eletrica/foto-3.jpg',
      '/equipamentos/fritadeira-eletrica/foto-4.jpg',
      '/equipamentos/fritadeira-eletrica/foto-5.jpg',
      '/equipamentos/fritadeira-eletrica/foto-6.jpg',
      '/equipamentos/fritadeira-eletrica/foto-7.jpg',
      '/equipamentos/fritadeira-eletrica/foto-8.jpg',
      '/equipamentos/fritadeira-eletrica/foto-9.jpg',
    ],
    features: [
      'Funcionamento elétrico',
      'Aquecimento rápido',
      'Cuba resistente',
      'Ideal para batatas e porções',
      'Uso profissional',
    ],
    condition: 'Usada em bom estado',
    status: 'disponivel',
  },
  {
    id: 'estufa-batata',
    name: 'Estufa de Batata Frita',
    description:
      'Estufa para manter batatas fritas e porções aquecidas e crocantes durante o atendimento. Essencial para o ritmo de uma hamburgueria.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'cozinha',
    image: '/equipamentos/estufa-batata/foto-1.jpg',
    gallery: [
      '/equipamentos/estufa-batata/foto-1.jpg',
      '/equipamentos/estufa-batata/foto-2.jpg',
      '/equipamentos/estufa-batata/foto-3.jpg',
      '/equipamentos/estufa-batata/foto-4.jpg',
      '/equipamentos/estufa-batata/foto-5.jpg',
      '/equipamentos/estufa-batata/foto-6.jpg',
    ],
    features: [
      'Mantém batatas crocantes',
      'Iluminação de aquecimento',
      'Ideal para hamburgueria e lanchonete',
      'Pronta para uso',
    ],
    condition: 'Usada',
    status: 'disponivel',
  },
  {
    id: 'pia-lanche',
    name: 'Pia Inox para Lanchonete',
    description:
      'Pia em inox ideal para cozinha profissional, higienização e preparo de alimentos. Material resistente e fácil de limpar.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'cozinha',
    image: '/equipamentos/pia-lanche/foto-1.jpg',
    gallery: [
      '/equipamentos/pia-lanche/foto-1.jpg',
      '/equipamentos/pia-lanche/foto-2.jpg',
      '/equipamentos/pia-lanche/foto-3.jpg',
      '/equipamentos/pia-lanche/foto-4.jpg',
    ],
    features: [
      'Material em inox',
      'Fácil limpeza',
      'Ideal para comércio alimentício',
      'Boa durabilidade',
    ],
    condition: 'Usada em bom estado',
    status: 'disponivel',
  },
  {
    id: 'mesa-balcao',
    name: 'Mesa / Suporte de Balcão de Atendimento',
    description:
      'Mesa e suporte de balcão para atendimento ao cliente, caixa ou apoio operacional. Estrutura firme com bom espaço para uso comercial.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'atendimento',
    image: '/equipamentos/mesa-balcao/foto-1.jpg',
    gallery: [
      '/equipamentos/mesa-balcao/foto-1.jpg',
      '/equipamentos/mesa-balcao/foto-2.jpg',
      '/equipamentos/mesa-balcao/foto-3.jpg',
      '/equipamentos/mesa-balcao/foto-4.jpg',
      '/equipamentos/mesa-balcao/foto-5.jpg',
      '/equipamentos/mesa-balcao/foto-6.jpg',
      '/equipamentos/mesa-balcao/foto-7.jpg',
    ],
    features: [
      'Estrutura firme',
      'Visual comercial',
      'Bom espaço para balcão de atendimento',
      'Ideal para recepção, caixa ou apoio',
    ],
    condition: 'Usada em bom estado',
    status: 'disponivel',
    badge: 'NEGOCIÁVEL',
  },
  {
    id: 'geladeira-consul',
    name: 'Geladeira Consul',
    description:
      'Geladeira Consul em bom estado de uso, ideal para armazenamento de bebidas, insumos e ingredientes em lanchonete ou hamburgueria.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'refrigeracao',
    image: '/equipamentos/geladeira-consul/foto-1.png',
    gallery: [
      '/equipamentos/geladeira-consul/foto-1.png',
      '/equipamentos/geladeira-consul/foto-2.png',
    ],
    features: [
      'Marca Consul',
      'Boa capacidade de armazenamento',
      'Ideal para bebidas e insumos',
      'Em funcionamento',
    ],
    condition: 'Usada em bom estado',
    status: 'disponivel',
  },
  {
    id: 'bancada',
    name: 'Bancada de Apoio',
    description:
      'Bancada de apoio para cozinha ou área de produção, oferecendo espaço extra para preparo, montagem de lanches e organização de utensílios.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'mobiliario',
    image: '/equipamentos/bancada/foto-1.png',
    gallery: [
      '/equipamentos/bancada/foto-1.png',
    ],
    features: [
      'Estrutura resistente',
      'Espaço útil para preparo',
      'Ideal para cozinha comercial',
      'Pronta para uso',
    ],
    condition: 'Usada em bom estado',
    status: 'disponivel',
  },
  {
    id: 'casinha-gas',
    name: 'Casinha de Gás (Abrigo para Botijão)',
    description:
      'Estrutura segura para abrigo do botijão de gás (casinha de gás), atendendo às boas práticas de instalação em estabelecimento comercial.',
    price: 0,
    priceLabel: 'A consultar',
    category: 'utensilios',
    image: '/equipamentos/casinha-gas/foto-1.jpg',
    gallery: [
      '/equipamentos/casinha-gas/foto-1.jpg',
      '/equipamentos/casinha-gas/foto-2.jpg',
      '/equipamentos/casinha-gas/foto-3.jpg',
    ],
    features: [
      'Abrigo seguro para botijão',
      'Adequada a uso comercial',
      'Estrutura resistente',
      'Pronta para instalação',
    ],
    condition: 'Usada',
    status: 'disponivel',
  },
];

export const categories: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'cozinha', label: 'Cozinha Industrial' },
  { id: 'atendimento', label: 'Atendimento' },
  { id: 'refrigeracao', label: 'Refrigeração' },
  { id: 'mobiliario', label: 'Mobiliário' },
  { id: 'exaustao', label: 'Exaustão' },
  { id: 'utensilios', label: 'Utensílios' },
  { id: 'promocoes', label: 'Destaques' },
  { id: 'vendidos', label: 'Vendidos' },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    text: 'Itens sujeitos à disponibilidade. A reserva é confirmada apenas mediante acordo direto com o vendedor pelo WhatsApp.',
    author: 'Aviso de disponibilidade',
    role: 'Importante',
    rating: 5,
  },
  {
    id: '2',
    text: 'Os valores anunciados podem ser negociados, especialmente em compras de mais de um item ou pagamento à vista.',
    author: 'Aviso de negociação',
    role: 'Importante',
    rating: 5,
  },
  {
    id: '3',
    text: 'Equipamentos usados podem apresentar marcas naturais de uso. Recomendamos solicitar fotos detalhadas e vídeo antes de fechar negócio.',
    author: 'Aviso de conservação',
    role: 'Importante',
    rating: 5,
  },
];

export const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Pacote para Montar Hamburgueria',
    description:
      'Leve a chapa, fritadeira, estufa, pia e balcão em um único pacote com condição especial.',
    badge: 'Negociação direta',
    color: 'cheese',
  },
  {
    id: '2',
    title: 'À vista com desconto',
    description:
      'Pagamento à vista em Pix ou dinheiro pode ter desconto adicional. Consulte pelo WhatsApp.',
    badge: 'Pix / dinheiro',
    color: 'fire',
  },
  {
    id: '3',
    title: 'Itens prontos para retirada',
    description:
      'Equipamentos disponíveis para retirada imediata após acerto. Combine local e horário pelo WhatsApp.',
    badge: 'Retirada combinada',
    color: 'cheese',
  },
];
