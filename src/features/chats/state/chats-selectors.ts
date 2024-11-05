import {RootState} from '../../../app/store'
import {chatsAdapter} from './chats-adapter'

export const chatsSelectors = chatsAdapter.getSelectors<RootState>(
  (state) => state.chats
)
