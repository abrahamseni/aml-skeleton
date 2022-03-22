import { FileInput as RPFileInput, FileInputWrapped } from '@reapit/elements'
import React from 'react'

export const FileInput: FileInputWrapped = React.forwardRef(
  ({ onChange, onBlur, ...rest }, ref: React.ForwardedRef<React.InputHTMLAttributes<HTMLInputElement>>) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange && onChange(e)

      const blurEvent: any = {
        type: 'blur',
        relatedTarget: null,
        target: e.target,
      }
      onBlur && onBlur(blurEvent)
    }
    return <RPFileInput {...rest} onChange={handleChange} ref={ref} />
  },
)

export default FileInput
