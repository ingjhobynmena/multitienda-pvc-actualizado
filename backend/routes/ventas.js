import { Router } from 'express'
import {
  listarVentas,
  crearVenta
} from '../controllers/ventasController.js'

const router = Router()

router.get('/', listarVentas)
router.post('/', crearVenta)

export default router