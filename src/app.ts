import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import 'dotenv/config'
import fastify from 'fastify'
import path from 'node:path'
import { ZodError } from 'zod'
import { env } from './env'

import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

// After building with tsup, the openapi.json copy to the build folder
let pathOpenApi = path.join(__dirname, 'docs', 'openapi.json')
if (process.env.NODE_ENV === 'production') {
  pathOpenApi = path.join(__dirname, 'openapi.json')
}

app.register(swagger, {
  mode: 'static',
  specification: {
    path: pathOpenApi,
    baseDir: path.join(__dirname, 'docs'),
  },
})
app.register(swaggerUi, {
  baseDir: path.join(__dirname, 'docs'),
  routePrefix: '/docs',
  staticCSP: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false, // <== This cookie will not be signed, because we will not read it in the backend
  },
  sign: {
    expiresIn: '10m', // <== Token expires in 10 minutes
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE') {
    return reply
      .status(401)
      .send({ message: 'Invalid JWT token.', code: error.code })
  }

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    //! TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
