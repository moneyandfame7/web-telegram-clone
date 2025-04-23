import {FC, useState} from 'react'
import {Column} from '../../../../shared/ui/Column/Column'
import {Chat, ChatPrivacyType as PrivacyType} from '../../../chats/types'
import {useNavigationStack} from '../../../../shared/ui/NavigationStack/useNavigationStack'
import {Section} from '../../../../shared/ui/Section/Section'
import {ListItem} from '../../../../shared/ui/ListItem/ListItem'
import {RadioGroup} from '../../../../shared/ui/RadioGroup/RadioGroup'
import {InputText} from '../../../../shared/ui/Input/Input'
import {Icon} from '../../../../shared/ui/Icon/Icon'
import {Toggle} from '../../../../shared/ui/Toggle/Toggle'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {FloatButton} from '../../../../shared/ui/FloatButton/FloatButton'

interface ChatPrivacyTypeProps {
  chat: Chat
}
export const ChatPrivacyType: FC<ChatPrivacyTypeProps> = ({chat}) => {
  const {pop} = useNavigationStack()
  const [privacyType, setPrivacyType] = useState(chat.privacyType)
  const [publicLink, setPublicLink] = useState('link://')
  const {value: allowSavingContent, toggle: toggleAllowSavingContent} =
    useBoolean()
  const isEdited =
    chat.privacyType !== privacyType ||
    chat.allowSavingContent !== allowSavingContent
  return (
    <Column
      title={`${chat.type === 'GROUP' ? 'Group' : 'Channel'} Type`}
      onGoBack={() => {
        pop()
      }}
    >
      <Section>
        <h2 className="section__heading">Group Type</h2>
        <RadioGroup
          values={[
            {
              value: 'PRIVATE',
              title: 'Private Group',
              subtitle:
                'Private groups can only be joined if you were invited or have an invite link.',
            },
            {
              value: 'PUBLIC',
              title: 'Public Group',
              subtitle:
                'Public groups can be found in search, chat history is available to everyone and anyone can join.',
            },
          ]}
          value={privacyType}
          onChange={(value) => {
            setPrivacyType(value as PrivacyType)
          }}
        />
      </Section>
      <Section>
        {privacyType === 'PRIVATE' ? (
          <>
            <ListItem
              withAvatar={false}
              title="link.com/joinchat/:id"
              subtitle="People can join your group by following this link. You can revoke the link any time."
              onClick={() => {}}
            />
            <ListItem
              withAvatar={false}
              danger
              startContent={<Icon name="deleteIcon" title="Revoke Link" />}
              title="Revoke Link"
              onClick={() => {}}
            />
          </>
        ) : (
          <InputText
            label="Public link"
            onChange={(e) => {
              const raw = e.currentTarget.value
              if (!raw.startsWith('link://')) {
                setPublicLink('link://')
              } else {
                setPublicLink(raw)
              }
            }}
            value={publicLink}
          />
        )}
      </Section>

      <Section>
        <h2 className="section__heading">Content Protection</h2>
        <ListItem
          withAvatar={false}
          titleRight={<Toggle checked={allowSavingContent} />}
          title="Restrict saving content"
          onClick={toggleAllowSavingContent}
        />
      </Section>
      <h3 className="section__subheading">
        Members won&apos;t be able to copy, save or forward content from this
        group.
      </h3>

      <FloatButton
        isVisible={isEdited}
        iconName="check"
        title="Edit"
        // isLoading={isLoading}
        onClick={async () => {
          // toggleIsLoading()
          // await dispatch(
          //   chatsThunks.updateChatInfo({
          //     chatId: chat.id,
          //     title: title.trim(),
          //     description: description.trim(),
          //   })
          // ).unwrap()
          // toggleIsLoading()
        }}
      />
    </Column>
  )
}
