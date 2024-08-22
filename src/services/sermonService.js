import { prisma } from '../utils/prismaClient.js'

export async function getSermonList(startRow, pageSize) {
  const data = await prisma.sermons.findMany({
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

export async function totalSermonCount() {
  return await prisma.sermons.count({
    where: {
      deleted: false
    }
  })
}

export async function getSermonContent(id) {
  const data = await prisma.sermons.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeSermonContent({
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
      const createResult = await prisma.sermons.create({
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
      return await prisma.sermons.updateMany({
        data: {
          mainContent: !mainContent
        },
        where: {
          id: { not: createResult.id }
        }
      })
    })
  } else {
    return await prisma.sermons.create({
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

export async function editSermonContent({
  id,
  title,
  content,
  mainContent,
  extension,
  fileDate,
  filename
}) {
  let result = {}

  if (mainContent) {
    result = await prisma.$transaction(async (prisma) => {
      let updateResult

      if (extension !== '' && fileDate !== '' && filename !== '') {
        updateResult = await prisma.sermons.update({
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
        })
      } else {
        updateResult = await prisma.sermons.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date()
          }
        })
      }

      console.log('updateResult: ', updateResult)

      const updateManyResult = await prisma.sermons.updateMany({
        data: { mainContent: false },
        where: { id: { not: updateResult.id } }
      })

      return { updateResult, updateManyResult }
    })
  } else {
    if (extension !== '' && fileDate !== '' && filename !== '') {
      result = await prisma.sermons.update({
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
      })
    } else {
      result = await prisma.sermons.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date()
        }
      })
    }
  }

  return result
}

export async function getMainSermon() {
  const data = await prisma.sermons.findFirstOrThrow({
    where: {
      deleted: false,
      mainContent: true
    }
  })

  console.log('data: ', data)

  return {
    ...data,
    id: Number(data.id)
  }
}
