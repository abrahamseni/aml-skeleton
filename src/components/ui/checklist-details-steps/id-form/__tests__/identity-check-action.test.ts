import { useSaveIdentityDocument } from '../identity-check-action'
import { renderHook } from '@testing-library/react-hooks'
import { wait } from 'utils/test'
import {
  createIdentityCheck as createIdentityCheckMock,
  updateIdentityCheck as updateIdentityCheckMock,
} from 'platform-api/identity-check-api'
import { mockBrowserSession } from 'core/__mocks__/connect-session'
import { now as nowMock } from 'utils/date'
import dayjs from 'dayjs'

jest.unmock('@reapit/connect-session')
jest.mock('core/connect-session')
jest.mock('platform-api/identity-check-api')
jest.mock('utils/date')

const createIdentityCheck: jest.Mock = createIdentityCheckMock as any
const updateIdentityCheck: jest.Mock = updateIdentityCheckMock as any
const now: jest.Mock = nowMock as any

describe('identity check action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useSaveIdentityDocument can create new identityCheck with document 1', async () => {
    const contact = {
      id: '123',
    }
    const idDocument = {
      idType: 'id123',
      idReference: 'ref123',
      expiryDate: '2021-10-31',
      documentFile: 'data:image/png;base64,',
    }
    const currentTime = dayjs('2021-10-24')
    now.mockReturnValueOnce(currentTime)

    const { result } = renderHook(() => useSaveIdentityDocument(1))
    await wait(0)
    result.current(contact, undefined, idDocument)

    expect(createIdentityCheck).toHaveBeenCalledTimes(1)
    expect(createIdentityCheck.mock.calls[0][0]).toEqual({
      contactId: contact.id!,
      identityDocument1: {
        typeId: idDocument.idType,
        details: idDocument.idReference,
        expiry: idDocument.expiryDate,
        fileData: idDocument.documentFile,
        name: `${contact.id}-${idDocument.idType}-${idDocument.idReference}.png`,
      },
      status: 'pending',
      checkDate: currentTime.format('YYYY-MM-DD'),
      negotiatorId: mockBrowserSession().loginIdentity.userCode,
    })
  })

  test('useSaveIdentityDocument can update identityCheck with document 1', async () => {
    const contact = {
      id: '123',
    }
    const idCheck = {
      id: 'idc123',
      _eTag: 'etag-123',
    }
    const idDocument = {
      idType: 'id123',
      idReference: 'ref123',
      expiryDate: '2021-10-31',
      documentFile: 'data:image/png;base64,',
    }
    const currentTime = dayjs('2021-10-24')
    now.mockReturnValueOnce(currentTime)

    const { result } = renderHook(() => useSaveIdentityDocument(1))
    await wait(0)
    await result.current(contact, idCheck, idDocument)

    expect(updateIdentityCheck).toHaveBeenCalledTimes(1)
    expect(updateIdentityCheck.mock.calls[0][0]).toEqual({
      id: idCheck.id,
      _eTag: idCheck._eTag,
      identityDocument1: {
        typeId: idDocument.idType,
        details: idDocument.idReference,
        expiry: idDocument.expiryDate,
        fileData: idDocument.documentFile,
        name: `${contact.id}-${idDocument.idType}-${idDocument.idReference}.png`,
      },
    })
  })

  test('useSaveIdentityDocument can update identityCheck with document 2', async () => {
    const contact = {
      id: '123',
    }
    const idCheck = {
      id: 'idc123',
      _eTag: 'etag-123',
    }
    const idDocument2 = {
      idType: 'id456',
      idReference: 'ref456',
      expiryDate: '2021-11-20',
      documentFile: 'data:image/png;base64,',
    }
    const currentTime = dayjs('2021-11-30')
    now.mockReturnValueOnce(currentTime)

    const { result } = renderHook(() => useSaveIdentityDocument(2))
    await wait(0)
    await result.current(contact, idCheck, idDocument2)

    expect(updateIdentityCheck).toHaveBeenCalledTimes(1)
    expect(updateIdentityCheck.mock.calls[0][0]).toEqual({
      id: idCheck.id,
      _eTag: idCheck._eTag,
      identityDocument2: {
        typeId: idDocument2.idType,
        details: idDocument2.idReference,
        expiry: idDocument2.expiryDate,
        fileData: idDocument2.documentFile,
        name: `${contact.id}-${idDocument2.idType}-${idDocument2.idReference}.png`,
      },
    })
  })

  test("useSaveIdentityDocument doesn't send document file if document file is a data url", async () => {
    const contact = {
      id: '123',
    }
    const idCheck = {
      id: 'idc123',
      _eTag: 'etag-123',
    }
    const idDocument = {
      idType: 'id123',
      idReference: 'ref123',
      expiryDate: '2021-10-31',
      documentFile: 'http://example.com/image.png',
    }
    const currentTime = dayjs('2021-10-24')
    now.mockReturnValueOnce(currentTime)

    const { result } = renderHook(() => useSaveIdentityDocument(1))
    await wait(0)
    await result.current(contact, idCheck, idDocument)

    expect(updateIdentityCheck).toHaveBeenCalledTimes(1)
    expect(updateIdentityCheck.mock.calls[0][0]).toEqual({
      id: idCheck.id,
      _eTag: idCheck._eTag,
      identityDocument1: {
        typeId: idDocument.idType,
        details: idDocument.idReference,
        expiry: idDocument.expiryDate,
      },
    })
  })

  test("useSaveIdentityDocument can't update identityCheck with document 2 if identityCheck doesn't have yet created", async () => {
    const contact = {
      id: '123',
    }
    const idCheck = undefined
    const idDocument2 = {
      idType: 'id456',
      idReference: 'ref456',
      expiryDate: '2021-11-20',
      documentFile: 'data:image/png;base64,',
    }

    const { result } = renderHook(() => useSaveIdentityDocument(2))
    await wait(0)

    await expect(() => result.current(contact, idCheck, idDocument2)).toThrow(
      new Error(
        'Cannot update "identityDocument2" on identityCheck resource if "identityDocument1" property doesn\'t exist or identityCheck doesn\'t exist',
      ),
    )
    expect(createIdentityCheck).toHaveBeenCalledTimes(0)
  })

  test("useSaveIdentityDocument can't create new identityCheck if user is not authorized", async () => {
    const contact = {
      id: '123',
    }
    const idCheck = undefined
    const idDocument = {
      idType: 'id123',
      idReference: 'ref123',
      expiryDate: '2021-10-31',
      documentFile: 'data:image/png;base64,',
    }
    mockBrowserSession.mockReturnValueOnce({
      loginIdentity: {
        userCode: null,
      },
    } as any)

    const { result } = renderHook(() => useSaveIdentityDocument(1))
    await wait(0)

    expect(
      result.current(contact, idCheck, idDocument, {
        onError(error) {
          expect(error).toEqual(
            new Error(
              'You are not currently logged in as negotiator. The Reapit Platform API only supports Identity Checks performed by negotiators. As such, you your data will not be saved and you will need to log in as another user to complete this action.',
            ),
          )
        },
      }),
    )
    await wait(0)
    expect(createIdentityCheck).toHaveBeenCalledTimes(0)
  })
})
