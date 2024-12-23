export function inRange(value: number, range: [number, number]): boolean {
  return value >= range[0] && value <= range[1]
}
