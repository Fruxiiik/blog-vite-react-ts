export interface BaseFormField<T> {
  value?: T
  type?: string
  required?: boolean | string
  minLength?: number
  maxLength?: number
  placeholder?: string
}

export interface StringFormField extends BaseFormField<string> {}
export interface BooleanFormField extends BaseFormField<boolean> {
  minLength?: never
  maxLength?: never
}

export interface RegistrationFormData {
  email: StringFormField
  username: StringFormField
  password: StringFormField
  repeatPassword: StringFormField
  agree: BooleanFormField
}

export interface RegistrationData {
  email: string
  username: string
  password: string
  repeatPassword: string
  agree: boolean
}

export interface LoginFormData {
  email: StringFormField
  password: StringFormField
}

export interface LoginData {
  email: string
  password: string
}

export interface ProfileFormData {
  username: StringFormField
  email: StringFormField
  password?: StringFormField
  image?: StringFormField
}

export interface ProfileData {
  username: string
  email: string
  token: string
  bio: string
  image: string | null
}

export interface CreateArticleFormData {
  title: StringFormField
  description: StringFormField
  body: StringFormField
  tagList: string[]
}

export interface CreateArticleData {
  title: string
  description: string
  body: string
  tagList: string[]
}
