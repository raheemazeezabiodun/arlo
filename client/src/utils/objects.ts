export function isObjectEmpty(object: {}): boolean {
  return Object.keys(object).length === 0
}

interface IEqualityObject {
  [key: string]: any
}

export function isObjectEqual(
  object1: IEqualityObject,
  object2: IEqualityObject
): boolean {
  if (object1 === object2) return true

  const keysA = Object.keys(object1)
  const keysB = Object.keys(object2)

  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!keysB.includes(key)) return false

    if (
      typeof object1[key] === 'function' ||
      typeof object2[key] === 'function'
    ) {
      if (object1[key].toString() !== object2[key].toString()) return false
    } else if (!isObjectEqual(object1[key], object2[key])) return false
  }
  return true
}
