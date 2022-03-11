import React, { FC } from 'react'
import { Table, Button, StatusIndicator } from '@reapit/elements'
import { TableProps } from './table-type'

export const TableResult: FC<TableProps> = (props) => {
  if (!props.items || !props.items.length) return null

  return (
    <Table
      rows={props.items?.map(({ surname, primaryAddress, identityCheck }) => ({
        cells: [
          {
            label: 'Name',
            value: surname ?? '',
            narrowTable: {
              showLabel: true,
            },
          },
          {
            label: 'Address',
            value: primaryAddress?.buildingName ?? '',
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
                <StatusIndicator intent="critical" /> Pending
              </>
            ),
          },
          {
            label: 'Action',
            value: <Button intent="primary">Edit</Button>,
            narrowTable: {
              showLabel: true,
            },
          },
        ],
        expandableContent: {
          content: '',
        },
      }),
    )}      
    />
  )
}

export default TableResult
