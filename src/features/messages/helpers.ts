export function formatMessageTime(date: Date, hour12 = false) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12,
  })
}
