import { Router } from 'express'
import { listarCotizaciones, crearCotizacion, actualizarEstadoCotizacion, convertirCotizacionEnVenta } from '../controllers/cotizacionesController.js'
const router = Router()
router.get('/', listarCotizaciones)
router.post('/', crearCotizacion)
router.patch('/:id/estado', actualizarEstadoCotizacion)
router.post('/:id/convertir-venta', convertirCotizacionEnVenta)
export default router
