export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'vanilla' | 'underwear';
}

import image1 from '@assets/WhatsApp Image 2025-08-12 at 2.03.14 PM_1756285171672.jpeg';
import image2 from '@assets/WhatsApp Image 2025-08-12 at 2.03.15 PM_1756285099951.jpeg';
import image3 from '@assets/WhatsApp Image 2025-08-12 at 2.03.16 PM_1756285109913.jpeg';
import image4 from '@assets/WhatsApp Image 2025-08-12 at 2.03.21 PM_1756285117973.jpeg';
import image5 from '@assets/WhatsApp Image 2025-08-12 at 2.03.22 PM_1756285139955.jpeg';

export const products: Product[] = [
  {
    id: 'top-vanilla',
    name: 'Top Vanilla',
    price: 59.99,
    description: 'Premium top-grade vanilla products for the discerning gentleman.',
    image: image1,
    category: 'vanilla'
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    price: 39.99,
    description: 'High-quality vanilla products for daily use.',
    image: image2,
    category: 'vanilla'
  },
  {
    id: 'premium-underwear',
    name: 'Premium Underwear',
    price: 49.99,
    description: 'Luxury mens underwear crafted for ultimate comfort and style.',
    image: image3,
    category: 'underwear'
  },
  {
    id: 'classic-underwear',
    name: 'Classic Underwear',
    price: 29.99,
    description: 'Traditional mens underwear with modern comfort technology.',
    image: image4,
    category: 'underwear'
  },
  {
    id: 'comfort-underwear',
    name: 'Comfort Underwear',
    price: 34.99,
    description: 'Designed for all-day comfort with breathable materials.',
    image: image5,
    category: 'underwear'
  }
];
