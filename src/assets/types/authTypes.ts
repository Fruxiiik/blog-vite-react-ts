export interface AuthTypes {
  data: null | UserData
  status: string
  isLoading: boolean
  isAuthenticated: boolean
  token: string
  errors?: Record<string, string>
}

export interface UserData {
  email: string
  token: string
  username: string
  bio: string
  image: string | null
}

export interface AuthRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// export interface EditRequest {
//   email: string
//   username: string
//   bio: string
//   image: string | null
//   password: string
// }
