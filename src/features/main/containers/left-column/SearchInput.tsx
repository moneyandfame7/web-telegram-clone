import {FC, useState} from 'react'
import {InputText} from '../../../../shared/ui/Input/Input'
import {Icon} from '../../../../shared/ui/Icon/Icon'

import './SearchInput.scss'
interface SearchInputProps {
  onFocus: () => void
}
export const SearchInput: FC<SearchInputProps> = ({onFocus}) => {
  const [searchText, setSearchText] = useState<string>('')
  return (
    <InputText
      className="search-input"
      onChange={(e) => {
        setSearchText(e.currentTarget.value)
      }}
      value={searchText}
      onFocus={onFocus}
      placeholder="Search"
      startIcon={<Icon name="search" title="Search" />}
    />
  )
}
