import {type FC} from 'react'
import {Outlet} from 'react-router-dom'

import './MiddleColumn.scss'
export const MiddleColumn: FC = () => {
  return (
    <div className="middle-column">
      <Outlet />
    </div>
  )
}
