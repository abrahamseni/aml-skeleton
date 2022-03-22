import * as Yup from 'yup'

export class FileValidation extends Yup.BaseSchema {
  static create() {
    return new FileValidation()
  }

  constructor() {
    super({
      type: 'fileFormValue',
    })
  }

  protected _typeCheck(_value: any): _value is any {
    return true
  }

  required(message?: string) {
    const aMessage = message || '${path} must be provided'
    return this.test({
      message: aMessage,
      name: 'fileIsRequired',
      test: (value) => {
        if (isAbsent(value)) {
          return false
        }

        if (typeof value === 'string' && value !== '') {
          return true
        }

        return false
      },
    })
  }

  maxSize(max: number, message?: string) {
    const megabytes = max
    const bytes = megabytes * 1024 * 1024
    const aMessage = message || '${path} cannot be larger than ${max}MB'

    return this.test({
      message: aMessage,
      name: 'fileMaxSize',
      params: {
        max,
      },
      test: (value) => {
        if (isAbsent(value)) {
          return true
        }

        if (typeof value !== 'string' || value === '') {
          return true
        }

        const base64 = value as string
        const base64Token = 'base64,'
        const onlyBase64 = base64.substring(base64.indexOf(base64Token) + base64Token.length)
        const decoded = window.atob(onlyBase64)

        const fileSize = decoded.length
        if (fileSize <= bytes) {
          return true
        }

        return false
      },
    })
  }
}

function isAbsent(value) {
  if (value === null || value === undefined) {
    return true
  }
  return false
}

export default FileValidation
