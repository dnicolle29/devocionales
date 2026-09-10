export type Libro = {
  id: string
  name: string
  commonName: string
  title: string
  order: number
  numberOfChapters: number
  firstChapterNumber: number
  firstChapterApiLink: string
  lastChapterNumber: number
  lastChapterApiLink: string
  totalNumberOfVerses: number
}

export type Versiculo = {
  type: 'verse'
  number: number
  text: string
}