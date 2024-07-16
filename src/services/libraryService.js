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

export async function writeLibraryContent({title, content, writer, filename, extension, fileDate }) {
    return await prisma.sunday_school_resources.create({
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



