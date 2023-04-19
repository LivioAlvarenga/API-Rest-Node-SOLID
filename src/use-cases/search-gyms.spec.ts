import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    // Create a fake repository
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      description: 'description-01',
      phone: 'phone-01',
      latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
      longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
    })

    await gymsRepository.create({
      title: 'gym-02',
      description: 'description-02',
      phone: 'phone-02',
      latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
      longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
    })

    const { gyms } = await sut.execute({
      query: '-01',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-01' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-${i}`,
        description: 'description',
        phone: 'phone',
        latitude: -20.3912427, // latitude of the Ouro Preto, Minas Gerais
        longitude: -43.540657, // longitude of the Ouro Preto, Minas Gerais
      })
    }

    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
    ])
  })
})
