import { prisma } from '../utils/prismaClient.js'

export async function writeContent({ title, content, writer, writer_name, files, board }) {
  try {
    return await prismaProxy[board].create({
      data: {
        title: title,
        content: content,
        writer: writer,
        writer_name: writer_name,
        files: files
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getContentList(startRow, pageSize, searchWord, board) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    const data = await prismaProxy[board].findMany({
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
    console.error('Error fetching photo list from the database:', error)
    throw new Error('데이터를 가져오는 중 오류가 발생했습니다.')
  }
}

export async function getContentById(id, board) {
  try {
    const data = await prismaProxy[board].findUnique({
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

export function editContent({ id, title, content, files = [], board }) {
  try {
    if (files.length === 0) {
      return prismaProxy[board].update({
        where: {
          id: id
        },
        data: {
          title: title,
          content: content
        }
      })
    } else {
      return prismaProxy[board].update({
        where: {
          id: id
        },
        data: {
          title: title,
          content: content,
          files: JSON.stringify(files)
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export async function totalContentCount(searchWord, board) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    return await prismaProxy[board].count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function logicalDeleteContent(id, board) {
  try {
    return prismaProxy[board].update({
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

export async function totalPhotoCount(searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    return await prismaProxy.photo.count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

 const prismaProxy = new Proxy(prisma, {
  get(target, prop) {
    if (typeof prop === 'string') {
      const snake = toSnakeCase(prop)
      return target[snake]
    }
    return target[prop]
  }
})

 function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1') 
    .toLowerCase();             
}