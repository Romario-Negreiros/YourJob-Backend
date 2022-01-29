import multer from 'multer'
import crypto from 'crypto'
// import path from 'path'

const multerConfig: multer.Options = {
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err, file.originalname)
        } else {
          const fileName = `${hash.toString('hex')}-${file.originalname}`
          cb(null, fileName)
        }
      })
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/jpg', 'image/png', 'image/svg']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid image typw!'))
    }
  }
}

export default multerConfig
