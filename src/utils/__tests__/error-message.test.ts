import { displayErrorMessage } from 'utils/error-message'
import { FormState } from 'react-hook-form'

type AvailableForm = {
  primaryAddress: {
    line1?: string
  }
  metadata: {
    primaryAddress?: {
      documentImage?: string
    }
  }
}
const formState: FormState<AvailableForm> = {
  isDirty: false,
  isSubmitSuccessful: false,
  isSubmitted: false,
  isSubmitting: false,
  isValid: false,
  isValidating: true,
  submitCount: 0,
  dirtyFields: {
    primaryAddress: {
      line1: false,
    },
    metadata: {
      primaryAddress: {
        documentImage: true,
      },
    },
  },
  touchedFields: {
    primaryAddress: {
      line1: true,
    },
    metadata: {
      primaryAddress: {
        documentImage: true,
      },
    },
  },
  errors: {
    primaryAddress: {
      line1: {
        message: undefined,
        type: 'required',
      },
    },
    metadata: {
      primaryAddress: {
        documentImage: {
          message: 'Required',
          type: 'required',
        },
      },
    },
  },
}

describe('generate error message from React Hook Form', () => {
  it('should return "error message", if error message is exist', () => {
    const primaryAddressDocumentImage = displayErrorMessage('metadata.primaryAddress.documentImage', formState)
    expect(primaryAddressDocumentImage).toMatch(/required/i)
  })

  it('not return "error message", if error message undefined', () => {
    const primaryAddressLine1 = displayErrorMessage('primaryAddress.line1', formState)
    expect(primaryAddressLine1).not.toBeDefined()
  })
})
