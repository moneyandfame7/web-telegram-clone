import {useRef} from 'react'
import {Message} from '../types'

/**
 * https://github.com/inokawa/virtua/issues/284
 */
export const useShift = (listData: Message[]) => {
  const previousListData = useRef<Message[]>()
  const shouldShift = useRef<boolean>()
  if (listData !== previousListData.current) {
    if (listData[0]?.id !== previousListData.current?.[0]?.id) {
      shouldShift.current = true
    } else {
      shouldShift.current = false
    }
    previousListData.current = listData
  }
  return shouldShift.current
}
