import clsx from 'clsx'

import {
  ChangeEvent,
  FC,
  FocusEvent,
  FormEventHandler,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import {Spinner} from '../Spinner/Spinner'

import './Input.scss'

export type InputVariant = 'filled' | 'outlined' | 'default'
interface InputProps {
  elRef?: RefObject<HTMLInputElement>
  id?: string
  value: string
  error?: string | undefined
  label?: string
  isDisabled?: boolean
  placeholder?: string
  onChange: FormEventHandler<HTMLInputElement>
  onBlur?: FormEventHandler<HTMLInputElement>
  onFocus?: FormEventHandler<HTMLInputElement>
  onClick?: FormEventHandler<HTMLInputElement>
  maxLength?: number
  withIndicator?: boolean
  isLoading?: boolean
  tabIndex?: number
  autoFocus?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
  'aria-label'?: string
  type?: string
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  variant?: InputVariant
  fixedLabel?: boolean
  pattern?: string
  autoComplete?: string
  autoCorrect?: string
}

export const InputText: FC<InputProps> = ({
  elRef,
  id,
  value,
  error,
  label,
  isDisabled,
  isLoading = false,
  placeholder,
  maxLength,
  pattern,
  withIndicator = !!maxLength,
  autoFocus = false,
  onChange,
  onBlur,
  onFocus,
  tabIndex,
  startIcon,
  endIcon,
  className,
  'aria-label': ariaLabel,
  type = 'text',
  inputMode,
  fixedLabel,
  variant = 'outlined',
  autoCorrect,
}) => {
  const [valueLength, setValueLength] = useState(maxLength)
  const labelText = error || label
  let ref = useRef<HTMLInputElement>(null)
  if (elRef) {
    ref = elRef
  }
  // const inputRef = useRef(elRef || null)
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (typeof maxLength !== 'undefined') {
      const {value} = e.currentTarget

      setValueLength(maxLength - value.length)
    }

    onChange(e)
  }
  const handleOnFocus = (e: ChangeEvent<HTMLInputElement>) => {
    // elRef?.current?.focus()
    onFocus?.(e)
    // e.preventDefault()
  }

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    onBlur?.(e)
  }

  const buildedClassname = clsx(
    className,
    'input-container',
    `input-${variant}`,
    {
      error: Boolean(error),
      'not-empty': Boolean(value.length),
      'start-icon': Boolean(startIcon),
      loading: isLoading,
      'end-icon': Boolean(endIcon) || typeof isLoading !== 'undefined',
      'fixed-label': fixedLabel, // if animation off
    }
  )

  useLayoutEffect(() => {
    if (autoFocus && ref?.current) {
      ref?.current.focus()
    }
  }, [])

  useEffect(() => {
    if (error) {
      ref?.current?.blur()
    }
  }, [error])

  const renderEndIcon = useCallback(() => {
    return (
      <>
        {isLoading && (
          <span className="input-spinner">
            <Spinner size="small" color="neutral" />
          </span>
        )}
        {endIcon}
      </>
    )
  }, [endIcon, isLoading])

  return (
    <div className={buildedClassname}>
      <input
        // autoFocus={autoFocus}
        autoCorrect={autoCorrect}
        autoComplete="off"
        pattern={pattern}
        inputMode={inputMode}
        tabIndex={tabIndex}
        ref={ref}
        id={id}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        value={value}
        type={type}
        disabled={isDisabled || isLoading}
        maxLength={maxLength}
        aria-label={ariaLabel || labelText}
        placeholder={placeholder}
      />
      {variant !== 'default' && <div className="input-border" />}
      {/* {startIcon && <Icon name={startIcon} color="secondary" />} */}
      {/* {renderStartIcon()} */}
      {startIcon}
      {renderEndIcon()}
      {labelText && <label htmlFor={id}>{labelText}</label>}
      {maxLength && withIndicator && (
        <span className="length-indicator">{valueLength}</span>
      )}
    </div>
  )
}
