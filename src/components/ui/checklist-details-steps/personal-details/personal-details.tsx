/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Input, InputGroup, Label, Button, SmallText } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type Props = {
  data: {}
}

const schema = yup.object().shape({
  personalDetails: yup.object().shape({
    email: yup.string().email('Please enter a valid email format!'),
    home: yup
      .number()
      .typeError('you must specify a number')
      .nullable()
      .transform((value: string, originalValue: string) => (originalValue.trim() === '' ? null : value)),
    mobile: yup
      .number()
      .typeError('you must specify a number')
      .nullable()
      .transform((value: string, originalValue: string) => (originalValue.trim() === '' ? null : value)),
    work: yup
      .number()
      .typeError('you must specify a number')
      .nullable()
      .transform((value: string, originalValue: string) => (originalValue.trim() === '' ? null : value)),
  }),
})

const PersonalDetails = ({ data }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmitHandler = (dataInput) => {
    console.log({ dataInput })
    // reset();
  }

  console.log({ errors })
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="el-flex el-flex-column el-flex-wrap">
        <InputGroup className="el-flex1">
          <Input id="title" type="text" {...register('personalDetails.title')} />
          <Label htmlFor="name">Title</Label>
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="forename" type="text" {...register('personalDetails.forename')} />
          <Label htmlFor="name">Forename</Label>
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="surname" type="text" {...register('personalDetails.surname')} />
          <Label htmlFor="name">Surname</Label>
        </InputGroup>
      </div>
      <div className="el-mt6 el-flex el-flex-column el-flex-wrap el-w6">
        <InputGroup className="el-flex1">
          <Input id="dob" type="date" {...register('personalDetails.dob')} />
          <Label htmlFor="name">Date Of Birth</Label>
        </InputGroup>
        <InputGroup className="el-mt6 el-flex1">
          <Input id="email" type="email" {...register('personalDetails.email')} />
          <Label htmlFor="name">Email</Label>
          <p>{errors.personalDetails?.email?.message}</p>
        </InputGroup>
      </div>
      <div className="el-mt8">
        <SmallText hasNoMargin hasGreyText>
          *At least one telephone number is required
        </SmallText>
        <div className=" el-flex el-flex-column el-flex-wrap">
          <InputGroup className="el-flex1">
            <Input id="home" type="text" {...register('personalDetails.home')} />
            <Label htmlFor="name">Home</Label>
            <p>{errors.personalDetails?.home?.message}</p>
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="mobile" type="text" {...register('personalDetails.mobile')} />
            <Label htmlFor="name">Mobile</Label>
            <p>{errors.personalDetails?.mobile?.message}</p>
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="work" type="text" {...register('personalDetails.work')} />
            <Label htmlFor="name">Work</Label>
            <p>{errors.personalDetails?.work?.message}</p>
          </InputGroup>
        </div>
      </div>
      <div className="el-flex el-flex-row el-flex-justify-end el-mt8">
        <Button className="el-mr6" intent="success" type="submit">
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
