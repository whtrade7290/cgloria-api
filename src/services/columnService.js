import { prisma } from "../utils/prismaClient.js";

export async function getColumnList(startRow, pageSize) {
    
    const data = await prisma.columns.findMany({
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

export async function totalColumnCount() {

    return await prisma.columns.count({
    where: {
        deleted: false
    },
    });
    
}

export async function getColumnContent(id) {

    const data = await prisma.columns.findUnique({
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

export async function writeColumnContent({title, content, writer, filename, extension, fileDate }) {
    return await prisma.columns.create({
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

export async function logicalDeleteColumn(id) {
   return prisma.columns.update({
        where: {
            id: id
        },
        data: {
            deleted: true
        }
    })
    
}