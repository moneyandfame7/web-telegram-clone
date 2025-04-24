import {FC, useEffect} from 'react'
import './TestModal.scss'
import {Button} from '../../../../shared/ui'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {Modal} from '../../../../shared/ui/Modal/Modal'
import {useBoolean} from '../../../../shared/hooks/useBoolean'
import {Avatar} from '../../../../shared/ui/Avatar/Avatar'
export const TestModal: FC = () => {
  const {inviteId} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const {value, toggle, setValue} = useBoolean()
  const hasBackground = !!location.state?.previousLocation

  useEffect(() => {
    console.log({inviteId})
    setValue(!!inviteId)
  }, [inviteId])
  return (
    <Modal
      isOpen={value}
      onClose={() => {
        console.log(location, history)
        setValue(false)
      }}
      onExitTransition={() => {
        if (hasBackground) {
          navigate(-1)
        } else {
          navigate('/', {replace: true})
        }
      }}
      title="Invite link"
      actions={
        <Button
          onClick={() => {}}
          // isLoading={isLoading}
          fullWidth
          size="small"
        >
          Test button
        </Button>
      }
      content={
        <>
          <Avatar title="hui" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
            saepe tempora tempore nisi reprehenderit temporibus amet facere unde
            cum, possimus incidunt similique blanditiis totam necessitatibus
            repellat recusandae. Ex, perferendis ratione.
          </p>
        </>
      }
    />
  )
}
