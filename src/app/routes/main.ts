import express from 'express'
import { vaganciesController, companiesController } from '../controllers'
import { validateToken } from '../middlewares'

const router = express.Router()

router.get('/')
router.get('/vagancies', vaganciesController.list)
router.get('/vagancies/:vagancyID', vaganciesController.fetchOne)
router.post('/vagancies/:vagancyID/saveVagancy', validateToken, vaganciesController.saveVagancy)
router.get('/companies_list', companiesController.list)
router.get('/companies_list/:companyID', companiesController.fetchOne)
router.post('/companies_list/:companyID/setAvaliation', validateToken, companiesController.setAvaliation)

export default router
