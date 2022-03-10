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
  Select,
  Subtitle,
  Table,
  TableHeadersRow,
  TableHeader,
  TableRowContainer,
  TableRow,
  TableCell,
  StatusIndicator,
  TableCtaTriggerCell,
} from '@reapit/elements'
import { cx } from '@linaria/core'
import { ID_STATUS } from '../../../constants/id-status'
import { useForm } from 'react-hook-form'
import { SearchContactParam, useFetchContactsBy } from '../../../platform-api/contact-api'

export type SearchableDropdownKey = {
  id: string
  name: string
}

export type SearchFieldValue = {
  searchName: string
  searchAddress: string
  searchIdStatus: string
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
  console.log(result)

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
                <Button type="reset" intent="low">
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
        <Table data-num-columns-excl-action-col="4" data-has-call-to-action>
          <TableHeadersRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Postcode</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableHeadersRow>
          <TableRowContainer>
            <TableRow>
              <TableCell narrowLabel="Name" icon="usernameSystem">
                Mr Johnny Corrigan
              </TableCell>
              <TableCell narrowLabel="Address" icon="homeSystem" narrowIsFullWidth>
                Mt Ash Jacket Brassey Road
              </TableCell>
              <TableCell narrowLabel="Postcode">57146</TableCell>
              <TableCell narrowLabel="Status">
                <StatusIndicator intent="critical" /> Pending
              </TableCell>
              <TableCtaTriggerCell>
                <Button>Edit</Button>
              </TableCtaTriggerCell>
            </TableRow>
          </TableRowContainer>
        </Table>
      </FlexContainer>
    </FlexContainer>
  )
}

export default SearchPage
