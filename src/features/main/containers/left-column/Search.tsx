import type {FC} from 'react'

import {Button} from '../../../../shared/ui'
import {LeftMainScreen} from '../../../../app/screens/left-column'

import './Search.scss'

interface SearchProps {
  setActiveScreen: (screen: LeftMainScreen) => void
}
export const Search: FC<SearchProps> = ({setActiveScreen}) => {
  return (
    <div className="search">
      <h1>Search</h1>
      <h1>Search</h1>
      <h1>Search</h1>
      <h1>Search</h1>
      <h1>Search</h1>
      <Button
        onClick={() => {
          setActiveScreen(LeftMainScreen.Chats)
        }}
      >
        Go back
      </Button>
    </div>
  )
}
