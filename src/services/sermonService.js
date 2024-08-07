import { prisma } from "../utils/prismaClient.js";

export async function getSermonList(startRow, pageSize) {
    
    const data = await prisma.sermons.findMany({
    where: {
        deleted: false
    },
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

    return await prisma.sermons.count({
    where: {
        deleted: false
    },
    });
    
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
        filename: data.filename,
        extension: data.extension,
        fileDate: data.fileDate,
        create_at: data.create_at,
        update_at: data.update_at,
        deleted: data.deleted
    }
}

export async function writeSermonContent({title, content, writer, filename, extension, fileDate }) {
    return await prisma.sermons.create({
        data: {
        title: title,
        content: content,
        writer: writer,
        filename: filename,
        extension: extension,
        fileDate: fileDate
    },
})
}

export async function logicalDeleteSermon(id) {
   return prisma.sermons.update({
        where: {
            id: id
        },
        data: {
            deleted: true
        }
    })
    
}



