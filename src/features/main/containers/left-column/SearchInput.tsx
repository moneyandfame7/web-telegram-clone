import React, {FC} from 'react'

import {InputText} from '../../../../shared/ui/Input/Input'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {Spinner} from '../../../../shared/ui/Spinner/Spinner'

import clsx from 'clsx'

import './SearchInput.scss'

interface SearchInputProps {
  onFocus: () => void
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUpdating: boolean
}
export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
  isUpdating,
}) => {
  const renderIcon = () => {
    return (
      <>
        <Spinner color="neutral" size="small" />
        <Icon name="search" title="Search" />
      </>
    )
  }

  const className = clsx('search-input', {
    'is-updating': isUpdating,
  })
  return (
    <InputText
      className={className}
      onChange={onChange}
      value={value}
      onFocus={onFocus}
      placeholder={isUpdating ? 'Updating...' : 'Search'}
      // isLoading
      startIcon={renderIcon()}
      // <Icon name="search" title="Search" />
    />
  )
}
