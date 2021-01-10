import Login from './login'
import Lookup from './lookup'
import Register from './register'

export { default as Register } from './register'
export { default as Login } from './login'
export { default as Lookup } from './lookup'

// Debugging
;(global as any).guest = { Register, Login, Lookup }
