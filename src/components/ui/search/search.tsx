import React, { FC, useState } from 'react'
import {
  Button,
  ButtonGroup,
  elFlexJustifyCenter,
  elRowGap6,
  elWFull,
  FlexContainer,
  FormLayout,
  InputGroup,
  InputWrap,
  InputWrapFull,
  Label,
  Pagination,
  Select,
  Subtitle,
  PersistantNotification,
  Loader,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { ID_STATUS } from '../../../constants/id-status'
import { useForm } from 'react-hook-form'
import { SearchContactParam, useFetchContactsBy } from '../../../platform-api/contact-api'
import { TableResult } from '../table/table'

export type SearchableDropdownKey = {
  id: string
  name: string
}

export type SearchFieldValue = {
  searchName: string
  searchAddress: string
  searchIdStatus: string
}

export type ContactsParams = SearchFieldValue & {
  pageNumber: number
}

export const fnChangePage = (setPageNumber: (page: number) => void) => (page: number) => {
  setPageNumber(page)
}

export const fnFetchContacts =
  (search: SearchFieldValue | null, pageNumber: number, fetchContacts: (params: ContactsParams) => void) => () => {
    if (search) {
      fetchContacts({ ...search, pageNumber })
    }
  }

export const SearchPage: FC = () => {
  const [searchParams, setSearchParams] = React.useState<SearchContactParam | {}>({})
  const { register, handleSubmit, reset } = useForm<SearchFieldValue>()
  const onSubmit = (e: SearchFieldValue) =>
    setSearchParams({
      name: e.searchName,
      address: e.searchAddress,
      identityCheck: e.searchIdStatus,
    })
  const result = useFetchContactsBy(searchParams)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState<number>(1)

  console.log(result)
  console.log(searchParams)

  const handleReset = () => {
    reset()
    setSearchParams({})
  }

  const handleChangePage = React.useCallback(fnChangePage(setPageNumber), [pageNumber])

  return (
    <FlexContainer isFlexAuto isFlexColumn className={cx(elRowGap6)}>
      <Subtitle>Client Search</Subtitle>
      <FlexContainer className={cx(elWFull)}>
        <form className={cx(elWFull, elFlexJustifyCenter)} onSubmit={handleSubmit(onSubmit)}>
          <FormLayout hasMargin>
            <InputWrap>
              <InputGroup
                label="Search by name"
                type="text"
                id="name"
                placeholder="Firstname or Surname"
                {...register('searchName')}
              />
            </InputWrap>
            <InputWrap>
              <InputGroup
                label="Search by address"
                type="text"
                id="address"
                placeholder="Streetnam, Village, Town or Postcode"
                {...register('searchAddress')}
              />
            </InputWrap>
            <InputWrap>
              <Label>Search by ID Status</Label>
              <Select placeholder="Please select..." defaultValue="" {...register('searchIdStatus')}>
                {ID_STATUS.map((status, index) => {
                  return (
                    <option key={status.value} value={status.value} disabled={index === 0}>
                      {status.label}
                    </option>
                  )
                })}
              </Select>
            </InputWrap>
            <InputWrapFull>
              <ButtonGroup alignment="right">
                <Button type="reset" intent="low" onClick={handleReset}>
                  Reset form
                </Button>
                <Button type="submit" intent="primary" chevronRight>
                  Search
                </Button>
              </ButtonGroup>
            </InputWrapFull>
          </FormLayout>
        </form>
      </FlexContainer>
      <FlexContainer>       

        {result.status === 'loading' ? (
           <Loader label="Loading" />
          ) : (
            <>
              {!searchParams || Number(result.data?._embedded?.length) === 0 ? (
                <PersistantNotification isExpanded={true} isFullWidth>
                  No search results
                </PersistantNotification>
              ) : (
                <>
                  <TableResult items={result?.data?._embedded} />  
                  {/* <Pagination callback={handleChangePage} currentPage={result?.data?.pageNumber} numberPages={result?.data?.pageSize}/> */}
                </>
              )}
            </>
          )}
      </FlexContainer>
    </FlexContainer>
  )
}

export default SearchPage
