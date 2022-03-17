/* eslint-disable no-confusing-arrow */
export const notificationMessage = {
  SUCCESS: (formName: string) => `Successfully update ${formName} data`,
  ERROR: (errorMessage: string | undefined) =>
    errorMessage ? `${errorMessage}` : 'Something is not working, try to reload your browser',
  /**
   * Address Information Form
   */
  AIF_SUCCESS: 'Successfully update address data',
  AIF_ERROR: 'Something is not working, try to reload your browser',
  /**
   * DRM Form
   */
  DRM_SUCCESS: 'Successfully update declaration risk management',
  DRM_ERROR: 'Something is not working, try to reload your browser',

  PI1_SUCCESS: 'Successfully update primary id',
  PI1_ERROR: 'Cannot update primary id, try to reload your browser',

  PI2_SUCCESS: 'Successfully update secondary id',
  PI2_ERROR: 'Cannot update secondary id, try to reload your browser',
}
