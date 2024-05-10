import { LoginFormData, RegistrationFormData, ProfileFormData, CreateArticleFormData } from '@/assets/types/formTypes'

export const validateRegistration = (
  fieldName: keyof RegistrationFormData,
  value: string | boolean
): string | boolean => {
  switch (fieldName) {
    case 'email':
      if (!value) return 'Email не должен быть пустым'
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.toString())) return 'Некорректный email адрес'
      return true
    case 'username':
      if (!value) return 'Username не должен быть пустым'
      if (value.toString().length < 3 || value.toString().length > 20) return 'Username должен быть от 3 до 20 символов'
      return true
    case 'password':
      if (!value) return 'Пароль не должен быть пустым'
      if (value.toString().length < 6 || value.toString().length > 40) return 'Пароль должен быть от 6 до 40 символов'
      return true
    case 'agree':
      if (!value) return 'Необходимо согласие на обработку ваших персональных данных'
      return true
    default:
      return true
  }
}

export const validateLogin = (fieldName: keyof LoginFormData, value: string): string | boolean => {
  switch (fieldName) {
    case 'email':
      if (!value) return 'Email не должен быть пустым'
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'Некорректный email адрес'
      return true
    case 'password':
      if (!value) return 'Пароль не должен быть пустым'
      return true
    default:
      return true
  }
}

export const validateProfileEdit = (fieldName: keyof ProfileFormData, value: string): string | boolean => {
  switch (fieldName) {
    case 'username':
      if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Username может содержать только латинские буквы и цифры'
      if (value?.length < 3 || value?.length > 20) return 'Username должен быть от 3 до 20 символов'
      return true
    case 'email':
      if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'Некорректный email адрес'
      return true
    case 'password':
      if (!value) return 'Пароль не должен быть пустым'
      if (value?.toString().length < 6 || value.toString().length > 40) return 'Пароль должен быть от 6 до 40 символов'
      return true
    case 'image':
      if (value && !/^https?:\/\/\S+\.\S+/.test(value)) return 'Некорректный URL для аватара'
      return true
    default:
      return true
  }
}

export const validateCreateArticle = (fieldName: keyof CreateArticleFormData, value: string): string | boolean => {
  switch (fieldName) {
    case 'title':
      if (!value) return 'Title не должен быть пустым'
      return true
    case 'body':
      if (!value) return 'Текст не должен быть пустым'
      if (value.length < 20) return 'Текст слишком маленький. Минимум 20 символов'
      return true
    case 'description':
      if (!value) return 'Short description не должен быть пустым'
      return true
    default:
      return true
  }
}
