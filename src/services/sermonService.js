import { prisma } from "../utils/prismaClient.js";

export async function getSermonList(startRow, pageSize) {
    
    const data = await prisma.sermons.findMany({

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

export async function totalSermonCount() {

    return await prisma.sermons.count();
    
}

export async function getSermonContent(id) {

    const data = await prisma.sermons.findUnique({
      where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
    });

    return {
        id: Number(data.id),
        title: data.title,
        content: data.content,
        writer: data.writer,
        create_at: data.create_at,
        update_at: data.update_at,
        deleted: data.deleted
    }
}

export async function writeSermonContent(title, content, writer) {
    return await prisma.sermons.create({
        data: {
        title: title,
        content: content,
        writer: writer,
    },
})

}



