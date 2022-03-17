export const useSaveIdentityDocument = () => {
  return saveIdentityDocument
}

export const saveIdentityDocument = jest.fn()

export const getSaveIdentityDocument = (module: any): typeof saveIdentityDocument => module.saveIdentityDocument
