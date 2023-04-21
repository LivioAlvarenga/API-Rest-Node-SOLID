import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { nearby } from './nearby'
import { search } from './search'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // all verify JWT

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
}
