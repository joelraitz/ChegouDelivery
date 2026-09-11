import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';

const app = Fastify({
  logger: true,
});

async function main() {
  // Habilita o CORS para permitir requisições da Vercel
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Habilita suporte a WebSockets
  await app.register(websocket);

  // Rota de teste
  app.get('/', async () => {
    return {
      status: 'online',
      message: 'API ChegouDelivery rodando com sucesso! 🚀',
    };
  });

  // Exemplo de rota para cadastro
  app.post('/users', async (request, reply) => {
    const body = request.body;
    return reply.status(201).send({ message: 'Usuário cadastrado com sucesso', data: body });
  });

  // Rota WebSocket
  app.get('/ws', { websocket: true }, (connection) => {
    connection.socket.on('message', (message: string) => {
      connection.socket.send(`Mensagem recebida: ${message}`);
    });
  });

  // Inicialização do servidor
  try {
    const port = Number(process.env.PORT) || 3333;
    const host = '0.0.0.0'; // Necessário para o Render receber conexões externas

    await app.listen({ port, host });
    console.log(`Servidor rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();