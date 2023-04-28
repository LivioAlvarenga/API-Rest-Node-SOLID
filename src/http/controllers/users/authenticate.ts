import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { authenticateBodySchema } from '@/validators/validations'

import { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase() // <== Call the factory function

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // <== Refresh token expires in 7 days, if the user doesn't login in 7 days, he will be logged out
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // <== This cookie will be sent to all routes
        secure: true, // <== This cookie will only be sent in HTTPS
        sameSite: true, // <== This cookie will only be sent to the same domain
        httpOnly: true, // <== This cookie will not be accessible by JavaScript
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
