import {FC} from 'react'
import {Section} from '../../../../shared/ui/Section/Section'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {IconButton} from '../../../../shared/ui/IconButton/IconButton'
import {Button} from '../../../../shared/ui'
import {DropdownMenu} from '../../../../shared/ui/DropdownMenu/DropdownMenu'
import {MenuItem} from '../../../../shared/ui/Menu/MenuItem'

import './InviteLinkContainer.scss'
interface InviteLinkProps {
  title: string
  fullLink: string
  joinedCount?: number
}
export const InviteLinkContainer: FC<InviteLinkProps> = ({
  title,
  fullLink,
  joinedCount,
}) => {
  return (
    <Section className="invite-link">
      <h2 className="section__heading">{title}</h2>
      <ListItem
        variant="secondary"
        withAvatar={false}
        title={fullLink}
        onClick={() => {}}
        titleRight={
          <DropdownMenu
            button={<IconButton name="more" title="Menu" />}
            position="bottom-right"
            transform="top right"
          >
            <MenuItem icon="copy" title="Copy Link" onClick={() => {}} />
            <MenuItem
              danger
              icon="deleteIcon"
              title="Delete Link"
              onClick={() => {}}
            />
          </DropdownMenu>
        }
      />
      <Button>Share</Button>
      {joinedCount && (
        <p className="invite-link__subtitle">{joinedCount} joined</p>
      )}
    </Section>
  )
}
