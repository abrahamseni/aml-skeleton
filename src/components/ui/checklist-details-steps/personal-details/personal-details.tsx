/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Input, InputGroup, Label, SmallText, InputError, useSnack } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ContactModel } from '@reapit/foundations-ts-definitions'

import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'
import validationSchema from './form-schema/validation-schema'
import { formFields } from './form-schema/form-field'
import FormFooter from '../../form-footer/form-footer'
import { generateLabelField, generateTestId } from 'utils/generator'
import { notificationMessage } from '../../../../constants/notification-message'

type PersonalDetailsProps = {
  userData: ContactModel
}

const PersonalDetails = ({ userData }: PersonalDetailsProps) => {
  const { title, forename, surname, dateOfBirth, email, homePhone, mobilePhone, workPhone } = formFields
  const { success: successAlert, error: errorAlert } = useSnack()
  const updateContact = useUpdateContact(userData!.id!, userData!._eTag!)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      [title.name]: userData?.title,
      [forename.name]: userData?.forename,
      [surname.name]: userData?.surname,
      [dateOfBirth.name]: userData?.dateOfBirth,
      [email.name]: userData?.email,
      [homePhone.name]: userData?.homePhone,
      [mobilePhone.name]: userData?.mobilePhone,
      [workPhone.name]: userData?.workPhone,
    },
    mode: 'onBlur',
  })

  const onSubmitHandler = async (): Promise<void> => {
    await updateContact.mutateAsync(
      { ...getValues() },
      {
        onSuccess: () => {
          successAlert(notificationMessage.SUCCESS('personal details'))
        },
        onError: (err) => errorAlert(notificationMessage.ERROR(err?.message)),
      },
    )
  }
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} data-testid="personal.details.form">
      <div className="el-flex el-flex-column el-flex-wrap">
        <InputGroup className="el-flex1">
          <Input id={title.name} type="text" {...register(title.name)} data-testid={generateTestId(title.name)} />
          <Label htmlFor={title.name}>{generateLabelField(title.label, true)}</Label>
          {errors.title?.message && (
            <p data-testid={`test.error.${title.name}`} className="el-input-error">
              {errors.title.message}
            </p>
          )}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input
            id={forename.name}
            type="text"
            {...register(forename.name)}
            data-testid={generateTestId(forename.name)}
          />
          <Label htmlFor={forename.name}>{generateLabelField(forename.label, true)}</Label>
          {errors.forename?.message && (
            <p data-testid={`test.error.${forename.name}`} className="el-input-error">
              {errors.forename.message}
            </p>
          )}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id={surname.name} type="text" {...register(surname.name)} data-testid={generateTestId(surname.name)} />
          <Label htmlFor={surname.name}> {generateLabelField(surname.label, true)}</Label>
          {errors.surname?.message && (
            <p data-testid={`test.error.${surname.name}`} className="el-input-error">
              {errors.surname.message}
            </p>
          )}
        </InputGroup>
      </div>
      <div className="el-mt6 el-flex el-flex-column el-flex-wrap el-w6">
        <InputGroup className="el-flex1">
          <Input
            id={dateOfBirth.name}
            type="date"
            {...register(dateOfBirth.name)}
            data-testid={generateTestId(dateOfBirth.name)}
          />
          <Label htmlFor={dateOfBirth.name}>{generateLabelField(dateOfBirth.label, true)}</Label>
          {errors.dateOfBirth?.message && (
            <p data-testid={`test.error.${dateOfBirth.name}`} className="el-input-error">
              {errors.dateOfBirth.message}
            </p>
          )}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id={email.name} type="email" {...register(email.name)} data-testid={generateTestId(email.name)} />
          <Label htmlFor={email.name}>{generateLabelField(email.label, true)}</Label>
          {errors.email?.message && (
            <p data-testid={`test.error.${email.name}`} className="el-input-error">
              {errors.email.message}
            </p>
          )}
        </InputGroup>
      </div>
      <div className="el-mt8">
        <SmallText hasNoMargin hasGreyText>
          *At least one telephone number is required
        </SmallText>
        <div className=" el-flex el-flex-column el-flex-wrap">
          <InputGroup className="el-flex1">
            <Input
              id={homePhone.name}
              type="text"
              {...register(homePhone.name)}
              data-testid={generateTestId(homePhone.name)}
            />
            <Label htmlFor={homePhone.name}>{homePhone.label}</Label>
            {errors.homePhone?.message && (
              <p data-testid={`test.error.${homePhone.name}`} className="el-input-error">
                {errors.homePhone.message}
              </p>
            )}
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input
              id={mobilePhone.name}
              type="text"
              {...register(mobilePhone.name)}
              data-testid={generateTestId(mobilePhone.name)}
            />
            <Label htmlFor={mobilePhone.name}>{mobilePhone.label}</Label>
            {errors.mobilePhone?.message && (
              <p data-testid={`test.error.${mobilePhone.name}`} className="el-input-error">
                {errors.mobilePhone.message}
              </p>
            )}
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input
              id={workPhone.name}
              type="text"
              {...register(workPhone.name)}
              data-testid={generateTestId(workPhone.name)}
            />
            <Label htmlFor={workPhone.name}>{workPhone.label}</Label>
            {errors.workPhone?.message && (
              <p data-testid={`test.error.${workPhone.name}`} className="el-input-error">
                {errors.workPhone.message}
              </p>
            )}
          </InputGroup>
        </div>
      </div>
      <FormFooter
        idUser={userData?.id}
        isFieldError={!!Object.keys(errors).length}
        isFormSubmitting={updateContact?.isLoading}
      />
    </form>
  )
}

export default PersonalDetails
