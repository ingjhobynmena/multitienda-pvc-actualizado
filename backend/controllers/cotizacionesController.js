import { getAll, saveAll, nextId } from '../utils/jsonDb.js'

export async function listarCotizaciones(_req, res) {
  res.json(await getAll('cotizaciones'))
}

export async function crearCotizacion(req, res) {
  const { clienteId, items } = req.body
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'La cotización debe tener al menos un producto.' })

  const productos = await getAll('productos')
  const cantidades = new Map()
  for (const item of items) {
    const id = Number(item.productoId), cantidad = Number(item.cantidad)
    if (!Number.isInteger(id) || !Number.isInteger(cantidad) || cantidad <= 0) return res.status(400).json({ success: false, message: 'Cada producto debe tener una cantidad entera mayor que cero.' })
    cantidades.set(id, (cantidades.get(id) || 0) + cantidad)
  }
  const detalle = []
  for (const [id, cantidad] of cantidades) {
    const p = productos.find((x) => x.id === id)
    if (!p) return res.status(404).json({ success: false, message: `El producto ${id} no existe.` })
    detalle.push({ productoId: p.id, nombre: p.nombre.trim(), cantidad, precio: Number(p.precio), subtotal: Number(p.precio) * cantidad })
  }
  const clientes = await getAll('clientes')
  const cliente = clienteId ? clientes.find((c) => c.id === Number(clienteId)) : null
  if (clienteId && !cliente) return res.status(404).json({ success: false, message: 'El cliente seleccionado no existe.' })

  const cotizaciones = await getAll('cotizaciones')
  const nueva = { id: nextId(cotizaciones), fecha: new Date().toISOString(), clienteId: cliente?.id || null, clienteNombre: cliente?.nombre || null, items: detalle, total: detalle.reduce((s, x) => s + x.subtotal, 0), estado: 'pendiente' }
  cotizaciones.push(nueva)
  await saveAll('cotizaciones', cotizaciones)
  res.status(201).json({ success: true, message: 'Cotización creada correctamente.', data: nueva })
}

export async function actualizarEstadoCotizacion(req, res) {
  const estados = ['pendiente', 'aprobada', 'rechazada']
  const estado = String(req.body.estado || '').toLowerCase()
  if (!estados.includes(estado)) return res.status(400).json({ success: false, message: 'Estado no válido.' })
  const cotizaciones = await getAll('cotizaciones')
  const q = cotizaciones.find((x) => x.id === Number(req.params.id))
  if (!q) return res.status(404).json({ success: false, message: 'Cotización no encontrada.' })
  if (q.estado === 'convertida') return res.status(400).json({ success: false, message: 'Esta cotización ya fue convertida en venta.' })
  q.estado = estado
  await saveAll('cotizaciones', cotizaciones)
  res.json({ success: true, message: 'Estado actualizado.', data: q })
}

export async function convertirCotizacionEnVenta(req, res) {
  const cotizaciones = await getAll('cotizaciones')
  const q = cotizaciones.find((x) => x.id === Number(req.params.id))
  if (!q) return res.status(404).json({ success: false, message: 'Cotización no encontrada.' })
  if (q.estado === 'convertida') return res.status(400).json({ success: false, message: 'Esta cotización ya fue convertida.' })
  if (q.estado === 'rechazada') return res.status(400).json({ success: false, message: 'No se puede convertir una cotización rechazada.' })

  const productos = await getAll('productos')
  for (const item of q.items) {
    const p = productos.find((x) => x.id === item.productoId)
    if (!p) return res.status(404).json({ success: false, message: `El producto ${item.nombre} ya no existe.` })
    if (Number(p.stock) < Number(item.cantidad)) return res.status(400).json({ success: false, message: `Stock insuficiente para ${p.nombre}. Disponible: ${p.stock}.` })
  }
  const ventas = await getAll('ventas')
  const fecha = new Date().toISOString()
  const venta = { id: nextId(ventas), fecha, clienteId: q.clienteId, clienteNombre: q.clienteNombre || 'Cliente mostrador', items: q.items, total: Number(q.total), cotizacionId: q.id }
  const movimientos = await getAll('movimientos')
  for (const item of q.items) {
    const p = productos.find((x) => x.id === item.productoId)
    const anterior = Number(p.stock)
    p.stock = anterior - Number(item.cantidad)
    movimientos.push({ id: nextId(movimientos), fecha, tipo: 'venta', productoId: p.id, productoNombre: p.nombre, unidad: p.unidad, cantidad: Number(item.cantidad), stockAnterior: anterior, stockNuevo: p.stock, observacion: `Salida por conversión de cotización #${q.id}` })
  }
  q.estado = 'convertida'
  q.ventaId = venta.id
  await saveAll('productos', productos)
  ventas.push(venta)
  await saveAll('ventas', ventas)
  await saveAll('cotizaciones', cotizaciones)
  await saveAll('movimientos', movimientos)
  res.status(201).json({ success: true, message: 'Cotización convertida en venta y existencias actualizadas.', data: venta })
}
