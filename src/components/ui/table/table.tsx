import React, { FC } from 'react'
import { Table, Button, StatusIndicator } from '@reapit/elements'
import { TableProps } from './table-type'
import { useHistory } from 'react-router'

export const TableResult: FC<TableProps> = (props) => {
  if (!props.items || !props.items.length) return null

  let history = useHistory();

  return (
    <Table
      numberColumns={5}
      rows={props.items?.map(({ id,surname,forename, primaryAddress, identityCheck }) => ({
        cells: [
          {
            label: 'Name',
            value: surname+' '+forename ?? '',
            narrowTable: {
              showLabel: true,
            },
          },
          {
            label: 'Address',
            value: primaryAddress?.buildingName+' '+primaryAddress?.line1+' '+primaryAddress?.line2+' '+primaryAddress?.line3+' '+primaryAddress?.line4 ?? '',
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
                <StatusIndicator intent="critical" /> {identityCheck}
              </>
            ),
          },
          {
            label: 'Action',
            value: <Button intent="primary" onClick={() => history.push(`/checklist-detail/${id}`)}>Edit</Button>,
            narrowTable: {
              showLabel: true,
            },
          },
        ],
      }),
    )}      
    />
  )
}

export default TableResult
