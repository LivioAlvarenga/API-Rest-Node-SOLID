import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let UsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase // System under test(sut), the main variable of the test

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    // Create a fake repository
    UsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(UsersRepository)
  })

  it('should be able to get user profile', async () => {
    // Create a fake user
    const createdUser = await UsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    // I am not creating a fake user here to test the wrong id
    expect(() =>
      sut.execute({
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
