import React, { FC } from 'react'
import { Table, Button, StatusIndicator } from '@reapit/elements'
import { TableProps } from './table-type'
import { useHistory } from 'react-router'

const status ={
  pass:'success',
  fail:'danger',
  pending:'primary',
  cancelled:'secondary',
  warnings:'critical',
  unchecked:'',
}

export const TableResult: FC<TableProps> = (props) => {
  if (!props.items || !props.items.length) return null

  const history = useHistory();
  
  return (
    <Table
      numberColumns={5}
      rows={props.items?.map(({ id,surname,forename, primaryAddress, identityCheck }) => ({
        cells: [
          {
            label: 'Name',
            value: forename+' '+surname ?? '',
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
          cellContent: (<Button intent="primary" onClick={() => history.push(`/checklist-detail/${id}`)}>Edit</Button>)
        }
      }),
    )}      
    />
  )
}

export default TableResult
