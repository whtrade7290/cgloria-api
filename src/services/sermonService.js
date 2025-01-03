import { prisma } from '../utils/prismaClient.js'

export async function getSermonList(startRow, pageSize, searchWord) {

  if (searchWord === undefined) {
    searchWord = ''
  }
    
  const data = await prisma.sermons.findMany({
    where: {
      deleted: false,
      title: {contains: searchWord}
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

export async function totalSermonCount(searchWord) {

  if (searchWord === undefined) {
    searchWord = ''
  }

  return await prisma.sermons.count({
    where: {
      deleted: false,
      title: {contains: searchWord}
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
  writer_name,
  mainContent,
  uuid,
  filename,
  extension,
  fileType
}) {
  if (mainContent) {
    // Return the transaction result
    return await prisma.$transaction(async (prisma) => {
      const createResult = await prisma.sermons.create({
        data: {
          title,
          content,
          writer,
          writer_name,
          mainContent,
          uuid,
          filename,
          extension,
          fileType
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
        title,
        content,
        writer,
        writer_name,
        mainContent,
        uuid,
        filename,
        extension,
        fileType
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
  uuid,
  filename,
  extension,
  fileType
}) {
  let result = {}

  if (mainContent) {
    result = await prisma.$transaction(async (prisma) => {
      let updateResult
      if (uuid && filename && extension && fileType) {
        updateResult = await prisma.sermons.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date(),
            uuid,
            filename,
            extension,
            fileType
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

      const updateManyResult = await prisma.sermons.updateMany({
        data: { mainContent: false },
        where: { id: { not: updateResult.id } }
      })

      return { updateResult, updateManyResult }
    })
  } else {
    if (uuid && filename && extension && fileType) {
      result = await prisma.sermons.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date(),
          uuid,
          filename,
          extension,
          fileType
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
  const data = await prisma.sermons.findFirst({
    where: {
      deleted: false,
      mainContent: true
    }
  })

  if (data) {
    return {
    ...data,
    id: Number(data.id)
  }
  }else {
    return {
      id: 999999,
      title: '',
      writer: '',
      create_at: new Date(),
      update_at: new Date(),
      deleted: false,
      extension: null,
      uuid: null,
      filename: null,
      fileType: null,
      content: '',
      mainContent: true,
      writer_name: null
    }
  }

  
}
