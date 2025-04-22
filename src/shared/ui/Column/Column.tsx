import {type PropsWithChildren, type FC, type ReactNode} from 'react'
import {IconButton} from '../IconButton/IconButton'

import './Column.scss'
export interface ColumnProps extends PropsWithChildren {
  title?: string
  header?: ReactNode
  onGoBack?: VoidFunction
  className?: string
}
export const Column: FC<ColumnProps> = ({
  title,
  header,
  onGoBack,
  children,
  className,
}) => {
  return (
    <div className={`column${className ? ` ${className}` : ``}`}>
      <div className="column-header">
        {onGoBack && (
          <IconButton title="Go Back" name="arrowLeft" onClick={onGoBack} />
        )}
        {title && <h1 className="column__title">{title}</h1>}
        {header}
      </div>
      <div className="column-content">{children}</div>
    </div>
  )
}
