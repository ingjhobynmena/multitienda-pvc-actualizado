# Multitienda PVC

Este proyecto es una aplicación web para organizar algunas tareas de Multitienda PVC: productos, inventario, clientes, ventas y cotizaciones.

## ¿Qué se usó?

- React y Vite para el frontend.
- React Router para cambiar entre las páginas.
- Node.js y Express para el backend.
- Archivos JSON para guardar los datos.
- Postman para probar la API.

## Carpetas principales

```text
multitienda-pvc-final/
├── backend/
│   ├── controllers/
│   ├── data/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── src/
│   ├── components/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postman_collection.json
└── README.md
```

## Cómo abrir el proyecto

### 1. Frontend

Abre una terminal en la carpeta principal del proyecto y ejecuta:

```bash
npm install
npm run dev
```

Luego abre:

```text
http://localhost:5173
```

### 2. Backend

Abre otra terminal en la misma carpeta y entra a `backend`:

```bash
cd backend
npm install
npm run dev
```

El backend queda en:

```text
http://localhost:3001
```

La API empieza en:

```text
http://localhost:3001/api
```

El frontend necesita que el backend esté encendido para cargar productos, clientes, ventas, cotizaciones y los datos del inicio.

## Inicio de sesión

Para entrar al sistema se puede usar:

```text
Usuario: admin
Contraseña: 1234
```

Es un acceso de demostración para el proyecto.

## ¿Qué se puede hacer?

### Productos
- Crear, editar y eliminar productos.
- Buscar por nombre, categoría o descripción y filtrar por categoría y existencias.
- Subir fotografías desde el computador, ver una vista previa y cambiar o quitar la imagen.
- Consultar indicadores de productos, stock bajo y valor del inventario.

### Inventario
- Consultar las existencias y detectar productos con 5 unidades o menos.
- Registrar entradas de mercancía y salidas o ajustes manuales.
- Consultar el historial con fecha, producto, tipo, cantidad y existencias antes/después.
- Las ventas y las conversiones de cotizaciones también generan movimientos de salida.

### Ventas
- Seleccionar un cliente o registrar una venta de mostrador.
- Agregar varios productos, validar cantidades y calcular subtotales y total.
- Descontar automáticamente las existencias.
- Consultar el detalle de una venta e imprimir un comprobante.

### Cotizaciones
- Preparar cotizaciones para clientes sin afectar el inventario.
- Marcar una cotización como pendiente, aprobada o rechazada.
- Convertir una cotización aprobada o pendiente en venta; al hacerlo, se valida el stock y se descuenta automáticamente.
- Una cotización convertida no se puede convertir por segunda vez.

### Clientes
- Registrar, editar y eliminar clientes.
- Consultar cuántas compras ha realizado cada cliente y el valor acumulado.
- Ver el historial de compras de cada cliente.

### Reportes
- Ver el resumen de productos, clientes, ventas, cotizaciones y valor del inventario.
- Consultar el total vendido, unidades en inventario y productos con stock bajo.
- Ver los productos más vendidos y las últimas ventas.

## Postman

La colección de pruebas está en:

```text
postman_collection.json
```

Se puede importar en Postman para probar las rutas de la API.

## Variables de entorno

El frontend tiene un archivo `.env.example` con:

```text
VITE_API_URL=http://localhost:3001/api
```

El backend tiene otro dentro de `backend/`:

```text
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Para trabajar localmente se pueden usar esos valores.




## Publicación en internet (Vercel + Render)

### Backend en Render
1. Sube los cambios del proyecto a GitHub.
2. En Render crea un servicio **Web Service** conectado al repositorio.
3. Configura `Root Directory` como `backend`, `Build Command` como `npm install` y `Start Command` como `npm start`.
4. Agrega `NODE_ENV=production`, `CORS_ORIGIN=https://TU-FRONTEND.vercel.app` y `DATA_DIR=/var/data`.
5. Si el plan contratado permite disco persistente, móntalo en `/var/data`. El plan gratuito de Render no garantiza persistencia de archivos; los JSON pueden reiniciarse o perderse al volver a desplegar. Para datos reales se recomienda una base de datos administrada.
6. Comprueba `https://TU-BACKEND.onrender.com/api/health`.

### Frontend en Vercel
1. Crea un proyecto en Vercel conectado al mismo repositorio.
2. Deja `Root Directory` en la carpeta principal.
3. Agrega la variable `VITE_API_URL=https://TU-BACKEND.onrender.com/api`.
4. Usa `npm run build` como comando de compilación y `dist` como directorio de salida.
5. Cuando tengas el dominio final, actualiza `CORS_ORIGIN` en Render con ese dominio y vuelve a desplegar el backend.

El archivo `vercel.json` permite que las rutas de React Router funcionen al actualizar una página. El archivo `render.yaml` deja preparada la configuración inicial del backend.

### Pruebas antes de entregar
- Abrir la dirección pública del frontend e iniciar sesión.
- Consultar productos e inventario.
- Crear y editar un producto de prueba.
- Registrar un cliente de prueba.
- Crear una cotización y comprobar que no descuente stock.
- Registrar una venta de prueba y comprobar que descuente stock.
- Revisar el inicio y los reportes.

> El inicio de sesión actual es únicamente de demostración (`admin / 1234`). No debe utilizarse para proteger información real ni para un negocio en producción.


## Fotografías de productos

El módulo de productos permite seleccionar una fotografía desde el computador al crear o editar un producto. Se muestra una vista previa antes de guardar y la imagen queda asociada al producto para mostrarse en su tarjeta.

- Formatos permitidos: JPG, PNG, WEBP y GIF.
- Tamaño máximo: 5 MB por imagen.
- Las imágenes se guardan en `backend/uploads/`.
- La ruta de cada imagen queda registrada en `backend/data/productos.json`.
- Al reemplazar o eliminar un producto, el sistema también limpia la fotografía anterior asociada.

### Instalar y ejecutar el backend después de esta actualización

Desde una terminal:

```bash
cd backend
npm install
npm run dev
```

En otra terminal, desde la carpeta principal:

```bash
npm install
npm run dev
```

Antes de reemplazar una versión anterior del proyecto, conserva una copia de `backend/data/` y, si ya tienes fotografías guardadas, también de `backend/uploads/`. No elimines esas carpetas: contienen los datos de tu tienda y las imágenes.


## Notas de esta versión
- Se añadió el producto **velo dorada** con 4 unidades para que el catálogo inicial coincida con las 13 referencias compartidas en la última revisión. El precio de $12.000 se tomó del valor total de inventario que aparecía en el reporte ($41.142.000). Puedes modificarlo desde Productos si el precio real es diferente.
- El historial de movimientos comienza a registrar los movimientos nuevos de esta versión. Las ventas anteriores se conservan en `ventas.json`, pero no se reconstruyen movimientos antiguos que no estaban guardados.
- Antes de sustituir una carpeta de proyecto que ya estés usando, haz una copia de `backend/data/` y `backend/uploads/`. Después puedes copiar tus datos anteriores sobre los archivos de esta versión, conservando `movimientos.json` si ya tiene registros.
- Para trabajar localmente, instala dependencias en la carpeta principal y en `backend`: `npm install` en cada una. No es necesario copiar `node_modules`; se genera al instalar.
