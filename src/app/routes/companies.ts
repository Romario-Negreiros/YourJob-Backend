import express from 'express'
import { companiesAuthController, vaganciesController, companiesController } from '../controllers'
import { validateToken } from '../middlewares'

const router = express.Router()

router.post('/register', companiesAuthController.register)
router.get('/verify_email/:companyID/:token', companiesAuthController.verifyEmail)
router.post('/authenticate', companiesAuthController.authenticate)
router.post('/forgot_password', companiesAuthController.forgotPassword)
router.post('/reset_password/:token', companiesAuthController.resetPassword)

router.post('/create_new_vagancy', validateToken, vaganciesController.register)
router.get('/profile/:companyID', companiesController.fetchOne)
router.post('/update', validateToken, companiesController.update)

export default router
