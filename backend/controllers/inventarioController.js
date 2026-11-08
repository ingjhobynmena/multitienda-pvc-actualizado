import { getAll, saveAll, nextId } from '../utils/jsonDb.js'

export async function listarMovimientos(_req, res) {
  const movimientos = await getAll('movimientos')
  res.json(movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
}

export async function registrarMovimiento(req, res) {
  const productoId = Number(req.body.productoId)
  const cantidad = Number(req.body.cantidad)
  const tipo = String(req.body.tipo || '').toLowerCase()
  const observacion = String(req.body.observacion || '').trim()

  if (!Number.isInteger(productoId) || !Number.isInteger(cantidad) || cantidad <= 0 || !['entrada', 'salida'].includes(tipo)) {
    return res.status(400).json({ success: false, message: 'Selecciona un producto, un tipo de movimiento y una cantidad entera mayor que cero.' })
  }

  const productos = await getAll('productos')
  const producto = productos.find((p) => p.id === productoId)
  if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado.' })

  const anterior = Number(producto.stock)
  if (tipo === 'salida' && cantidad > anterior) {
    return res.status(400).json({ success: false, message: `No hay existencias suficientes. Stock actual: ${anterior}.` })
  }

  producto.stock = tipo === 'entrada' ? anterior + cantidad : anterior - cantidad
  const movimientos = await getAll('movimientos')
  const nuevo = {
    id: nextId(movimientos), fecha: new Date().toISOString(), tipo,
    productoId, productoNombre: producto.nombre, unidad: producto.unidad,
    cantidad, stockAnterior: anterior, stockNuevo: producto.stock,
    observacion: observacion || (tipo === 'entrada' ? 'Entrada de mercancía' : 'Salida de mercancía')
  }

  await saveAll('productos', productos)
  movimientos.push(nuevo)
  await saveAll('movimientos', movimientos)
  res.status(201).json({ success: true, message: 'Movimiento registrado y existencias actualizadas.', data: nuevo })
}
