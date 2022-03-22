import React from 'react'
import propsRepo from 'utils/mocks/props-repo'

const FileInputExporteds = jest.requireActual('../file-input')

const FileInput = React.forwardRef((props, ref) => {
  ref
  propsRepo.props[props['data-testid']] = props
  return <></>
})

module.exports = {
  __esModule: true,
  ...FileInputExporteds,
  FileInput,
}

export {}
