import { env } from '../env';
import { PrismaClient } from '../generated/prisma/client';
const connectionString = `${env.DATABASE_URL}`

export const prisma = new PrismaClient()