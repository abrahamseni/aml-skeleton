import React from 'react'
import propsRepo from 'utils/mocks/props-repo'

const RPFileInput = jest.requireActual('@reapit/elements').FileInput

export const FileInput = React.forwardRef((props, ref) => {
  propsRepo.props[props['data-testid']] = props
  return <RPFileInput {...props} ref={ref} />
})
