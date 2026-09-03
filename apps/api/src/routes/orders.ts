import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function orderRoutes(app: FastifyInstance) {
  // Criar pedido
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

  // Listar pedidos
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

  // Atualizar Status do Pedido / Aceitar Entrega
  app.patch('/orders/:id/status', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const bodySchema = z.object({
      status: z.enum(['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED']),
      driverId: z.string().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status, driverId } = bodySchema.parse(request.body);

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(driverId && { driverId }),
      },
    });

    return reply.send({ message: 'Status atualizado com sucesso!', order });
  });
}
