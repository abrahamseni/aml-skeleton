import React from 'react'

type Props = {
  data: {}
}
const SecondaryId = ({ data }: Props) => {
  console.log({ data })

  return <div>SecondaryId</div>
}

export default SecondaryId
