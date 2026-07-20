// Busca portadas en Open Library por ISBN o por título+autor, y guarda el resultado
// en src/data/covers.json (que actúa de caché: solo consulta lo que falta).
// Se ejecuta automáticamente antes de cada build (`npm run build`),
// o a mano con `npm run covers`.
import { readFile, writeFile } from "node:fs/promises"

const booksPath = new URL("../src/data/books.json", import.meta.url)
const coversPath = new URL("../src/data/covers.json", import.meta.url)

const books = JSON.parse(await readFile(booksPath, "utf8"))
let covers = {}
try {
  covers = JSON.parse(await readFile(coversPath, "utf8"))
} catch {}

const opts = { headers: { "User-Agent": "web-personal-cenybar (cenybar@gmail.com)" } }

function stripAccents(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

async function search(params) {
  try {
    const qs = new URLSearchParams({ ...params, limit: "5", fields: "title,author_name,cover_i" })
    const res = await fetch(`https://openlibrary.org/search.json?${qs}`, opts)
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.find((d) => d.cover_i)?.cover_i ?? null
  } catch {
    return null
  }
}

for (const b of books) {
  const key = `${b.titulo}|${b.autor}`

  if (covers[key]) continue
  if (b.isbn) {
    covers[key] = `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`
    continue
  }

  const authorLast = b.autor.split("/").pop().trim().split(" ").pop()
  const titleClean = stripAccents(b.titulo)

  let id = await search({ title: b.titulo, author: b.autor })
  if (!id) id = await search({ q: `${b.titulo} ${b.autor}` })
  if (!id) id = await search({ title: titleClean, author: stripAccents(b.autor) })
  if (!id) id = await search({ q: `${titleClean} ${authorLast}` })
  if (!id) id = await search({ title: b.titulo })

  covers[key] = id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null
  console.log(`${id ? "OK " : "-- "}${b.titulo}`)
  await new Promise((r) => setTimeout(r, 300))
}

await writeFile(coversPath, JSON.stringify(covers, null, 2) + "\n")
console.log("covers.json actualizado")
