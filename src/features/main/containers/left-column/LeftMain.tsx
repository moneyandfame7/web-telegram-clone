import {useState, type FC} from 'react'

import {LeftMainScreen} from '../../../../app/types'

import {Transition} from '../../../../shared/ui/Transition/Transition'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'

import {Contacts} from './Contacts'
import {Settings} from './Settings'
import {ChatList} from './ChatList'
import {Search} from './Search'
import {SearchInput} from './SearchInput'
import {useAppSelector} from '../../../../app/store'
import {Column} from '../../../../shared/ui/Column/Column'

export const LeftMain: FC = () => {
  const {push} = useNavigationStack()
  const [activeScreen, setActiveScreen] = useState(LeftMainScreen.Chats)
  const [searchText, setSearchText] = useState('')
  const isUpdating = useAppSelector((state) => state.ui.isUpdating)

  const renderScreen = () => {
    switch (activeScreen) {
      case LeftMainScreen.Chats:
        return <ChatList />
      case LeftMainScreen.Search:
        return <Search setActiveScreen={setActiveScreen} />
    }
  }
  return (
    <Column
      header={
        <>
          <DropdownMenu
            position="bottom-left"
            transform="top left"
            button={
              <IconButton
                name="menu"
                title="Menu"
                size="medium"
                color="secondary"
              />
            }
            style={{minWidth: 250}}
          >
            <MenuItem icon="savedMessages" title="Saved Messages" />
            <MenuItem icon="archived" title="Archived Chats" badge={50} />
            <MenuItem
              icon="user"
              title="Contacts"
              onClick={() => {
                push(<Contacts />)
              }}
            />
            <MenuItem
              icon="settings"
              title="Settings"
              onClick={() => {
                push(<Settings />)
              }}
            />
          </DropdownMenu>

          <SearchInput
            value={searchText}
            onChange={(e) => {
              setSearchText(e.currentTarget.value)
            }}
            onFocus={() => {
              setActiveScreen(LeftMainScreen.Search)
            }}
            isUpdating={isUpdating}
          />
        </>
      }
    >
      <Transition
        activeKey={activeScreen}
        transitionName="zoomFade"
        shouldCleanup
        timeout={200}
        cleanupException={LeftMainScreen.Chats}
      >
        {renderScreen()}
      </Transition>
    </Column>
  )
}
