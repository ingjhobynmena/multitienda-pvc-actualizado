import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// En producción se puede indicar una carpeta persistente mediante DATA_DIR.
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data')

const filesByResource = {
  productos: 'productos.json',
  clientes: 'clientes.json',
  ventas: 'ventas.json',
  cotizaciones: 'cotizaciones.json',
  movimientos: 'movimientos.json'
}

// Obtiene la ruta del archivo JSON correspondiente al recurso.
function getFilePath(resource) {
  const fileName = filesByResource[resource]

  if (!fileName) {
    throw new Error(`Recurso no configurado: ${resource}`)
  }

  return path.join(DATA_DIR, fileName)
}

// Lee todos los registros.
export async function getAll(resource) {
  const destination = getFilePath(resource)
  try {
    const content = await fs.readFile(destination, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error

    // Si se usa un disco persistente vacío, copiamos los datos iniciales del proyecto.
    const initialFile = path.join(__dirname, '..', 'data', filesByResource[resource])
    if (path.resolve(initialFile) === path.resolve(destination)) throw error
    await fs.mkdir(DATA_DIR, { recursive: true })
    const initialContent = await fs.readFile(initialFile, 'utf8')
    await fs.writeFile(destination, initialContent, 'utf8')
    return JSON.parse(initialContent)
  }
}

// Guarda todos los registros.
export async function saveAll(resource, records) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const destination = getFilePath(resource)
  const temporary = `${destination}.tmp`
  await fs.writeFile(temporary, JSON.stringify(records, null, 2), 'utf8')
  await fs.rename(temporary, destination)
}

// Busca un registro por id.
export async function getById(resource, id) {
  const records = await getAll(resource)
  return records.find((record) => record.id === Number(id))
}

// Genera un id sencillo para el prototipo.
export function nextId(records) {
  return records.length
    ? Math.max(...records.map((record) => Number(record.id))) + 1
    : 1
}