import { useEffect, useState } from 'react'
import {
  cambiarFavorito,
  obtenerDevocionales,
} from './services/devocionalService'

interface Devocional {
  id: number
  fecha: string
  lectura: string
  versiculo: string
  que_dice: string
  que_dios_quiere_mostrarme: string
  aplicacion: string
  compromiso: string
  favorito: boolean
}

interface FavoritosProps {
  userId: string
}

function Favoritos({
  userId,
}: FavoritosProps) {
  const [devocionales, setDevocionales] = useState<
    Devocional[]
  >([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarFavoritos = async () => {
    try {
      setCargando(true)
      setError('')

      const datos =
        await obtenerDevocionales(userId)

      const favoritos = (datos || []).filter(
        (devocional) => devocional.favorito
      )

      setDevocionales(favoritos)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'No se pudieron cargar tus favoritos.'
        )
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarFavoritos()
  }, [userId])

  const quitarFavorito = async (
    devocional: Devocional
  ) => {
    try {
      setError('')

      await cambiarFavorito(
        devocional.id,
        false
      )

      setDevocionales((actuales) =>
        actuales.filter(
          (item) => item.id !== devocional.id
        )
      )
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'No se pudo quitar de favoritos.'
        )
      }
    }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
        <div className="mx-auto max-w-5xl text-center">

          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
            Tu espacio personal
          </p>

          <h1 className="mt-6 text-4xl font-semibold text-[#514A45] sm:text-5xl">
            Favoritos
          </h1>

          <p className="mt-5 text-sm text-[#8A8179]">
            Cargando tus favoritos...
          </p>

        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">

        {/* ENCABEZADO */}
        <section className="mb-9 text-center sm:mb-10">

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

            <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
              Guardados para ti
            </p>

            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-[#514A45] sm:text-5xl">
            Favoritos
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8A8179] sm:leading-7">
            Guarda las reflexiones a las que quieres
            volver de manera especial.
          </p>

        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-[#E4D6D0] bg-[#F3ECE8] px-5 py-4 text-center text-sm leading-6 text-[#795F55]">
            {error}
          </div>
        )}

        {/* CONTADOR */}
        {devocionales.length > 0 && (
          <div className="mb-5 flex items-center justify-between px-1">

            <p className="text-sm text-[#8A8179]">
              {devocionales.length === 1
                ? '1 devocional favorito'
                : `${devocionales.length} devocionales favoritos`}
            </p>

            <span className="text-lg text-[#756B4F]">
              ★
            </span>

          </div>
        )}

        {/* SIN FAVORITOS */}
        {devocionales.length === 0 ? (
          <section className="rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem] sm:px-7 sm:py-14">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EEE0] text-lg text-[#756B4F]">
              ★
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#514A45]">
              Aún no tienes favoritos
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8A8179]">
              Cuando marques un devocional como favorito,
              aparecerá aquí para que puedas volver a él
              fácilmente.
            </p>

          </section>
        ) : (
          /* LISTA */
          <div className="space-y-6 sm:space-y-8">

            {devocionales.map(
              (devocional) => (
                <article
                  key={devocional.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem]"
                >

                  {/* CABECERA */}
                  <div className="border-b border-[#E7E1D8] bg-[#F1EEE8] px-5 py-5 sm:px-7 sm:py-6 md:px-9">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8A8179] sm:text-[10px] sm:tracking-[0.25em]">
                          Fecha
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#514A45]">
                          {devocional.fecha}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8A8179] sm:text-[10px] sm:tracking-[0.25em]">
                          Lectura
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#657466]">
                          {devocional.lectura}
                        </p>
                      </div>

                      {/* FAVORITO */}
                      <button
                        type="button"
                        onClick={() =>
                          quitarFavorito(
                            devocional
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-full border border-[#CFC9B8] bg-[#F1EEE0] px-4 py-2 text-sm text-[#756B4F] transition hover:bg-[#EAE5D2]"
                      >
                        <span className="text-lg leading-none">
                          ★
                        </span>

                        <span>
                          Quitar favorito
                        </span>
                      </button>

                    </div>

                  </div>

                  {/* CONTENIDO */}
                  <div className="px-5 py-7 sm:px-7 sm:py-8 md:px-9 md:py-10">

                    {/* VERSÍCULO */}
                    <div className="mb-8 rounded-2xl border border-[#E7E1D8] bg-[#F8F6F1] px-4 py-6 text-center sm:mb-9 sm:px-6 sm:py-7">

                      <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.22em] text-[#7F8B81] sm:text-[10px] sm:tracking-[0.25em]">
                        Versículo
                      </p>

                      <p className="mx-auto max-w-3xl text-base font-light leading-7 text-[#514A45] sm:text-lg sm:leading-8 md:text-xl">
                        “{devocional.versiculo}”
                      </p>

                    </div>

                    {/* REFLEXIONES */}
                    <div className="space-y-6 sm:space-y-7">

                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#657466] sm:text-xs sm:tracking-[0.18em]">
                          ¿Qué dice el versículo?
                        </p>

                        <p className="text-sm leading-7 text-[#6F6862]">
                          {devocional.que_dice}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#657466] sm:text-xs sm:tracking-[0.18em]">
                          ¿Qué quiere Dios mostrarme?
                        </p>

                        <p className="text-sm leading-7 text-[#6F6862]">
                          {
                            devocional.que_dios_quiere_mostrarme
                          }
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#657466] sm:text-xs sm:tracking-[0.18em]">
                          ¿Cómo puedo aplicarlo en mi vida?
                        </p>

                        <p className="text-sm leading-7 text-[#6F6862]">
                          {devocional.aplicacion}
                        </p>
                      </div>

                      {/* COMPROMISO */}
                      <div className="rounded-2xl bg-[#E8EEE8] px-5 py-5 sm:px-6">

                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#657466] sm:text-xs sm:tracking-[0.18em]">
                          Mi compromiso
                        </p>

                        <p className="text-sm leading-7 text-[#59655B]">
                          {devocional.compromiso}
                        </p>

                      </div>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </div>
    </main>
  )
}

export default Favoritos