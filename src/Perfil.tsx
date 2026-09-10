import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

interface PerfilProps {
  userId: string
  email: string
}

function Perfil({
  userId,
  email,
}: PerfilProps) {
  const [cantidadDevocionales, setCantidadDevocionales] =
    useState(0)

  const [cantidadFavoritos, setCantidadFavoritos] =
    useState(0)

  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        setCargando(true)

        const { data, error } = await supabase
          .from('devocionales')
          .select('id, favorito')
          .eq('user_id', userId)

        if (error) {
          throw error
        }

        const devocionales = data || []

        setCantidadDevocionales(
          devocionales.length
        )

        setCantidadFavoritos(
          devocionales.filter(
            (devocional) =>
              devocional.favorito === true
          ).length
        )
      } catch (error) {
        console.error(
          'Error al obtener estadísticas:',
          error
        )
      } finally {
        setCargando(false)
      }
    }

    obtenerEstadisticas()
  }, [userId])

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">

        <section className="mb-9 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

            <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
              Tu espacio personal
            </p>

            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-[#514A45] sm:text-5xl">
            Mi perfil
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#8A8179] sm:leading-7">
            Aquí puedes ver la información de tu cuenta
            y un pequeño resumen de tu espacio.
          </p>
        </section>

        <section className="overflow-hidden rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem]">

          <div className="relative overflow-hidden border-b border-[#E7E1D8] bg-[#F1EEE8] px-5 py-8 sm:px-8 sm:py-10">

            <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#E8EEE8] sm:h-40 sm:w-40 sm:translate-x-12 sm:-translate-y-12" />

            <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#E8EEE8] text-2xl font-semibold text-[#657466]">
                {email.charAt(0).toUpperCase()}
              </div>

              <div className="mt-5 sm:ml-6 sm:mt-0">

                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8A8179] sm:text-[10px] sm:tracking-[0.25em]">
                  Cuenta
                </p>

                <h2 className="mt-2 break-all text-lg font-semibold text-[#514A45] sm:text-xl">
                  {email}
                </h2>

                <p className="mt-2 text-sm text-[#8A8179]">
                  Tu espacio personal de devocionales
                </p>

              </div>

            </div>
          </div>

          <div className="grid gap-px bg-[#E7E1D8] sm:grid-cols-2">

            <div className="bg-[#FCFBF8] px-6 py-8 text-center sm:px-8 sm:py-10">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E8EEE8] text-[#657466]">
                ✦
              </div>

              <p className="mt-5 text-3xl font-semibold text-[#514A45]">
                {cargando
                  ? '—'
                  : cantidadDevocionales}
              </p>

              <p className="mt-2 text-sm text-[#8A8179]">
                {cantidadDevocionales === 1
                  ? 'Devocional escrito'
                  : 'Devocionales escritos'}
              </p>

            </div>

            <div className="bg-[#FCFBF8] px-6 py-8 text-center sm:px-8 sm:py-10">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F1EEE0] text-[#756B4F]">
                ★
              </div>

              <p className="mt-5 text-3xl font-semibold text-[#514A45]">
                {cargando
                  ? '—'
                  : cantidadFavoritos}
              </p>

              <p className="mt-2 text-sm text-[#8A8179]">
                {cantidadFavoritos === 1
                  ? 'Favorito guardado'
                  : 'Favoritos guardados'}
              </p>

            </div>

          </div>

          <div className="border-t border-[#E7E1D8] px-5 py-7 sm:px-8 sm:py-9">

            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#7F8B81] sm:text-[10px] sm:tracking-[0.25em]">
              Información de la cuenta
            </p>

            <div className="mt-5 rounded-2xl bg-[#F4F1EB] px-5 py-5">

              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#A39A92] sm:text-[10px] sm:tracking-[0.2em]">
                Correo electrónico
              </p>

              <p className="mt-2 break-all text-sm font-medium text-[#514A45]">
                {email}
              </p>

            </div>

          </div>

        </section>

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.25em] text-[#A39A92] sm:mt-12">
          Un día a la vez · Una palabra a la vez
        </p>

      </div>
    </main>
  )
}

export default Perfil