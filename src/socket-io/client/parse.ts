import Messages from './messages'
import { Expect } from './util'

export interface IRegister {
  server: string
  subscriptions: string[]
  token: string
}
export async function register(data): Promise<IRegister> {
  Expect(data, 'object', 'data')
  Expect(data.server, 'string', 'data.server')
  Expect(data.subscriptions, 'array', 'data.server')
  // TODO: Remove no token check
  !data.token || Expect(data.token, ['string', 'null_'], 'data.token')

  return data
}

export interface ISignUp {
  name: string
}
export async function signUp(data): Promise<ISignUp> {
  Expect(data, 'object', 'data')
  Expect(data.name, 'string', 'data.name')
  Expect(
    data.name,
    name => name.length >= 2,
    value => Messages.ERROR('data.name', 'greater than', '2', value.length)
  )
  Expect(
    data.name,
    name => name.length < 32,
    value => Messages.ERROR('data.name', 'less than', '32', value.length)
  )

  return data
}

export interface IMessage {
  channel: string
  message: string
}
export async function message(data): Promise<IMessage> {
  await Expect(data, 'object', 'data')
  await Expect(data.channel, 'string', 'data.channel')
  await Expect(data.message, 'string', 'data.message')
  await Expect(
    data.message,
    string => string.length !== 0,
    value => Messages.ERROR('data.message', 'greater than', '0', value.length)
  )

  return data
}

export interface IInvite {
  channel: string
}
export async function invite(data): Promise<IInvite> {
  await Expect(data, 'object', 'data')
  await Expect(data.channel, 'string', 'data.channel')

  return data
}
