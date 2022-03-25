import {
  generateLabelField,
  generateOptionsType,
  generateOptionsYearsOrMonths,
  generateProgressBarResult,
  generateTestId,
} from 'utils/generator'
import { TAB_SECTION_MOCK_CONTENT } from 'utils/__mocks__/tab-mocks'

describe('generateOptionsYearsOrMonths', () => {
  describe('generate months option', () => {
    const monthsOption = generateOptionsYearsOrMonths('months')

    it('should generate exactly 12 options', () => {
      expect(monthsOption.length).toEqual(12)
    })

    it('first option value should start with 1', () => {
      const firstOption = monthsOption[0]

      expect(firstOption.value).toMatch(/1/i)
    })

    it('last option value should ended with 12', () => {
      const lastOption = monthsOption[11]

      expect(lastOption.value).toMatch(/12/i)
    })
  })

  describe('generate years option', () => {
    const yearsOption = generateOptionsYearsOrMonths('years')

    it('should generate exactly 101 options', () => {
      expect(yearsOption.length).toEqual(101)
    })

    it('first option value should start with 0', () => {
      const firstOption = yearsOption[0]

      expect(firstOption.value).toMatch(/0/i)
    })

    it('last option value should start with 100', () => {
      const firstOption = yearsOption[100]

      expect(firstOption.value).toMatch(/100/i)
    })
  })
})

describe('generateOptionsType', () => {
  describe('documentType', () => {
    const documentTypeOptions = generateOptionsType('documentType')

    it('each of generated option should have 2 object keys', () => {
      const firstDocumentType = documentTypeOptions[0]
      const ObjectKeys = Object.keys(firstDocumentType)

      expect(ObjectKeys.length).toEqual(2)
      expect(ObjectKeys[0]).toMatch(/label/i)
      expect(ObjectKeys[1]).toMatch(/value/i)
    })

    it('should generate exactly 16 options', () => {
      const documentTypeOptionsLength = documentTypeOptions.length
      expect(documentTypeOptionsLength).toEqual(16)
    })

    it('should match value option', () => {
      const thirdDocumentType = documentTypeOptions[3]
      expect(thirdDocumentType.value).toMatch(/current council tax bill/i)

      const seventhDocumentType = documentTypeOptions[7]
      expect(seventhDocumentType.value).toMatch(/Current State Pension notification letter/i)
    })
  })

  describe('riskAssessmentType', () => {
    const riskAssessmentOptions = generateOptionsType('riskAssessmentType')

    it('each of generated option should have 2 object keys', () => {
      const firstDocumentType = riskAssessmentOptions[0]
      const ObjectKeys = Object.keys(firstDocumentType)

      expect(ObjectKeys.length).toEqual(2)
      expect(ObjectKeys[0]).toMatch(/label/i)
      expect(ObjectKeys[1]).toMatch(/value/i)
    })

    it('should generate exactly 4 options', () => {
      const riskAssessmentOptionsLength = riskAssessmentOptions.length
      expect(riskAssessmentOptionsLength).toEqual(4)
    })

    it('should match value option', () => {
      const thirdDocumentType = riskAssessmentOptions[3]
      expect(thirdDocumentType.value).toMatch(/enhanced/i)

      const seventhDocumentType = riskAssessmentOptions[2]
      expect(seventhDocumentType.value).toMatch(/normal/i)
    })
  })
})

describe('generateLabelField', () => {
  it('should  contain asterisk, when the second argument is true', () => {
    const generatedLabelString = generateLabelField('testString', true)

    expect(generatedLabelString).toContain('*')
  })

  it('should not contain asterisk, when the second argument is false', () => {
    const generatedLabelString = generateLabelField('testString', false)

    expect(generatedLabelString).not.toContain('*')
  })

  it('should not contain asterisk, if the second argument is empty', () => {
    const generatedLabelString = generateLabelField('testString')

    expect(generatedLabelString).not.toContain('*')
  })
})

describe('generateTestId', () => {
  it('should have "test." prefix on first argument', () => {
    const firstTest = generateTestId('isGenerated')
    expect(firstTest).toEqual('test.isGenerated')
  })
})

describe('generateProgressBarResult', () => {
  const mockGenerateProgressBar = generateProgressBarResult({ tabContents: TAB_SECTION_MOCK_CONTENT })
  it('should have 3 object keys', () => {
    const objectKeys = Object.keys(mockGenerateProgressBar)
    expect(objectKeys.length).toEqual(3)

    expect(objectKeys[0]).toMatch(/notComplete/i)
    expect(objectKeys[1]).toMatch(/complete/i)
    expect(objectKeys[2]).toMatch(/total/i)
  })

  it('"total" keys is a sum result between "complete" key and "notComplete" key', () => {
    const { complete, notComplete, total } = mockGenerateProgressBar

    expect(complete + notComplete).toEqual(total)
  })
})
