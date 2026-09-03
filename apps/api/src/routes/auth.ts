import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  // Cadastro de Usuário
  app.post('/register', async (request, reply) => {
    const registerSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string(),
      role: z.enum(['CLIENT', 'DRIVER', 'RESTAURANT']),
    });

    const { name, email, password, phone } = registerSchema.parse(request.body);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return reply.status(400).send({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
      },
    });

    return reply.status(201).send({ message: 'Usuário criado com sucesso!', userId: user.id });
  });

  // Login
  app.post('/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(400).send({ message: 'Credenciais inválidas.' });
    }

    const token = app.jwt.sign(
      { name: user.name, email: user.email },
      { sub: user.id, expiresIn: '7d' }
    );

    return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
}
