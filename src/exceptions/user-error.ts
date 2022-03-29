export const UserErrorName = 'UserError'

export class UserError extends Error {
  constructor(public message: string) {
    super(message)

    this.name = UserErrorName
  }
}

export default UserError
