import express from 'express'
import { companiesAuthController, vaganciesController } from '../controllers'
import { validateToken } from '../middlewares'

const router = express.Router()

router.post('/register', companiesAuthController.register)
router.get('/verify_email/:companyID/:token', companiesAuthController.verifyEmail)
router.post('/authenticate', companiesAuthController.authenticate)
router.post('/forgot_password', companiesAuthController.forgotPassword)
router.post('/reset_password/:token', companiesAuthController.resetPassword)

router.get('/home')
router.post('/create_new_vagancy', validateToken, vaganciesController.register)

export default router
