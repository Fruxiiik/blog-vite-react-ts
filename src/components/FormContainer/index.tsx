import { useEffect } from 'react'
import { useForm, FieldValues, Path, DefaultValues, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider'

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
  const { handleSubmit, control, setError } = useForm<TFormValues>({
    mode: 'onBlur',
  })
  const serverErrors = useTypedSelector((state) => state.auth.errors)
  useEffect(() => {
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([key, message]) => {
        setError(key as Path<TFormValues>, { type: 'server', message: message as string })
      })
    }
  }, [serverErrors, setError])
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
