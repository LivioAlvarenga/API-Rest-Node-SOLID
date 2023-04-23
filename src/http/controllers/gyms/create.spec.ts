import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym-01 Title',
        description: 'Gym-01 Description',
        phone: 'Gym-01 Phone',
        latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
        longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
      })

    expect(response.statusCode).toEqual(201)
  })
})
