import React, { FC } from 'react'
import {
  FlexContainer,
  Table,
  TableHeadersRow,
  TableHeader,
  TableRowContainer,
  TableRow,
  TableCell,
  StatusIndicator,
  TableCtaTriggerCell,
  Button,
} from '@reapit/elements'

export const SearchPage: FC = () => {
  return (
    <>
      <FlexContainer isFlexAuto>search</FlexContainer>
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
              <StatusIndicator intent="critical" /> Complete
            </TableCell>
            <TableCtaTriggerCell>
              <Button>Edit</Button>
            </TableCtaTriggerCell>
          </TableRow>
        </TableRowContainer>
      </Table>
    </>
  )
}

export default SearchPage
