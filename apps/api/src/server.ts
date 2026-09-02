import Fastify from 'fastify';

const app = Fastify({ logger: true });

// Rota de checagem de saúde da API
app.get('/health', async () => {
  return { status: 'ok', service: 'ChegouDelivery API' };
});

// Exemplo de rota de listagem de pedidos
app.get('/orders', async () => {
  return {
    orders: [
      { id: '1', type: 'SNACK', totalAmount: 45.0, status: 'PENDING' },
      { id: '2', type: 'GROCERY', totalAmount: 120.50, status: 'DELIVERED' }
    ]
  };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();