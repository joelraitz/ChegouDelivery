import { FastifyInstance } from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import { WebSocket } from 'ws'

interface CreateOrderBody {
  type: 'SNACK' | 'GROCERY' | 'PARCEL'
  deliveryAddress: string
  totalAmount: number
}

interface UpdateStatusBody {
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'
  driverId?: string
}

export interface Order {
  id: string
  userId: string
  type: 'SNACK' | 'GROCERY' | 'PARCEL'
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  paymentMethod?: 'PIX' | 'CREDIT_CARD'
  deliveryAddress: string
  totalAmount: number
  driverId?: string
  createdAt: string
}

const orders: Order[] = []
const connectedClients = new Set<WebSocket>()

function broadcastOrderUpdate(event: string, data: any) {
  const payload = JSON.stringify({ event, data })
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload)
    }
  })
}

export async function ordersRoutes(fastify: FastifyInstance) {
  await fastify.register(fastifyWebsocket)

  // Utiliza 'any' no parâmetro para evitar incompatibilidades de versões de tipos do Fastify WebSocket
  fastify.get('/ws/orders', { websocket: true }, (connection: any) => {
    const socket: WebSocket = connection.socket || connection
    connectedClients.add(socket)

    socket.on('close', () => {
      connectedClients.delete(socket)
    })
  })

  // Criar Pedido
  fastify.post('/orders', async (request, reply) => {
    let userId = 'user_guest'

    try {
      const decoded = await request.jwtVerify<{ sub: string }>()
      userId = decoded.sub
    } catch (err) {}

    const { type, deliveryAddress, totalAmount } = request.body as CreateOrderBody

    if (!type || !deliveryAddress || !totalAmount) {
      return reply.status(400).send({ error: 'Dados incompletos para criação do pedido.' })
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      deliveryAddress,
      totalAmount,
      createdAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    broadcastOrderUpdate('ORDER_CREATED', newOrder)

    return reply.status(201).send({ order: newOrder })
  })

  // Confirmar Pagamento
  fastify.post('/orders/:id/pay', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { paymentMethod } = request.body as { paymentMethod: 'PIX' | 'CREDIT_CARD' }

    const order = orders.find((o) => o.id === id)

    if (!order) {
      return reply.status(404).send({ error: 'Pedido não encontrado.' })
    }

    order.paymentStatus = 'PAID'
    order.paymentMethod = paymentMethod

    broadcastOrderUpdate('ORDER_PAID', order)

    return reply.send({ message: 'Pagamento confirmado com sucesso!', order })
  })

  // Listar Pedidos
  fastify.get('/orders', async (request) => {
    let userId: string | null = null

    try {
      const decoded = await request.jwtVerify<{ sub: string }>()
      userId = decoded.sub
    } catch (err) {}

    if (userId) {
      return { orders: orders.filter((o) => o.userId === userId) }
    }

    return { orders }
  })

  // Atualizar Status do Pedido
  fastify.patch('/orders/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { status, driverId } = request.body as UpdateStatusBody

    const order = orders.find((o) => o.id === id)

    if (!order) {
      return reply.status(404).send({ error: 'Pedido não encontrado.' })
    }

    if (status === 'PREPARING' && order.paymentStatus !== 'PAID') {
      return reply.status(400).send({ error: 'Pedido aguardando confirmação de pagamento.' })
    }

    order.status = status
    if (driverId) order.driverId = driverId

    broadcastOrderUpdate('ORDER_STATUS_UPDATED', order)

    return reply.send({ order })
  })
}
