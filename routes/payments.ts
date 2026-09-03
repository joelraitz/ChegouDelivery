import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function paymentRoutes(app: FastifyInstance) {
  // Gerar cobrança Pix vinculada aos dados da conta
  app.post('/payments/pix/generate', async (request, reply) => {
    const pixSchema = z.object({
      orderId: z.string(),
      amount: z.number().positive()
    });

    const { orderId, amount } = pixSchema.parse(request.body);

    const pixKey = process.env.PIX_KEY || '23139359000140';
    const bankName = process.env.BANK_NAME || 'Nu Pagamentos S.A.';

    // Exemplo de código BR Code / Pix Copia e Cola
    const pixPayload = `00020126580014br.gov.bcb.pix0114${pixKey}520400005303986540${amount.toFixed(2)}5802BR5915CHEGOUDELIVERY6006MANAUS62070503***6304`;

    return reply.send({
      success: true,
      orderId,
      amount,
      recipient: {
        bank: bankName,
        pixKey: pixKey,
        keyType: 'CNPJ'
      },
      pixCopiaECola: pixPayload,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixPayload)}`
    });
  });
}