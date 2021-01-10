function template(string, context = {}) {
  const scope = Object.keys(context).reduce(
    (prev, key) => `${prev}var ${key}=${JSON.stringify(context[key])};`,
    ''
  )

  return eval(`${scope}\`${string}\``)
}

export default template
