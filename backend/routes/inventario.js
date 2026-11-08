import { Router } from 'express'
import { listarMovimientos, registrarMovimiento } from '../controllers/inventarioController.js'

const router = Router()
router.get('/movimientos', listarMovimientos)
router.post('/movimientos', registrarMovimiento)
export default router
