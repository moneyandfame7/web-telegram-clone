import type {FC, SVGProps} from 'react'
import clsx from 'clsx'

import type {Size} from '../../types/ui-types'

import * as icons from '../../../assets/icons/all'

import './Icon.scss'

export type IconName = keyof typeof icons | 'placeholder'
export type IconColor = 'default' | 'secondary' | 'primary' | 'white' | 'red'

export interface IconProps {
  name: IconName
  title: string

  /**
   * @default 'secondary'
   */
  color?: IconColor

  /**
   * @default 24
   */
  heightAndWidth?: number

  /**
   * @default 'medium
   */
  size?: Size

  className?: string

  onClick?: () => void
}
export const Icon: FC<IconProps> = ({
  name,
  color = 'default',
  heightAndWidth = 24,
  size = 'medium',
  className,
  ...props
}) => {
  const IconComponent =
    name !== 'placeholder' ? (icons[name] as FC<SVGProps<SVGSVGElement>>) : null

  const buildedClassname = clsx(
    className,
    'icon',
    `icon-${name}`,
    `icon-${size}`,
    `icon-${color}`
  )
  return IconComponent ? (
    <IconComponent
      className={buildedClassname}
      {...props}
      height={heightAndWidth}
      width={heightAndWidth}
    />
  ) : (
    <svg
      className={buildedClassname}
      {...props}
      height={heightAndWidth}
      width={heightAndWidth}
    />
  )
}
