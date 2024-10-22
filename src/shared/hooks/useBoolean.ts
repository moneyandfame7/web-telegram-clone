import {type Dispatch, type SetStateAction, useCallback, useState} from 'react'

interface UseBooleanOutput {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}
type UseBoolean = (initial?: boolean) => UseBooleanOutput
const useBoolean: UseBoolean = (initial = false) => {
  const [value, setValue] = useState(initial)

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])
  const toggle = useCallback(() => {
    console.log('TOGGLE ALLO')
    setValue((prev) => !prev)
  }, [])

  return {
    value,
    setValue,
    setFalse,
    setTrue,
    toggle,
  }
}

export {useBoolean}
