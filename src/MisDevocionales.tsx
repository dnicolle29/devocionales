import { useEffect, useState } from 'react'
import {
  actualizarDevocional,
  cambiarFavorito,
  eliminarDevocional,
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

interface MisDevocionalesProps {
  userId: string
}

function MisDevocionales({
  userId,
}: MisDevocionalesProps) {
  const [devocionales, setDevocionales] = useState<
    Devocional[]
  >([])

  const [editando, setEditando] =
    useState<Devocional | null>(null)

  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Búsqueda, fecha y orden
  const [busqueda, setBusqueda] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState('')
  const [orden, setOrden] = useState<
    'recientes' | 'antiguos'
  >('recientes')

  // Cargar devocionales
  const cargarDevocionales = async () => {
    try {
      setCargando(true)
      setError('')

      const datos =
        await obtenerDevocionales(userId)

      setDevocionales(datos || [])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'No se pudieron cargar tus devocionales.'
        )
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDevocionales()
  }, [userId])

  // Guardar cambios
  const guardarCambios = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!editando) {
      return
    }

    try {
      setGuardando(true)
      setError('')
      setMensaje('')

      await actualizarDevocional(
        editando.id,
        {
          fecha: editando.fecha,
          versiculo: editando.versiculo,
          lectura: editando.lectura,
          que_dice: editando.que_dice,
          que_dios_quiere_mostrarme:
            editando.que_dios_quiere_mostrarme,
          aplicacion: editando.aplicacion,
          compromiso: editando.compromiso,
        }
      )

      setMensaje(
        '¡Devocional actualizado correctamente! ✏️'
      )

      setEditando(null)

      await cargarDevocionales()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'No se pudo actualizar el devocional.'
        )
      }
    } finally {
      setGuardando(false)
    }
  }

  // Eliminar devocional
  const borrarDevocional = async (
    id: number
  ) => {
    const confirmar = window.confirm(
      '¿Estás segura de que quieres eliminar este devocional?'
    )

    if (!confirmar) {
      return
    }

    try {
      setEliminando(true)
      setError('')
      setMensaje('')

      await eliminarDevocional(id)

      setMensaje(
        'Devocional eliminado correctamente. 🗑️'
      )

      await cargarDevocionales()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'No se pudo eliminar el devocional.'
        )
      }
    } finally {
      setEliminando(false)
    }
  }

  // Cambiar estado de favorito
  const manejarFavorito = async (
    devocional: Devocional
  ) => {
    try {
      setError('')
      setMensaje('')

      await cambiarFavorito(
        devocional.id,
        !devocional.favorito
      )

      setDevocionales((actuales) =>
        actuales.map((item) =>
          item.id === devocional.id
            ? {
                ...item,
                favorito: !item.favorito,
              }
            : item
        )
      )
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'No se pudo actualizar el favorito.'
        )
      }
    }
  }

  // Filtrar y ordenar devocionales
  const devocionalesFiltrados = [...devocionales]
    .filter((devocional) => {
      const texto = busqueda
        .toLowerCase()
        .trim()

      if (!texto) {
        return true
      }

      const contenido = [
        devocional.lectura,
        devocional.versiculo,
        devocional.que_dice,
        devocional.que_dios_quiere_mostrarme,
        devocional.aplicacion,
        devocional.compromiso,
      ]
        .join(' ')
        .toLowerCase()

      return contenido.includes(texto)
    })
    .filter((devocional) => {
      if (!fechaFiltro) {
        return true
      }

      return devocional.fecha === fechaFiltro
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime()
      const fechaB = new Date(b.fecha).getTime()

      if (orden === 'recientes') {
        return fechaB - fechaA
      }

      return fechaA - fechaB
    })

  // CARGANDO
  if (cargando) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
        <div className="mx-auto max-w-5xl text-center">

          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
            Mi espacio
          </p>

          <h1 className="mt-5 text-4xl font-semibold text-[#514A45] sm:text-5xl">
            Mis devocionales
          </h1>

          <p className="mt-5 text-sm text-[#8A8179]">
            Cargando tus devocionales...
          </p>

        </div>
      </main>
    )
  }

  // ERROR
  if (error && devocionales.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
        <div className="mx-auto max-w-5xl">

          <section className="mb-9 text-center sm:mb-10">

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
                Mi espacio
              </p>

              <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
            </div>

            <h1 className="mt-6 text-4xl font-semibold text-[#514A45] sm:text-5xl">
              Mis devocionales
            </h1>

          </section>

          <div className="rounded-[1.5rem] border border-[#E4D6D0] bg-[#F3ECE8] px-5 py-7 text-center text-sm leading-6 text-[#795F55] sm:rounded-[2rem] sm:px-6 sm:py-8">
            {error}
          </div>

        </div>
      </main>
    )
  }

  // FORMULARIO DE EDICIÓN
  if (editando) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">

          {/* ENCABEZADO */}
          <section className="mb-9 text-center sm:mb-10">

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

              <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
                Editar reflexión
              </p>

              <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-[#514A45] sm:text-5xl">
              Editar devocional
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8A8179] sm:leading-7">
              Puedes modificar tu reflexión y guardar los cambios.
            </p>

          </section>

          {/* FORMULARIO */}
          <form
            onSubmit={guardarCambios}
            className="rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-7 shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem] sm:px-7 sm:py-9 md:px-12 md:py-12"
          >

            <div className="mb-8 sm:mb-9">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.28em]">
                Información
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#514A45]">
                Tu lectura
              </h2>
            </div>

            {/* FECHA Y LECTURA */}
            <div className="mb-7 grid gap-5 sm:mb-8 sm:grid-cols-2 sm:gap-6">

              <div>
                <label
                  htmlFor="fecha"
                  className="mb-3 block text-sm font-medium text-[#514A45]"
                >
                  Fecha
                </label>

                <input
                  id="fecha"
                  type="date"
                  value={editando.fecha}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      fecha: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
                />
              </div>

              <div>
                <label
                  htmlFor="lectura"
                  className="mb-3 block text-sm font-medium text-[#514A45]"
                >
                  Lectura
                </label>

                <input
                  id="lectura"
                  type="text"
                  value={editando.lectura}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      lectura: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
                />
              </div>

            </div>

            {/* VERSÍCULO */}
            <div className="mb-7 sm:mb-8">
              <label
                htmlFor="versiculo"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                Versículo
              </label>

              <textarea
                id="versiculo"
                value={editando.versiculo}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    versiculo: e.target.value,
                  })
                }
                required
                rows={4}
                className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
              />
            </div>

            {/* QUÉ DICE */}
            <div className="mb-7 sm:mb-8">
              <label
                htmlFor="queDice"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                ¿Qué dice el versículo?
              </label>

              <textarea
                id="queDice"
                value={editando.que_dice}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    que_dice: e.target.value,
                  })
                }
                required
                rows={5}
                className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
              />
            </div>

            {/* QUÉ QUIERE DIOS MOSTRARME */}
            <div className="mb-7 sm:mb-8">
              <label
                htmlFor="queDiosQuiereMostrarme"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                ¿Qué quiere Dios mostrarme?
              </label>

              <textarea
                id="queDiosQuiereMostrarme"
                value={
                  editando.que_dios_quiere_mostrarme
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    que_dios_quiere_mostrarme:
                      e.target.value,
                  })
                }
                required
                rows={5}
                className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
              />
            </div>

            {/* APLICACIÓN */}
            <div className="mb-7 sm:mb-8">
              <label
                htmlFor="aplicacion"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                ¿Cómo puedo aplicarlo en mi vida?
              </label>

              <textarea
                id="aplicacion"
                value={editando.aplicacion}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    aplicacion: e.target.value,
                  })
                }
                required
                rows={5}
                className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
              />
            </div>

            {/* COMPROMISO */}
            <div className="mb-8 sm:mb-9">
              <label
                htmlFor="compromiso"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                Mi compromiso
              </label>

              <textarea
                id="compromiso"
                value={editando.compromiso}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    compromiso: e.target.value,
                  })
                }
                required
                rows={5}
                className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
              />
            </div>

            {/* BOTONES */}
            <div className="flex flex-col gap-3 border-t border-[#E7E1D8] pt-6 sm:flex-row sm:justify-end sm:pt-7">

              <button
                type="button"
                onClick={() => setEditando(null)}
                disabled={guardando}
                className="w-full rounded-full border border-[#D8D2C8] bg-[#F7F5F0] px-7 py-3.5 text-sm font-medium text-[#817A74] transition hover:bg-[#F1EEE8] hover:text-[#514A45] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#657466] px-7 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#566457] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {guardando
                  ? 'Guardando cambios...'
                  : 'Guardar cambios'}

                {!guardando && (
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>

            </div>

          </form>
        </div>
      </main>
    )
  }

  // LISTA DE DEVOCIONALES
  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">

        {/* ENCABEZADO */}
        <section className="mb-9 text-center sm:mb-10">

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

            <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
              Tu espacio personal
            </p>

            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-[#514A45] sm:text-5xl">
            Mis devocionales
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8A8179] sm:leading-7">
            Un espacio para volver a tus reflexiones,
            recordar lo aprendido y ver cómo Dios ha ido
            trabajando en tu vida.
          </p>

        </section>

        {/* MENSAJES */}
        {mensaje && (
          <div className="mb-5 rounded-2xl border border-[#D6E1D6] bg-[#E8EEE8] px-4 py-4 text-center text-sm leading-6 text-[#657466] sm:mb-6 sm:px-5">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-[#E4D6D0] bg-[#F3ECE8] px-4 py-4 text-center text-sm leading-6 text-[#795F55] sm:mb-6 sm:px-5">
            {error}
          </div>
        )}

        {/* BUSCAR Y FILTRAR */}
        <section className="mb-7 rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] p-5 shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:mb-8 sm:rounded-[2rem] sm:p-6 md:p-7">

          <div className="mb-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#7F8B81] sm:text-[10px] sm:tracking-[0.25em]">
              Buscar y organizar
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#514A45]">
              Encuentra una reflexión
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">

            {/* BÚSQUEDA */}
            <div>
              <label
                htmlFor="busqueda"
                className="mb-2 block text-xs font-medium text-[#514A45]"
              >
                Buscar
              </label>

              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Busca una palabra o frase..."
                className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
              />
            </div>

            {/* FECHA */}
            <div>
              <label
                htmlFor="fechaFiltro"
                className="mb-2 block text-xs font-medium text-[#514A45]"
              >
                Fecha
              </label>

              <input
                id="fechaFiltro"
                type="date"
                value={fechaFiltro}
                onChange={(e) =>
                  setFechaFiltro(e.target.value)
                }
                className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8]"
              />
            </div>

            {/* ORDEN */}
            <div>
              <label
                htmlFor="orden"
                className="mb-2 block text-xs font-medium text-[#514A45]"
              >
                Ordenar
              </label>

              <select
                id="orden"
                value={orden}
                onChange={(e) =>
                  setOrden(
                    e.target.value as
                      | 'recientes'
                      | 'antiguos'
                  )
                }
                className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-3.5 text-sm text-[#514A45] outline-none transition focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8]"
              >
                <option value="recientes">
                  Más recientes
                </option>

                <option value="antiguos">
                  Más antiguos
                </option>
              </select>
            </div>

          </div>

          {/* LIMPIAR FILTROS */}
          {(busqueda || fechaFiltro) && (
            <div className="mt-5 flex justify-end border-t border-[#E7E1D8] pt-5">

              <button
                type="button"
                onClick={() => {
                  setBusqueda('')
                  setFechaFiltro('')
                }}
                className="text-sm font-medium text-[#657466] transition hover:text-[#4F5E51] hover:underline"
              >
                Limpiar filtros
              </button>

            </div>
          )}

        </section>

        {/* RESULTADOS */}
        <div className="mb-5 flex items-center justify-between px-1">

          <p className="text-sm text-[#8A8179]">
            {devocionalesFiltrados.length === 1
              ? '1 devocional encontrado'
              : `${devocionalesFiltrados.length} devocionales encontrados`}
          </p>

        </div>

        {/* SIN DEVOCIONALES */}
        {devocionales.length === 0 ? (
          <section className="rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem] sm:px-7 sm:py-14">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EEE8] text-[#657466]">
              ✦
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#514A45]">
              Aún no tienes devocionales
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8A8179]">
              Cuando escribas tu primera reflexión,
              aparecerá aquí para que puedas volver a ella
              cuando quieras.
            </p>

          </section>
        ) : devocionalesFiltrados.length === 0 ? (
          /* SIN RESULTADOS */
          <section className="rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem] sm:px-7 sm:py-14">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EEE8] text-[#657466]">
              🔎
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#514A45]">
              No encontramos resultados
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8A8179]">
              Intenta buscar otra palabra o selecciona
              una fecha diferente.
            </p>

          </section>
        ) : (
          /* DEVOCIONALES */
          <div className="space-y-6 sm:space-y-8">

            {devocionalesFiltrados.map(
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
                          manejarFavorito(
                            devocional
                          )
                        }
                        className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                          devocional.favorito
                            ? 'border-[#CFC9B8] bg-[#F1EEE0] text-[#756B4F]'
                            : 'border-[#D8D2C8] bg-[#F7F5F0] text-[#8A8179] hover:border-[#BFC9BF] hover:bg-[#E8EEE8] hover:text-[#657466]'
                        }`}
                      >
                        <span className="text-lg leading-none">
                          {devocional.favorito
                            ? '★'
                            : '☆'}
                        </span>

                        <span>
                          {devocional.favorito
                            ? 'Favorito'
                            : 'Marcar favorito'}
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

                    {/* ACCIONES */}
                    <div className="mt-8 flex flex-col gap-3 border-t border-[#E7E1D8] pt-6 sm:mt-9 sm:flex-row sm:items-center sm:justify-end sm:pt-7">

                      <button
                        type="button"
                        onClick={() =>
                          setEditando(devocional)
                        }
                        className="group flex w-full items-center justify-center gap-2 rounded-full border border-[#D8D2C8] bg-[#F7F5F0] px-6 py-3 text-sm font-medium text-[#657466] transition duration-200 hover:border-[#BFC9BF] hover:bg-[#E8EEE8] sm:w-auto"
                      >
                        <span>
                          Editar
                        </span>

                        <span className="text-sm transition-transform duration-200 group-hover:translate-x-0.5">
                          →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          borrarDevocional(
                            devocional.id
                          )
                        }
                        disabled={eliminando}
                        className="w-full rounded-full border border-[#E2D4CE] bg-[#FBF7F4] px-6 py-3 text-sm font-medium text-[#8A675D] transition duration-200 hover:border-[#D7C2BA] hover:bg-[#F3EAE5] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {eliminando
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>

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

export default MisDevocionales