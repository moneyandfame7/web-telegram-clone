import {FC} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'

export const ChatInviteLinkEdit: FC = () => {
  const {pop, push} = useNavigationStack()

  return <Column title="Edit Invite Link" onGoBack={pop}></Column>
}
