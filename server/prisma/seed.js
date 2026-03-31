import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 A plantar a semente inicial no NeonDB...');

  // 1. Criar as configurações da loja
  await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      isOpen: true,
      deliveryFee: 5.99,
      estimatedDeliveryTime: '30-40 min',
      minimumOrderValue: 0
    },
  });

  // 2. Criar alguns produtos iniciais
  const produtos = [
    {
      name: 'Smash Premium',
      description: 'Pão brioche, 2 blends smash de 80g, queijo cheddar derretido e molho especial.',
      price: 28.90,
      category: 'burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
      popular: true,
      customizations: ['Sem Cebola', 'Ponto da Carne: Bem Passado', 'Adicionar Bacon'],
      active: true
    },
    {
      name: 'Batata Frita Rústica',
      description: 'Porção de 300g de batatas rústicas super crocantes.',
      price: 14.90,
      category: 'sides',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500',
      popular: false,
      customizations: ['Sem Sal', 'Adicionar Cheddar e Bacon'],
      active: true
    },
    {
      name: 'Coca-Cola Lata',
      description: 'Refrigerante 350ml geladinho.',
      price: 6.00,
      category: 'drinks',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500',
      popular: true,
      customizations: [],
      active: true
    }
  ];

  for (const p of produtos) {
    await prisma.product.create({ data: p });
  }

  console.log('✅ Base de dados populada com sucesso! Tens Hambúrgueres no sistema!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });