import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
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
}
