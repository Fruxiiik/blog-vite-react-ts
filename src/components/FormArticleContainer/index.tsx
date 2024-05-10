import { useEffect } from 'react'
import {
  useForm,
  FieldValues,
  Path,
  DefaultValues,
  Controller,
  useFieldArray,
  ArrayPath,
  FieldArray,
} from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { FormControl } from '@mui/base/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Input } from 'antd'

import { CreateArticleData } from '@/assets/types/formTypes'

import styles from './FormArticleContainer.module.scss'

interface FormProps<TFormValues extends FieldValues, TSubmitValues> {
  onSubmit: (data: TSubmitValues) => void
  formData: DefaultValues<TFormValues>
  defaultValues: CreateArticleData
  validate: (fieldName: keyof TFormValues, value: string) => boolean | string
  buttonText: string
}

export const FormArticleContainer = <TFormValues extends FieldValues, TSubmitValues>({
  onSubmit,
  formData,
  defaultValues,
  validate,
  buttonText,
}: FormProps<TFormValues, TSubmitValues>) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<CreateArticleData>({
    mode: 'onBlur',
    defaultValues: defaultValues as CreateArticleData,
  })
  const { TextArea } = Input
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList' as ArrayPath<CreateArticleData>,
  })
  useEffect(() => {
    if (fields.length === 0) {
      append('' as FieldArray<TFormValues, ArrayPath<TFormValues>>)
    }
  }, [fields, append])
  const onSubmitHandler = handleSubmit((data) => {
    onSubmit(data as unknown as TSubmitValues)
  })
  return (
    <form onSubmit={onSubmitHandler} className={styles.form}>
      {Object.keys(formData).map((key) => {
        const fieldName = key as Path<CreateArticleData>
        const fieldData = formData[fieldName]
        return (
          <Controller
            key={fieldName}
            control={control}
            name={fieldName}
            rules={{ validate: (value) => validate(fieldName, value as string) }}
            render={({ field, fieldState }) => {
              if (fieldName === 'tagList') {
                return (
                  <>
                    {fields.map((item, index) => (
                      <div key={item.id} className={styles.tags}>
                        <TextField
                          {...register(`tagList.${index}`, {
                            validate: (value) => value.length >= 2 || 'Тег должен содержать не менее 2 символов',
                          })}
                          label={`Tag ${index + 1}`}
                          size="small"
                          margin="normal"
                          className={styles.tag}
                          error={!!(errors.tagList && errors.tagList[index])}
                          helperText={errors.tagList?.[index]?.message || ''}
                          FormHelperTextProps={{
                            style: { marginLeft: 0 },
                          }}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outlined"
                            className={styles.remove}
                            onClick={() => remove(index)}
                          >
                            Delete
                          </Button>
                        )}
                        {index === fields.length - 1 && (
                          <Button
                            type="button"
                            variant="outlined"
                            className={styles.add}
                            onClick={() => append('' as FieldArray<TFormValues, ArrayPath<TFormValues>>)}
                          >
                            Add tag
                          </Button>
                        )}
                      </div>
                    ))}
                  </>
                )
              }
              if (fieldName === 'body') {
                return (
                  <FormControl>
                    <TextArea
                      {...field}
                      placeholder={fieldData.placeholder}
                      defaultValue={fieldData.value}
                      className={`${styles.textArea} ${fieldState.error && styles.error}`}
                      status={fieldState.error && 'error'}
                      autoSize
                      onBlur={field.onBlur}
                    />
                    <FormHelperText error={!!fieldState.error}>
                      {fieldState.error ? fieldState.error.message : ''}
                    </FormHelperText>
                  </FormControl>
                )
              }
              return (
                <TextField
                  {...register(field.name)}
                  label={fieldData.placeholder}
                  type={fieldData.type}
                  defaultValue={fieldData.value}
                  size="small"
                  margin="normal"
                  fullWidth
                  onBlur={field.onBlur}
                  // onChange={(e) => field.onChange(e.target.value)}
                  // value={field.value || fieldData.value}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ''}
                  FormHelperTextProps={{
                    style: { marginLeft: 0 },
                  }}
                />
              )
            }}
          />
        )
      })}
      <Button className={`${styles.button} ${styles.button__send} ${styles.color}`} type="submit" variant="contained">
        {buttonText}
      </Button>
    </form>
  )
}
