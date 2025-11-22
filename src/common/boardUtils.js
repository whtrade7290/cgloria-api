import { prisma } from '../utils/prismaClient.js'

export async function writeContent({
  title,
  content,
  writer,
  writer_name,
  files,
  board,
  mainContent
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // mainContent가 true라면 기존 것을 모두 false로
      if (mainContent === 'true') {
        await tx[board].updateMany({
          where: { mainContent: true },
          data: { mainContent: false }
        });
      }

      // 새로운 레코드 생성
      const created = await tx[board].create({
        data: {
          title,
          content,
          writer,
          writer_name,
          files,
          mainContent: mainContent === 'true'
        }
      });

      return created;
    });
  } catch (error) {
    console.error("writeContent error:", error);
    throw error;
  }
}



export async function getContentList(startRow, pageSize, searchWord, board) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    const data = await prisma[board].findMany({
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
    const data = await prisma[board].findUnique({
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

export async function editContent({ id, title, content, files = [], board, mainContent }) {

  mainContent = mainContent === 'true'

  try {
    // mainContent가 true라면 다른 모든 레코드를 false로 변경
    if (mainContent === true) {
      await prisma[board].updateMany({
        where: { mainContent: true },
        data: { mainContent: false }
      });
    }

    // 수정 데이터 공통 부분
    const updateData = {
      title,
      content,
      ...(mainContent !== undefined && { mainContent }),  // 있으면만 적용
      ...(files.length > 0 && { files: JSON.stringify(files) })
    };

    // 수정 쿼리 실행
    return await prisma[board].update({
      where: { id },
      data: updateData
    });

  } catch (error) {
    console.error("editContent error:", error);
    throw error;
  }
}

export async function totalContentCount(searchWord, board) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    return await prisma[board].count({
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
    return prisma[board].update({
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
    return await prisma.photo.count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getMainContent(board) {
  try {
    const data = await prisma[board].findFirst({
      where: { mainContent: true }
    });

    if (!data) return null;

    return {
      ...data,
      id: Number(data.id)
    }
  } catch (error) {
    console.error(error);
  }
}
