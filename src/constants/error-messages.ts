export const errorMessages = {
  DEFAULT_SERVER_ERROR: 'Something went wrong fetching data',
  DEFAULT_COMPONENT_ERROR: 'Something went wrong with this component',
  FIELD_REQUIRED: 'Required',
  FIELD_WRONG_EMAIL_FORMAT: 'Invalid email format',
  FIELD_WRONG_URI_FORMAT: 'Invalid uri format',
  FIELD_MUST_CAPITALIZE: 'Field must filled with Capitalize format',
  FIELD_GENERAL_ERROR: (name?: string) => `Please enter a valid ${name || 'value'}`,
  MINIMUM_CHARACTER_LENGTH: (min: number) => `The minimum length is ${min} characters`,
  MAXIMUM_CHARACTER_LENGTH: (max: number) => `The maximum length is ${max} characters`,
  WRONG_FILE_TYPE: 'Invalid image file (must be png, jpg, jpeg or svg)',
  EXCEEDED_MAX_FILE_SIZE: 'Image or document file cannot be larger than ${max}MB',
}
