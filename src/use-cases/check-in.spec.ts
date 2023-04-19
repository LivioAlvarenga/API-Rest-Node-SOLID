import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase // System under test(sut), the main variable of the test

describe('Check-in Use Case', () => {
  beforeEach(() => {
    // Create a fake repository
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    // In tests is complicated to work with time, so we must use fake timers
    vi.useFakeTimers() // Use fake timers to mock the Date.now() function
  })

  afterEach(() => {
    vi.useRealTimers() // Reset the fake timers
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 19, 8, 0, 0)) // Set the fake time, 3 is April because the months start in 0
    // Now all checks will be in the same day

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 19, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    vi.setSystemTime(new Date(2023, 3, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
