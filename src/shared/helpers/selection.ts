import {RefObject} from 'react'

export function insertTextAtCursor(
  text: string,
  inputRef: RefObject<HTMLDivElement>
) {
  if (!isSelectionInElement(inputRef)) {
    console.log('NY TI EBLAN?')
    return
  }
  const sel = window.getSelection()
  const range = sel?.getRangeAt(0)

  if (!range || !sel?.rangeCount) {
    return
  }
  range.deleteContents()
  const textNode = document.createTextNode(text)
  range.insertNode(textNode)
  range.setStartAfter(textNode)
  sel?.removeAllRanges()
  sel?.addRange(range)
  inputRef.current?.dispatchEvent(new Event('input', {bubbles: true})) // щоб відбувся евент і пропав placeholder, змінилась висота і т.д
}

export function insertCursorAtEnd(inputRef: RefObject<HTMLDivElement>) {
  if (/* !isSelectionInElement(inputRef) || */ !inputRef.current) {
    console.log('NY TI EBLAN? 222')
    return
  }
  const range = document.createRange()
  const selection = window.getSelection()
  range.setStart(inputRef.current, inputRef.current.childNodes.length)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
  // const selection = window.getSelection()
  // const range = document.createRange()
  // range.selectNodeContents(inputRef.current)
  // range.collapse(false) // Встановлюємо курсор в кінець
  // selection?.removeAllRanges()
  // selection?.addRange(range)
}

export function isSelectionInElement(inputRef: RefObject<HTMLDivElement>) {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) {
    return false
  }

  const range = selection.getRangeAt(0)
  const element = inputRef.current
  if (!element) {
    return false
  }

  const startContainer = range.startContainer
  const endContainer = range.endContainer

  if (startContainer === element || element.contains(startContainer)) {
    return true
  }

  if (endContainer === element || element.contains(endContainer)) {
    return true
  }

  return false
}
