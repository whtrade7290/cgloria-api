import { prisma } from "../utils/prismaClient.js";

export async function getWithDiaryList(startRow, pageSize, withDiary) {
    
    const data = await prisma.withDiary.findMany({
    where:{
       withDiaryNum: withDiary     
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

export async function totalWithDiaryCount(withDiary) {
    console.log("withDiary: ", withDiary);
    return await prisma.withDiary.count({
        where: {
            withDiaryNum: withDiary
        },
    });
    
}

export async function getWithDiaryContent(id) {

    const data = await prisma.withDiary.findUnique({
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

export async function writeWithDiaryContent({title, content, writer, filename, extension, fileDate, withDiaryNum }) {
    console.log("exrute2");
    return await prisma.withDiary.create({
        data: {
        title: title,
        content: content,
        writer: writer,
        filename: filename,
        extension: extension,
        fileDate: fileDate,
        withDiaryNum: withDiaryNum
    },
})

}



