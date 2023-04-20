import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('setup') // execute before each test

    return {
      teardown() {
        console.log('teardown') // execute after each test
      },
    }
  },
}
