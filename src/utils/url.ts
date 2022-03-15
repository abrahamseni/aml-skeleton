export function isDataUrl(str: string) {
  return str.startsWith('data:')
}

export function isObjectUrl(str: string) {
  return str.startsWith('blob:')
}
