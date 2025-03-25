import {
  FC,
  useRef,
  useLayoutEffect,
  useEffect,
  ChangeEvent,
  RefObject,
} from 'react'

import clsx from 'clsx'

import {useLayout} from '../../../../shared/hooks/useLayout'

import {insertTextAtCursor} from '../../../../shared/helpers/selection'

import './MessageInput.scss'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  inputRef: RefObject<HTMLDivElement>
}

export const MessageInput: FC<MessageInputProps> = ({
  value,
  onChange,
  inputRef,
}) => {
  const inputScrollRef = useRef<HTMLDivElement>(null)
  // const inputRef = useRef<HTMLDivElement>(null)

  const textRef = useRef(value)
  const {isMobile} = useLayout()

  const maxInputHeight = isMobile ? 215 : 350

  useLayoutEffect(() => {
    updateHeight()
  }, [isMobile])

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      /**
       * @todo вставляти зображення з буферу
       */
      const text = e.clipboardData ? e.clipboardData.getData('text/plain') : ''
      console.log({text})

      insertTextAtCursor(text, inputRef)
    }

    inputRef.current.addEventListener('paste', handlePaste)

    return () => inputRef.current?.removeEventListener('paste', handlePaste)
  }, [])

  // useEffect(() => {
  //   if (isFocused) {
  //     inputRef.current?.focus()
  //   } else {
  //     inputRef.current?.blur()
  //   }
  // }, [isFocused])

  useLayoutEffect(() => {
    // if (autoFocus) {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 400)
    // }
  }, [])

  useEffect(() => {
    if (!inputRef.current) {
      return
    }
    if (value !== inputRef.current.innerHTML) {
      inputRef.current.innerHTML = value
    }
    if (value !== textRef.current) {
      textRef.current = value

      updateHeight()
    }
  }, [value])

  const updateHeight = () => {
    const textarea = inputRef.current
    const scroller = inputScrollRef.current

    if (!textarea || !scroller) {
      return
    }

    const newHeight = Math.min(textarea.scrollHeight, maxInputHeight)
    scroller.style.height = `${newHeight}px`
  }

  const handleChange = (e: ChangeEvent<HTMLDivElement>) => {
    const textarea = inputRef.current
    const scroller = inputScrollRef.current
    if (!textarea || !scroller) {
      return
    }
    e.preventDefault()
    const {innerHTML} = textarea
    const newValue =
      innerHTML === '<br>' || innerHTML === '&nbsp;' || innerHTML === '\n'
        ? ''
        : innerHTML
    onChange(newValue)
    console.log({newValue})
  }

  const className = clsx(
    'message-input scrollable scrollable-y scrollable-hidden',
    {
      'is-empty': value.length === 0,
    }
  )
  return (
    <div className="message-input-container" ref={inputScrollRef}>
      <div
        ref={inputRef}
        className={className}
        contentEditable
        data-placeholder="Send a message..."
        // important! contentEditable works only with "onInput" method
        onInput={handleChange}
        // onBlur={() => {
        //   setFocused(false)
        // }}
        // onFocus={() => {
        //   setFocused(true)
        // }}
      />
    </div>
  )
}
