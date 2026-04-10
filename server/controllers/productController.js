import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { active: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao procurar produtos', details: error.message });
  }
};

export const createProduct = async (req, res) => {
  // 👇 A NOSSA ESCUTA DE DEBUG ESTÁ AQUI
  console.log("🔥 CHEGOU UM PEDIDO PARA CRIAR PRODUTO:", req.body.name);

  try {
    const data = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name: String(data.name || 'Produto Sem Nome'),
        description: String(data.description || ''),
        price: Number(data.price) || 0,
        category: String(data.category || 'burgers'),
        image: String(data.image || ''),
        popular: Boolean(data.popular),
        customizations: Array.isArray(data.customizations) ? data.customizations : [],
        active: true 
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("🚨 Erro interno no createProduct:", error);
    res.status(500).json({ error: 'Erro interno ao criar produto', details: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updateData = {};
    if (data.name !== undefined) updateData.name = String(data.name);
    if (data.description !== undefined) updateData.description = String(data.description);
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.category !== undefined) updateData.category = String(data.category);
    if (data.image !== undefined) updateData.image = String(data.image);
    if (data.popular !== undefined) updateData.popular = Boolean(data.popular);
    if (data.customizations !== undefined) updateData.customizations = Array.isArray(data.customizations) ? data.customizations : [];

    const updatedProduct = await prisma.product.update({ where: { id }, data: updateData });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar produto', details: error.message });
  }
};
