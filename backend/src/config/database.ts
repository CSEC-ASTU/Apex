import { env } from '../env';
import { PrismaClient } from '../../generated/prisma';
const connectionString = `${env.DATABASE_URL}`

export const prisma = new PrismaClient()