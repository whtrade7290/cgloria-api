import { prisma } from './prismaClient.js'

const PROFILE_UPLOAD_PREFIX = '/uploads/'

export const normalizeProfileImagePath = (value) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const normalized = value.replace(/^\/?uploads\//i, '').replace(/\\+/g, '/')
  return `${PROFILE_UPLOAD_PREFIX}${normalized}`
}

export const fetchProfileImageUrlByWriter = async (writer) => {
  const username = typeof writer === 'string' ? writer.trim() : String(writer ?? '').trim()
  if (!username) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { profile_image_url: true }
    })

    return normalizeProfileImagePath(user?.profile_image_url)
  } catch (error) {
    console.error('작성자 프로필 조회 실패:', error)
    return null
  }
}
