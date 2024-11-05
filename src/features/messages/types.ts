export interface Message {
  id: string
  orderedId: number
  chatId: string
  senderId: string
  text?: string
  createdAt: Date
  editedAt?: Date

  isOutgoing: boolean
  isSilent: boolean
}
