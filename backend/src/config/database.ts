import { env } from '../env';
import { PrismaClient } from '../generated/prisma';
const connectionString = `${env.DATABASE_URL}`

export const prisma = new PrismaClient()

// import { PrismaClient } from '@prisma/client'

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined
// }

// export const prisma = globalThis.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = prisma
// }

// export async function connectDatabase(): Promise<void> {
//   try {
//     await prisma.$connect()
//     console.log('✅ Database connected successfully')
//   } catch (error) {
//     console.error('❌ Database connection failed:', error)
//     process.exit(1)
//   }
// }

// export async function disconnectDatabase(): Promise<void> {
//   await prisma.$disconnect()
//   console.log('Database disconnected')
// }
