import { Server } from "socket.io";
import { GameType } from "src/typeorm/game.entity";

export const numActPerSendData = 2;
export const baseSpeed = 100;
export const scoreMax = 3;
// export const startTime = 1e3;
export const gameTps = 40;
export const ballSpeed = (baseSpeed / gameTps); //padWidth den fazla olmasin
export const ballSizeX = 2.4;
export const ballSizeY = 3.2;
export const ballSpeedInc = ballSpeed / 25;
export const padSpeed = (baseSpeed / gameTps);
export const padHeight = 20;
export const padWidth = 1.25;
export const paddleLeftStartX = padWidth * 2;
export const paddleRightStartX = 100 - (padWidth * 3);
export const paddleblockStartX = 50 - (padWidth * 3);
export const padStartY = 50 - padHeight / 2;
// export const 50 - 15 / 2 = 50 - padHeight / 2;

export enum PadMove {
  UP = -1,
  STATIC,
  DOWN,
}

export class Ball {
  x: number;
  y: number;
  speed: number;
  directionX: number;
  directionY: number;
  sizeX: number;
  sizeY: number;
  accel: number;

  constructor(directionX: number, customBallSpeed: number) {
    this.x = 50;
    this.y = 50;
    this.speed = customBallSpeed;
    this.directionX  = directionX;
    this.directionY = customBallSpeed * Math.sin(Math.PI / 4);
    this.sizeX = ballSizeX;
    this.sizeY = ballSizeY;
    this.accel = 0.1;
  }
}

export class Pad {
  x: number;
  y: number;
  height: number;
  width: number;
  speed: number;
  move: number;
  reversed: number;

  constructor(startX: number, height: number) {
    this.x = startX;
    this.y = padStartY;
    this.height = height;
    this.width = padWidth;
    this.speed = padSpeed;
    this.move = PadMove.STATIC;
    this.reversed = 1;
  }
}

export class Game {
  
  interval: NodeJS.Timer;
  pause: boolean;
  p1Score: number;
  p2Score: number;
  ball: Ball;
  paddleLeft: Pad;
  paddleRight: Pad;
  server: Server;
  p1: number;
  p2: number;
  id: string;
  dbIdP1: number;
  dbIdP2: number;
  type: GameType;
  isCustom: boolean;
  // block: Ball; 
  blockA: Pad; 
  blockB: Pad; 

  constructor(
    server: Server,
    p1: number,
    p2: number,
    dbIdP1: number,
    dbIdP2: number,
    type: GameType,
    customPadHeight = padHeight,
    customBallSpeed = 100/120,
    customAccelBall = ballSpeedInc,
  ) {
    const modeSpeed = customBallSpeed;

    this.server = server;
    this.interval = null;
    this.pause = false;
    this.p1Score = 0;
    this.p2Score = 0;
    this.ball = new Ball(-modeSpeed * Math.cos(Math.PI / 4), modeSpeed);
    // this.block = new Ball(-modeSpeed * Math.cos(Math.PI / 4), modeSpeed);
    this.paddleLeft = new Pad(paddleLeftStartX, customPadHeight);
    this.paddleRight = new Pad(paddleRightStartX, customPadHeight);
    this.blockA = new Pad(paddleblockStartX, customPadHeight);
    this.blockA.x = 20;
    this.blockA.y = 20;
    this.blockB = new Pad(paddleblockStartX, customPadHeight);
    this.blockB.x = 80;
    this.blockB.y = 20;
    // this.block.height = 50;
    this.p1 = p1;
    this.p2 = p2;
    this.id = [p1, p2].sort().join('vs');
    this.dbIdP1 = dbIdP1;
    this.dbIdP2 = dbIdP2;

    if (type == GameType.CLASSIC)
      this.isCustom = false;
    else
      this.isCustom = true;
  }

}