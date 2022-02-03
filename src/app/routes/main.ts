import express from 'express'
import { vaganciesController } from '../controllers'

const router = express.Router()

router.get('/')
router.post('/vagancies', vaganciesController.list)

export default router
