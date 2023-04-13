import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0', // This is the default value for frontend apps
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 Server is running on port 3333!')
  })
