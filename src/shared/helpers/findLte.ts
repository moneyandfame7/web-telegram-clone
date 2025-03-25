export function findLte<T>(
  arr: T[],
  predicate: (value: T) => boolean,
  compare: (a: T, b: T) => number
): T | undefined {
  return arr.filter(predicate).sort(compare)[0]
}
