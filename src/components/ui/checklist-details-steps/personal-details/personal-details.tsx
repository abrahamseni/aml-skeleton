/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { reapitConnectBrowserSession } from '../../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { Input, InputGroup, Label, Button, SmallText } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query'

import { ContactModel } from '@reapit/foundations-ts-definitions'
import validationSchema from './form-schema/validation-schema'
import { useUpdateContact } from '../../../../platform-api/hooks/useUpdateContact'

type PersonalDetailsProps = {
  userData: ContactModel
  userDataRefetch: (
    options?: (RefetchOptions & RefetchQueryFilters) | undefined,
  ) => Promise<QueryObserverResult<ContactModel, Error>>
}

const PersonalDetails = ({ userData, userDataRefetch }: PersonalDetailsProps) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const updateContact = useUpdateContact(connectSession, userData!.id!, userData!._eTag!)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: userData?.title,
      forename: userData?.forename,
      surname: userData?.surname,
      dob: userData?.dateOfBirth,
      email: userData?.email,
      home: userData?.homePhone,
      mobile: userData?.mobilePhone,
      work: userData?.workPhone,
    },
  })

  const onSubmitHandler = (data: object) => {
    console.log({ data })
    if (!connectSession) return // not really necessary ?
    updateContact.mutate({ ...data })
  }
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="el-flex el-flex-column el-flex-wrap">
        <InputGroup className="el-flex1">
          <Input id="title" type="text" {...register('title')} />
          <Label htmlFor="name">Title</Label>
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="forename" type="text" {...register('forename')} />
          <Label htmlFor="name">Forename</Label>
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="surname" type="text" {...register('surname')} />
          <Label htmlFor="name">Surname</Label>
        </InputGroup>
      </div>
      <div className="el-mt6 el-flex el-flex-column el-flex-wrap el-w6">
        <InputGroup className="el-flex1">
          <Input id="dob" type="date" {...register('dob')} />
          <Label htmlFor="name">Date Of Birth</Label>
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="email" type="email" {...register('email')} />
          <Label htmlFor="name">Email</Label>
          <p>{errors.email?.message}</p>
        </InputGroup>
      </div>
      <div className="el-mt8">
        <SmallText hasNoMargin hasGreyText>
          *At least one telephone number is required
        </SmallText>
        <div className=" el-flex el-flex-column el-flex-wrap">
          <InputGroup className="el-flex1">
            <Input id="home" type="text" {...register('home')} />
            <Label htmlFor="name">Home Phone</Label>
            <p>{errors.home?.message}</p>
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="mobile" type="text" {...register('mobile')} />
            <Label htmlFor="name">Mobile Phone</Label>
            <p>{errors.mobile?.message}</p>
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="work" type="text" {...register('work')} />
            <Label htmlFor="name">Work Phone</Label>
            <p>{errors.work?.message}</p>
          </InputGroup>
        </div>
      </div>
      <div className="el-flex el-flex-row el-flex-justify-end el-mt8">
        <Button className="el-mr6" intent="success" type="submit" loading={updateContact.isLoading}>
          Save
        </Button>
        <Button intent="primary" chevronRight type="submit">
          Next
        </Button>
      </div>
    </form>
  )
}

export default PersonalDetails
