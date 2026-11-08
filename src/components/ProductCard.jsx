function ProductCard({ producto, onEdit, onDelete }) {
  const stockBajo = Number(producto.stock) <= 5

  return (
    <article className="product-card">
      <div className={`product-image ${stockBajo ? 'product-image-low' : ''}`}>
        {producto.imagen ? (
          <img
            src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')}${producto.imagen}`}
            alt={producto.nombre}
            loading="lazy"
          />
        ) : (
          <span>{producto.categoria}</span>
        )}
        {stockBajo && <span className="product-stock-badge">Stock bajo</span>}
      </div>

      <div className="product-info">
        <p className="product-category">{producto.categoria}</p>
        <h3>{producto.nombre}</h3>
        <p className="product-description">
          {producto.descripcion || 'Sin descripción registrada.'}
        </p>

        <div className="product-data">
          <strong>${Number(producto.precio).toLocaleString('es-CO')}</strong>
          <span className={stockBajo ? 'product-stock-low' : ''}>
            Stock: {producto.stock} {producto.unidad}
          </span>
        </div>

        <div className="card-actions">
          {onEdit && (
            <button type="button" className="small-button" onClick={() => onEdit(producto)}>
              Editar
            </button>
          )}
          {onDelete && (
            <button type="button" className="small-button danger" onClick={() => onDelete(producto.id)}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
