import { prisma } from "../utils/prismaClient.js";

export async function login(username, password) {
    
    return await prisma.user.findUnique({
      where: { username },    });

}
