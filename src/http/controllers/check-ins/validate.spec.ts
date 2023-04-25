import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validade Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validade a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    // Find a first user in the database
    const user = await prisma.user.findFirstOrThrow()

    // Create a gym
    const gym = await prisma.gym.create({
      data: {
        title: 'Gym-01 Title',
        description: 'Gym-01 Description',
        phone: 'Gym-01 Phone',
        latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
        longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
      },
    })

    // Create a check-in
    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    // Find the check-in again
    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
