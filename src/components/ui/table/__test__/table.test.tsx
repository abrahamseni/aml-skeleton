import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AxiosMockAdapter from 'axios-mock-adapter'
import Axios from 'axios/axios'
import { TableResult } from '../table'
import { SearchPage } from '../../search/search'
import { TableProps } from '../table-type'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from '../../../../platform-api/__mocks__/contact-api.mock'
import { URLS } from '../../../../constants/api'
import { SearchContactParam } from 'platform-api/contact-api'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

//table show should same with the search
describe('Table Show', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.reset()
  })

  it('should match a snapshot when success status / isLoading false', () => {
    expect(render(<TableResult items={defaultTableProps} />)).toMatchSnapshot()
  })

  it('should match a snapshot when loading status / isLoading true', () => {
    expect(render(<TableResult items={null} />)).toMatchSnapshot()
  })

  // it('onSubmit to have been called ', async () => {
  //     const { getByTestId } = renderSearch(defaultSearchParams);
  //     // Arrange
  //     const form = getByTestId('form');
  //     // Act
  //     fireEvent.submit(form);
  //     // Assert
  //     expect(renderSearch(defaultSearchParams)).toHaveBeenCalled();
  // })
})

const defaultTableProps: TableProps = {
  items: CONTACT_MOCK_DATA_1,
}

// const defaultSearchParams: SearchContactParam = {
//   name: 'NoName',
//   address: '',
//   identityCheck: '',
// }
