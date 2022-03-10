import React, { FC, ReactElement } from 'react'
import { cx } from '@linaria/core'
import {
  Button,
  ButtonGroup,
  elMb2,
  elMt8,
  elW11,
  elW3,
  elW4,
  elW5,
  elW6,
  elWFull,
  FlexContainer,
  Input,
  InputAddOn,
  InputGroup,
  Label,
  Modal,
  Select,
} from '@reapit/elements'
import { formFields, ValuesType } from './form-schema/form-field'
import { UseFormReturn } from 'react-hook-form'
import { FileInput } from '../../file-input'
import { InputError } from '../../input-error'

interface FormFieldProps {
  identity: 'primaryAddress' | 'secondaryAddress'
  /**
   * Pass Reach Hook Form hook
   */
  rhfProps: UseFormReturn<ValuesType, any>
}

const FormField: FC<FormFieldProps> = ({ identity, rhfProps }): ReactElement => {
  const [isModalDocumentAOpen, setIsModalDocumentAOpen] = React.useState<boolean>(false)

  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = rhfProps

  const {
    buildingNameField,
    buildingNumberField,
    line1Field,
    line2Field,
    line3Field,
    line4Field,
    postcodeField,
    documentImageField,
  } = formFields(identity)

  return (
    <>
      <FlexContainer>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Input type="text" {...register(buildingNameField.name)} placeholder={buildingNameField.label} />
            <Label>Building Name</Label>
          </InputGroup>
          {errors.primaryAddress?.buildingName && <InputError message={errors.primaryAddress?.buildingName.message} />}
        </div>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Building Number</Label>
            <Input type="text" {...register(buildingNumberField.name)} placeholder={buildingNumberField.label} />
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elWFull}>
            <Label>Post Code</Label>
            <Input type="text" {...register(postcodeField.name)} placeholder={postcodeField.label} />
            <InputAddOn>Required</InputAddOn>
          </InputGroup>
        </div>
      </FlexContainer>
      <FlexContainer className={cx(elWFull, elMt8)} isFlexJustifyBetween>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Line 1</Label>
            <Input type="text" {...register(line1Field.name)} placeholder={line1Field.label} />
            <InputAddOn>Required</InputAddOn>
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Line 2</Label>
            <Input type="text" placeholder={line2Field.label} {...register(line2Field.name)} />
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elW11}>
            <Label>Line 3</Label>
            <Input type="text" placeholder={line3Field.label} {...register(line3Field.name)} />
            <InputAddOn>Required</InputAddOn>
          </InputGroup>
        </div>
        <div className={elW4}>
          <InputGroup className={elWFull}>
            <Label>Line 4</Label>
            <Input type="text" placeholder={line4Field.name} {...register(line4Field.name)} />
          </InputGroup>
        </div>
      </FlexContainer>
      <FlexContainer className={cx(elWFull, elMt8)} isFlexJustifyBetween>
        <div className={elW3}>
          <Label>Number of Years at Address</Label>
          <Select className={elW11} name={`${identity}-address-number-of-years`}>
            <option>1</option>
          </Select>
        </div>
        <div className={elW3}>
          <Label>Number of Months at Address</Label>
          <Select className={elW11} name={`${identity}-address-number-of-months` ?? '-'}>
            <option>1</option>
          </Select>
        </div>
        <div className={elW5}>
          <Label>Document Type</Label>
          <Select className={elW11} name={`${identity}-address-document-type`}>
            <option>1</option>
          </Select>
        </div>
        <div className={elW6}>
          <InputGroup className={elWFull}>
            <Label style={{ order: 0 }} className={elMb2}>
              Document Image Primary Address
            </Label>
            <FileInput
              {...register(documentImageField.name)}
              placeholderText={documentImageField.label}
              defaultValue={getValues('metadata.primaryAddress.documentImage')}
              onFileView={() => setIsModalDocumentAOpen(true)}
            />
            {errors.metadata?.primaryAddress && (
              <>
                <InputError message={errors.metadata?.primaryAddress.documentImage?.message!} />
              </>
            )}
          </InputGroup>
        </div>
      </FlexContainer>
      {/* Declaration Form */}
      <Modal isOpen={isModalDocumentAOpen} title="Image Preview" onModalClose={() => setIsModalDocumentAOpen(false)}>
        <FlexContainer isFlexAlignCenter isFlexJustifyCenter>
          {watch('metadata.primaryAddress.documentImage') && (
            <img src={watch('metadata.primaryAddress.documentImage')} height="auto" width="150px" />
          )}
        </FlexContainer>
        <ButtonGroup alignment="right">
          <Button intent="low" onClick={() => setIsModalDocumentAOpen(false)}>
            Close
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}

export default FormField
