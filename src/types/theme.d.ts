export interface Colors {
  primary: string
  background: string
  accent: string
}

interface Theme {
  colors: Colors
  css: string
}

export default Theme
