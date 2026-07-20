// Busca portadas en Open Library por título y autor, y guarda el resultado
// en src/data/covers.json (que actúa de caché: solo consulta lo que falta).
// Se ejecuta automáticamente antes de cada build (`npm run build`),
// o a mano con `npm run covers`.
import { readFile, writeFile } from 'node:fs/promises';

const booksPath = new URL('../src/data/books.json', import.meta.url);
const coversPath = new URL('../src/data/covers.json', import.meta.url);

const books = JSON.parse(await readFile(booksPath, 'utf8'));
let covers = {};
try {
  covers = JSON.parse(await readFile(coversPath, 'utf8'));
} catch {}

const opts = { headers: { 'User-Agent': 'web-personal-cenybar (cenybar@gmail.com)' } };

async function search(params) {
  try {
    const qs = new URLSearchParams({ ...params, limit: '5', fields: 'title,cover_i' });
    const res = await fetch(`https://openlibrary.org/search.json?${qs}`, opts);
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.find((d) => d.cover_i)?.cover_i ?? null;
  } catch {
    return null;
  }
}

for (const b of books) {
  const key = `${b.titulo}|${b.autor}`;
  if (b.isbn) {
    covers[key] = `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`;
    continue;
  }
  if (covers[key]) continue; // ya resuelta

  let id = await search({ title: b.titulo, author: b.autor });
  if (!id) id = await search({ q: `${b.titulo} ${b.autor}` });
  covers[key] = id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null;
  console.log(`${id ? 'OK ' : '-- '}${b.titulo}`);
  await new Promise((r) => setTimeout(r, 300)); // ser amables con la API
}

await writeFile(coversPath, JSON.stringify(covers, null, 2) + '\n');
console.log('covers.json actualizado');
