import React, { useState } from 'react'
import { Modal, BodyText, InputGroup, Button } from '@reapit/elements'
import { ContactModel, IdentityCheckModel } from '@reapit/foundations-ts-definitions'

import { useUpdateIdentityCheck } from '../../../platform-api/identity-check-api'
import { GenerateProgressBarResult } from 'utils/generator'

type Props = {
  userData: ContactModel
  idCheck: IdentityCheckModel
  isModalStatusOpen: boolean
  setModalStatusOpen: React.Dispatch<React.SetStateAction<boolean>>
  progressBarStatus: GenerateProgressBarResult
}

const ModalStatus = ({ userData, idCheck, isModalStatusOpen, setModalStatusOpen, progressBarStatus }: Props) => {
  const [userStatus, setUserStatus] = useState<string>(userData!.identityCheck!)
  const { updateIdentityCheck } = useUpdateIdentityCheck()
  // const createIdentityCheck = useCreateIdentityCheck()

  const handleUpdateStatus = () => {
    return updateIdentityCheck({ id: idCheck.id!, _eTag: idCheck._eTag!, status: userStatus, contactId: userData.id! })
  }

  return (
    <Modal isOpen={isModalStatusOpen} onModalClose={() => setModalStatusOpen(false)} title="Update Status">
      <BodyText>
        You have completed {progressBarStatus.complete} out of {progressBarStatus.total} sections for contact{' '}
        {`${userData?.title} ${userData?.forename} ${userData?.surname}`}. Please now select one of the following
        options in order to continue
      </BodyText>
      <div className="el-flex el-flex-row el-flex-wrap">
        {[
          { label: 'Passed', value: 'pass', className: '' },
          { label: 'Fail', value: 'fail', className: 'el-ml8' },
          { label: 'Pending', value: 'pending', className: 'el-ml8' },
          { label: 'Cancelled', value: 'warnings', className: 'el-ml8' },
          { label: 'Unchecked', value: 'unchecked', className: 'el-ml8' },
        ].map(({ label, value, className }, index) => (
          <InputGroup
            key={index}
            type="radio"
            label={label}
            className={className}
            onChange={() => setUserStatus(value)}
            checked={userStatus === value}
          />
        ))}
      </div>
      <div className="el-flex el-flex-justify-end el-mt6">
        <Button intent="primary" onClick={handleUpdateStatus}>
          Save Status
        </Button>
      </div>
    </Modal>
  )
}

export default ModalStatus
