import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let UsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase // System under test(sut), the main variable of the test

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    // Create a fake repository
    UsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(UsersRepository)
  })

  it('should be able to authenticate', async () => {
    // Create a fake user
    await UsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // I am not creating a fake user here to test the wrong email
    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    // Create a fake user
    await UsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
    })

    // I am using the wrong password here
    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
