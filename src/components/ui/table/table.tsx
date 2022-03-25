import React, { FC } from 'react'
import { cx } from '@linaria/core'
import { Table, Button, StatusIndicator, elWFull } from '@reapit/elements'
import { TableProps } from './table-type'
import { useHistory } from 'react-router'
import { AddressModel } from '@reapit/foundations-ts-definitions'

const status = {
  pass: 'success',
  fail: 'danger',
  pending: 'primary',
  cancelled: 'secondary',
  warnings: 'critical',
  unchecked: '',
}

export const generateAddress = (address: AddressModel | undefined) => {
  if (!address) return
  const primaryAddress = address
  const addressKeys = ['buildingNumber', 'line1', 'line2', 'line3', 'line4']
  const filteredAddressEntries = Object.entries(primaryAddress)
    .filter(([key, value]) => addressKeys.includes(key) && value)
    .map(([, value]) => value)
    .join(', ')

  return filteredAddressEntries
}

export const TableResult: FC<TableProps> = (props) => {
  if (!props.items || !props.items.length) return null

  const history = useHistory()

  return (
    <Table
      className={cx(elWFull)}
      numberColumns={5}
      rows={props.items?.map(({ id, surname, forename, primaryAddress, identityCheck }) => ({
        cells: [
          {
            label: 'Name',
            value: forename + ' ' + surname ?? '',
            narrowTable: {
              showLabel: true,
            },
          },
          {
            label: 'Address',
            value: generateAddress(primaryAddress) ?? '',
            narrowTable: {
              showLabel: true,
            },
          },
          {
            label: 'Postcode',
            value: primaryAddress?.postcode ?? '',
            narrowTable: {
              showLabel: true,
            },
          },
          {
            label: 'Status',
            value: identityCheck ?? '',
            narrowTable: {
              showLabel: true,
            },
            children: (
              <>
                <StatusIndicator intent={status[identityCheck]} /> {identityCheck}
              </>
            ),
          },
        ],
        ctaContent: {
          cellContent: (
            <Button intent="primary" onClick={() => history.push(`/checklist-detail/${id}`)}>
              Edit
            </Button>
          ),
        },
      }))}
    />
  )
}

export default TableResult
