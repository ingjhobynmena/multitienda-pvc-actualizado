import { getAll, saveAll, nextId } from '../utils/jsonDb.js'

function validarCliente(data) {
  const errores = []

  if (!data.nombre || String(data.nombre).trim().length < 2) {
    errores.push('El nombre del cliente es obligatorio.')
  }

  if (!data.documento || String(data.documento).trim() === '') {
    errores.push('El documento es obligatorio.')
  }

  if (data.correo && !String(data.correo).includes('@')) {
    errores.push('El correo no tiene un formato válido.')
  }

  return errores
}

export async function listarClientes(req, res) {
  res.json(await getAll('clientes'))
}

export async function crearCliente(req, res) {
  const errores = validarCliente(req.body)

  if (errores.length) {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos.',
      errors: errores
    })
  }

  const clientes = await getAll('clientes')

  if (clientes.some((c) => c.documento === req.body.documento)) {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un cliente con ese documento.'
    })
  }

  const nuevo = {
    id: nextId(clientes),
    nombre: String(req.body.nombre).trim(),
    documento: String(req.body.documento).trim(),
    telefono: String(req.body.telefono || '').trim(),
    correo: String(req.body.correo || '').trim()
  }

  clientes.push(nuevo)
  await saveAll('clientes', clientes)

  res.status(201).json({
    success: true,
    message: 'Cliente creado correctamente.',
    data: nuevo
  })
}

export async function actualizarCliente(req, res) {
  const clientes = await getAll('clientes')
  const index = clientes.findIndex((c) => c.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Cliente no encontrado.'
    })
  }

  const actualizado = {
    ...clientes[index],
    ...req.body,
    id: clientes[index].id
  }

  const errores = validarCliente(actualizado)

  if (errores.length) {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos.',
      errors: errores
    })
  }

  clientes[index] = actualizado
  await saveAll('clientes', clientes)

  res.json({
    success: true,
    message: 'Cliente actualizado correctamente.',
    data: actualizado
  })
}

export async function eliminarCliente(req, res) {
  const clientes = await getAll('clientes')
  const index = clientes.findIndex((c) => c.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Cliente no encontrado.'
    })
  }

  const eliminado = clientes.splice(index, 1)[0]
  await saveAll('clientes', clientes)

  res.json({
    success: true,
    message: 'Cliente eliminado correctamente.',
    data: eliminado
  })
}