import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']], // name prisma must like the name after vitest-environment- folder. For example, if the folder name is vitest-environment-prisma, then the name must be prisma.
  },
})
