import type { Libro, Versiculo } from '../types/bible'

const URL_BASE = 'https://bible.helloao.org/api/spa_pdt'

type RespuestaLibros = {
  books: Libro[]
}

type RespuestaCapitulo = {
  chapter: {
    content: Array<
      | {
          type: 'heading'
          text: string
        }
      | Versiculo
    >
  }
}

export async function obtenerLibros(): Promise<Libro[]> {
  const respuesta = await fetch(`${URL_BASE}/books.json`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los libros')
  }

  const datos: RespuestaLibros = await respuesta.json()

  return datos.books
}

export async function obtenerCapitulo(
  idLibro: string,
  numeroCapitulo: number
): Promise<Versiculo[]> {
  const respuesta = await fetch(
    `${URL_BASE}/${idLibro}/${numeroCapitulo}.simple.json`
  )

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el capítulo')
  }

  const datos: RespuestaCapitulo = await respuesta.json()

  const versiculos = datos.chapter.content.filter(
    (elemento): elemento is Versiculo =>
      elemento.type === 'verse'
  )

  return versiculos
}