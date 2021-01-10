import { Role } from './message'

export interface Member {
  name: string
  type: 'member' | 'bot' | 'guest'
  avatar: string
  id: string
  color: string
  roles: Role[]
}
