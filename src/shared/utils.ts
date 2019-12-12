/**
 *
 * @param len Max is 12, default is 8
 */
export function uid(len = 8) {
  return Math.random()
    .toString(16)
    .substr(2, len)
}

export function getId<T extends { id: string }>(instanceOrId: T | string) {
  return typeof instanceOrId === 'string' ? instanceOrId : instanceOrId.id
}

export class SArray<T> extends Array<T> {
  remove(predicate: (o: T) => boolean): T | null {
    const idx = this.findIndex(predicate)

    return idx >= 0 ? this.splice(idx, 1)[0] : null
  }

  removeItem(item: T): T | null {
    const idx = this.indexOf(item)

    return idx >= 0 ? this.splice(idx, 1)[0] : null
  }

  /**
   *
   * Return true when has the item
   */
  pushDistinct(item: T): boolean {
    const has = this.indexOf(item) >= 0

    !has && this.push(item)

    return has
  }
}

export function warn(...args: any[]) {
  console.warn(...args)
  console.trace()
}

/**
 * Check whether have at least one item of intersection
 * @param arr1
 * @param arr2
 */
export function oneOf<T>(arr1: T[], arr2: T[]): boolean {
  for (const item of arr1) {
    if (arr2.indexOf(item) >= 0) {
      return true
    }
  }

  return false
}

export function toArray<T>(t: T | T[]): T[] {
  return Array.isArray(t) ? t : [t]
}

interface IThrottleConfig {
  leading: boolean
  trailing: boolean
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  time: number,
  options: Partial<IThrottleConfig> = {}
): T {
  let firstTimeCalled = false
  let lastCalledTime = 0

  const opt: IThrottleConfig = Object.assign({ leading: true, trailing: false }, options)

  let trailingHandle: NodeJS.Timeout

  // @ts-ignore
  return (...params: Parameters<T>) => {
    const now = new Date().getTime()

    // leading
    if (!firstTimeCalled) {
      firstTimeCalled = true
      lastCalledTime = now

      if (opt.leading) {
        func(...params)
        return
      }
    }

    // exact time interval
    if (now - lastCalledTime >= time) {
      lastCalledTime = now
      func(...params)
      return
    }

    // between time interval, for trailing
    if (opt.trailing) {
      clearTimeout(trailingHandle)
      trailingHandle = setTimeout(() => func(...params), time)
    }
  }
}

interface IDebounceConfig {
  leading: boolean
  maxWait: number
  trailing: boolean
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  time: number,
  options: Partial<IDebounceConfig> = {}
): T {
  let trailingHandle: NodeJS.Timeout
  let firstTimeCalled = false
  let lastRecordTime = 0

  const opt: IDebounceConfig = Object.assign({ leading: false, trailing: true, maxWait: time }, options)

  //@ts-ignore
  return (...params: any[]) => {
    const now = new Date().getTime()

    // leading
    if (!firstTimeCalled) {
      lastRecordTime = now
      firstTimeCalled = true

      if (opt.leading) {
        func(...params)
        return
      }
    }

    // exact time interval
    if (now - lastRecordTime >= time) {
      func(...params)
      lastRecordTime = now
      return
    }

    lastRecordTime = now

    if (opt.trailing) {
      clearTimeout(trailingHandle)
      trailingHandle = setTimeout(() => func(...params), opt.maxWait)
    }
  }
}
