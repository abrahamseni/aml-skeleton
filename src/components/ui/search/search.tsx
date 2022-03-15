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
  Select,
  Subtitle,
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

export const SearchPage: FC = () => {
  const [searchParams, setSearchParams] = React.useState<SearchContactParam | {}>({})
  const { register, handleSubmit } = useForm<SearchFieldValue>()
  const onSubmit = (e: SearchFieldValue) =>
    setSearchParams({
      name: e.searchName,
      address: e.searchAddress,
      identityCheck: e.searchIdStatus,
    })
  const result = useFetchContactsBy(searchParams)
  const [currentPage, setCurrentPage] = useState(1);

  const handleResetForm = () => {
    setSearchParams({})
  }

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
                <Button type="reset" intent="low" onClick={handleResetForm}>
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
        {!searchParams || Number(result.data?._embedded?.length) === 0 ? (
              'No search results'
        ) : (
              <TableResult items={result?.data?._embedded} />
        )}
      </FlexContainer>
    </FlexContainer>
  )
}

export default SearchPage
