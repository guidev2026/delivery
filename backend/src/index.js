import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import insumosRouter from './routes/insumos.js';
import pratosRouter from './routes/pratos.js';
import vendasRouter from './routes/vendas.js';

export const prisma = new PrismaClient();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/insumos', insumosRouter);
app.use('/pratos', pratosRouter);
app.use('/vendas', vendasRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});