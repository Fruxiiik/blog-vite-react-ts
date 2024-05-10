import { useEffect } from 'react'
import { useForm, FieldValues, Path, DefaultValues, Controller, useFieldArray, ArrayPath } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FormControl } from '@mui/base/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider'
import { Input } from 'antd'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import styles from './FormContainer.module.scss'

interface FormProps<TFormValues extends FieldValues, TSubmitValues> {
  onSubmit: (data: TSubmitValues) => void
  defaultValues: DefaultValues<TFormValues>
  validate: (fieldName: keyof TFormValues, value: string) => boolean | string
  buttonText: string
}

export const FormContainer = <TFormValues extends FieldValues, TSubmitValues>({
  onSubmit,
  defaultValues,
  validate,
  buttonText,
}: FormProps<TFormValues, TSubmitValues>) => {
  const {
    handleSubmit,
    control,
    register,
    setError,
    formState: { errors },
  } = useForm<TFormValues>({
    mode: 'onBlur',
  })
  const { TextArea } = Input
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList' as ArrayPath<TFormValues>,
  })
  const serverErrors = useTypedSelector((state) => state.auth.errors)
  useEffect(() => {
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([key, message]) => {
        setError(key as Path<TFormValues>, { type: 'server', message })
      })
    }
  }, [serverErrors, setError])
  useEffect(() => {
    if (fields.length === 0) {
      append('')
    }
  }, [fields, append])
  const onSubmitHandler = handleSubmit((data) => {
    if (validate.name === 'validateRegistration') {
      if (data.password !== data.repeatPassword) {
        setError('repeatPassword' as Path<TFormValues>, {
          type: 'manual',
          message: 'Passwords must match',
        })
        return
      }
    }
    onSubmit(data as unknown as TSubmitValues)
  })
  return (
    <form onSubmit={onSubmitHandler} className={styles.form}>
      {Object.keys(defaultValues).map((key) => {
        const fieldName = key as Path<TFormValues>
        const fieldData = defaultValues[fieldName]
        return (
          <Controller
            key={fieldName}
            control={control}
            name={fieldName}
            rules={{ validate: (value) => validate(fieldName, value) }}
            render={({ field, fieldState }) => {
              if (fieldData.type === 'checkbox' || fieldName === 'agree') {
                return (
                  <>
                    <Divider className={styles.divider} />
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value ?? false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          onBlur={field.onBlur}
                        />
                      }
                      className={styles.label}
                      label={fieldData.placeholder || 'I agree to the processing of my personal information'}
                    />
                    <FormHelperText error={!!fieldState.error}>
                      {fieldState.error ? fieldState.error.message : ''}
                    </FormHelperText>
                  </>
                )
              }
              if (fieldName === 'tagList') {
                return (
                  <>
                    {fields.map((item, index) => (
                      <div key={item.id} className={styles.tag}>
                        <TextField
                          {...register(`tagList.${index}` as Path<TFormValues>, {
                            validate: (value) => value.length >= 2 || 'Тег должен содержать не менее 2 символов',
                          })}
                          label={`Tag ${index + 1}`}
                          size="small"
                          margin="normal"
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
                          <Button type="button" variant="outlined" className={styles.add} onClick={() => append('')}>
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
                  <>
                    <FormControl>
                      <TextArea
                        {...field}
                        placeholder={fieldData.placeholder}
                        className={`${styles.textArea} ${fieldState.error && styles.error}`}
                        status={fieldState.error && 'error'}
                        autoSize
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormHelperText error={!!fieldState.error}>
                      {fieldState.error ? fieldState.error.message : ''}
                    </FormHelperText>
                  </>
                )
              }
              return (
                <TextField
                  {...field}
                  label={fieldData.placeholder}
                  type={fieldData.type}
                  size="small"
                  margin="normal"
                  fullWidth
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || fieldData.value}
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
      <Button className={`${styles.button} ${styles.color}`} type="submit" variant="contained">
        {buttonText}
      </Button>
    </form>
  )
}
