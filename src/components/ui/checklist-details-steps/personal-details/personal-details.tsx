/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { reapitConnectBrowserSession } from '../../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'
import { Input, InputGroup, Label, Button, SmallText } from '@reapit/elements'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import { ContactModel } from '@reapit/foundations-ts-definitions'
import { BASE_HEADERS } from '../../../../constants/api'

type Props = {
  data: ContactModel
}

type FormPersonalDetailsType = {}

const schema = yup.object().shape({
  personalDetails: yup.object().shape({
    email: yup.string().email('Please enter a valid email format!'),
    home: yup.number().typeError('you must specify a number').nullable(),
    // .transform((value: string, originalValue: string) => (originalValue.trim() === '' ? null : value))
    mobile: yup.number().typeError('you must specify a number').nullable(),
    work: yup.number().typeError('you must specify a number').nullable(),
  }),
})

const PersonalDetails = ({ data }: Props) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      personalDetails: {
        title: data?.title,
        forename: data?.forename,
        surname: data?.surname,
        dob: data?.dateOfBirth,
        email: data?.email,
        home: data?.homePhone,
        mobile: data?.mobilePhone,
        work: data?.workPhone,
      },
    },
  })

  const onSubmitHandler = ({ personalDetails }: { personalDetails: object }) => {
    console.log({ personalDetails })
    // reset();

    // const queryClient = useQueryClient()

    // return useMutation(
    //   () =>
    //     axios.patch(
    //       `${window.reapit.config.platformApiUrl}/contacts/${data?.id}`,
    //       { ...personalDetails },
    //       {
    //         headers: {
    //           ...BASE_HEADERS,
    //           Authorization: `Bearer ${connectSession?.accessToken}`,
    //         },
    //       },
    //     ),
    //   {
    //     onSuccess: () => {
    //       // ✅ refetch the comments list for our blog post
    //       queryClient.invalidateQueries(['contact', data?.id])
    //     },
    //   },
    // )
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
            <Label htmlFor="name">Home Phone</Label>
            <p>{errors.personalDetails?.home?.message}</p>
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="mobile" type="text" {...register('personalDetails.mobile')} />
            <Label htmlFor="name">Mobile Phone</Label>
            <p>{errors.personalDetails?.mobile?.message}</p>
          </InputGroup>
          <InputGroup className="el-mt6 el-flex1">
            <Input id="work" type="text" {...register('personalDetails.work')} />
            <Label htmlFor="name">Work Phone</Label>
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
