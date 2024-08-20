import { prisma } from '../utils/prismaClient.js'

export async function getColumnList(startRow, pageSize) {
  const data = await prisma.columns.findMany({
    where: {
      deleted: false
    },
    orderBy: {
      id: 'desc'
    },
    take: pageSize,
    skip: startRow
  })

  return data.map((item) => ({
    ...item,
    id: Number(item.id)
  }))
}

export async function totalColumnCount() {
  return await prisma.columns.count({
    where: {
      deleted: false
    }
  })
}

export async function getColumnContent(id) {
  const data = await prisma.columns.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeColumnContent({
  title,
  content,
  writer,
  mainContent,
  filename,
  extension,
  fileDate
}) {
  if (mainContent) {
    prisma.$transaction(async (prisma) => {
      const createResult = await prisma.columns.create({
        data: {
          title: title,
          content: content,
          writer: writer,
          mainContent: mainContent,
          filename: filename,
          extension: extension,
          fileDate: fileDate
        }
      })
      return await prisma.columns.updateMany({
        data: {
          mainContent: !mainContent
        },
        where: {
          id: { not: createResult.id }
        }
      })
    })
  } else {
  return await prisma.columns.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      mainContent: mainContent,
      filename: filename,
      extension: extension,
      fileDate: fileDate
    }
  })
}
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


export async function editColumnContent({
  id,
  title,
  content,
  mainContent,
  extension,
  fileDate,
  filename
}) {
  let result = {};

  if (mainContent) {
    result = await prisma.$transaction(async (prisma) => {
      let updateResult;

      if (extension !== '' && fileDate !== '' && filename !== '') {
        console.log("1");
        updateResult = await prisma.columns.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date(),
            extension,
            fileDate,
            filename
          }
        });
      } else {
        console.log("2");
        updateResult = await prisma.columns.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date()
          }
        });
      }

      const updateManyResult = await prisma.columns.updateMany({
        data: { mainContent: false },
        where: { id: { not: updateResult.id } }
      });

      return { updateResult, updateManyResult };
    });
  } else {
    if (extension !== '' && fileDate !== '' && filename !== '') {
      console.log("3");
      result = await prisma.columns.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date(),
          extension,
          fileDate,
          filename
        }
      });
    } else {
      console.log("4");
      result = await prisma.columns.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date()
        }
      });
    }
  }

  return result;
}

export async function getMainColumn() {
  const data = await prisma.columns.findFirstOrThrow({
    where: {
      deleted: false,
      mainContent: true
    }
  })

  return {
    ...data,
    id: Number(data.id)
  }
}
