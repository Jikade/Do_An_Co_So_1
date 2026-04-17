<<<<<<< HEAD
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

=======
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
<<<<<<< HEAD
  turbopack: {
    root: rootDir,
  },
=======
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
}

export default nextConfig
