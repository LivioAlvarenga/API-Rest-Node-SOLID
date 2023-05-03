import fs from 'node:fs'
import path from 'node:path'

function deleteSpecFiles(dirPath: string): void {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.lstatSync(filePath)

    if (stat.isDirectory()) {
      deleteSpecFiles(filePath)
    } else if (filePath.endsWith('.spec.js')) {
      fs.unlinkSync(filePath)
    }
  }
}

// Verify if the script is running in production mode or not
const isProduction = process.env.NODE_ENV === 'production'
const buildPath = isProduction
  ? process.cwd()
  : path.join(process.cwd(), 'build')
deleteSpecFiles(buildPath)
