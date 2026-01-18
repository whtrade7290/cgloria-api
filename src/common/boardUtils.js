import { prisma } from '../utils/prismaClient.js'
import { fetchProfileImageUrlByWriter } from '../utils/profileImage.js'

export async function writeContent({
  title,
  content,
  writer,
  writer_name,
  files,
  board,
  mainContent
}) {

  mainContent = mainContent === 'true'

  const hasMainContent = ['sermon', 'column', 'weekly_bible_verse', 'class_meeting', 'testimony'].includes(board);


  try {
    return await prisma.$transaction(async (tx) => {
      // mainContent가 true라면 기존 것을 모두 false로
      if (hasMainContent && mainContent === true) {
        await tx[board].updateMany({
          where: { mainContent: true },
          data: { mainContent: false }
        });
      }

      let data = {
          title,
          content,
          writer,
          writer_name,
          files,
      }

      if (hasMainContent) {
        data.mainContent = mainContent;
      }

      // 새로운 레코드 생성
      const created = await tx[board].create({
        data: data
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

    if (!data) return null

    const writerProfileImageUrl = await fetchProfileImageUrlByWriter(data.writer)

    return {
      ...data,
      id: Number(data.id),
      writerProfileImageUrl
    }
  } catch (error) {
    console.error(error)
  }
}

export async function editContent({ id, title, content, files, board, mainContent }) {

  mainContent = mainContent === 'true'

  const hasMainContent = ['sermon', 'column', 'weekly_bible_verse', 'class_meeting', 'testimony'].includes(board);

  try {
    // mainContent가 true라면 다른 모든 레코드를 false로 변경
    if (hasMainContent && mainContent === true) {
      await prisma[board].updateMany({
        where: { mainContent: true },
        data: { mainContent: false }
      });
    }

    // 수정 데이터 공통 부분
    const updateData = {
      title,
      content,
      ...(hasMainContent && mainContent !== undefined && { mainContent })  // 있으면만 적용
    };

    if (files !== undefined) {
      updateData.files = JSON.stringify(files)
    }

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
