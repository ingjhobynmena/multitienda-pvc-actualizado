import { useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom'

import { api } from './services/api'
import ProductCard from './components/ProductCard'
import './dashboard.css'

function ProtectedRoute({ children }) {
  const logged = localStorage.getItem('multitienda_logged') === 'true'
  return logged ? children : <Navigate to="/login" replace />
}

function Layout({ children, onLogout }) {
  const links = [
    ['/', 'Inicio'],
    ['/productos', 'Productos'],
    ['/inventario', 'Inventario'],
    ['/ventas', 'Ventas'],
    ['/cotizaciones', 'Cotizaciones'],
    ['/clientes', 'Clientes'],
    ['/reportes', 'Reportes']
  ]

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link to="/" className="logo">
          <span>Multitienda</span> PVC
        </Link>

        <nav className="main-nav">
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="login-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="page-content">
        {children}
      </main>

      <footer className="footer">
        <strong>Multitienda PVC</strong>
        <span>Gestión de productos, inventario, ventas y cotizaciones.</span>
        <span>© 2026</span>
      </footer>
    </div>
  )
}

function Home() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard()
      .then(setDashboard)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const indicadores = [
    {
      icon: '▦',
      label: 'Productos',
      value: dashboard?.productos ?? '—',
      detail: 'Referencias registradas',
      tone: 'green'
    },
    {
      icon: '♙',
      label: 'Clientes',
      value: dashboard?.clientes ?? '—',
      detail: 'Clientes registrados',
      tone: 'blue'
    },
    {
      icon: '$',
      label: 'Ventas',
      value: dashboard?.ventas ?? '—',
      detail: 'Ventas realizadas',
      tone: 'orange'
    },
    {
      icon: '▤',
      label: 'Cotizaciones',
      value: dashboard?.cotizaciones ?? '—',
      detail: 'Cotizaciones creadas',
      tone: 'purple'
    }
  ]

  const accesos = [
    {
      icon: '▦',
      title: 'Productos',
      description: 'Agrega productos, actualiza precios y organiza el catálogo.',
      link: '/productos',
      action: 'Administrar productos',
      tone: 'green'
    },
    {
      icon: '▤',
      title: 'Inventario',
      description: 'Consulta las existencias y revisa qué productos necesitan reposición.',
      link: '/inventario',
      action: 'Ver inventario',
      tone: 'blue'
    },
    {
      icon: '$',
      title: 'Ventas',
      description: 'Registra las ventas de la tienda y consulta los movimientos.',
      link: '/ventas',
      action: 'Registrar venta',
      tone: 'orange'
    },
    {
      icon: '▧',
      title: 'Cotizaciones',
      description: 'Prepara cotizaciones con los productos y cantidades solicitadas.',
      link: '/cotizaciones',
      action: 'Crear cotización',
      tone: 'purple'
    },
    {
      icon: '♙',
      title: 'Clientes',
      description: 'Guarda y mantén actualizada la información de los clientes.',
      link: '/clientes',
      action: 'Ver clientes',
      tone: 'teal'
    },
    {
      icon: '▥',
      title: 'Reportes',
      description: 'Consulta un resumen de la información registrada en el sistema.',
      link: '/reportes',
      action: 'Consultar reportes',
      tone: 'gray'
    }
  ]

  return (
    <section className="dashboard-page">
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="dashboard-kicker">PANEL PRINCIPAL</span>
          <h1>Bienvenido a <span>Multitienda PVC</span></h1>
          <p>
            Desde aquí puedes organizar las actividades de la tienda,
            consultar el inventario y llevar el control de las ventas.
          </p>
          <div className="dashboard-welcome-actions">
            <Link to="/ventas" className="dashboard-primary-action">
              + Registrar una venta
            </Link>
            <Link to="/productos" className="dashboard-secondary-action">
              Ver productos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="dashboard-welcome-mark" aria-hidden="true">
          <span className="dashboard-mark-top">M</span>
          <span className="dashboard-mark-bottom">PVC</span>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="dashboard-section-title">
        <div>
          <span className="dashboard-kicker">RESUMEN DEL NEGOCIO</span>
          <h2>Indicadores generales</h2>
        </div>
        <span className="dashboard-live-label">
          <i /> Datos del sistema
        </span>
      </div>

      <div className="dashboard-metrics">
        {indicadores.map((item) => (
          <article className="dashboard-metric-card" key={item.label}>
            <div className={`dashboard-metric-icon ${item.tone}`}>{item.icon}</div>
            <div className="dashboard-metric-info">
              <span>{item.label}</span>
              <strong>{loading ? '...' : item.value}</strong>
              <small>{item.detail}</small>
            </div>
          </article>
        ))}
      </div>

      <article className="dashboard-inventory-value">
        <div>
          <span className="dashboard-kicker">VALOR DEL INVENTARIO</span>
          <h2>
            {loading
              ? 'Calculando...'
              : `$${Number(dashboard?.valorInventario ?? 0).toLocaleString('es-CO')}`}
          </h2>
          <p>Valor total estimado de los productos registrados.</p>
        </div>
        <div className="dashboard-inventory-symbol" aria-hidden="true">$</div>
      </article>

      <div className="dashboard-section-title dashboard-access-title">
        <div>
          <span className="dashboard-kicker">GESTIÓN DE LA TIENDA</span>
          <h2>Accesos rápidos</h2>
          <p>Selecciona el módulo que necesitas utilizar.</p>
        </div>
      </div>

      <div className="dashboard-shortcuts">
        {accesos.map((item) => (
          <article className="dashboard-shortcut-card" key={item.title}>
            <div className={`dashboard-shortcut-icon ${item.tone}`}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link to={item.link}>
              {item.action} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function Productos() {
  const emptyForm = {
    nombre: '',
    categoria: 'PVC',
    descripcion: '',
    precio: '',
    stock: '',
    unidad: 'unidad'
  }

  const categorias = [
    'PVC', 'WPC', 'Drywall', 'Superboard', 'Marmolizada',
    'Estuco', 'Masilla', 'Pinturas', 'Accesorios', 'Iluminación'
  ]

  const [productos, setProductos] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [imagen, setImagen] = useState(null)
  const [vistaPrevia, setVistaPrevia] = useState('')
  const [eliminarImagen, setEliminarImagen] = useState(false)

  const cargar = async () => {
    try {
      setLoading(true)
      setError('')
      setProductos(await api.getProductos())
    } catch (err) {
      setError(err.message || 'No fue posible cargar los productos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  useEffect(() => {
    return () => {
      if (vistaPrevia.startsWith('blob:')) URL.revokeObjectURL(vistaPrevia)
    }
  }, [vistaPrevia])

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido.')
      e.target.value = ''
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5 MB.')
      e.target.value = ''
      return
    }
    setImagen(archivo)
    setVistaPrevia(URL.createObjectURL(archivo))
    setError('')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const nombre = form.nombre.trim()
    const precio = Number(form.precio)
    const stock = Number(form.stock)

    if (!nombre) {
      setError('Escribe el nombre del producto.')
      return
    }
    if (form.precio === '' || !Number.isFinite(precio) || precio < 0) {
      setError('Ingresa un precio válido, igual o mayor que cero.')
      return
    }
    if (form.stock === '' || !Number.isFinite(stock) || stock < 0) {
      setError('Ingresa una cantidad de stock válida, igual o mayor que cero.')
      return
    }

    try {
      const data = new FormData()
      data.append('nombre', nombre)
      data.append('categoria', form.categoria)
      data.append('descripcion', form.descripcion.trim())
      data.append('precio', String(precio))
      data.append('stock', String(stock))
      data.append('unidad', form.unidad)
      if (imagen) data.append('imagen', imagen)
      if (eliminarImagen) data.append('eliminarImagen', 'true')

      if (editingId !== null) {
        await api.actualizarProducto(editingId, data)
        setMessage('Producto actualizado correctamente.')
      } else {
        await api.crearProducto(data)
        setMessage('Producto creado correctamente.')
      }

      setForm(emptyForm)
      setEditingId(null)
      setImagen(null)
      setVistaPrevia('')
      setEliminarImagen(false)
      await cargar()
    } catch (err) {
      setError(err.message || 'No fue posible guardar el producto.')
    }
  }

  const editar = (producto) => {
    setEditingId(producto.id)
    setImagen(null)
    setEliminarImagen(false)
    setVistaPrevia(producto.imagen ? `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')}${producto.imagen}` : '')
    setForm({
      nombre: producto.nombre || '',
      categoria: producto.categoria || 'PVC',
      descripcion: producto.descripcion || '',
      precio: producto.precio ?? '',
      stock: producto.stock ?? '',
      unidad: producto.unidad || 'unidad'
    })
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return

    try {
      setError('')
      await api.eliminarProducto(id)
      setMessage('Producto eliminado correctamente.')
      if (editingId === id) {
        setEditingId(null)
        setForm(emptyForm)
        setImagen(null)
        setVistaPrevia('')
      }
      await cargar()
    } catch (err) {
      setError(err.message || 'No fue posible eliminar el producto.')
    }
  }

  const cancelar = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImagen(null)
    setVistaPrevia('')
    setEliminarImagen(false)
    setError('')
    setMessage('')
  }

  const filtrados = productos.filter((p) => {
    const texto = `${p.nombre || ''} ${p.categoria || ''} ${p.descripcion || ''}`.toLowerCase()
    const coincideTexto = texto.includes(search.trim().toLowerCase())
    const coincideCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro
    const coincideEstado =
      estadoFiltro === 'Todos' ||
      (estadoFiltro === 'Stock bajo' && Number(p.stock) <= 5) ||
      (estadoFiltro === 'Disponible' && Number(p.stock) > 5)
    return coincideTexto && coincideCategoria && coincideEstado
  })

  const stockBajo = productos.filter((p) => Number(p.stock) <= 5).length
  const valorInventario = productos.reduce(
    (total, p) => total + Number(p.precio || 0) * Number(p.stock || 0), 0
  )

  return (
    <section className="products-page">
      <PageHeader
        eyebrow="CATÁLOGO"
        title="Productos"
        description="Administra el catálogo, actualiza precios y controla las existencias de la tienda."
      />

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="products-summary">
        <article className="products-summary-card">
          <span className="products-summary-icon">▦</span>
          <div><strong>{productos.length}</strong><small>Productos registrados</small></div>
        </article>
        <article className="products-summary-card">
          <span className="products-summary-icon warning">!</span>
          <div><strong>{stockBajo}</strong><small>Productos con stock bajo</small></div>
        </article>
        <article className="products-summary-card">
          <span className="products-summary-icon money">$</span>
          <div>
            <strong>${valorInventario.toLocaleString('es-CO')}</strong>
            <small>Valor estimado del inventario</small>
          </div>
        </article>
      </div>

      <div className="products-layout">
        <form className="panel form-panel products-form" onSubmit={guardar}>
          <div className="products-form-heading">
            <div>
              <span className="eyebrow">{editingId !== null ? 'ACTUALIZACIÓN' : 'CATÁLOGO'}</span>
              <h2>{editingId !== null ? 'Editar producto' : 'Nuevo producto'}</h2>
            </div>
            <span className="products-form-symbol">{editingId !== null ? '✎' : '+'}</span>
          </div>

          <label>Nombre del producto
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. PVC blanco madera"
              maxLength="100"
              required
            />
          </label>

          <label>Categoría
            <select name="categoria" value={form.categoria} onChange={handleChange}>
              {categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}
            </select>
          </label>

          <label>Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente el producto..."
              maxLength="300"
            />
          </label>

          <div className="form-row">
            <label>Precio (COP)
              <input
                type="number"
                min="0"
                step="any"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </label>
            <label>Stock
              <input
                type="number"
                min="0"
                step="any"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </label>
          </div>

          <label>Unidad de medida
            <select name="unidad" value={form.unidad} onChange={handleChange}>
              <option value="unidad">Unidad</option>
              <option value="paquete">Paquete</option>
              <option value="metro">Metro</option>
              <option value="galón">Galón</option>
              <option value="cuarto">Cuarto</option>
              <option value="cuñete">Cuñete</option>
              <option value="balde">Balde</option>
              <option value="kilo">Kilo</option>
              <option value="bulto">Bulto</option>
              <option value="medio bulto">Medio bulto</option>
            </select>
          </label>

          <label className="image-upload-label">Fotografía del producto
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={seleccionarImagen}
            />
            <small>Formatos JPG, PNG, WEBP o GIF. Máximo 5 MB.</small>
          </label>
          {vistaPrevia && (
            <div className="image-preview-wrap">
              <img className="image-preview" src={vistaPrevia} alt="Vista previa del producto" />
              <button
                type="button"
                className="secondary-button image-remove-button"
                onClick={() => { setImagen(null); setVistaPrevia(''); setEliminarImagen(true) }}
              >
                Quitar imagen
              </button>
            </div>
          )}

          <div className="button-row products-form-actions">
            <button className="primary-button" type="submit">
              {editingId !== null ? 'Guardar cambios' : 'Crear producto'}
            </button>
            {editingId !== null && (
              <button className="secondary-button" type="button" onClick={cancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="products-catalog">
          <div className="products-toolbar panel">
            <div className="products-toolbar-title">
              <div>
                <span className="eyebrow">INVENTARIO</span>
                <h2>Catálogo de productos</h2>
              </div>
              <span className="products-result-count">{filtrados.length} resultados</span>
            </div>

            <input
              className="search-input products-search"
              type="search"
              placeholder="Buscar por nombre, categoría o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar productos"
            />

            <div className="products-filters">
              <label>
                Categoría
                <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
                  <option value="Todas">Todas las categorías</option>
                  {categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}
                </select>
              </label>
              <label>
                Existencias
                <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                  <option>Todos</option>
                  <option>Disponible</option>
                  <option>Stock bajo</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="panel products-empty">Cargando productos...</div>
          ) : filtrados.length > 0 ? (
            <div className="product-grid">
              {filtrados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onEdit={editar}
                  onDelete={eliminar}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state products-empty">
              <strong>No se encontraron productos</strong>
              <p>Prueba con otra búsqueda o cambia los filtros seleccionados.</p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setSearch('')
                  setCategoriaFiltro('Todas')
                  setEstadoFiltro('Todos')
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Inventario() {
  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [productoId, setProductoId] = useState('')
  const [tipo, setTipo] = useState('entrada')
  const [cantidad, setCantidad] = useState(1)
  const [observacion, setObservacion] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    try {
      setLoading(true)
      const [p, m] = await Promise.all([api.getProductos(), api.getMovimientos()])
      setProductos(p)
      setMovimientos(m)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { cargar() }, [])

  const registrar = async (e) => {
    e.preventDefault()
    setError(''); setMessage('')
    try {
      const result = await api.registrarMovimiento({ productoId: Number(productoId), tipo, cantidad: Number(cantidad), observacion })
      setMessage(result.message || 'Movimiento registrado.')
      setProductoId(''); setCantidad(1); setObservacion('')
      await cargar()
    } catch (err) { setError(err.message) }
  }

  const stockBajo = productos.filter((p) => Number(p.stock) <= 5).length
  const unidades = productos.reduce((sum, p) => sum + Number(p.stock || 0), 0)
  const seleccionado = productos.find((p) => p.id === Number(productoId))

  return (
    <section>
      <PageHeader eyebrow="CONTROL" title="Inventario" description="Controla las existencias, registra entradas y salidas y consulta el historial de movimientos." />
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <div className="stat-card"><strong>{productos.length}</strong><span>Referencias</span></div>
        <div className="stat-card"><strong>{unidades}</strong><span>Unidades registradas</span></div>
        <div className="stat-card"><strong>{stockBajo}</strong><span>Stock bajo (5 o menos)</span></div>
      </div>

      <form className="panel form-panel inventory-movement-form" onSubmit={registrar}>
        <h2>Registrar movimiento de inventario</h2>
        <p>Usa una entrada cuando llegue mercancía y una salida para ajustes o retiros que no sean ventas.</p>
        <div className="form-row">
          <label>Producto
            <select value={productoId} onChange={(e) => setProductoId(e.target.value)} required>
              <option value="">Seleccionar producto...</option>
              {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre} — stock: {p.stock} {p.unidad}</option>)}
            </select>
          </label>
          <label>Tipo de movimiento
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="entrada">Entrada de mercancía</option><option value="salida">Salida / ajuste</option></select>
          </label>
          <label>Cantidad
            <input type="number" min="1" step="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
          </label>
        </div>
        {seleccionado && <p className="inventory-current-stock">Existencia actual: <strong>{seleccionado.stock} {seleccionado.unidad}</strong></p>}
        <label>Observación (opcional)
          <input value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Ej. Llegada de pedido del proveedor" maxLength="180" />
        </label>
        <button className="primary-button" type="submit">Registrar {tipo}</button>
      </form>

      <div className="panel table-panel">
        <h2>Existencias actuales</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Producto</th><th>Categoría</th><th>Unidad</th><th>Stock</th><th>Estado</th></tr></thead>
          <tbody>{productos.map((p) => <tr key={p.id}><td>{p.nombre}</td><td>{p.categoria}</td><td>{p.unidad}</td><td>{p.stock}</td><td><span className={Number(p.stock) <= 5 ? 'status low' : 'status ok'}>{Number(p.stock) <= 5 ? 'Stock bajo' : 'Disponible'}</span></td></tr>)}</tbody>
        </table></div>
      </div>

      <div className="panel table-panel">
        <div className="section-heading-inline"><h2>Historial de movimientos</h2><span>{movimientos.length} registros</span></div>
        <div className="table-scroll"><table>
          <thead><tr><th>Fecha</th><th>Movimiento</th><th>Producto</th><th>Cantidad</th><th>Existencia</th><th>Observación</th></tr></thead>
          <tbody>{movimientos.length ? movimientos.map((m) => <tr key={m.id}><td>{new Date(m.fecha).toLocaleString('es-CO')}</td><td><span className={`status ${m.tipo === 'entrada' ? 'ok' : m.tipo === 'salida' ? 'low' : 'neutral'}`}>{m.tipo === 'entrada' ? 'Entrada' : m.tipo === 'venta' ? 'Venta' : 'Salida'}</span></td><td>{m.productoNombre}</td><td>{m.cantidad} {m.unidad}</td><td>{m.stockAnterior} → <strong>{m.stockNuevo}</strong></td><td>{m.observacion}</td></tr>) : <tr><td colSpan="6">Todavía no hay movimientos registrados.</td></tr>}</tbody>
        </table></div>
      </div>
      {loading && <p className="muted">Actualizando inventario...</p>}
    </section>
  )
}
function Clientes() {
  const empty = { nombre: '', documento: '', telefono: '', correo: '' }
  const [clientes, setClientes] = useState([])
  const [ventas, setVentas] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [clienteHistorialId, setClienteHistorialId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const cargar = async () => {
    try { const [c, v] = await Promise.all([api.getClientes(), api.getVentas()]); setClientes(c); setVentas(v) }
    catch (e) { setError(e.message) }
  }
  useEffect(() => { cargar() }, [])
  const submit = async (e) => {
    e.preventDefault(); setError(''); setMessage('')
    try {
      if (editingId !== null) { await api.actualizarCliente(editingId, form); setMessage('Cliente actualizado correctamente.') }
      else { await api.crearCliente(form); setMessage('Cliente creado correctamente.') }
      setForm(empty); setEditingId(null); await cargar()
    } catch (e) { setError(e.message) }
  }
  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return
    try { await api.eliminarCliente(id); setMessage('Cliente eliminado. Las ventas anteriores se conservan.'); await cargar() }
    catch (e) { setError(e.message) }
  }
  const ventasCliente = ventas.filter((v) => Number(v.clienteId) === Number(clienteHistorialId))
  const totalCliente = ventasCliente.reduce((sum, v) => sum + Number(v.total), 0)
  return (
    <section>
      <PageHeader eyebrow="CLIENTES" title="Clientes" description="Registra clientes y consulta su historial de compras." />
      {message && <div className="alert success">{message}</div>}{error && <div className="alert error">{error}</div>}
      <div className="two-column">
        <form className="panel form-panel" onSubmit={submit}>
          <h2>{editingId !== null ? 'Editar cliente' : 'Nuevo cliente'}</h2>
          <label>Nombre<input value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required maxLength="100" /></label>
          <label>Documento<input value={form.documento} onChange={(e) => setForm({...form, documento: e.target.value})} required maxLength="30" /></label>
          <label>Teléfono<input value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} maxLength="30" /></label>
          <label>Correo<input type="email" value={form.correo} onChange={(e) => setForm({...form, correo: e.target.value})} /></label>
          <div className="button-row"><button className="primary-button">{editingId !== null ? 'Guardar cambios' : 'Guardar cliente'}</button>{editingId !== null && <button className="secondary-button" type="button" onClick={() => {setEditingId(null); setForm(empty)}}>Cancelar</button>}</div>
        </form>
        <div className="panel table-panel"><h2>Clientes registrados</h2><div className="table-scroll"><table>
          <thead><tr><th>Nombre</th><th>Documento</th><th>Teléfono</th><th>Compras</th><th>Total comprado</th><th>Acciones</th></tr></thead>
          <tbody>{clientes.map((c) => { const compras = ventas.filter((v) => Number(v.clienteId) === Number(c.id)); const total = compras.reduce((s,v) => s + Number(v.total),0); return <tr key={c.id}><td>{c.nombre}</td><td>{c.documento}</td><td>{c.telefono || '—'}</td><td>{compras.length}</td><td>${total.toLocaleString('es-CO')}</td><td><button className="small-button" onClick={() => {setEditingId(c.id); setForm({nombre:c.nombre||'',documento:c.documento||'',telefono:c.telefono||'',correo:c.correo||''})}}>Editar</button><button className="small-button" onClick={() => setClienteHistorialId(String(c.id))}>Historial</button><button className="small-button danger" onClick={() => eliminar(c.id)}>Eliminar</button></td></tr> })}</tbody>
        </table></div></div>
      </div>
      {clienteHistorialId && <div className="panel table-panel client-history"><div className="section-heading-inline"><h2>Historial de compras: {clientes.find(c => c.id === Number(clienteHistorialId))?.nombre}</h2><button className="secondary-button" onClick={() => setClienteHistorialId('')}>Cerrar</button></div><p><strong>{ventasCliente.length}</strong> ventas · <strong>${totalCliente.toLocaleString('es-CO')}</strong> en compras</p><div className="table-scroll"><table><thead><tr><th>Fecha</th><th>Productos</th><th>Total</th></tr></thead><tbody>{ventasCliente.map(v => <tr key={v.id}><td>{new Date(v.fecha).toLocaleString('es-CO')}</td><td>{v.items?.map(i => `${i.nombre} × ${i.cantidad}`).join(', ')}</td><td>${Number(v.total).toLocaleString('es-CO')}</td></tr>)}{!ventasCliente.length && <tr><td colSpan="3">Este cliente todavía no tiene compras registradas.</td></tr>}</tbody></table></div></div>}
    </section>
  )
}
function Ventas() {
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [items, setItems] = useState([])
  const [ventas, setVentas] = useState([])
  const [ventaDetalle, setVentaDetalle] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const cargar = async () => { try { const [p,c,v] = await Promise.all([api.getProductos(),api.getClientes(),api.getVentas()]); setProductos(p);setClientes(c);setVentas(v) } catch(e){setError(e.message)} }
  useEffect(() => { cargar() }, [])
  const agregar = () => {
    const p = productos.find((x) => x.id === Number(productoId)); const qty = Number(cantidad)
    if (!p) return setError('Selecciona un producto.')
    const yaAgregado = items.filter(x => x.productoId === p.id).reduce((s,x) => s + x.cantidad,0)
    if (!Number.isInteger(qty) || qty < 1 || qty + yaAgregado > Number(p.stock)) return setError(`La cantidad supera las existencias disponibles. Stock: ${p.stock}; ya agregado: ${yaAgregado}.`)
    setItems([...items,{productoId:p.id,nombre:p.nombre,cantidad:qty,precio:Number(p.precio),subtotal:Number(p.precio)*qty}]);setProductoId('');setCantidad(1);setError('')
  }
  const quitar = (index) => setItems(items.filter((_,i)=>i!==index))
  const total = items.reduce((sum,item)=>sum+item.subtotal,0)
  const registrar = async () => {
    if (!items.length) return setError('Agrega al menos un producto.')
    try { await api.crearVenta({clienteId:clienteId?Number(clienteId):null,items,total});setMessage('Venta registrada y existencias actualizadas.');setItems([]);setClienteId('');await cargar() }
    catch(e){setError(e.message)}
  }
  const imprimir = (v) => { setVentaDetalle(v); setTimeout(() => window.print(), 100) }
  return (
    <section>
      <PageHeader eyebrow="VENTAS" title="Registrar venta" description="Registra ventas, descuenta las existencias y consulta el detalle de cada operación." />
      {message && <div className="alert success">{message}</div>}{error && <div className="alert error">{error}</div>}
      <div className="panel form-panel"><h2>Nueva venta</h2><div className="form-row">
        <label>Cliente<select value={clienteId} onChange={e=>setClienteId(e.target.value)}><option value="">Venta general / mostrador</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label>
        <label>Producto<select value={productoId} onChange={e=>setProductoId(e.target.value)}><option value="">Seleccionar...</option>{productos.map(p=><option key={p.id} value={p.id} disabled={Number(p.stock)<=0}>{p.nombre} — stock: {p.stock} {p.unidad}</option>)}</select></label>
        <label>Cantidad<input type="number" min="1" step="1" value={cantidad} onChange={e=>setCantidad(e.target.value)} /></label>
      </div><button className="primary-button" onClick={agregar}>Agregar producto</button></div>
      <div className="panel table-panel"><h2>Detalle de venta</h2><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead><tbody>{items.map((it,i)=><tr key={`${it.productoId}-${i}`}><td>{it.nombre}</td><td>{it.cantidad}</td><td>${it.precio.toLocaleString('es-CO')}</td><td>${it.subtotal.toLocaleString('es-CO')}</td><td><button className="small-button danger" onClick={()=>quitar(i)}>Quitar</button></td></tr>)}{!items.length&&<tr><td colSpan="5">Agrega productos para calcular la venta.</td></tr>}</tbody></table></div><div className="total-line">Total: ${total.toLocaleString('es-CO')}</div><button className="primary-button" onClick={registrar} disabled={!items.length}>Registrar venta</button></div>
      <div className="panel table-panel"><h2>Ventas registradas</h2><div className="table-scroll"><table><thead><tr><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Acciones</th></tr></thead><tbody>{ventas.map(v=><tr key={v.id}><td>{new Date(v.fecha).toLocaleString('es-CO')}</td><td>{v.clienteNombre||'Venta general'}</td><td>{v.items?.length||0}</td><td>${Number(v.total).toLocaleString('es-CO')}</td><td><button className="small-button" onClick={()=>setVentaDetalle(v)}>Ver detalle</button><button className="small-button" onClick={()=>imprimir(v)}>Comprobante</button></td></tr>)}</tbody></table></div></div>
      {ventaDetalle && <div className="panel table-panel receipt-panel"><div className="section-heading-inline"><h2>Detalle de venta #{ventaDetalle.id}</h2><button className="secondary-button no-print" onClick={()=>setVentaDetalle(null)}>Cerrar</button></div><p><strong>Fecha:</strong> {new Date(ventaDetalle.fecha).toLocaleString('es-CO')}</p><p><strong>Cliente:</strong> {ventaDetalle.clienteNombre||'Venta general'}</p><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>{ventaDetalle.items?.map((it,i)=><tr key={i}><td>{it.nombre}</td><td>{it.cantidad}</td><td>${Number(it.precio).toLocaleString('es-CO')}</td><td>${Number(it.subtotal).toLocaleString('es-CO')}</td></tr>)}</tbody></table></div><div className="total-line">Total: ${Number(ventaDetalle.total).toLocaleString('es-CO')}</div><button className="primary-button no-print" onClick={()=>window.print()}>Imprimir comprobante</button></div>}
    </section>
  )
}
function Cotizaciones() {
  const [productos,setProductos]=useState([]);const [clientes,setClientes]=useState([]);const [clienteId,setClienteId]=useState('');const [productoId,setProductoId]=useState('');const [cantidad,setCantidad]=useState(1);const [items,setItems]=useState([]);const [cotizaciones,setCotizaciones]=useState([]);const [message,setMessage]=useState('');const [error,setError]=useState('')
  const cargar=async()=>{try{const [p,c,q]=await Promise.all([api.getProductos(),api.getClientes(),api.getCotizaciones()]);setProductos(p);setClientes(c);setCotizaciones(q)}catch(e){setError(e.message)}}
  useEffect(()=>{cargar()},[])
  const agregar=()=>{const p=productos.find(x=>x.id===Number(productoId));const qty=Number(cantidad);if(!p)return setError('Selecciona un producto.');if(!Number.isInteger(qty)||qty<1)return setError('La cantidad debe ser un número entero mayor que cero.');setItems([...items,{productoId:p.id,nombre:p.nombre,cantidad:qty,precio:Number(p.precio),subtotal:Number(p.precio)*qty}]);setProductoId('');setCantidad(1);setError('')}
  const total=items.reduce((s,x)=>s+x.subtotal,0)
  const guardar=async()=>{if(!items.length)return setError('Agrega al menos un producto.');try{await api.crearCotizacion({clienteId:clienteId?Number(clienteId):null,items,total});setMessage('Cotización guardada. No se modificó el inventario.');setItems([]);setClienteId('');await cargar()}catch(e){setError(e.message)}}
  const cambiarEstado=async(id,estado)=>{try{await api.actualizarEstadoCotizacion(id,estado);setMessage(`Cotización marcada como ${estado}.`);await cargar()}catch(e){setError(e.message)}}
  const convertir=async(id)=>{if(!window.confirm('¿Convertir esta cotización en una venta? Se descontarán las existencias.'))return;try{await api.convertirCotizacion(id);setMessage('Cotización convertida en venta y stock actualizado.');await cargar()}catch(e){setError(e.message)}}
  return <section><PageHeader eyebrow="COTIZACIONES" title="Cotizaciones" description="Prepara propuestas para los clientes, administra su estado y conviértelas en ventas cuando sean aprobadas." />{message&&<div className="alert success">{message}</div>}{error&&<div className="alert error">{error}</div>}
    <div className="panel form-panel"><h2>Nueva cotización</h2><div className="form-row"><label>Cliente<select value={clienteId} onChange={e=>setClienteId(e.target.value)}><option value="">Sin cliente</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label><label>Producto<select value={productoId} onChange={e=>setProductoId(e.target.value)}><option value="">Seleccionar...</option>{productos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select></label><label>Cantidad<input type="number" min="1" step="1" value={cantidad} onChange={e=>setCantidad(e.target.value)} /></label></div><button className="primary-button" onClick={agregar}>Agregar producto</button></div>
    <div className="panel table-panel"><h2>Detalle de cotización</h2><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead><tbody>{items.map((it,i)=><tr key={i}><td>{it.nombre}</td><td>{it.cantidad}</td><td>${it.precio.toLocaleString('es-CO')}</td><td>${it.subtotal.toLocaleString('es-CO')}</td><td><button className="small-button danger" onClick={()=>setItems(items.filter((_,idx)=>idx!==i))}>Quitar</button></td></tr>)}{!items.length&&<tr><td colSpan="5">Agrega productos para preparar la cotización.</td></tr>}</tbody></table></div><div className="total-line">Total: ${total.toLocaleString('es-CO')}</div><button className="primary-button" onClick={guardar} disabled={!items.length}>Guardar cotización</button></div>
    <div className="panel table-panel"><h2>Cotizaciones registradas</h2><div className="table-scroll"><table><thead><tr><th>Fecha</th><th>Cliente</th><th>Detalle</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{cotizaciones.map(q=><tr key={q.id}><td>{new Date(q.fecha).toLocaleString('es-CO')}</td><td>{q.clienteNombre||'Sin cliente'}</td><td>{q.items?.map(i=>`${i.nombre} × ${i.cantidad}`).join(', ')}</td><td>${Number(q.total).toLocaleString('es-CO')}</td><td><span className={`status ${q.estado==='aprobada'?'ok':q.estado==='rechazada'?'low':'neutral'}`}>{q.estado}</span></td><td><div className="table-actions">{q.estado!=='convertida'&&q.estado!=='rechazada'&&<><button className="small-button" onClick={()=>cambiarEstado(q.id,'aprobada')}>Aprobar</button><button className="small-button danger" onClick={()=>cambiarEstado(q.id,'rechazada')}>Rechazar</button><button className="small-button" onClick={()=>convertir(q.id)}>Convertir en venta</button></>}</div></td></tr>)}</tbody></table></div><p className="muted">Aprobar o rechazar una cotización no modifica el inventario. El stock se descuenta únicamente al convertirla en venta.</p></div>
  </section>
}
function Reportes() {
  const [data,setData]=useState({productos:[],clientes:[],ventas:[],cotizaciones:[]});const [error,setError]=useState('')
  useEffect(()=>{Promise.all([api.getProductos(),api.getClientes(),api.getVentas(),api.getCotizaciones()]).then(([productos,clientes,ventas,cotizaciones])=>setData({productos,clientes,ventas,cotizaciones})).catch(e=>setError(e.message))},[])
  const totalVentas=data.ventas.reduce((s,v)=>s+Number(v.total||0),0)
  const valorInventario=data.productos.reduce((s,p)=>s+Number(p.precio||0)*Number(p.stock||0),0)
  const unidades=data.productos.reduce((s,p)=>s+Number(p.stock||0),0)
  const bajo=data.productos.filter(p=>Number(p.stock)<=5)
  const topProductos=Object.values(data.ventas.flatMap(v=>v.items||[]).reduce((acc,it)=>{const k=it.productoId;acc[k]??={nombre:it.nombre,cantidad:0,total:0};acc[k].cantidad+=Number(it.cantidad);acc[k].total+=Number(it.subtotal);return acc},{})).sort((a,b)=>b.cantidad-a.cantidad).slice(0,5)
  const maxTop=Math.max(1,...topProductos.map(x=>x.cantidad))
  const cards=[['Productos',data.productos.length],['Clientes',data.clientes.length],['Ventas registradas',data.ventas.length],['Cotizaciones',data.cotizaciones.length],['Unidades en inventario',unidades],['Valor inventario',`$${valorInventario.toLocaleString('es-CO')}`],['Total vendido',`$${totalVentas.toLocaleString('es-CO')}`],['Productos con stock bajo',bajo.length]]
  return <section><PageHeader eyebrow="INFORMACIÓN" title="Reportes" description="Consulta los resultados de ventas, el estado del inventario y los productos con mayor movimiento." />{error&&<div className="alert error">{error}</div>}
    <div className="report-grid">{cards.map(([k,v])=><div className="report-card" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
    <div className="two-column report-details"><div className="panel"><h2>Productos más vendidos</h2>{topProductos.length?topProductos.map((p,i)=><div className="report-bar-row" key={i}><div><span>{p.nombre}</span><strong>{p.cantidad} unidades</strong></div><div className="report-bar-track"><i style={{width:`${p.cantidad/maxTop*100}%`}} /></div></div>):<p>Aún no hay ventas suficientes para mostrar este indicador.</p>}</div>
    <div className="panel"><h2>Productos que necesitan reposición</h2>{bajo.length?bajo.map(p=><div className="low-stock-row" key={p.id}><span>{p.nombre}</span><strong>{p.stock} {p.unidad}</strong></div>):<p>Todos los productos tienen existencias superiores al mínimo de 5.</p>}</div></div>
    <div className="panel table-panel"><h2>Últimas ventas</h2><div className="table-scroll"><table><thead><tr><th>Fecha</th><th>Cliente</th><th>Total</th></tr></thead><tbody>{[...data.ventas].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).slice(0,10).map(v=><tr key={v.id}><td>{new Date(v.fecha).toLocaleString('es-CO')}</td><td>{v.clienteNombre||'Venta general'}</td><td>${Number(v.total).toLocaleString('es-CO')}</td></tr>)}</tbody></table></div></div>
  </section>
}
function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const entrar = (e) => {
    e.preventDefault()
    if (usuario === 'admin' && clave === '1234') {
      localStorage.setItem('multitienda_logged', 'true')
      onLogin()
      navigate('/')
    } else {
      setError('Usuario o contraseña incorrectos. Demo: admin / 1234')
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={entrar}>
        <p className="eyebrow">MULTITIENDA PVC</p>
        <h1>Iniciar sesión</h1>
        <p>Acceso de demostración.</p>
        {error && <div className="alert error">{error}</div>}
        <label>Usuario
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        </label>
        <label>Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
        </label>
        <button className="primary-button">Ingresar</button>
        <small>Demo: admin / 1234</small>
      </form>
    </div>
  )
}

function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}

function App() {
  const [logged, setLogged] = useState(
    localStorage.getItem('multitienda_logged') === 'true'
  )

  const logout = () => {
    localStorage.removeItem('multitienda_logged')
    setLogged(false)
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setLogged(true)} />} />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout onLogout={logout}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/cotizaciones" element={<Cotizaciones />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App