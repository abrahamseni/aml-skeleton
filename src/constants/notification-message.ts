export const notificationMessage = {
  SUCCESS: (formName: string) => `Successfully update ${formName} data`,
  ERROR: (errorMessage: string | undefined) => {
    return errorMessage ? `${errorMessage}` : 'Something went wrong, try to reload your browser'
  },
  AIF_SUCCESS: 'Successfully update address data',
  AIF_ERROR: 'Something is not working, try to reload your browser',
  DRM_SUCCESS: 'Successfully update declaration risk management',
  DRM_ERROR: 'Failed to submit Declaration Risk Management form',
  PI1_SUCCESS: 'Successfully update primary id',
  PI1_ERROR: 'Cannot update primary id, try to reload your browser',
  PI2_SUCCESS: 'Successfully update secondary id',
  PI2_ERROR: 'Cannot update secondary id, try to reload your browser',
  NOT_MATCH_E_TAG:
    'We are unable to save your changes as this record has recently been updated in AgencyCloud. Please close and reopen the app to ensure you are seeing the most up to date contact information',
}
