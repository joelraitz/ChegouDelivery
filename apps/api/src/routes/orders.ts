import { FastifyInstance } from 'fastify';

interface CreateOrderBody {
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  deliveryAddress: string;
  totalAmount: number;
}

interface UpdateStatusBody {
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  driverId?: string;
}

export interface Order {
  id: string;
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod?: 'PIX' | 'CREDIT_CARD';
  deliveryAddress: string;
  totalAmount: number;
  driverId?: string;
  createdAt: string;
}

// Armazenamento em memória para demonstração
const orders: Order[] = [];

export async function ordersRoutes(fastify: FastifyInstance) {
  // Criar Pedido (Aguardando Pagamento)
  fastify.post('/orders', async (request, reply) => {
    const { type, deliveryAddress, totalAmount } = request.body as CreateOrderBody;

    if (!type || !deliveryAddress || !totalAmount) {
      return reply.status(400).send({ error: 'Dados incompletos para criação do pedido.' });
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      deliveryAddress,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return reply.status(201).send({ order: newOrder });
  });

  // Simular Processamento de Pagamento
  fastify.post('/orders/:id/pay', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { paymentMethod } = request.body as { paymentMethod: 'PIX' | 'CREDIT_CARD' };

    const order = orders.find((o) => o.id === id);

    if (!order) {
      return reply.status(404).send({ error: 'Pedido não encontrado.' });
    }

    order.paymentStatus = 'PAID';
    order.paymentMethod = paymentMethod;

    return reply.send({ message: 'Pagamento confirmado com sucesso!', order });
  });

  // Listar Pedidos
  fastify.get('/orders', async () => {
    return { orders };
  });

  // Atualizar Status do Pedido (Restaurante/Entregador)
  fastify.patch('/orders/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, driverId } = request.body as UpdateStatusBody;

    const order = orders.find((o) => o.id === id);

    if (!order) {
      return reply.status(404).send({ error: 'Pedido não encontrado.' });
    }

    // Regra: Restaurante só aceita pedido se estiver PAGO
    if (status === 'PREPARING' && order.paymentStatus !== 'PAID') {
      return reply.status(400).send({ error: 'Pedido aguardando confirmação de pagamento.' });
    }

    order.status = status;
    if (driverId) order.driverId = driverId;

    return reply.send({ order });
  });
}
