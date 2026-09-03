import { FastifyInstance } from 'fastify';

export async function driverRoutes(app: FastifyInstance) {
  // Listar entregadores disponíveis próximos
  app.get('/drivers/available', async () => {
    return {
      drivers: [
        {
          id: 'drv_01',
          name: 'Carlos Silva',
          vehicle: 'MOTO',
          rating: 4.9,
          isOnline: true,
          currentLocation: { lat: -3.119027, lng: -60.021731 }
        },
        {
          id: 'drv_02',
          name: 'Roberto Souza',
          vehicle: 'CAR',
          rating: 4.8,
          isOnline: true,
          currentLocation: { lat: -3.125010, lng: -60.015400 }
        }
      ]
    };
  });
}