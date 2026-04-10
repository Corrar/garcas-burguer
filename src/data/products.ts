import type { Product } from '@/types';
import burgerHero from '@/assets/burger-hero.jpg';
import burgerSmash from '@/assets/burger-smash.jpg';
import burgerBlue from '@/assets/burger-blue.jpg';
import fries from '@/assets/fries.jpg';
import drinks from '@/assets/drinks.jpg';

export const CUSTOMIZATION_OPTIONS = [
  'Sem cebola', 'Sem tomate', 'Sem alface', 'Sem picles',
  'Extra queijo', 'Extra bacon', 'Extra carne', 'Ponto da carne: Mal passado',
  'Ponto da carne: Ao ponto', 'Ponto da carne: Bem passado',
];

export const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Smash',
    description: 'Duplo smash de 90g, queijo americano, picles, cebola, mostarda e ketchup no pão brioche com gergelim.',
    price: 32.90,
    category: 'burgers',
    image: burgerSmash,
    popular: true,
    customizations: CUSTOMIZATION_OPTIONS,
  },
  {
    id: '2',
    name: 'Bacon House',
    description: 'Burger artesanal 180g, cheddar derretido, bacon crocante, cebola caramelizada, alface e tomate.',
    price: 38.90,
    category: 'burgers',
    image: burgerHero,
    popular: true,
    customizations: CUSTOMIZATION_OPTIONS,
  },
  {
    id: '3',
    name: 'Blue Cheese BBQ',
    description: 'Burger 180g, queijo gorgonzola, rúcula, onion rings, molho barbecue artesanal.',
    price: 42.90,
    category: 'burgers',
    image: burgerBlue,
    customizations: CUSTOMIZATION_OPTIONS,
  },
  {
    id: '4',
    name: 'Batata Frita',
    description: 'Porção de batatas fritas crocantes com ketchup e maionese da casa.',
    price: 18.90,
    category: 'sides',
    image: fries,
    popular: true,
  },
  {
    id: '5',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados e crocantes com molho especial.',
    price: 22.90,
    category: 'sides',
    image: fries,
  },
  {
    id: '6',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite. 350ml.',
    price: 7.90,
    category: 'drinks',
    image: drinks,
  },
  {
    id: '7',
    name: 'Suco Natural',
    description: 'Laranja, limão ou maracujá. 400ml.',
    price: 12.90,
    category: 'drinks',
    image: drinks,
  },
  {
    id: '8',
    name: 'Cerveja Artesanal',
    description: 'IPA, Pilsen ou Weiss. 500ml.',
    price: 19.90,
    category: 'drinks',
    image: drinks,
    popular: true,
  },
  {
    id: '9',
    name: 'Combo Smash',
    description: 'Classic Smash + Batata Frita + Refrigerante.',
    price: 49.90,
    category: 'combos',
    image: burgerSmash,
    popular: true,
  },
  {
    id: '10',
    name: 'Combo Bacon',
    description: 'Bacon House + Batata Frita + Refrigerante.',
    price: 54.90,
    category: 'combos',
    image: burgerHero,
  },
  {
    id: '11',
    name: 'Extra Queijo',
    description: 'Fatia adicional de queijo cheddar ou americano.',
    price: 4.00,
    category: 'extras',
    image: burgerHero,
  },
  {
    id: '12',
    name: 'Extra Bacon',
    description: 'Porção extra de bacon crocante.',
    price: 6.00,
    category: 'extras',
    image: burgerHero,
  },
];
