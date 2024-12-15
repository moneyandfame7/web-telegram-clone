import {AnyFunction} from '../types/common'

// Ajaxy tt ( web.telegram/a)
export function throttle<F extends AnyFunction>(
  fn: F,
  ms: number,
  leading = true
) {
  let interval: number | undefined
  let isPending: boolean
  let args: Parameters<F>

  return (..._args: Parameters<F>) => {
    isPending = true
    args = _args

    if (!interval) {
      if (leading) {
        isPending = false
        fn(...args)
      }

      // eslint-disable-next-line no-restricted-globals
      interval = self.setInterval(() => {
        if (!isPending) {
          // eslint-disable-next-line no-restricted-globals
          self.clearInterval(interval!)
          interval = undefined
          return
        }

        isPending = false
        fn(...args)
      }, ms)
    }
  }
}
