import {FC, PropsWithChildren} from 'react'

import './Section.scss'
interface SectionProps extends PropsWithChildren {
  className?: string
}
export const Section: FC<SectionProps> = ({children, className}) => {
  return (
    <div className={`section ${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
