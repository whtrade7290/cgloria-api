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

export async function writeTestimonyContent({ title, content, writer, writer_name, uuid, filename, extension, fileType }) {
  try {
    return await prisma.testimonies.create({
      data: {
        title,
        content,
        writer,
        writer_name,
        uuid,
        filename,
        extension,
        fileType
      }
    })
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

export async function editTestimonyContent({ id, title, content, uuid, filename, extension, fileType }) {
  try {
    const data = {
      title,
      content,
      update_at: new Date()
    }

    if (uuid && filename && extension && fileType) {
      Object.assign(data, { uuid, filename, extension, fileType })
    }

    return await prisma.testimonies.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getMainTestimony() {
  try {
    const data = await prisma.testimonies.findFirst({
      where: {
        deleted: false
      },
      orderBy: {
        id: 'desc'
      }
    })

    if (!data) {
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
        writer_name: null
      }
    }

    return {
      ...data,
      id: Number(data.id)
    }
  } catch (error) {
    console.error(error)
  }
}
