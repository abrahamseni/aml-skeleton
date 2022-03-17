import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from 'platform-api/__mocks__/contact-api.mock'
import * as CompletedSections from '../completed-sections'

describe('completed-section', () => {
  it('should return boolean', () => {
    // Profile
    expect(CompletedSections.isCompletedProfile(CONTACT_MOCK_DATA_1)).toBeTruthy()
    expect(CompletedSections.isCompletedProfile(CONTACT_MOCK_DATA_2)).toBeTruthy()

    // expect(CompletedSections.isCompletedPrimaryID(getSaveIdentityDocument)).toBeTruthy()
    // expect(CompletedSections.isCompletedSecondaryID(CONTACT_MOCK_DATA_1)).toBeTruthy()

    // Address
    expect(CompletedSections.isCompletedAddress(CONTACT_MOCK_DATA_1)).toBeTruthy()
    expect(CompletedSections.isCompletedAddress(CONTACT_MOCK_DATA_2)).not.toBeTruthy()

    // DRM
    expect(CompletedSections.isCompletedDeclarationRisk(CONTACT_MOCK_DATA_1)).toBeTruthy()
    expect(CompletedSections.isCompletedDeclarationRisk(CONTACT_MOCK_DATA_2)).not.toBeTruthy()
  })
})
