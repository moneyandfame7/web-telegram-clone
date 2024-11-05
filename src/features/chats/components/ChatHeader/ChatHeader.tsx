import {FC} from 'react'
import {isUserId} from '../../../users/helpers'

import {PrivateChatInfo} from './PrivateChatInfo'
import {GroupChatInfo} from './GroupChatInfo'

import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'

import {useAppDispatch} from '../../../../app/store'
import {uiActions} from '../../../../shared/store/ui-slice'
import {RightColumnScreen} from '../../../../shared/types/ui-types'

import './ChatHeader.scss'

export interface ChatHeaderProps {
  chatId: string
}
export const ChatHeader: FC<ChatHeaderProps> = ({chatId}) => {
  const dispatch = useAppDispatch()
  const isPrivate = isUserId(chatId)

  return (
    <div className="chat-header">
      <div
        className="chat-info"
        onClick={() => {
          console.log('LALALA')
          dispatch(uiActions.setRightColumn(RightColumnScreen.Info))
        }}
      >
        {isPrivate ? (
          <PrivateChatInfo userId={chatId.split('u_')[1]} />
        ) : (
          <GroupChatInfo chatId={chatId} />
        )}
      </div>
      <div className="chat-utils">
        <IconButton name="search" title="Search" color="secondary" />
        <DropdownMenu
          button={<IconButton name="more" title="Menu" color="secondary" />}
          position="bottom-right"
        >
          <MenuItem
            icon="info2"
            title="Info"
            onClick={() => {
              dispatch(uiActions.setRightColumn(RightColumnScreen.Info))
            }}
          />
          <MenuItem
            icon="edit"
            title="Edit"
            onClick={() => {
              dispatch(uiActions.setRightColumn(RightColumnScreen.Edit))
            }}
          />
        </DropdownMenu>
      </div>
    </div>
  )
}
