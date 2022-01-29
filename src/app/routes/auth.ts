import express from 'express'
import { authController } from '../controllers'

const router = express.Router()

router.post('/register', authController.register)
router.post('/authenticate', authController.authenticate)
router.post('/forgot_password', authController.forgotPassword)
router.post('/reset_password/:token', authController.resetPassword)

export default router
