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

export async function signUp(username, hashedPassword, name, email) {
  // 사용자 생성
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email
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

export async function findDisApproveUsers() {
  try {
    return await prisma.user.findMany({
      where: { isApproved: false }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateApproveStatus(id) {
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
