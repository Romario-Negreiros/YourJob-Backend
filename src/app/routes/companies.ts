import express from 'express'
import { companiesController } from '../controllers'

const router = express.Router()

router.post('/register', companiesController.register)
router.get('/verify_email/:companyID/:token', companiesController.verifyEmail)
router.post('/authenticate', companiesController.authenticate)
router.post('/forgot_password', companiesController.forgotPassword)
router.post('/reset_password/:token', companiesController.resetPassword)

export default router
