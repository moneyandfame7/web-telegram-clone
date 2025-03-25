export function uniqueArray<T>(arr: T[]) {
  return Array.from(new Set(arr))
}
