import express from 'express'
import { authController } from '../controllers'

const router = express.Router()

router.post('/register', authController.register)
router.get('/verify_email/:userID/:token', authController.verifyEmail)
router.post('/authenticate', authController.authenticate)
router.post('/forgot_password', authController.forgotPassword)
router.put('/reset_password/:token', authController.resetPassword)

export default router
