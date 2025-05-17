import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'] // 실행되는 쿼리를 로그로 출력
})

export { prisma }
