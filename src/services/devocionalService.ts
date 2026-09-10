import { supabase } from '../lib/supabase'

export interface NuevoDevocional {
  user_id: string
  fecha: string
  versiculo: string
  lectura: string
  que_dice: string
  que_dios_quiere_mostrarme: string
  aplicacion: string
  compromiso: string
}

export const guardarDevocional = async (
  devocional: NuevoDevocional
) => {
  const { data, error } = await supabase
    .from('devocionales')
    .insert(devocional)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const obtenerDevocionales = async (
  userId: string
) => {
  const { data, error } = await supabase
    .from('devocionales')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Actualizar un devocional
export const actualizarDevocional = async (
  id: number,
  devocional: {
    fecha: string
    versiculo: string
    lectura: string
    que_dice: string
    que_dios_quiere_mostrarme: string
    aplicacion: string
    compromiso: string
  }
) => {
  const { data, error } = await supabase
    .from('devocionales')
    .update(devocional)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Marcar o desmarcar un devocional como favorito
export const cambiarFavorito = async (
  id: number,
  favorito: boolean
) => {
  const { data, error } = await supabase
    .from('devocionales')
    .update({
      favorito,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Eliminar un devocional
export const eliminarDevocional = async (
  id: number
) => {
  const { error } = await supabase
    .from('devocionales')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}