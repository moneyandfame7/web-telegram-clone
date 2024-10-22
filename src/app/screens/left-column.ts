import {createScreenContext} from './context'

export enum LeftColumnScreen {
  Chats,
  Search,
  Settings,
  NewChannelStep1,
  NewChannelStep2,
  NewGroupStep1,
  NewGroupStep2,
}

export enum LeftMainScreen {
  Chats,
  Search,
}

export enum LeftColumnGroup {
  Main,
  Settings,
  NewChat,
  NewGroup,
}

export const LeftColumnContext = createScreenContext<
  LeftColumnScreen,
  typeof LeftColumnScreen
>(LeftColumnScreen, 'left-column')
