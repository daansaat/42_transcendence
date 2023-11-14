import { useRef, useEffect, useState } from 'react'
import { Ball, Paddle, Score, Timer, Net } from './components'
import { useGame } from '../../contexts'
import { GameMode } from './logic/types'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import './components/Online/styles.css'
import { CloseIcon } from '../Lobby/assets/CloseIcon'

type GameProps = {
  gameMode?: GameMode
}

const Background = styled.div`
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

export function Game({ gameMode = 'endless' }: GameProps) {
  const ballRef = useRef<HTMLDivElement>(null)
  const playerPaddleRef = useRef<HTMLDivElement>(null)
  const computerPaddleRef = useRef<HTMLDivElement>(null)
  const { setUp, start, gameState } = useGame()
  const [rules, setRules] = useState('');
  const [gameEnd, setGameEnd] = useState(false);
  const [P1Score, setP1Score] = useState(0);
  const [P2Score, setP2Score] = useState(0);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (
      ballRef.current &&
      playerPaddleRef.current &&
      computerPaddleRef.current &&
      !gameState.isGameRunning
    ) {
      setUp(
        ballRef.current as HTMLDivElement,
        playerPaddleRef.current as HTMLDivElement,
        computerPaddleRef.current as HTMLDivElement,
        { gameMode }
      )

      start()
    }
  }, )

  useEffect(() => {
    if (gameMode === 'solo')
      setRules("Play using your mouse");
    else if (gameMode === 'multiplayer')
      setRules("Play using ArrowUp ArrowDown");
  }, [gameMode]);

   useEffect(() => {
    if (gameState.score[0] === 5 || gameState.score[1] === 5) {
      setP1Score(gameState.score[0])
      setP2Score(gameState.score[1])
      setGameEnd(true);
    }
  }, [gameState.score]);

  const handleClose = () => {
    navigate('/lobby');
  };

  const handleExit = () => {
    navigate('/lobby');
  };

  return (
    <>
    {!gameEnd && (
      <Background>
        {/* <Timer/> */}
        <Timer str={rules}/>
        <Score />
        <button className='exit' onClick={handleExit}>
          <CloseIcon />
        </button>
        <Net />
        <Ball ballRef={ballRef} />
        <Paddle paddleRef={playerPaddleRef} />
        <Paddle paddleRef={computerPaddleRef} side='right' />
      </Background>
    )}
    {gameEnd && (
      <div className='result'>
        {P1Score}-{P2Score}
        <button className='backlobby' onClick={handleClose}>
           Turn back to Lobby
        </button>
      </div>
    )}
    </>
  )
}
