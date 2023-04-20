import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
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
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'antonio@gmail.com',
      }),
    )
  })
})
