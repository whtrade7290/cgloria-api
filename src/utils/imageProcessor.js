import path from 'path'
import { promises as fs } from 'fs'
import sharp from 'sharp'
import heicConvert from 'heic-convert'

const LONG_EDGE_LIMIT = 1920
const JPEG_QUALITY = 75

const HEIF_MIME_TYPES = new Set([
  'image/heif',
  'image/heic',
  'image/heif-sequence',
  'image/heic-sequence'
])

const HEIF_EXTENSIONS = new Set(['.heif', '.heic'])

const normalizeExt = (filename = '') => path.extname(filename).toLowerCase()

const isHeifFile = (file) => {
  if (!file) return false
  const mime = file.mimetype?.toLowerCase()
  if (mime && HEIF_MIME_TYPES.has(mime)) return true
  const ext = normalizeExt(file.originalname || file.filename)
  return HEIF_EXTENSIONS.has(ext)
}

const resizeAndCompress = (input) => {
  return sharp(input).rotate().resize({
    width: LONG_EDGE_LIMIT,
    height: LONG_EDGE_LIMIT,
    fit: 'inside',
    withoutEnlargement: true
  })
}

const updateFileReference = async ({ file, outputPath, outputFilename, mimetype, originalname }) => {
  const stats = await fs.stat(outputPath)
  file.path = outputPath
  file.filename = outputFilename
  file.size = stats.size
  file.mimetype = mimetype
  if (originalname) {
    file.originalname = originalname
  }
}

const cleanupPartialFile = async (filePath) => {
  try {
    await fs.unlink(filePath)
  } catch {
    // ignore
  }
}

const convertHeifToJpeg = async (file) => {
  const baseDir = file.destination || path.dirname(file.path)
  const originalPath = file.path
  const parsedName = path.parse(file.filename)
  const outputFilename = `${parsedName.name}.jpg`
  const outputPath = path.join(baseDir, outputFilename)

  const buildOriginalName = () =>
    file.originalname ? `${path.parse(file.originalname).name}.jpg` : outputFilename

  const finalize = async () => {
    await updateFileReference({
      file,
      outputPath,
      outputFilename,
      mimetype: 'image/jpeg',
      originalname: buildOriginalName()
    })
    await fs.unlink(originalPath)
    console.info(`HEIF 변환 완료: ${file.filename}`)
  }

  try {
    await resizeAndCompress(file.path).jpeg({ quality: JPEG_QUALITY }).toFile(outputPath)
    await finalize()
    return true
  } catch (error) {
    console.warn('sharp에서 HEIF 처리 실패, heic-convert로 재시도합니다.', error.message)
    await cleanupPartialFile(outputPath)
  }

  try {
    const inputBuffer = await fs.readFile(file.path)
    const jpegBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    })

    await resizeAndCompress(jpegBuffer).jpeg({ quality: JPEG_QUALITY }).toFile(outputPath)
    await finalize()
    return true
  } catch (fallbackError) {
    console.error('heic-convert 변환까지 실패했습니다. 원본을 유지합니다.', fallbackError)
    await cleanupPartialFile(outputPath)
    return false
  }
}

const gatherUploadedFiles = (req) => {
  if (!req) return []
  if (req.file) return [req.file]
  if (Array.isArray(req.files)) {
    return req.files
  }
  if (req.files && typeof req.files === 'object') {
    return Object.values(req.files).flat()
  }
  return []
}

export const processUploadedImages = async (req) => {
  const files = gatherUploadedFiles(req)
  if (!files.length) return

  await Promise.all(
    files.map(async (file) => {
      if (!isHeifFile(file)) {
        return
      }

      console.info(`HEIF 감지: ${file.originalname ?? file.filename}, JPEG 변환을 시도합니다.`)
      await convertHeifToJpeg(file)
    })
  )
}
