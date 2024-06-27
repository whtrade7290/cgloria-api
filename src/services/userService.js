import { prisma } from "../utils/prismaClient.js";

export async function signIn(username, password) {
    
    return await prisma.user.findUnique({
      where: { username },    });

}

export async function signUp(username, hashedPassword) {

  // 사용자 생성
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const obj = {
      id: parseInt(user.id), 
      username: user.username,
      password: user.password,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
    }

    return obj;
  
}
