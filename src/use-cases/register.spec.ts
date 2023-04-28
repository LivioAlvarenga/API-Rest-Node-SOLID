import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let UsersRepository: InMemoryUsersRepository
let sut: RegisterUseCase // System under test(sut), the main variable of the test

describe('Register Use Case', () => {
  beforeEach(() => {
    // Create a fake repository
    UsersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(UsersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Password123!',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password after registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Password123!',
    })

    const isPasswordHashed = await compare('Password123!', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'test@email.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'Password123!',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: 'Password123!',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
