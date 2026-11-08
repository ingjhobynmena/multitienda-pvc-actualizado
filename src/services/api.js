// En producción define VITE_API_URL con la dirección pública del backend.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '')

async function apiRequest(endpoint, options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté activo.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = Array.isArray(data.errors) ? ` ${data.errors.join(' ')}` : ''
    throw new Error((data.message || 'Ocurrió un error en la solicitud.') + detail)
  }
  return data
}

export const api = {
  getProductos: () => apiRequest('/productos'),
  crearProducto: (producto) => apiRequest('/productos', { method: 'POST', body: producto instanceof FormData ? producto : JSON.stringify(producto) }),
  actualizarProducto: (id, producto) => apiRequest(`/productos/${id}`, { method: 'PUT', body: producto instanceof FormData ? producto : JSON.stringify(producto) }),
  eliminarProducto: (id) => apiRequest(`/productos/${id}`, { method: 'DELETE' }),
  getClientes: () => apiRequest('/clientes'),
  crearCliente: (cliente) => apiRequest('/clientes', { method: 'POST', body: JSON.stringify(cliente) }),
  actualizarCliente: (id, cliente) => apiRequest(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(cliente) }),
  eliminarCliente: (id) => apiRequest(`/clientes/${id}`, { method: 'DELETE' }),
  getVentas: () => apiRequest('/ventas'),
  crearVenta: (venta) => apiRequest('/ventas', { method: 'POST', body: JSON.stringify(venta) }),
  getCotizaciones: () => apiRequest('/cotizaciones'),
  crearCotizacion: (cotizacion) => apiRequest('/cotizaciones', { method: 'POST', body: JSON.stringify(cotizacion) }),
  actualizarEstadoCotizacion: (id, estado) => apiRequest(`/cotizaciones/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  convertirCotizacion: (id) => apiRequest(`/cotizaciones/${id}/convertir-venta`, { method: 'POST' }),
  getMovimientos: () => apiRequest('/inventario/movimientos'),
  registrarMovimiento: (movimiento) => apiRequest('/inventario/movimientos', { method: 'POST', body: JSON.stringify(movimiento) }),
  getDashboard: () => apiRequest('/dashboard')
}
