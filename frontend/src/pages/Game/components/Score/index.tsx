import { useGame } from '../../../../contexts'
// import { useNavigate } from 'react-router-dom';
import './styles.css'

export function Score() {
  const { gameState } = useGame()
  // const [gameEnd, setGameEnd] = useState(false);
  // const navigate = useNavigate();


  // useEffect(() => {
  //   if (gameState.score[0] === 5 || gameState.score[1] === 5) {
  //     setGameEnd(true);
  //   }
  // }, [gameState.score]);

  return (
    <>
      {/* {!gameEnd && ( */}
        <div className='score'>
          <div id='player-score'>{gameState.score[0]}-</div>
          <div id='computer-score'>{gameState.score[1]}</div>
        </div>
      {/* )}
      {gameEnd && (
        <div className='result'>
          {gameState.score[0]}-{gameState.score[1]}
        </div>
      )} */}
    </>
  );
}