export enum AuthScreen {
  Username,
  Password,
  SignUp,
}

export interface Geolocation {
  ipVersion: number
  ipAddress: string
  latitude: number
  longitude: number
  countryName: string
  countryCode: string
  timeZone: string
  zipCode: string
  cityName: string
  regionName: string
  continent: string
  continentCode: string
}

/* API TYPES */
export interface User {
  id: string
  username: string
  firstName: string
  lastName?: string

  isSelf: boolean
  isContact: boolean
  isMutualContact: boolean
  // bio?: string
}

export interface DeviceInfo {
  ip: string
  browser: string
  platform: string
  location: string
}

export interface Session extends DeviceInfo {
  id: string
  refreshToken: string
  activeAt: Date
  userId: string
}

export interface AuthorizationResult {
  accessToken: string
  session: Session
}

export interface SignInPayload {
  username: string
  password: string
  deviceInfo: DeviceInfo
}

export interface SignUpPayload {
  username: string
  password: string
  passwordConfirm: string
  firstName: string
  lastName?: string
  deviceInfo: DeviceInfo
}

export interface RefreshTokenPayload {
  refreshToken: string
}
