import {isUUID} from '../../shared/helpers/isUUID'
import {User} from '../auth/types'

export const isUserId = (id: string) => {
  return id.startsWith('u_') && isUUID(id.split('u_')[1])
}

export const getUserTitle = (user: User) => {
  return user.firstName + (user.lastName ? ` ${user.lastName}` : '')
}
