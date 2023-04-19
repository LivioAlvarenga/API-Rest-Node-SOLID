import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
<<<<<<< HEAD
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
=======
import { MaxNumberOfCheckInsError } from './errors/max-number-of-chec-ins-error'
>>>>>>> 458ca28569d8d63dbde623224e92af0849e49ef7

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase // System under test(sut), the main variable of the test

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    // Create a fake repository
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    // Create a fake gym (latitude and longitude example is Praça da Liberdade, Belo Horizonte)
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym-01 Title',
      description: '',
      phone: '',
      latitude: -19.9328401, // latitude of the Ouro Preto, Minas Gerais
      longitude: -43.9411575, // longitude of the Ouro Preto, Minas Gerais
    })

    // In tests is complicated to work with time, so we must use fake timers
    vi.useFakeTimers() // Use fake timers to mock the Date.now() function
  })

  afterEach(() => {
    vi.useRealTimers() // Reset the fake timers
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -19.9328401,
      userLongitude: -43.9411575,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 19, 8, 0, 0)) // Set the fake time, 3 is April because the months start in 0
    // Now all checks will be in the same day

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -19.9328401,
      userLongitude: -43.9411575,
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-id',
        userLatitude: -19.9328401,
        userLongitude: -43.9411575,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 19, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -19.9328401,
      userLongitude: -43.9411575,
    })

    vi.setSystemTime(new Date(2023, 3, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id',
      userLatitude: -19.9328401,
      userLongitude: -43.9411575,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in at gyms that are more than 100 meters away', async () => {
    // Gym-02 is distant > 100 meters from Praça da Liberdade
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Gym-02 Title',
      description: 'Gym-02 Description',
      phone: 'Gym-02 Phone',
      latitude: new Decimal(-20.3912427), // latitude of the Ouro Preto, Minas Gerais
      longitude: new Decimal(-43.540657), // longitude of the Ouro Preto, Minas Gerais
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-id',
        userLatitude: -19.9328401, // latitude of Praça da Liberdade
        userLongitude: -43.9411575, // longitude of Praça da Liberdade
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
