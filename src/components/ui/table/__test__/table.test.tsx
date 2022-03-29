import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AxiosMockAdapter from 'axios-mock-adapter'
import Axios from 'axios/axios'
import { TableResult } from '../table'
import { SearchPage } from '../../search/search'
// import { } from '@reapit/elements'
import { TableProps } from '../table-type'
import { CONTACT_MOCK_DATA_1, CONTACT_MOCK_DATA_2 } from '../../../../platform-api/__mocks__/contact-api.mock'
import { URLS } from '../../../../constants/api'
import { SearchContactParam } from 'platform-api/contact-api'

const axiosMock = new AxiosMockAdapter(Axios, {
    onNoMatch: 'throwException',
  })
  
jest.mock('@reapit/elements', () => jest.requireActual('utils/mocks/reapit-element-mocks'))
jest.unmock('@reapit/connect-session')
jest.mock('../../../../core/connect-session')

//table show should same with the search
describe('Table Show', () => {

    beforeEach(() => {
        jest.clearAllMocks()
        axiosMock.reset()
    })

    it('should match a snapshot when success status / isLoading false', () => {
        expect(renderComponent(defaultTableProps)).toMatchSnapshot()
    })

    it('should match a snapshot when loading status / isLoading true', () => {
        expect(renderNullComponent(nullTableProps)).toMatchSnapshot()
    })

    it('onSubmit to have been called ', async () => {
        const { getByTestId } = renderSearch(defaultSearchParams);
        // Arrange
        const form = getByTestId('form');
        // Act
        fireEvent.submit(form);
        // Assert
        expect(renderSearch(defaultSearchParams)).toHaveBeenCalled();
    })

    // it('search by name, table should show data with right name', () => {
        
    // })

    // it('search by city, table should show data with right city', () => {
        
    // })

    // it('search by status, table should show data with right status', () => {
        
    // })

    // it('search by name that is not in the database, table should show Not Found notification', () => {
        
    // })

    // it('reset form, table & search form should be empty', () => {
        
    // })

})



const renderComponent = (props) => {
    return render(<TableResult {...props} items={defaultTableProps} />)
}

const renderNullComponent = (props) => {
    return render(<TableResult {...props} items={nullTableProps} />)
}

const renderSearch = (props) => {
    return render(<SearchPage {...props} onSubmit={defaultSearchParams} />)
}

const nullTableProps: TableProps = {
    items: {},
}

const defaultTableProps: TableProps = {
    items: CONTACT_MOCK_DATA_1,
} 

const defaultSearchParams: SearchContactParam = {
    name: 'NoName',
    address: '',
    identityCheck: ''
}
