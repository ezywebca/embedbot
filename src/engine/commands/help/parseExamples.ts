import { client } from 'engine'
import pipe from 'function-pipe'

const prettifyExamples = (command, examples) =>
  examples.map(
    example => `:pencil: <@!${client.user.id}> __${command}__ __${example}__`
  )
const joinExamples = examples => examples.join('\n')

const parseExamples = pipe(prettifyExamples, joinExamples)

export default parseExamples
