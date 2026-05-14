import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import insumosRouter from './routes/insumos.js';
import pratosRouter from './routes/pratos.js';
import vendasRouter from './routes/vendas.js';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  // Adicione a URL da sua Vercel e o localhost para testes
  origin: [
    'https://seu-projeto.vercel.app', 
    'http://localhost:5173', // Porta padrão do Vite
    'http://localhost:3000'  // Porta padrão do React/Next
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

app.use('/insumos', insumosRouter);
app.use('/pratos', pratosRouter);
app.use('/vendas', vendasRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});