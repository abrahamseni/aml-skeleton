type FormFieldInfo = {
  name: string
  label: string
}

export interface ValuesType {
  title?: string
  forename?: string
  surname?: string
  dateOfBirth?: string
  email?: string
  home?: string
  mobile?: string
  work?: string
}

interface PersonalDetailsFormInfo extends FormFieldInfo {
  name: keyof ValuesType
}

export interface FormFieldType {
  title: PersonalDetailsFormInfo
  forename: PersonalDetailsFormInfo
  surname: PersonalDetailsFormInfo
  dateOfBirth: PersonalDetailsFormInfo
  email: PersonalDetailsFormInfo
  homePhone: PersonalDetailsFormInfo
  mobilePhone: PersonalDetailsFormInfo
  workPhone: PersonalDetailsFormInfo
}

export const formFields: FormFieldType = {
  title: {
    name: 'title',
    label: 'Title',
  },
  forename: {
    name: 'forename',
    label: 'Forename',
  },
  surname: {
    name: 'surname',
    label: 'Surname',
  },
  dateOfBirth: {
    name: 'dateOfBirth',
    label: 'Date Of Birth',
  },
  email: {
    name: 'email',
    label: 'Email',
  },
  homePhone: {
    name: 'home',
    label: 'Home Phone',
  },
  mobilePhone: {
    name: 'mobile',
    label: 'Mobile Phone',
  },
  workPhone: {
    name: 'work',
    label: 'Work Phone',
  },
}
