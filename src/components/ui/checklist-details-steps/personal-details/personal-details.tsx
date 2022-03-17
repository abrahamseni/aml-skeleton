/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Input, InputGroup, Label, Button, SmallText, InputError, useSnack } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ContactModel } from '@reapit/foundations-ts-definitions'
import validationSchema from './form-schema/validation-schema'

import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'
import FormFooter from '../../form-footer/form-footer'
import { notificationMessage } from '../../../../constants/notification-message'

type PersonalDetailsProps = {
  userData: ContactModel
  switchTabContent: (type: 'forward' | 'backward') => void | undefined
}

const PersonalDetails = ({ userData, switchTabContent }: PersonalDetailsProps) => {
  const { success: successAlert, error: errorAlert } = useSnack()
  const updateContact = useUpdateContact(userData!.id!, userData!._eTag!)
  const formPersonalDetails = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: userData?.title,
      forename: userData?.forename,
      surname: userData?.surname,
      dateOfBirth: userData?.dateOfBirth,
      email: userData?.email,
      homePhone: userData?.homePhone,
      mobilePhone: userData?.mobilePhone,
      workPhone: userData?.workPhone,
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formPersonalDetails

  const onSubmitHandler = async (): Promise<void> => {
    await updateContact.mutateAsync(
      { ...formPersonalDetails.getValues() },
      {
        onSuccess: () => {
          successAlert(notificationMessage.SUCCESS('personal details'))
        },
        onError: (err) => errorAlert(notificationMessage.ERROR(err?.message)),
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="el-flex el-flex-column el-flex-wrap">
        <InputGroup className="el-flex1">
          <Input id="title" type="text" {...register('title')} />
          <Label htmlFor="name">Title</Label>
          {errors.title?.message && <InputError message={errors.title.message} />}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="forename" type="text" {...register('forename')} />
          <Label htmlFor="name">Forename</Label>
          {errors.forename?.message && <InputError message={errors.forename.message} />}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="surname" type="text" {...register('surname')} />
          <Label htmlFor="name">Surname</Label>
          {errors.surname?.message && <InputError message={errors.surname.message} />}
        </InputGroup>
      </div>
      <div className="el-mt6 el-flex el-flex-column el-flex-wrap el-w6">
        <InputGroup className="el-flex1">
          <Input id="dob" type="date" {...register('dateOfBirth')} />
          <Label htmlFor="name">Date Of Birth</Label>
          {errors.dateOfBirth?.message && <InputError message={errors.dateOfBirth.message} />}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="email" type="email" {...register('email')} />
          <Label htmlFor="name">Email</Label>
          {errors.email?.message && <InputError message={errors.email.message} />}
        </InputGroup>
      </div>
      <div className="el-mt8">
        <SmallText hasNoMargin hasGreyText>
          *At least one telephone number is required
        </SmallText>
        <div className=" el-flex el-flex-column el-flex-wrap">
          <InputGroup className="el-flex1">
            <Input id="home" type="text" {...register('homePhone')} />
            <Label htmlFor="name">Home Phone</Label>
            {errors.homePhone?.message && <InputError message={errors.homePhone.message} />}
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="mobile" type="text" {...register('mobilePhone')} />
            <Label htmlFor="name">Mobile Phone</Label>
            {errors.mobilePhone?.message && <InputError message={errors.mobilePhone.message} />}
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="work" type="text" {...register('workPhone')} />
            <Label htmlFor="name">Work Phone</Label>
            {errors.workPhone?.message && <InputError message={errors.workPhone.message} />}
          </InputGroup>
        </div>
      </div>
      <FormFooter
        isPrevHide={true}
        idUser={userData?.id}
        isFieldError={Object.keys(errors).length !== 0}
        isFormSubmitting={updateContact?.isLoading}
        switchTabContent={switchTabContent}
        submitHandler={onSubmitHandler}
      />
    </form>
  )
}

export default PersonalDetails
