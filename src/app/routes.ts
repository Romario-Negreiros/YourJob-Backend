import express from 'express'
import { companiesAuthController, authController, vaganciesController, usersController, companiesController } from './controllers'
import { validateToken } from './middlewares'

const router = express.Router()

router.get('/', (req, res) => res.send('API running!'))
// Register
router.post('/users/register', authController.register)
router.post('/companies/register', companiesAuthController.register)
// Authenticate
router.post('/users/authenticate', authController.authenticate)
router.post('/companies/authenticate', companiesAuthController.authenticate)
// Verify email
router.get('/users/verify_email/:userID/:token', authController.verifyEmail)
router.get('/companies/verify_email/:companyID/:token', companiesAuthController.verifyEmail)
// Forgot password
router.post('/users/forgot_password', authController.forgotPassword)
router.post('/companies/forgot_password', companiesAuthController.forgotPassword)
// Reset password
router.put('/users/reset_password/:token', authController.resetPassword)
router.put('/companies/reset_password/:token', companiesAuthController.resetPassword)
// Create vagancy
router.post('/create_new_vagancy', validateToken, vaganciesController.register)
// Show unique
router.get('/users/profile/:userID', usersController.fetchOne)
router.get('/companies/profile/:companyID', companiesController.fetchOne)
router.get('/vagancies/:vagancyID', vaganciesController.fetchOne)
// Lists
router.get('/users', usersController.list)
router.get('/companies', companiesController.list)
router.get('/vagancies', vaganciesController.list)
// Updates
router.put('/users/profile/:userID/update', validateToken, usersController.update)
router.put('/companies/profile/:companyID/update', validateToken, companiesController.update)
router.put('/vagancies/:vagancyID/update', validateToken, vaganciesController.update)
// Deletes
router.delete('/users/profile/:userID/delete', validateToken, usersController.delete)
router.delete('/companies/profile/:companyID/delete', validateToken, companiesController.delete)
router.delete('/vagancies/:vagancyID/delete', validateToken, vaganciesController.delete)
// Save vagancy
router.post('/vagancies/:vagancyID/saveVagancy', validateToken, vaganciesController.saveVagancy)
// Set avaliation
router.post('/avaliations/:companyID/create', validateToken, companiesController.setAvaliation)

export default router
