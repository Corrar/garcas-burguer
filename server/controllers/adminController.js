import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Configurações
export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações', details: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    const updatedSettings = await prisma.storeSettings.upsert({
      where: { id: 'singleton' },
      update: {
        isOpen: data.isOpen,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        deliveryFee: data.deliveryFee !== undefined ? Number(data.deliveryFee) : undefined,
        minimumOrderValue: data.minimumOrderValue !== undefined ? Number(data.minimumOrderValue) : undefined
      },
      create: {
        id: 'singleton',
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        estimatedDeliveryTime: data.estimatedDeliveryTime || '30-40 min',
        deliveryFee: Number(data.deliveryFee) || 5.99,
        minimumOrderValue: Number(data.minimumOrderValue) || 0
      }
    });
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar configurações', details: error.message });
  }
};

// Banners
export const getBanners = async (req, res) => {
  try {
    const banners = await prisma.promoBanner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar banners', details: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const newBanner = await prisma.promoBanner.create({ data: req.body });
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar banner', details: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBanner = await prisma.promoBanner.update({ where: { id }, data: req.body });
    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar banner', details: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.promoBanner.delete({ where: { id } });
    res.json({ message: 'Banner removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar banner', details: error.message });
  }
};