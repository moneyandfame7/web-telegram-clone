import {memo, type FC} from 'react'

import {LeftMain} from './LeftMain'

import {NavigationStack} from '../../../../shared/ui/NavigationStack/NavigationStack'

import './LeftColumn.scss'

/**
 * @todo
 * Component Column with header
 */

export const LeftColumn: FC = memo(() => {
  return (
    <div className="left-column">
      <NavigationStack rootScreen={<LeftMain />} />
    </div>
  )
})
