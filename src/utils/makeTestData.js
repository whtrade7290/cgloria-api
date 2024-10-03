import faker from 'faker'
import { prisma } from '../utils/prismaClient.js'

async function createTestData() {
  // User 모델에 대한 테스트 데이터 생성
  // for (let i = 0; i < 20; i++) {
  //   await prisma.user.create({
  //     data: {
  //       username: faker.internet.userName(),
  //       password: faker.internet.password(),
  //       role: 'USER'
  //     }
  //   });
  // }

  // 나머지 모델에 대한 테스트 데이터 생성
  // const models = ['columns', 'weekly_bible_verses', 'class_meeting', 'sunday_school_photo_gallery', 'sunday_school_resources', 'general_forum', 'photo_gallery', 'testimonies'];
  const models = ['testimonies']

  for (const model of models) {
    for (let i = 0; i < 20; i++) {
      await prisma[model].create({
        data: {
          title: faker.lorem.words(),
          writer: 'test1',
          content: faker.lorem.words(),
          create_at: new Date(),
          update_at: new Date()
        }
      })
    }
  }

  console.log('테스트 데이터 생성이 완료되었습니다.')
}

export default createTestData()
  .catch((error) => {
    console.error('테스트 데이터 생성 중 오류가 발생했습니다:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
