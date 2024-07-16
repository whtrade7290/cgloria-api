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

export async function writeGeneralForumContent({title, content, writer, filename, extension, fileDate }) {
    return await prisma.general_forum.create({
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



