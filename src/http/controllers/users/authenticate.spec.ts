import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Authenticate', async () => {
    // Create a user
    await request(app.server).post('/users').send({
      name: 'Antônio Silva',
      email: 'antonio@gmail.com',
      password: 'Password123!',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'antonio@gmail.com',
      password: 'Password123!',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
