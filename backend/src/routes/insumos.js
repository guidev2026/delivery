import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Listar todos os insumos
router.get('/', async (req, res) => {
  try {
    const insumos = await prisma.insumo.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar insumo
router.post('/', async (req, res) => {
  try {
    const { nome, unidadeMedida, quantidadeEstoque } = req.body;
    const insumo = await prisma.insumo.create({
      data: { nome, unidadeMedida, quantidadeEstoque: quantidadeEstoque ?? 0 },
    });
    res.status(201).json(insumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar insumo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const insumo = await prisma.insumo.update({ where: { id: Number(id) }, data });
    res.json(insumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar insumo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.insumo.delete({ where: { id: Number(id) } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;