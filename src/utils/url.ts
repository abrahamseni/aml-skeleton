export const isDataUrl = (str: string) => {
  return str.startsWith('data:')
}

export const isObjectUrl = (str: string) => {
  return str.startsWith('blob:')
}

export const isSameOrigin = (url: string) => {
  const urlObj = new URL(url)

  if (urlObj.protocol === 'data:') {
    return true
  }
  if (urlObj.protocol === 'blob:') {
    return true
  }
  if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
    return urlObj.hostname === window.location.hostname
  }

  return false
}
