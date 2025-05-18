import { prisma } from '../utils/prismaClient.js'

export async function getTestimonyList(startRow, pageSize, searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }
  try {
    const data = await prisma.testimonies.findMany({
      where: {
        deleted: false,
        title: { contains: searchWord }
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
  } catch (error) {
    console.error(error)
  }
}

export async function totalTestimonyCount(searchWord) {
  try {
    return await prisma.testimonies.count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getTestimonyContent(id) {
  try {
    const data = await prisma.testimonies.findUnique({
      where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
    })

    return {
      ...data,
      id: Number(data.id)
    }
  } catch (error) {
    console.error(error)
  }
}

export async function writeTestimonyContent({
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
  try {
    if (mainContent) {
      prisma.$transaction(async (prisma) => {
        const createResult = await prisma.testimonies.create({
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
        return await prisma.testimonies.updateMany({
          data: {
            mainContent: !mainContent
          },
          where: {
            id: { not: createResult.id }
          }
        })
      })
    } else {
      return await prisma.testimonies.create({
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
  } catch (error) {
    console.error(error)
  }
}

export async function logicalDeleteTestimony(id) {
  try {
    return prisma.testimonies.update({
      where: {
        id: id
      },
      data: {
        deleted: true
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function editTestimonyContent({
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
  try {
    if (mainContent) {
      result = await prisma.$transaction(async (prisma) => {
        let updateResult

        if (uuid && filename && extension && fileType) {
          updateResult = await prisma.testimonies.update({
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
          updateResult = await prisma.testimonies.update({
            where: { id },
            data: {
              title,
              content,
              mainContent,
              update_at: new Date()
            }
          })
        }

        const updateManyResult = await prisma.testimonies.updateMany({
          data: { mainContent: false },
          where: { id: { not: updateResult.id } }
        })

        return { updateResult, updateManyResult }
      })
    } else {
      if (uuid && filename && extension && fileType) {
        result = await prisma.testimonies.update({
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
        result = await prisma.testimonies.update({
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
  } catch (error) {
    console.error(error)
  }
}

export async function getMainTestimony() {
  try {
    const data = await prisma.testimonies.findFirst({
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
    } else {
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
  } catch (error) {
    console.error(error)
  }
}
