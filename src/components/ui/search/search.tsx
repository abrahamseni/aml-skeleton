import React, { FC } from 'react'
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
  searchPageNumber: number
}

export const SearchPage: FC = () => {
  const [searchParams, setSearchParams] = React.useState<SearchContactParam>({})
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchFieldValue>()

  const onSubmit = (e: SearchFieldValue) =>
    setSearchParams({
      pageSize: 10,
      pageNumber: 1,
      name: e.searchName,
      address: e.searchAddress,
      identityCheck: e.searchIdStatus,
    })

  const result = useFetchContactsBy(searchParams)

  const handleReset = () => {
    reset()
    setSearchParams({})
  }

  console.log(result)

  return (
    <FlexContainer isFlexAuto isFlexColumn className={cx(elRowGap6)}>
      <Subtitle>Client Search</Subtitle>
      <FlexContainer className={cx(elWFull)}>
        <form className={cx(elWFull, elFlexJustifyCenter)} onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <FormLayout hasMargin>
            <InputWrap>
              <InputGroup
                label="Search by name"
                type="text"
                id="name"
                placeholder="Firstname or Surname"
                {...register('searchName', { required: true })}
                errorMessage={errors.searchName?.type === 'required' ? '*Name is required' : ''}
                data-testid={'test.input.searchName'}
              />
            </InputWrap>
            <InputWrap>
              <InputGroup
                label="Search by address"
                type="text"
                id="address"
                placeholder="Streetname, Village, Town or Postcode"
                {...register('searchAddress')}
                data-testid={'test.input.searchAddress'}
              />
            </InputWrap>
            <InputWrap>
              <Label>Search by ID Status</Label>
              <Select
                placeholder="Please select..."
                defaultValue=""
                {...register('searchIdStatus')}
                data-testid={'test.select.searchIdStatus'}
              >
                {ID_STATUS.map((status, index) => {
                  return (
                    <option
                      key={status.value}
                      value={status.value}
                      disabled={index === 0}
                      data-testid={'test.option.status'}
                    >
                      {status.label}
                    </option>
                  )
                })}
              </Select>
            </InputWrap>
            <InputWrapFull>
              <ButtonGroup alignment="right">
                <Button type="reset" intent="low" onClick={handleReset} data-testid={'test.button.reset'}>
                  Reset form
                </Button>
                <Button type="submit" intent="primary" chevronRight data-testid={'test.button.search'}>
                  Search
                </Button>
              </ButtonGroup>
            </InputWrapFull>
          </FormLayout>
        </form>
      </FlexContainer>
      <FlexContainer className={cx(elWFull)}>
        {result.status === 'loading' ? (
          <Loader label="Loading" />
        ) : (
          <>
            {!searchParams || Number(result.data?._embedded?.length) === 0 ? (
              <PersistantNotification
                data-testid={'test.persistantnotification.notfound'}
                isExpanded={true}
                isFullWidth
              >
                No search results
              </PersistantNotification>
            ) : (
              <TableResult items={result?.data?._embedded} />
            )}
          </>
        )}
      </FlexContainer>
      {result.status === 'success' ? (
        <FlexContainer className={cx(elWFull)}>
          <Pagination
            callback={(nextPage: number) =>
              setSearchParams((prevValue) => {
                return {
                  ...prevValue,
                  pageNumber: nextPage,
                }
              })
            }
            currentPage={searchParams.pageNumber ?? 1}
            numberPages={result?.data?.totalPageCount ?? 1}
            data-testid={'test.pagination.result'}
          />
        </FlexContainer>
      ) : null}
    </FlexContainer>
  )
}

export default SearchPage
