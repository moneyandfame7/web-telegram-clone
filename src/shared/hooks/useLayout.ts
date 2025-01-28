import {useEffect, useState} from 'react'

export const useLayout = () => {
  const getWindowMatches = () => ({
    isMobile: window.matchMedia('(max-width: 480px)').matches,
    isTablet: window.matchMedia('(min-width: 480.1px) and (max-width: 768px)')
      .matches,
    isLaptop: window.matchMedia('(min-width: 768.1px) and (max-width: 1280px)')
      .matches,
    isSmall: window.matchMedia('(max-width: 768px)').matches,
    // isAnimationOff: !global.settings.general.animationsEnabled,
  })

  const [layout, setLayout] = useState(getWindowMatches)

  useEffect(() => {
    const handleResize = () => {
      setLayout(getWindowMatches())
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return layout
}
