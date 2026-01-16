import { deleteFile } from './multer.js'
import { getContentById } from '../common/boardUtils.js'

const normalizeUploadedFiles = (files = []) => {
  if (!Array.isArray(files) || files.length === 0) {
    return []
  }

  return files.map((file) => {
    if (file?.originalname) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    }
    return file
  })
}

const parseDeleteKeys = (jsonDeleteKeys) => {
  if (!jsonDeleteKeys) return []

  if (Array.isArray(jsonDeleteKeys)) {
    return jsonDeleteKeys
  }

  try {
    return JSON.parse(jsonDeleteKeys) ?? []
  } catch (error) {
    console.error('삭제 파일 파싱 실패:', error)
    return []
  }
}

const normalizeDeleteKeyFilenames = (deleteKeys) => {
  if (!Array.isArray(deleteKeys) || deleteKeys.length === 0) {
    return []
  }

  return deleteKeys
    .map((file) => {
      if (typeof file === 'string') {
        return file.replace(/^uploads\//, '')
      }
      if (file && typeof file === 'object') {
        return file.filename ?? ''
      }
      return ''
    })
    .filter((filename) => filename)
}

const removePhysicalFiles = (normalizedDeleteKeys) => {
  normalizedDeleteKeys.forEach((filename) => {
    deleteFile(`uploads/${filename}`)
  })
}

const parseStoredFiles = (storedFiles) => {
  if (!storedFiles) {
    return []
  }

  if (Array.isArray(storedFiles)) {
    return storedFiles
  }

  if (typeof storedFiles === 'string') {
    try {
      return JSON.parse(storedFiles) ?? []
    } catch (error) {
      console.error('DB 파일 파싱 실패:', error)
      return []
    }
  }

  return []
}

export async function processFileUpdates({
  id,
  board,
  jsonDeleteKeys,
  uploadedFiles = [],
  fetchCurrentFiles
}) {
  const normalizedUploads = normalizeUploadedFiles(uploadedFiles)
  const deleteKeyList = parseDeleteKeys(jsonDeleteKeys)
  const normalizedDeleteKeys = normalizeDeleteKeyFilenames(deleteKeyList)

  if (normalizedDeleteKeys.length > 0) {
    removePhysicalFiles(normalizedDeleteKeys)
  }

  const hasFileUpdate = normalizedDeleteKeys.length > 0 || normalizedUploads.length > 0

  if (!hasFileUpdate) {
    return { files: undefined, hasFileUpdate }
  }

  let existingFiles = []

  try {
    let currentContent
    if (typeof fetchCurrentFiles === 'function') {
      currentContent = await fetchCurrentFiles(id, board)
    } else if (board) {
      currentContent = await getContentById(id, board)
    }

    if (currentContent?.files) {
      existingFiles = parseStoredFiles(currentContent.files)
    }
  } catch (error) {
    console.error('기존 파일 조회 실패:', error)
  }

  if (normalizedDeleteKeys.length > 0) {
    existingFiles = existingFiles.filter(
      (file) => file && !normalizedDeleteKeys.includes(file.filename)
    )
  }

  if (normalizedUploads.length > 0) {
    existingFiles = [...existingFiles, ...normalizedUploads]
  }

  return { files: existingFiles, hasFileUpdate }
}
