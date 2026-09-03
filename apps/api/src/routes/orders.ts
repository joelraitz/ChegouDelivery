import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function orderRoutes(app: FastifyInstance) {
  // Criar pedido no Banco de Dados
  app.post('/orders', async (request, reply) => {
    const createOrderSchema = z.object({
      userId: z.string(),
      type: z.enum(['SNACK', 'GROCERY', 'PARCEL']),
      totalAmount: z.number().positive(),
      deliveryAddress: z.string(),
    });

    const body = createOrderSchema.parse(request.body);

    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        type: body.type,
        totalAmount: body.totalAmount,
        deliveryAddress: body.deliveryAddress,
      },
    });

    return reply.status(201).send({ message: 'Pedido criado!', order });
  });

  // Listar pedidos do Banco de Dados
  app.get('/orders', async () => {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        driver: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { orders };
  });
}
