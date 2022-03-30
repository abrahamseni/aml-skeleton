import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchPage } from '../../search/search'
import userEvent from '@testing-library/user-event'
import AxiosMockAdapter from 'axios-mock-adapter'
import Axios from 'axios/axios'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))
jest.unmock('@reapit/connect-session')
jest.mock('../../../../core/connect-session')

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.reset()
  })

  it('correctly search correctly', async () => {
    // const onSubmit = jest.fn()
    // render(<SearchPage />)
    // userEvent.type(screen.getByLabelText(/Search by name/i), 'will')
    // // userEvent.type(screen.getByLabelText(/Search by address/i), '')
    // userEvent.click(screen.getByRole('button', {name: /submit/i}))
    // await waitFor(() =>
    //     expect(onSubmit).toHaveBeenCalledWith({
    //         pageNumber: 1,
    //         pageSize: 1,
    //         name: 'will',
    //         address: '',
    //         identityCheck: '',
    //     }),
    // )
  })
})
