import { prisma } from '../utils/prismaClient.js'

export const DEFAULT_SCHEDULE_COLOR = '#0F2854'

export async function createSchedule(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('유효한 스케줄 데이터가 필요합니다.')
  }

  try {
    const created = await prisma.schedule.create({
      data
    })

    return created
  } catch (error) {
    console.error('스케줄 생성 실패:', error)
    throw error
  }
}

export async function createSchedules(records = []) {
  if (!Array.isArray(records) || records.length === 0) {
    return 0
  }

  try {
    const result = await prisma.schedule.createMany({
      data: records
    })

    return result?.count ?? records.length
  } catch (error) {
    console.error('스케줄 저장 실패:', error)
    throw error
  }
}

export async function logScheduleUpload({
  filename,
  uploader,
  successCount = 0,
  failCount = 0,
  errors = []
}) {
  try {
    await prisma.schedule_upload_log.create({
      data: {
        filename: filename ?? '',
        uploader: uploader ?? '',
        successCount,
        failCount,
        errors: errors.length > 0 ? JSON.stringify(errors) : null
      }
    })
  } catch (error) {
    console.error('스케줄 업로드 이력 저장 실패:', error)
  }
}

export async function getSchedulesBetween(start, end) {
  if (!start || !end) {
    throw new Error('날짜 범위가 필요합니다.')
  }

  try {
    return await prisma.schedule.findMany({
      where: {
        deleted: false,
        start: {
          lte: end
        },
        end: {
          gte: start
        }
      },
      select: {
        id: true,
        title: true,
        start: true,
        end: true,
        color: true
      },
      orderBy: {
        start: 'asc'
      }
    })
  } catch (error) {
    console.error('스케줄 조회 실패:', error)
    throw error
  }
}
