import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

import Auth from './Auth'
import Home from './Home'
import DevocionalForm from './DevocionalForm'
import MisDevocionales from './MisDevocionales'
import Favoritos from './Favoritos'
import Perfil from './Perfil'

import { supabase } from './lib/supabase'

import type { Libro } from './types/bible'
import {
  obtenerCapitulo,
  obtenerLibros,
} from './services/bibleApi'

function App() {
  const [usuario, setUsuario] = useState<User | null>(null)

  const [pagina, setPagina] = useState<
    'inicio' | 'nuevo' | 'mis' | 'favoritos' | 'perfil'
  >('inicio')

  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('modoOscuro') === 'true'
  })

  const [libros, setLibros] = useState<Libro[]>([])
  const [versiculo, setVersiculo] = useState('')
  const [referencia, setReferencia] = useState('')
  const [lectura, setLectura] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  // Aplicar modo oscuro
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      modoOscuro
    )

    localStorage.setItem(
      'modoOscuro',
      String(modoOscuro)
    )
  }, [modoOscuro])

  // Comprobar si existe una sesión al iniciar la aplicación
  useEffect(() => {
    const obtenerSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUsuario(session?.user ?? null)
    }

    obtenerSesion()

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        setUsuario(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Cargar los libros de la Biblia
  useEffect(() => {
    if (!usuario) {
      return
    }

    const cargarLibros = async () => {
      try {
        setError('')

        const librosObtenidos = await obtenerLibros()

        setLibros(librosObtenidos)
      } catch {
        setError(
          'No se pudieron cargar los libros de la Biblia.'
        )
      }
    }

    cargarLibros()
  }, [usuario])

  // Obtener el versículo del día
  const obtenerVersiculo = async () => {
    if (libros.length === 0) {
      return
    }

    try {
      setCargando(true)
      setError('')

      const hoy = new Date()

      // Crear una semilla basada en la fecha
      const fecha =
        hoy.getFullYear() * 10000 +
        (hoy.getMonth() + 1) * 100 +
        hoy.getDate()

      // Crear una parte de la semilla usando
      // el ID único del usuario
      const textoUsuario = usuario?.id ?? ''

      let semillaUsuario = 0

      for (let i = 0; i < textoUsuario.length; i++) {
        semillaUsuario =
          (semillaUsuario * 31 +
            textoUsuario.charCodeAt(i)) %
          100000
      }

      // Combinar la fecha con el usuario
      const semilla = fecha + semillaUsuario

      // Escoger un libro según la fecha y el usuario
      const numeroLibro = semilla % libros.length

      const libro = libros[numeroLibro]

      // Escoger un capítulo según la fecha y el usuario
      const numeroCapitulo =
        (Math.floor(semilla / libros.length) %
          libro.numberOfChapters) + 1

      // Obtener los versículos del capítulo
      const versiculos = await obtenerCapitulo(
        libro.id,
        numeroCapitulo
      )

      if (versiculos.length === 0) {
        throw new Error(
          'El capítulo no contiene versículos.'
        )
      }

      // Escoger un versículo según la fecha y el usuario
      const numeroVersiculo =
        Math.floor(semilla / 100) %
        versiculos.length

      const elemento = versiculos[numeroVersiculo]

      setVersiculo(elemento.text)

      setReferencia(
        `${libro.name} ${numeroCapitulo}:${elemento.number}`
      )

      setLectura(
        `${libro.name} ${numeroCapitulo}`
      )
    } catch {
      setError(
        'Ocurrió un error al obtener el versículo.'
      )
    } finally {
      setCargando(false)
    }
  }

  // Cargar automáticamente el versículo
  useEffect(() => {
    if (libros.length === 0) {
      return
    }

    obtenerVersiculo()
  }, [libros])

  // Cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut()

    setVersiculo('')
    setReferencia('')
    setLectura('')
    setLibros([])
    setPagina('inicio')
  }

  // Si no hay usuario, mostrar autenticación
  if (!usuario) {
    return <Auth />
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#514A45]">

      {/* NAVBAR */}
      <nav className="border-b border-[#E7E2D9] bg-[#FCFBF8]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">

          {/* LOGO */}
          <button
            type="button"
            onClick={() => setPagina('inicio')}
            className="group shrink-0 text-left"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.4em] text-[#8A8179] transition group-hover:text-[#657466]">
              Mi espacio
            </p>

            <p className="mt-0.5 text-lg font-semibold tracking-[0.14em] text-[#514A45] transition group-hover:text-[#657466]">
              DEVOCIONAL
            </p>
          </button>

          {/* NAVEGACIÓN */}
          <div className="flex items-center gap-1 overflow-x-auto">

            {/* INICIO */}
            <button
              type="button"
              onClick={() => setPagina('inicio')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pagina === 'inicio'
                  ? 'bg-[#E8EEE8] font-medium text-[#657466]'
                  : 'text-[#817A74] hover:bg-[#F2F0EB] hover:text-[#514A45]'
              }`}
            >
              Inicio
            </button>

            {/* NUEVO */}
            <button
              type="button"
              onClick={() => setPagina('nuevo')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pagina === 'nuevo'
                  ? 'bg-[#E8EEE8] font-medium text-[#657466]'
                  : 'text-[#817A74] hover:bg-[#F2F0EB] hover:text-[#514A45]'
              }`}
            >
              Nuevo
            </button>

            {/* MIS DEVOCIONALES */}
            <button
              type="button"
              onClick={() => setPagina('mis')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pagina === 'mis'
                  ? 'bg-[#E8EEE8] font-medium text-[#657466]'
                  : 'text-[#817A74] hover:bg-[#F2F0EB] hover:text-[#514A45]'
              }`}
            >
              Mis devocionales
            </button>

            {/* FAVORITOS */}
            <button
              type="button"
              onClick={() =>
                setPagina('favoritos')
              }
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition ${
                pagina === 'favoritos'
                  ? 'bg-[#F1EEE0] font-medium text-[#756B4F]'
                  : 'text-[#817A74] hover:bg-[#F2F0EB] hover:text-[#514A45]'
              }`}
            >
              <span className="text-sm">
                ★
              </span>

              <span>
                Favoritos
              </span>
            </button>

            {/* PERFIL */}
            <button
              type="button"
              onClick={() => setPagina('perfil')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pagina === 'perfil'
                  ? 'bg-[#E8EEE8] font-medium text-[#657466]'
                  : 'text-[#817A74] hover:bg-[#F2F0EB] hover:text-[#514A45]'
              }`}
            >
              Perfil
            </button>

            {/* MODO OSCURO */}
            <button
              type="button"
              onClick={() =>
                setModoOscuro(!modoOscuro)
              }
              aria-label={
                modoOscuro
                  ? 'Activar modo claro'
                  : 'Activar modo oscuro'
              }
              className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E4DED4] text-sm text-[#817A74] transition hover:bg-[#F2F0EB] hover:text-[#514A45]"
            >
              {modoOscuro ? '☀' : '☾'}
            </button>

            {/* SEPARADOR */}
            <div className="mx-2 h-5 w-px bg-[#DED8CE]" />

            {/* SALIR */}
            <button
              type="button"
              onClick={cerrarSesion}
              className="rounded-full px-4 py-2 text-sm text-[#817A74] transition hover:bg-[#F2F0EB] hover:text-[#514A45]"
            >
              Salir
            </button>

          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="mx-auto max-w-6xl">

        {/* INICIO */}
        {pagina === 'inicio' && (
          <Home
            email={usuario.email ?? ''}
            versiculo={versiculo}
            referencia={referencia}
            cargando={cargando}
            error={error}
            onHacerDevocional={() =>
              setPagina('nuevo')
            }
          />
        )}

        {/* NUEVO DEVOCIONAL */}
        {pagina === 'nuevo' && (
          <DevocionalForm
            userId={usuario.id}
            fecha={
              new Date()
                .toISOString()
                .split('T')[0]
            }
            lectura={lectura}
            versiculo={versiculo}
          />
        )}

        {/* MIS DEVOCIONALES */}
        {pagina === 'mis' && (
          <MisDevocionales
            userId={usuario.id}
          />
        )}

        {/* FAVORITOS */}
        {pagina === 'favoritos' && (
          <Favoritos
            userId={usuario.id}
          />
        )}

        {/* PERFIL */}
        {pagina === 'perfil' && (
          <Perfil
            userId={usuario.id}
            email={usuario.email ?? ''}
          />
        )}

      </div>
    </main>
  )
}

export default App