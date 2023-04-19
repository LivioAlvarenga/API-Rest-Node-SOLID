import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    // Create a fake repository
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Ouro Preto Gym',
      phone: 'phone-01',
      latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
      longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
    })

    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Praça da Liberdade Gym',
      phone: 'phone-02',
      latitude: -19.9328401, // latitude of Praça da Liberdade
      longitude: -43.9411575, // longitude of Praça da Liberdade
    })

    const { gyms } = await sut.execute({
      userLatitude: -19.9328401, // latitude of Praça da Liberdade
      userLongitude: -43.9411575, // longitude of Praça da Liberdade
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
