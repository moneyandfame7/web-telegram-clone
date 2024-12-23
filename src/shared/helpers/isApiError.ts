import {ApiError} from '../../app/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isApiError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error?.status === 'number' &&
    typeof error?.code === 'string' &&
    typeof error?.message === 'string' &&
    (error?.details === undefined || typeof error?.details === 'object')
  )
}
