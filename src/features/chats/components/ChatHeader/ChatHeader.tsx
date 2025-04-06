import {FC} from 'react'

import {PrivateChatInfo} from './PrivateChatInfo'
import {GroupChatInfo} from './GroupChatInfo'

import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'

import {useAppDispatch, useAppSelector} from '../../../../app/store'
import {uiActions} from '../../../../shared/store/ui-slice'
import {RightColumnScreen} from '../../../../shared/types/ui-types'

import './ChatHeader.scss'
import {chatsSelectors} from '../../state'
import {Chat} from '../../types'
import {isUserId} from '../../../users/helpers'

export interface ChatHeaderProps {
  chatId: string
}
export const ChatHeader: FC<ChatHeaderProps> = ({chatId}) => {
  const dispatch = useAppDispatch()
  const chat = useAppSelector((state) =>
    chatsSelectors.selectById(state, chatId)
  ) as Chat | undefined

  return (
    <div className="chat-header">
      <div
        className="chat-info"
        onClick={() => {
          dispatch(uiActions.setRightColumn(RightColumnScreen.Info))
        }}
      >
        {chat?.userId || isUserId(chatId) ? (
          <PrivateChatInfo userId={chat?.userId || chatId.split('u_')[1]} />
        ) : (
          <GroupChatInfo chatId={chatId} />
        )}
      </div>
      <div className="chat-utils">
        <IconButton name="search" title="Search" />
        <DropdownMenu
          button={<IconButton name="more" title="Menu" />}
          position="bottom-right"
          transform="top right"
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
