interface HomeProps {
  email: string
  versiculo: string
  referencia: string
  cargando: boolean
  error: string
  onHacerDevocional: () => void
}

function Home({
  email,
  versiculo,
  referencia,
  cargando,
  error,
  onHacerDevocional,
}: HomeProps) {
  const fechaActual = new Date()

  const fechaFormateada =
    fechaActual.toLocaleDateString('es-PA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-[#514A45] sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">

        {/* ENCABEZADO */}
        <section className="mb-10 text-center sm:mb-14">

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.3em]">
              Tu espacio personal
            </p>

            <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.02em] text-[#514A45] sm:text-5xl md:text-6xl">
            Un momento para
            <br />
            <span className="text-[#718071]">
              estar con Dios.
            </span>
          </h1>

          <div className="mt-5 text-sm text-[#8A8179] sm:mt-6">
            <p className="capitalize">
              {fechaFormateada}
            </p>

            <p className="mx-auto mt-2 max-w-xl leading-6 sm:leading-7">
              Hola, {email}
            </p>
          </div>

        </section>

        {/* VERSÍCULO DEL DÍA */}
        <section className="relative overflow-hidden rounded-[1.5rem] border border-[#E4DED4] bg-[#FCFBF8] px-5 py-8 shadow-[0_8px_30px_rgba(81,74,69,0.04)] sm:rounded-[2rem] sm:px-8 sm:py-10 md:px-14 md:py-14">

          {/* DECORACIÓN */}
          <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-[#E8EEE8] sm:h-36 sm:w-36 sm:translate-x-12 sm:-translate-y-12" />

          <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full border border-[#E8EEE8] sm:h-28 sm:w-28 sm:-translate-x-14 sm:translate-y-14" />

          <div className="relative">

            {/* TÍTULO */}
            <div className="mb-9 flex items-center justify-between sm:mb-11">

              <div className="flex items-center gap-2 sm:gap-3">

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8EEE8] text-sm text-[#657466]">
                  ✦
                </span>

                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#7F8B81] sm:text-[11px] sm:tracking-[0.28em]">
                    Palabra para hoy
                  </p>
                </div>

              </div>

              <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-[#A39A92] sm:block">
                HOY
              </span>

            </div>

            {/* CONTENIDO */}
            {cargando ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#8A8179]">
                  Cargando tu versículo...
                </p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#8A8179]">
                  {error}
                </p>
              </div>
            ) : versiculo ? (
              <div>

                <p className="mx-auto max-w-3xl text-center text-xl font-light leading-8 tracking-[-0.01em] text-[#514A45] sm:text-2xl sm:leading-10 md:text-3xl md:leading-[1.7]">
                  “{versiculo}”
                </p>

                {/* REFERENCIA */}
                <div className="mt-8 flex items-center justify-center gap-2 sm:mt-9 sm:gap-3">

                  <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

                  <p className="text-xs font-semibold tracking-wide text-[#657466] sm:text-sm">
                    {referencia}
                  </p>

                  <span className="h-px w-6 bg-[#A5B2A5] sm:w-10" />

                </div>

                {/* FRASE */}
                <p className="mx-auto mt-6 max-w-lg text-center text-xs leading-6 text-[#A39A92] sm:text-sm sm:leading-7">
                  Tómate unos minutos para meditar en estas palabras
                  y escuchar lo que Dios quiere mostrarte hoy.
                </p>

              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-[#8A8179]">
                  Todavía no se ha cargado el versículo del día.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* ACCIÓN */}
        <section className="mt-7 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] border border-[#E7E1D8] bg-[#F1EEE8] px-5 py-6 text-center sm:mt-10 sm:flex-row sm:px-8 sm:py-7 sm:text-left">

          <div>
            <p className="text-sm font-medium text-[#514A45]">
              ¿Qué quieres guardar de este momento?
            </p>

            <p className="mt-1 text-xs leading-5 text-[#8A8179]">
              Escribe tu reflexión y vuelve a ella cuando quieras.
            </p>
          </div>

          <button
            type="button"
            onClick={onHacerDevocional}
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#657466] px-6 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#566457] hover:shadow-md sm:w-auto"
          >
            Escribir mi devocional

            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>

        </section>

        {/* FRASE FINAL */}
        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.25em] text-[#A39A92] sm:mt-12">
          Un día a la vez · Una palabra a la vez
        </p>

      </div>
    </main>
  )
}

export default Home