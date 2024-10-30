import {CHAT_COLORS} from './consants'

export interface IdPayload {
  id: string
}

export type ChatColor = (typeof CHAT_COLORS)[number]

export type Status = 'idle' | 'pending' | 'succeeded' | 'failed'

export interface ApiError {
  status: number
  code: string
  message: string
  details?: object
}
