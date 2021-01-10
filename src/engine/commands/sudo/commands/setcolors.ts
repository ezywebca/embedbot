import { IArgs } from 'engine/commands/types'
import { Colors } from '../../../../types/theme'
import { Fetch, Update } from 'database/server'

interface IColor {
  name?: string
  color?: string
  invalid: boolean
}

const parser = /^(.*)=(#.*)$/
const isID = /^\d+$/
const format = (regexResult: RegExpExecArray): IColor => {
  if (!regexResult) return { invalid: true }
  return {
    name: regexResult[1],
    color: regexResult[2],
    invalid: false
  }
}
const names = ['primary', 'background', 'accent']

const setcolors = ({ payload, message }: IArgs) => {
  const serverID = payload.split(' ').shift()

  if (!isID.test(serverID)) {
    return message.reply('Server ID invalid!')
  }

  var colorsArray = payload
    .split(' ')
    .splice(1)
    .map(arg => parser.exec(arg))
    .map(format)
  const colors: Colors = {} as Colors

  colorsArray.forEach(
    color =>
      !color.invalid && names.includes(color.name)
        ? (colors[color.name] = color.color)
        : ''
  )

  Fetch(serverID)
    .then(oldStore => {
      const store = oldStore

      for (const colorKey in colors) {
        const color = colors[colorKey]
        store.theme.colors[colorKey] = color
      }

      Update(serverID, store).then(() => {
        message.reply('Done!')
      })
    })
    .catch(error => {
      message.reply(
        'Operation failed. Make sure to use the correct command structure!'
      )
    })
}

export default setcolors
