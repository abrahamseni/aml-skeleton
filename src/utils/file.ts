import { isDataUrl } from './url'

export const getFileExtensionsFromDataUrl = (data: string) => {
  if (!isDataUrl(data)) {
    return ''
  }
  const base64ArrayData = data.split('/')
  const extensionArray = base64ArrayData?.[1]?.split(';')
  const extension = extensionArray[0]
  return extension
}
