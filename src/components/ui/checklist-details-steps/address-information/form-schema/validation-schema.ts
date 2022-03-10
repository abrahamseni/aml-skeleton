import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  primaryAddress: Yup.object().shape({
    buildingName: Yup.string().required('Wajib diisi'),
    buildingNumber: Yup.number().min(3, 'aisdjiasdji'),
  }),
})

export default validationSchema
