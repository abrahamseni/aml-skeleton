import React from 'react'

interface InputErrorProps {
  message: string | undefined
}
const InputError: React.FC<InputErrorProps> = ({ message }): React.ReactElement => {
  return <p className="el-input-error">{message}</p>
}

export default InputError
