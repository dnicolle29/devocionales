import { useState } from 'react'
import { supabase } from './lib/supabase'

function Auth() {
  const [modo, setModo] = useState<'login' | 'registro'>('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const manejarAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    setMensaje('')
    setError('')
    setCargando(true)

    try {
      if (modo === 'registro') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          throw error
        }

        setMensaje(
          'Cuenta creada. Revisa tu correo para confirmar tu cuenta.'
        )
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (error) {
          throw error
        }

        setMensaje('¡Inicio de sesión exitoso!')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Ocurrió un error.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-6 py-10 text-[#514A45]">

      <div className="w-full max-w-md">

        {/* ENCABEZADO */}
        <section className="mb-8 text-center">

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#A5B2A5]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#7F8B81]">
              Mi espacio
            </p>

            <span className="h-px w-8 bg-[#A5B2A5]" />
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-[#514A45]">
            {modo === 'login'
              ? 'Bienvenida de nuevo'
              : 'Crea tu espacio'}
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#8A8179]">
            {modo === 'login'
              ? 'Un lugar para hacer una pausa y dedicar un momento a Dios.'
              : 'Crea tu cuenta para guardar tus reflexiones y devocionales.'}
          </p>

        </section>

        {/* TARJETA */}
        <section className="rounded-[2rem] border border-[#E4DED4] bg-[#FCFBF8] px-7 py-9 shadow-[0_10px_35px_rgba(81,74,69,0.05)] md:px-9">

          {/* PEQUEÑO DETALLE */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8EEE8] text-[#657466]">
              ✦
            </div>
          </div>

          <form onSubmit={manejarAuth}>

            {/* CORREO */}
            <div className="mb-6">

              <label
                htmlFor="email"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="correo@ejemplo.com"
                required
                className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-5 py-3.5 text-sm text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8]"
              />

            </div>

            {/* CONTRASEÑA */}
            <div className="mb-7">

              <label
                htmlFor="password"
                className="mb-3 block text-sm font-medium text-[#514A45]"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                minLength={6}
                required
                className="w-full rounded-2xl border border-[#DED8CE] bg-[#FAF9F6] px-5 py-3.5 text-sm text-[#514A45] outline-none transition placeholder:text-[#A39A92] focus:border-[#9BA99C] focus:bg-white focus:ring-2 focus:ring-[#E8EEE8]"
              />

              {modo === 'registro' && (
                <p className="mt-2 text-xs text-[#A39A92]">
                  La contraseña debe tener al menos 6 caracteres.
                </p>
              )}

            </div>

            {/* BOTÓN PRINCIPAL */}
            <button
              type="submit"
              disabled={cargando}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#657466] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#566457] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando
                ? 'Procesando...'
                : modo === 'login'
                  ? 'Iniciar sesión'
                  : 'Crear mi cuenta'}

              {!cargando && (
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>

          </form>

          {/* MENSAJE */}
          {mensaje && (
            <div className="mt-6 rounded-2xl border border-[#D6E1D6] bg-[#E8EEE8] px-5 py-4 text-center text-sm leading-6 text-[#657466]">
              {mensaje}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-2xl border border-[#E4D6D0] bg-[#F3ECE8] px-5 py-4 text-center text-sm leading-6 text-[#795F55]">
              {error}
            </div>
          )}

          {/* CAMBIAR ENTRE LOGIN / REGISTRO */}
          <div className="mt-8 border-t border-[#E7E1D8] pt-7 text-center">

            <p className="text-sm text-[#8A8179]">
              {modo === 'login'
                ? '¿Todavía no tienes una cuenta?'
                : '¿Ya tienes una cuenta?'}
            </p>

            <button
              type="button"
              onClick={() => {
                setModo(
                  modo === 'login'
                    ? 'registro'
                    : 'login'
                )

                setMensaje('')
                setError('')
              }}
              className="mt-2 text-sm font-medium text-[#657466] transition hover:text-[#4F5E51] hover:underline"
            >
              {modo === 'login'
                ? 'Crear una cuenta'
                : 'Iniciar sesión'}
            </button>

          </div>

        </section>

        {/* PIE */}
        <p className="mt-7 text-center text-[11px] uppercase tracking-[0.2em] text-[#A39A92]">
          Un momento para estar con Dios
        </p>

      </div>

    </main>
  )
}

export default Auth