import {type PropsWithChildren, type ReactNode, type FC, useEffect} from 'react'
import {useNavigationStack} from './useNavigationStack'

interface NavigationLinkProps extends PropsWithChildren {
  destination: ReactNode
  isActive?: boolean
}
export const NavigationLink: FC<NavigationLinkProps> = ({
  destination,
  children,
  isActive,
}) => {
  const {push, pop} = useNavigationStack()

  useEffect(() => {
    if (isActive) {
      push(destination)
    } else {
      pop()
    }
  }, [isActive])

  if (typeof isActive === 'undefined') {
    return (
      <div
        className="navigation-link"
        onClick={() => {
          push(destination)
        }}
      >
        {children}
      </div>
    )
  }
}
