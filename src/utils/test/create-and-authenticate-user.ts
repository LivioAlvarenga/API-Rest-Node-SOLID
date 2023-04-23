import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  // Create a user
  await request(app.server).post('/users').send({
    name: 'Antônio Silva',
    email: 'antonio@gmail.com',
    password: '123456',
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
