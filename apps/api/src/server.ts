import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { authRoutes } from './routes/auth'
import { ordersRoutes } from './routes/orders'
import { paymentsRoutes } from './routes/payments'

const app = Fastify({
  logger: true,
})

async function bootstrap() {
  // Configuração do CORS
  await app.register(cors, {
    origin: true,
  })

  // Configuração do JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
  })

  // Registrar as rotas da aplicação
  await app.register(authRoutes)
  await app.register(ordersRoutes)
  await app.register(paymentsRoutes)

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
