import { prisma } from "../utils/prismaClient.js";

export async function getTestimonyList(startRow, pageSize) {
    
    const data = await prisma.testimonies.findMany({

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

export async function totalTestimonyCount() {

    return await prisma.testimonies.count();
    
}

export async function getTestimonyContent(id) {

    const data = await prisma.testimonies.findUnique({
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

export async function writeTestimonyContent({title, content, writer, filename, extension, fileDate }) {
    return await prisma.testimonies.create({
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



