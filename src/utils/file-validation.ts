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

        const url = value.url
        if (url !== undefined && typeof url === 'string' && url !== '') {
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

        const size = value.size
        if (isAbsent(size) || typeof size !== 'number') {
          return true
        }
        if (size <= bytes) {
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
