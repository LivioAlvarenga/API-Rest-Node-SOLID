import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let GymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    // Create a fake repository
    GymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(GymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym-02 Title',
      description: 'Gym-02 Description',
      phone: 'Gym-02 Phone',
      latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
      longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
