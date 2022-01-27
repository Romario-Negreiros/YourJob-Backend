import express from 'express'
import { authController } from '../controllers'

const router = express.Router()

router.post('/register', authController.register)
router.post('/authenticate', authController.authenticate)

export default router
