import express from 'express'
import { vaganciesController, companiesController, usersController } from '../controllers'
import { validateToken } from '../middlewares'

const router = express.Router()

router.get('/')
router.get('/vagancies', vaganciesController.list)
router.get('/vagancies/:vagancyID', vaganciesController.fetchOne)
router.get('/profile/:userID', usersController.fetchOne)
router.get('/users', usersController.list)

router.post('/vagancies/:vagancyID/saveVagancy', validateToken, vaganciesController.saveVagancy)
router.post('/profile/:companyID/setAvaliation', validateToken, companiesController.setAvaliation)

router.put('/profile/:userID/update', validateToken, usersController.update)

router.delete('/profile/:userID/delete', validateToken, usersController.delete)

export default router
