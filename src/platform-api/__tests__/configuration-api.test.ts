import { getIdentityDocumentTypes } from '../configuration-api'
getIdentityDocumentTypes
// import { ListItemModel } from '@reapit/foundations-ts-definitions'
// import { mockBrowserSession } from '../__mocks__/session'

// const mockedFetch = jest.spyOn(window, 'fetch')
// const mockConfigurationAppointments = [
//   {
//     id: 'some_id',
//     value: 'some_value',
//   },
// ] as ListItemModel[]

// describe('configurationApiService', () => {
//   it('should return a response from the config service', async () => {
//     expect(await getIdentityDocumentTypes(mockBrowserSession)).toEqual(mockConfigurationAppointments)
//     expect(mockedFetch).toHaveBeenCalledTimes(1)
//   })

//   it('should catch an error if no response from config service', async () => {
//     const errorSpy = jest.spyOn(console, 'error')
//     await getIdentityDocumentTypes(mockBrowserSession)
//     expect(errorSpy).toHaveBeenCalledWith(
//       'Error fetching Identity Document Types',
//     )
//   })
// })
