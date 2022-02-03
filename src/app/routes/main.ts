import express from 'express'
import { vaganciesController, companiesController } from '../controllers'

const router = express.Router()

router.get('/')
router.get('/vagancies', vaganciesController.list)
router.get('/vagancies/:vagancyID', vaganciesController.fetchOne)
router.get('/companies_list', companiesController.list)
router.get('/companies_list/:companyID', companiesController.fetchOne)

export default router
