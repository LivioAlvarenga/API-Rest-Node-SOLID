import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: 'Ouro Preto Gym',
        phone: 'Far Gym Phone',
        latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
        longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: 'Praça da Liberdade Gym',
        phone: 'Near Gym Phone',
        latitude: -19.9328401, // latitude of Praça da Liberdade
        longitude: -43.9411575, // longitude of Praça da Liberdade
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -19.9328401, // latitude of Praça da Liberdade
        longitude: -43.9411575, // longitude of Praça da Liberdade
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
