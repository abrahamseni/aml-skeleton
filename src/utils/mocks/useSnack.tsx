export const useSnack = () => {
  return {
    success,
    error,
  }
}

export const success = jest.fn()
export const error = jest.fn()
