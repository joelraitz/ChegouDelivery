import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { authRoutes } from './routes/auth'
import { ordersRoutes } from './routes/orders'
import { paymentRoutes } from './routes/payments'

const app = Fastify({
  logger: true,
})

async function bootstrap() {
  await app.register(cors, {
    origin: true,
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
  })

  // Rota raiz para confirmação de status da API
  app.get('/', async () => {
    return { status: 'online', message: 'API ChegouDelivery rodando com sucesso! 🚀' }
  })

  await app.register(authRoutes)
  await app.register(ordersRoutes)
  await app.register(paymentRoutes)

  const port = Number(process.env.PORT) || 3333

  try {
    await app.listen({
      port,
      host: '0.0.0.0',
    })
    console.log(`🚀 Servidor rodando na porta ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()
