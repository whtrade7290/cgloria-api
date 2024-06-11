import { prisma } from "../utils/prismaClient.js";

export async function getSermonList(username, password) {
    
    return await prisma.sermon.findMany();

}