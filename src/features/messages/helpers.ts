export function formatMessageTime({
  date,
  hour12 = false,
  onlyTime = true,
  withToday = false,
}: {
  date: Date
  hour12?: boolean
  onlyTime?: boolean
  withToday?: boolean
}): string {
  const now = new Date()

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (isToday || onlyTime) {
    const todayDate = date.toLocaleTimeString(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      hour12,
    })

    return withToday && !onlyTime ? `Today at ${todayDate}` : todayDate
  }

  const isThisWeek = isDateInThisWeek(date)

  if (isThisWeek) {
    return date.toLocaleDateString('us', {
      weekday: 'short',
    })
  }

  return date.toLocaleDateString(navigator.language, {
    dateStyle: 'short',
  })
}

function isDateInThisWeek(date: Date) {
  const today = new Date()
  const todayDate = today.getDate()
  const todayDay = today.getDay()

  // get first date of week
  const firstDayOfWeek = new Date(today.setDate(todayDate - todayDay))

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek)
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6)

  // if date is equal or within the first and last dates of the week
  return date >= firstDayOfWeek && date <= lastDayOfWeek
}
