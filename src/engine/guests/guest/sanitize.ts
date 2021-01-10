/**
 * Escapes keywords by inserting an invisible space at the second position
 * @param message Message to escape
 * @param keywords Keywords to escape
 */
const Escape = (message: string, keywords: string[]) => {
  let escaped = message
  keywords.forEach(
    keyword =>
      (escaped = escaped
        .split(keyword)
        .join(`${keyword[0]}​${keyword.slice(1)}`))
  )
  return escaped
}

const sanitize = (message: string) => {
  message = Escape(message, ['@everyone', '@here', '](http'])
  return message
}

export default sanitize
