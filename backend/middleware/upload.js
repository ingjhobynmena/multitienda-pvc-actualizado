import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, '..', 'uploads')

fs.mkdirSync(uploadDir, { recursive: true })

const extensionsByType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extension = extensionsByType[file.mimetype]
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
  }
})

export const uploadProductoImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!extensionsByType[file.mimetype]) {
      return callback(new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF.'))
    }
    callback(null, true)
  }
}).single('imagen')

export function getUploadsDirectory() {
  return uploadDir
}
