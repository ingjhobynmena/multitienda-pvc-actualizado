import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import productosRoutes from './routes/productos.js'
import clientesRoutes from './routes/clientes.js'
import ventasRoutes from './routes/ventas.js'
import cotizacionesRoutes from './routes/cotizaciones.js'
import inventarioRoutes from './routes/inventario.js'
import { getAll } from './utils/jsonDb.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.join(__dirname, 'uploads')

const app = express()
const PORT = process.env.PORT || 3001

// En desarrollo acepta cualquier origen. En producción se puede limitar
// con CORS_ORIGIN, separando varios dominios con comas.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['*']

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Origen no permitido por la configuración CORS.'))
  }
}))

// Sirve las fotografías guardadas de los productos.
app.use('/uploads', express.static(uploadsDir))

// Permite recibir datos JSON.
app.use(express.json())

// Ruta para comprobar que el servidor funciona.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Multitienda PVC funcionando correctamente.',
    entorno: process.env.NODE_ENV || 'development'
  })
})

// Rutas de la API.
app.use('/api/productos', productosRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/ventas', ventasRoutes)
app.use('/api/cotizaciones', cotizacionesRoutes)
app.use('/api/inventario', inventarioRoutes)

// Datos para el inicio y los reportes.
app.get('/api/dashboard', async (req, res) => {
  try {
    const [productos, clientes, ventas, cotizaciones] = await Promise.all([
      getAll('productos'),
      getAll('clientes'),
      getAll('ventas'),
      getAll('cotizaciones')
    ])

    const valorInventario = productos.reduce(
      (total, producto) => total + Number(producto.precio) * Number(producto.stock),
      0
    )

    res.json({
      productos: productos.length,
      clientes: clientes.length,
      ventas: ventas.length,
      cotizaciones: cotizaciones.length,
      valorInventario
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'No fue posible obtener el resumen.',
      error: error.message
    })
  }
})

// Rutas que no existen.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'La ruta solicitada no existe.'
  })
})

// Errores del servidor.
app.use((error, req, res, next) => {
  console.error(error)
  const esErrorImagen = error?.name === 'MulterError' || /Formato no permitido/.test(error?.message || '')
  res.status(esErrorImagen ? 400 : 500).json({
    success: false,
    message: esErrorImagen
      ? (error.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera el límite de 5 MB.' : error.message)
      : 'Error interno del servidor.'
  })
})

app.listen(PORT, () => {
  console.log(`API Multitienda PVC ejecutándose en http://localhost:${PORT}`)
})