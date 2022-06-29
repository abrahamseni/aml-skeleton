import React from 'react'
import { render } from '@testing-library/react'
import AxiosMockAdapter from 'axios-mock-adapter'
import Axios from 'axios/axios'
import { TableResult } from '../table'
import { TableProps } from '../table-type'
import { CONTACT_MOCK_DATA_1 } from '../../../../platform-api/__mocks__/contact-api.mock'

const axiosMock = new AxiosMockAdapter(Axios, {
  onNoMatch: 'throwException',
})

//table show should same with the search
describe('Table Show & Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosMock.reset()
  })

  describe('Snapshot', () => {
    it('snapshot table', () => {
      expect(render(<TableResult items={defaultTableProps} />)).toMatchSnapshot()
    })
  })
})

const defaultTableProps: TableProps = {
  items: CONTACT_MOCK_DATA_1,
}
