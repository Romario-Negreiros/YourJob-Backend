import express from 'express'
import { companiesAuthController, authController, vacanciesController, usersController, companiesController } from './controllers'
import { validateToken } from './middlewares'

const router = express.Router()

// Register
router.post('/users/register', authController.register)
router.post('/companies/register', companiesAuthController.register)
// Authenticate
router.post('/users/authenticate', authController.authenticate)
router.post('/companies/authenticate', companiesAuthController.authenticate)
router.post('/users/authenticate/jwt', validateToken, authController.authenticateWithJwt)
router.post('/companies/authenticate/jwt', validateToken, companiesAuthController.authenticateWithJwt)
// Verify email
router.get('/users/verify_email/:userID/:token', authController.verifyEmail)
router.get('/companies/verify_email/:companyID/:token', companiesAuthController.verifyEmail)
// Forgot password
router.post('/users/forgot_password', authController.forgotPassword)
router.post('/companies/forgot_password', companiesAuthController.forgotPassword)
// Reset password
router.put('/users/reset_password/:token', authController.resetPassword)
router.put('/companies/reset_password/:token', companiesAuthController.resetPassword)
// Create vacancy
router.post('/create_new_vacancy', validateToken, vacanciesController.register)
// Show unique
router.get('/users/profile/:userID', usersController.fetchOne)
router.get('/companies/profile/:companyID', companiesController.fetchOne)
router.get('/vacancies/:vacancyID', vacanciesController.fetchOne)
// Lists
router.get('/users', usersController.list)
router.get('/companies', companiesController.list)
router.get('/vacancies', vacanciesController.list)
// Updates
router.put('/users/profile/:userID/update', validateToken, usersController.update)
router.put('/companies/profile/:companyID/update', validateToken, companiesController.update)
router.put('/vacancies/:vacancyID/update', validateToken, vacanciesController.update)
// Deletes
router.delete('/users/profile/:userID/delete', validateToken, usersController.delete)
router.delete('/companies/profile/:companyID/delete', validateToken, companiesController.delete)
router.delete('/vacancies/:vacancyID/delete', validateToken, vacanciesController.delete)
// Save vacancy
router.post('/vacancies/:vacancyID/saveVacancy', validateToken, vacanciesController.saveVacancy)
// Remove saved vacancy
router.delete('/vacancies/:vacancyID/removeSavedVacancy', validateToken, vacanciesController.removeSavedVacancy)
// Set avaliation
router.post('/avaliations/:companyID/create', validateToken, companiesController.setAvaliation)

export default router
