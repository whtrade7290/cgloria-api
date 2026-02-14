import { prisma } from '../utils/prismaClient.js'

export async function signIn(username) {
  try {
    return await prisma.user.findUnique({
      where: { username: username, isApproved: true }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function signUp(username, hashedPassword, name, email, profileImagePath) {
  // 사용자 생성
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        ...(profileImagePath && { profile_image_url: profileImagePath })
      }
    })
    const obj = {
      id: parseInt(user.id),
      username: user.username,
      password: user.password,
      email: user.email,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
      name: user.name
    }

    return obj
  } catch (error) {
    console.error(error)
  }
}

export async function editPassword(username, hashedPassword, name, email) {
  try {
    const user = await prisma.user.update({
      where: {
        username
      },
      data: {
        name,
        email,
        password: hashedPassword,
        update_at: new Date()
      }
    })

    return {
      id: parseInt(user.id),
      username: user.username,
      email: user.email,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
      name: user.name
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function findUser(username) {
  try {
    return await prisma.user.findUnique({
      where: { username }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function findUserByName(keyword) {
  try {
    return await prisma.user.findFirst({
      where: {
        isApproved: true,
        OR: [{ username: keyword }, { name: keyword }]
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function findUserById(id) {
  if (id === undefined || id === null) {
    return null
  }

  try {
    const normalizedId =
      typeof id === 'bigint' ? id : typeof id === 'number' ? BigInt(id) : BigInt(String(id))

    return await prisma.user.findUnique({
      where: { id: normalizedId }
    })
  } catch (error) {
    console.error('findUserById error:', error)
    return null
  }
}

export async function findDisApproveUsers() {
  try {
    return await prisma.user.findMany({
      where: { isApproved: false }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function approveUser(id) {
  try {
    return await prisma.user.update({
      where: { id: id },
      data: {
        isApproved: true
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function revokeApproveStatus(id) {
  try {
    return await prisma.user.update({
      where: { id: id },
      data: {
        isApproved: false
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getApprovedUsers({ startRow = 0, pageSize = 10, searchWord = '' }) {
  const keyword = searchWord ?? ''

  try {
    const users = await prisma.user.findMany({
      where: {
        isApproved: true,
        OR: [{ username: { contains: keyword } }, { name: { contains: keyword } }]
      },
      orderBy: {
        id: 'desc'
      },
      skip: Number(startRow) || 0,
      take: Number(pageSize) || 10
    })

    return users.map((user) => ({
      ...user,
      id: Number(user.id)
    }))
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getApprovedUsersCount(searchWord = '') {
  const keyword = searchWord ?? ''

  try {
    return await prisma.user.count({
      where: {
        isApproved: true,
        OR: [{ username: { contains: keyword } }, { name: { contains: keyword } }]
      }
    })
  } catch (error) {
    console.error('getApprovedUsersCount error:', error)
    throw error
  }
}

export async function updateUserRole(id, role) {
  if (role === undefined || role === null) {
    throw new Error('role is required')
  }

  const normalizedRole =
    role === 0 || role === '0'
      ? 'ADMIN'
      : role === 1 || role === '1'
        ? 'USER'
        : typeof role === 'string'
          ? role.toUpperCase()
          : role

  try {
    const result = await prisma.user.update({
      where: { id },
      data: { role: normalizedRole, update_at: new Date() }
    })

    return {
      ...result,
      id: Number(result.id)
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateProfile({ id, name, email, password, profileImagePath }) {
  if (!id) {
    throw new Error('id is required')
  }

  const normalizedId =
    typeof id === 'bigint' ? id : typeof id === 'number' ? BigInt(id) : BigInt(String(id))

  const data = {
    update_at: new Date()
  }

  if (name !== undefined) {
    data.name = name
  }

  if (email !== undefined) {
    data.email = email
  }

  if (password) {
    data.password = password
  }
  if (profileImagePath !== undefined) {
    data.profile_image_url = profileImagePath
  }

  try {
    const updated = await prisma.user.update({
      where: { id: normalizedId },
      data
    })

    return {
      ...updated,
      id: Number(updated.id)
    }
  } catch (error) {
    console.error('updateProfile error:', error)
    throw error
  }
}
