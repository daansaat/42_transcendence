import { COMPUTER_PADDLE_SPEED } from '.'

export class Paddle {
  paddleElem: HTMLDivElement

  constructor(paddleElem: HTMLDivElement) {
    this.paddleElem = paddleElem
    this.reset()
  }

  get position(): number {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue('--position')
    )
  }

  set position(value: number) {
    if (value < 0) value = 0
    if (value > 100) value = 100

    this.paddleElem.style.setProperty('--position', String(value))
  }

  rect(): DOMRect {
    return this.paddleElem.getBoundingClientRect()
  }

  reset() {
    this.position = 50
  }

  update(delta: number, ballHeight: number) {
    this.position +=
      COMPUTER_PADDLE_SPEED * delta * (ballHeight - this.position)
  }
}
