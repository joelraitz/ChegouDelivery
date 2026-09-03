import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function orderRoutes(app: FastifyInstance) {
  // Criar um novo pedido (Lanche, Rancho ou Encomenda)
  app.post('/orders', async (request, reply) => {
    const createOrderSchema = z.object({
      userId: z.string(),
      type: z.enum(['SNACK', 'GROCERY', 'PARCEL']),
      totalAmount: z.number().positive(),
      deliveryAddress: z.string(),
      paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD'])
    });

    const body = createOrderSchema.parse(request.body);

    const newOrder = {
      id: `ord_${Date.now()}`,
      ...body,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    return reply.status(201).send({
      message: 'Pedido criado com sucesso!',
      order: newOrder
    });
  });

  // Listar pedidos ativos
  app.get('/orders', async () => {
    return {
      orders: [
        {
          id: 'ord_1001',
          type: 'SNACK',
          totalAmount: 45.0,
          status: 'PREPARING',
          deliveryAddress: 'Rua das Flores, 123'
        },
        {
          id: 'ord_1002',
          type: 'GROCERY',
          totalAmount: 180.5,
          status: 'DELIVERING',
          deliveryAddress: 'Av. Brasil, 456'
        }
      ]
    };
  });
}