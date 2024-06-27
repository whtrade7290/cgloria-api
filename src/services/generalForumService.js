import { prisma } from "../utils/prismaClient.js";

export async function getGeneralForumList(startRow, pageSize) {
    
    const data = await prisma.general_forum.findMany({

    orderBy: {
        id: 'desc',
    },
    take: pageSize,
    skip: startRow,
        
    });

    return data.map( item => ({
    ...item,
    id: Number(item.id)
    }))
}

export async function totalGeneralForumCount() {

    return await prisma.general_forum.count();
    
}

export async function getGeneralForumContent(id) {

    const data = await prisma.general_forum.findUnique({
      where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
    });

    return {
        id: Number(data.id),
        title: data.title,
        writer: data.writer,
        create_at: data.create_at,
        update_at: data.update_at,
        deleted: data.deleted
    }
}



