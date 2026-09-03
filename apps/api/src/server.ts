import Fastify from 'fastify';
import { orderRoutes } from './routes/orders';
import { driverRoutes } from './routes/drivers';
import { paymentRoutes } from './routes/payments';

const app = Fastify({ logger: true });

// Registro das rotas
app.register(orderRoutes);
app.register(driverRoutes);
app.register(paymentRoutes);

// Checagem de saúde
app.get('/health', async () => {
  return { status: 'ok', service: 'ChegouDelivery API' };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Servidor ChegouDelivery API rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();