import { prisma } from '../utils/prismaClient.js'

export async function signIn(username) {
  return await prisma.user.findUnique({
    where: { username: username, isApproved: true }
  })
}

export async function signUp(username, hashedPassword, name) {
  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name
    }
  })
  const obj = {
    id: parseInt(user.id),
    username: user.username,
    password: user.password,
    create_at: user.create_at,
    update_at: user.update_at,
    role: user.role,
    deleted: user.deleted,
    name: user.name
  }

  return obj
}

export async function findUser(username) {
  return await prisma.user.findUnique({
    where: { username }
  })
}

export async function findDisApproveUsers(){
  return await prisma.user.findMany({
    where: { isApproved: false }
  })
}

export async function updateApproveStatus(id){
  return await prisma.user.update({
    where: { id: id },
    data: {
      isApproved: true
    }
  })
}
