import { prisma } from "../utils/prismaClient.js";

export async function getLibraryList(startRow, pageSize) {
    
    const data = await prisma.sunday_school_resources.findMany({

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

export async function totalLibraryCount() {

    return await prisma.sunday_school_resources.count();
    
}

export async function getLibraryContent(id) {

    const data = await prisma.sunday_school_resources.findUnique({
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



