import { useState } from 'react'
import { guardarDevocional } from './services/devocionalService'

interface DevocionalFormProps {
  userId: string
  fecha: string
  lectura: string
  versiculo: string
}

function DevocionalForm({
  userId,
  fecha,
  lectura,
  versiculo,
}: DevocionalFormProps) {
  const [queDice, setQueDice] = useState('')
  const [queDiosQuiereMostrarme, setQueDiosQuiereMostrarme] =
    useState('')
  const [aplicacion, setAplicacion] = useState('')
  const [compromiso, setCompromiso] = useState('')

  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const manejarGuardado = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setMensaje('')
    setError('')
    setGuardando(true)

    try {
      await guardarDevocional({
        user_id: userId,
        fecha,
        versiculo,
        lectura,
        que_dice: queDice,
        que_dios_quiere_mostrarme:
          queDiosQuiereMostrarme,
        aplicacion,
        compromiso,
      })

      setMensaje(
        '¡Devocional guardado correctamente! 📖'
      )

      setQueDice('')
      setQueDiosQuiereMostrarme('')
      setAplicacion('')
      setCompromiso('')
    } catch (error) {
      console.error('Error al guardar:', error)

      if (
        error &&
        typeof error === 'object' &&
        'message' in error
      ) {
        setError(
          String(error.message)
        )
      } else {
        setError(
          JSON.stringify(error)
        )
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">

        {/* ENCABEZADO */}
        <section className="mb-9 text-center sm:mb-10">

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

            <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
              Tiempo de reflexión
            </p>

            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-[#514A45] sm:text-5xl">
            Mi devocional
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8A8179] sm:leading-7">
            Tómate un momento para reflexionar sobre lo que
            Dios quiere enseñarte hoy.
          </p>

        </section>

        {/* LECTURA DEL DÍA */}
        <section className="relative mb-7 overflow-hidden rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-7 shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:mb-8 sm:rounded-[2rem] sm:px-7 sm:py-9 md:px-12">

          {/* DETALLE DECORATIVO */}
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#E8EEE8] sm:h-28 sm:w-28 sm:translate-x-10 sm:-translate-y-10" />

          <div className="relative">

            <div className="mb-6 flex items-center gap-2 sm:mb-7 sm:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EEE8] text-sm text-[#657466]">
                ✦
              </span>

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.28em]">
                Lectura de hoy
              </p>
            </div>

            {/* INFORMACIÓN */}
            <div className="grid gap-3 text-sm sm:grid-cols-2 sm:gap-4">

              <div className="rounded-2xl bg-[#F4F1EB] px-4 py-4 sm:px-5">
                <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#A39A92] sm:text-[10px] sm:tracking-[0.2em]">
                  Fecha
                </p>

                <p className="font-medium text-[#514A45]">
                  {fecha}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F4F1EB] px-4 py-4 sm:px-5">
                <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#A39A92] sm:text-[10px] sm:tracking-[0.2em]">
                  Lectura
                </p>

                <p className="font-medium text-[#514A45]">
                  {lectura}
                </p>
              </div>

            </div>

            {/* VERSÍCULO */}
            <div className="mt-5 rounded-2xl border border-[#E7E1D8] bg-[#F8F6F1] px-4 py-6 text-center sm:mt-6 sm:px-6">

              <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.22em] text-[#7F8B81] sm:text-[10px] sm:tracking-[0.25em]">
                Versículo
              </p>

              <p className="mx-auto max-w-2xl text-base font-light leading-7 text-[#514A45] sm:text-lg sm:leading-8 md:text-xl">
                “{versiculo}”
              </p>

            </div>

          </div>
        </section>

        {/* FORMULARIO */}
        <form
          onSubmit={manejarGuardado}
          className="rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-7 shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem] sm:px-7 sm:py-9 md:px-12 md:py-12"
        >

          {/* TÍTULO */}
          <div className="mb-8 sm:mb-9">
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.28em]">
              Mi reflexión
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#514A45] sm:text-2xl">
              Escribe lo que hay en tu corazón
            </h2>
          </div>

          {/* PREGUNTA 1 */}
          <div className="mb-7 sm:mb-8">
            <label
              htmlFor="queDice"
              className="mb-3 block text-sm font-medium text-[#514A45]"
            >
              ¿Qué dice el versículo?
            </label>

            <textarea
              id="queDice"
              value={queDice}
              onChange={(e) =>
                setQueDice(e.target.value)
              }
              placeholder="¿Qué está diciendo este versículo?"
              required
              rows={5}
              className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
            />
          </div>

          {/* PREGUNTA 2 */}
          <div className="mb-7 sm:mb-8">
            <label
              htmlFor="queDiosQuiereMostrarme"
              className="mb-3 block text-sm font-medium text-[#514A45]"
            >
              ¿Qué quiere Dios mostrarme?
            </label>

            <textarea
              id="queDiosQuiereMostrarme"
              value={queDiosQuiereMostrarme}
              onChange={(e) =>
                setQueDiosQuiereMostrarme(
                  e.target.value
                )
              }
              placeholder="¿Qué quiere Dios enseñarme o mostrarme a través de este versículo?"
              required
              rows={5}
              className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
            />
          </div>

          {/* PREGUNTA 3 */}
          <div className="mb-7 sm:mb-8">
            <label
              htmlFor="aplicacion"
              className="mb-3 block text-sm font-medium text-[#514A45]"
            >
              ¿Cómo puedo aplicarlo en mi vida?
            </label>

            <textarea
              id="aplicacion"
              value={aplicacion}
              onChange={(e) =>
                setAplicacion(e.target.value)
              }
              placeholder="¿Cómo puedo llevar este mensaje a mi vida diaria?"
              required
              rows={5}
              className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
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
              value={compromiso}
              onChange={(e) =>
                setCompromiso(e.target.value)
              }
              placeholder="¿Qué me comprometo a hacer a partir de lo aprendido?"
              required
              rows={5}
              className="w-full resize-y rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-4 py-4 text-sm leading-7 text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8] sm:px-5"
            />
          </div>

          {/* BOTÓN */}
          <div className="flex justify-stretch border-t border-[#E7E1D8] pt-6 sm:justify-end sm:pt-7">

            <button
              type="submit"
              disabled={guardando}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#657466] px-7 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#566457] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {guardando
                ? 'Guardando...'
                : 'Guardar devocional'}

              {!guardando && (
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </div>

        </form>

        {/* MENSAJES */}
        {mensaje && (
          <div className="mt-5 rounded-2xl border border-[#D6E1D6] bg-[#E8EEE8] px-4 py-4 text-center text-sm leading-6 text-[#657466] sm:mt-6 sm:px-5">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-[#E4D6D0] bg-[#F3ECE8] px-4 py-4 text-center text-sm leading-6 text-[#795F55] sm:mt-6 sm:px-5">
            {error}
          </div>
        )}

      </div>
    </main>
  )
}

export default DevocionalForm