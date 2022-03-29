/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Input, InputGroup, Label, SmallText, InputError, useSnack } from '@reapit/elements'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ContactModel } from '@reapit/foundations-ts-definitions'

import { useUpdateContact } from '../../../../platform-api/contact-api/update-contact'
import validationSchema from './form-schema/validation-schema'
import { formFields } from './form-schema/form-field'
import FormFooter from '../../form-footer/form-footer'
import { generateLabelField } from 'utils/generator'
import { notificationMessage } from '../../../../constants/notification-message'
import { getFormSaveErrorMessage } from '../../../../utils/error-message'
import ErrorMessage from '../../../../components/ui/elements/error-message'

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
    trigger,
    watch,
    control,
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
    mode: 'all',
  })
  const watchFields = watch([mobilePhone.name, workPhone.name])
  const onSubmitHandler = async (): Promise<void> => {
    await updateContact.mutateAsync(
      { ...getValues() },
      {
        onSuccess: () => {
          successAlert(notificationMessage.SUCCESS('Personal Details'))
        },
        onError: (err) => errorAlert(getFormSaveErrorMessage('Personal Details', err)),
      },
    )
  }

  React.useEffect(() => {
    const subscription = watch(() => {
      trigger([homePhone.name])
    })
    return () => subscription.unsubscribe()
  }, [watchFields])

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} data-testid="personal.details.form">
      <div className="el-flex el-flex-column el-flex-wrap">
        <InputGroup className="el-flex1">
          <Input id={title.name} type="text" {...register(title.name)} data-testid={`test.${title.name}`} />
          <Label htmlFor={title.name}>{generateLabelField(title.label, true)}</Label>
          {errors.title?.message && <ErrorMessage name={title.name} errors={errors} />}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id={forename.name} type="text" {...register(forename.name)} data-testid={`test.${forename.name}`} />
          <Label htmlFor={forename.name}>{generateLabelField(forename.label, true)}</Label>
          {errors.forename?.message && <ErrorMessage name={forename.name} errors={errors} />}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id={surname.name} type="text" {...register(surname.name)} data-testid={`test.${surname.name}`} />
          <Label htmlFor={surname.name}> {generateLabelField(surname.label, true)}</Label>
          {errors.surname?.message && <ErrorMessage name={surname.name} errors={errors} />}
        </InputGroup>
      </div>
      <div className="el-mt6 el-flex el-flex-column el-flex-wrap el-w6">
        <InputGroup className="el-flex1">
          <Input
            id={dateOfBirth.name}
            type="date"
            {...register(dateOfBirth.name)}
            data-testid={`test.${dateOfBirth.name}`}
          />
          <Label htmlFor={dateOfBirth.name}>{generateLabelField(dateOfBirth.label, true)}</Label>
          {errors.dateOfBirth?.message && <ErrorMessage name={dateOfBirth.name} errors={errors} />}
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id={email.name} type="email" {...register(email.name)} data-testid={`test.${email.name}`} />
          <Label htmlFor={email.name}>{generateLabelField(email.label, true)}</Label>
          {errors.email?.message && <ErrorMessage name={email.name} errors={errors} />}
        </InputGroup>
      </div>
      <div className="el-mt8">
        <SmallText
          hasNoMargin
          className={errors.homePhone?.type === 'required' ? 'el-input-error' : ' el-has-grey-text'}
        >
          *At least one telephone number is required
        </SmallText>
        <div className=" el-flex el-flex-column el-flex-wrap">
          <InputGroup className="el-flex1">
            <Input
              id={homePhone.name}
              type="text"
              {...register(homePhone.name)}
              data-testid={`test.${homePhone.name}`}
            />
            <Label htmlFor={homePhone.name}>{homePhone.label}</Label>
            {errors.homePhone?.message && errors.homePhone?.type !== 'required' && (
              <ErrorMessage name={homePhone.name} errors={errors} />
            )}
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input
              id={mobilePhone.name}
              type="text"
              {...register(mobilePhone.name)}
              data-testid={`test.${mobilePhone.name}`}
            />
            <Label htmlFor={mobilePhone.name}>{mobilePhone.label}</Label>
            {errors.mobilePhone?.message && <ErrorMessage name={mobilePhone.name} errors={errors} />}
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input
              id={workPhone.name}
              type="text"
              {...register(workPhone.name)}
              data-testid={`test.${workPhone.name}`}
            />
            <Label htmlFor={workPhone.name}>{workPhone.label}</Label>
            {errors.workPhone?.message && <ErrorMessage name={workPhone.name} errors={errors} />}
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
