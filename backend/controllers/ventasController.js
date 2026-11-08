import { getAll, saveAll, nextId } from '../utils/jsonDb.js'

export async function listarVentas(_req, res) {
  res.json(await getAll('ventas'))
}

export async function crearVenta(req, res) {
  const { clienteId, items } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'La venta debe tener al menos un producto.' })
  }

  const productos = await getAll('productos')
  const cantidades = new Map()
  for (const item of items) {
    const id = Number(item.productoId)
    const cantidad = Number(item.cantidad)
    if (!Number.isInteger(id) || !Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({ success: false, message: 'Cada producto debe tener una cantidad entera mayor que cero.' })
    }
    cantidades.set(id, (cantidades.get(id) || 0) + cantidad)
  }

  const clientes = await getAll('clientes')
  const cliente = clienteId ? clientes.find((c) => c.id === Number(clienteId)) : null
  if (clienteId && !cliente) return res.status(404).json({ success: false, message: 'El cliente seleccionado no existe.' })

  const detalle = []
  for (const [id, cantidad] of cantidades) {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return res.status(404).json({ success: false, message: `El producto ${id} no existe.` })
    if (cantidad > Number(producto.stock)) return res.status(400).json({ success: false, message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.` })
    detalle.push({ productoId: producto.id, nombre: producto.nombre.trim(), cantidad, precio: Number(producto.precio), subtotal: Number(producto.precio) * cantidad })
  }

  const ventas = await getAll('ventas')
  const nuevaVenta = {
    id: nextId(ventas), fecha: new Date().toISOString(),
    clienteId: cliente ? cliente.id : null, clienteNombre: cliente ? cliente.nombre : 'Cliente mostrador',
    items: detalle, total: detalle.reduce((sum, item) => sum + item.subtotal, 0)
  }
  const movimientos = await getAll('movimientos')
  for (const item of detalle) {
    const producto = productos.find((p) => p.id === item.productoId)
    const anterior = Number(producto.stock)
    producto.stock = anterior - item.cantidad
    movimientos.push({
      id: nextId(movimientos), fecha: nuevaVenta.fecha, tipo: 'venta',
      productoId: producto.id, productoNombre: producto.nombre, unidad: producto.unidad,
      cantidad: item.cantidad, stockAnterior: anterior, stockNuevo: producto.stock,
      observacion: `Salida por venta #${nuevaVenta.id}`
    })
  }
  await saveAll('productos', productos)
  ventas.push(nuevaVenta)
  await saveAll('ventas', ventas)
  await saveAll('movimientos', movimientos)
  res.status(201).json({ success: true, message: 'Venta registrada correctamente y stock actualizado.', data: nuevaVenta })
}
