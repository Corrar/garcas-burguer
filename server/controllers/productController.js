// Ficheiro: server/controllers/productController.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Inteligência para BUSCAR produtos
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { active: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao procurar produtos' });
  }
};

// Inteligência para CRIAR produto
export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const newProduct = await prisma.product.create({
      data: { ...data, active: true }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao criar produto' });
  }
};

// Inteligência para ATUALIZAR produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: data
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// Inteligência para APAGAR produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: id } });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar produto' });
  }
};