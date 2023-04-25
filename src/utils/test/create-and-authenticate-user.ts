import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // Create a user
  await prisma.user.create({
    data: {
      name: 'Antônio Silva',
      email: 'antonio@gmail.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  // Authenticate the user
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'antonio@gmail.com',
    password: '123456',
  })

  // Get the user profile
  const { token } = authResponse.body

  return {
    token,
  }
}
