import { PADDLE_DEFAULT_SIZE } from '../../../contexts'
import { Paddle } from '.'

const playerMouseMove = (e: MouseEvent, paddle: Paddle) => {
  paddle.position = (e.y / window.innerHeight) * 100
}

const movePlayer = (
  e: KeyboardEvent,
  paddle: Paddle,
  keys: [string, string],
  paddleSize: number = PADDLE_DEFAULT_SIZE
) => {
  if (e.key === keys[0]) {
    paddle.position = paddle.position - paddleSize
  }

  if (e.key === keys[1]) {
    paddle.position = paddle.position + paddleSize
  }
}

export function setUpListeners(paddles: Paddle[], paddleSize?: number) {
  if (paddles.length === 2) {
    document.addEventListener('keydown', (e) => {
      movePlayer(e, paddles[0], ['w', 's'], paddleSize)
      movePlayer(e, paddles[1], ['ArrowUp', 'ArrowDown'], paddleSize)
    })
  } else {
    document.addEventListener('mousemove', (e) => {
      playerMouseMove(e, paddles[0])
    })
  }
}
