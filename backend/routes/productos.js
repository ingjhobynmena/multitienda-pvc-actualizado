import { uploadProductoImage } from '../middleware/upload.js'
import { Router } from 'express'
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js'

const router = Router()

router.get('/', listarProductos)
router.get('/:id', obtenerProducto)
router.post('/', uploadProductoImage, crearProducto)
router.put('/:id', uploadProductoImage, actualizarProducto)
router.delete('/:id', eliminarProducto)

export default router