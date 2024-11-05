import {User} from '../auth/types'

export const isUserId = (id: string) => {
  return id.startsWith('u_')
}

export const getUserTitle = (user: User) => {
  return user.firstName + ' ' + (user.lastName ?? '')
}
