import {type PropsWithChildren, type FC, type ReactNode} from 'react'
import {IconButton} from '../IconButton/IconButton'

import './Column.scss'
export interface ColumnProps extends PropsWithChildren {
  title?: string
  header?: ReactNode
  onGoBack: VoidFunction
}
export const Column: FC<ColumnProps> = ({
  title,
  header,
  onGoBack,
  children,
}) => {
  return (
    <div className="column">
      <div className="column-header">
        <IconButton
          title="Go Back"
          name="arrowLeft"
          onClick={onGoBack}
          color="secondary"
        />
        {title && <p>{title}</p>}
        {header}
      </div>
      <div className="column-content">{children}</div>
    </div>
  )
}
