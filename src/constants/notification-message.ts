export const notificationMessage = {
  SUCCESS: (formName: string) => `Successfully save ${formName} data`,
  ERROR: (errorMessage: string | undefined) => {
    return errorMessage ? `${errorMessage}` : 'Something went wrong, try to reload your browser'
  },
  FORM_SAVE_ERROR: (formName: string) => `Failed to save ${formName} form, try to reload your browser`,
  NOT_MATCH_E_TAG:
    'We are unable to save your changes as this record has recently been updated in AgencyCloud. Please close and reopen the app to ensure you are seeing the most up to date contact information',
}
