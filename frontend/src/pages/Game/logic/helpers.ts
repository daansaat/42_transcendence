export function randomNumberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function isCollision(rect1: DOMRect, rect2: DOMRect): boolean {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  )
}

