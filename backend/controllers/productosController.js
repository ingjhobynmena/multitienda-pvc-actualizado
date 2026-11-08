import { getAll, saveAll, nextId } from '../utils/jsonDb.js'
import fs from 'fs/promises'
import path from 'path'
import { getUploadsDirectory } from '../middleware/upload.js'

async function borrarImagen(imagen) {
  if (!imagen || typeof imagen !== 'string' || !imagen.startsWith('/uploads/')) return
  const nombre = path.basename(imagen)
  if (!nombre || nombre !== imagen.slice('/uploads/'.length)) return
  try {
    await fs.unlink(path.join(getUploadsDirectory(), nombre))
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('No se pudo eliminar la imagen:', error)
  }
}

function rutaImagen(file) {
  return file ? `/uploads/${file.filename}` : undefined
}

const camposPermitidos = ['nombre', 'categoria', 'descripcion', 'precio', 'stock', 'unidad']

function validarProducto(data) {
  const errores = []

  if (!data.nombre || String(data.nombre).trim().length < 2) {
    errores.push('El nombre es obligatorio y debe tener al menos 2 caracteres.')
  }

  if (!data.categoria || String(data.categoria).trim() === '') {
    errores.push('La categoría es obligatoria.')
  }

  if (data.precio === undefined || Number.isNaN(Number(data.precio)) || Number(data.precio) < 0) {
    errores.push('El precio debe ser un número mayor o igual a 0.')
  }

  if (data.stock === undefined || !Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    errores.push('El stock debe ser un número entero mayor o igual a 0.')
  }

  if (!data.unidad || String(data.unidad).trim() === '') {
    errores.push('La unidad es obligatoria.')
  }

  return errores
}

export async function listarProductos(req, res) {
  const productos = await getAll('productos')
  res.status(200).json(productos)
}

export async function obtenerProducto(req, res) {
  const productos = await getAll('productos')
  const producto = productos.find((p) => p.id === Number(req.params.id))

  if (!producto) {
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado.'
    })
  }

  res.status(200).json(producto)
}

export async function crearProducto(req, res) {
  const errores = validarProducto(req.body)

  if (errores.length) {
    if (req.file) await borrarImagen(rutaImagen(req.file))
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos.',
      errors: errores
    })
  }

  const productos = await getAll('productos')
  const nuevo = {}

  for (const campo of camposPermitidos) {
    nuevo[campo] = req.body[campo]
  }

  nuevo.id = nextId(productos)
  nuevo.precio = Number(nuevo.precio)
  nuevo.stock = Number(nuevo.stock)
  if (req.file) nuevo.imagen = rutaImagen(req.file)

  productos.push(nuevo)
  await saveAll('productos', productos)
  if (Number(nuevo.stock) > 0) {
    const movimientos = await getAll('movimientos')
    movimientos.push({ id: nextId(movimientos), fecha: new Date().toISOString(), tipo: 'entrada', productoId: nuevo.id, productoNombre: nuevo.nombre, unidad: nuevo.unidad, cantidad: Number(nuevo.stock), stockAnterior: 0, stockNuevo: Number(nuevo.stock), observacion: 'Stock inicial del producto' })
    await saveAll('movimientos', movimientos)
  }

  res.status(201).json({
    success: true,
    message: 'Producto creado correctamente.',
    data: nuevo
  })
}

export async function actualizarProducto(req, res) {
  const productos = await getAll('productos')
  const index = productos.findIndex((p) => p.id === Number(req.params.id))

  if (index === -1) {
    if (req.file) await borrarImagen(rutaImagen(req.file))
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado.'
    })
  }

  const productoActualizado = {
    ...productos[index],
    ...req.body,
    id: productos[index].id
  }

  const errores = validarProducto(productoActualizado)

  if (errores.length) {
    if (req.file) await borrarImagen(rutaImagen(req.file))
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos.',
      errors: errores
    })
  }

  const imagenAnterior = productos[index].imagen
  delete productoActualizado.eliminarImagen
  if (req.file) productoActualizado.imagen = rutaImagen(req.file)
  else if (req.body.eliminarImagen === 'true') delete productoActualizado.imagen

  productoActualizado.precio = Number(productoActualizado.precio)
  productoActualizado.stock = Number(productoActualizado.stock)

  const stockAnterior = Number(productos[index].stock)
  productos[index] = productoActualizado
  await saveAll('productos', productos)
  const diferenciaStock = Number(productoActualizado.stock) - stockAnterior
  if (diferenciaStock !== 0) {
    const movimientos = await getAll('movimientos')
    movimientos.push({ id: nextId(movimientos), fecha: new Date().toISOString(), tipo: diferenciaStock > 0 ? 'entrada' : 'salida', productoId: productoActualizado.id, productoNombre: productoActualizado.nombre, unidad: productoActualizado.unidad, cantidad: Math.abs(diferenciaStock), stockAnterior, stockNuevo: Number(productoActualizado.stock), observacion: 'Ajuste de existencias desde el catálogo de productos' })
    await saveAll('movimientos', movimientos)
  }
  if ((req.file || req.body.eliminarImagen === 'true') && imagenAnterior) await borrarImagen(imagenAnterior)

  res.status(200).json({
    success: true,
    message: 'Producto actualizado correctamente.',
    data: productoActualizado
  })
}

export async function eliminarProducto(req, res) {
  const productos = await getAll('productos')
  const index = productos.findIndex((p) => p.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado.'
    })
  }

  const eliminado = productos.splice(index, 1)[0]
  await saveAll('productos', productos)
  if (eliminado.imagen) await borrarImagen(eliminado.imagen)

  res.status(200).json({
    success: true,
    message: 'Producto eliminado correctamente.',
    data: eliminado
  })
}