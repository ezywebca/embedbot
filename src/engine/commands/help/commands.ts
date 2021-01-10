import { IHelp } from 'engine/commands/types'
import * as R from 'ramda'
import { list } from '../list'

export type Command = [string, IHelp]

const getName = path => path.split('/')[1]
const getHelp = (paths): Command[] =>
  paths.map(path => [getName(path), list[path].help])
const filterHelp = (commands: Command[]) =>
  commands.filter(command => !!command[1])

export const commands = R.pipe(
  getHelp,
  filterHelp
)(Object.keys(list))
