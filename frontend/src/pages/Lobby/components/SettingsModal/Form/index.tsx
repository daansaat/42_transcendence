import { Radio, Range, Wrapper } from './components';
import {
  BallVelocityIncreaseModeKey,
  ballVelocityIncreaseModesKeys,
  useSettings,
} from '../../../../../contexts'
import './styles.css'

export function SettingsForm() {
  const {
    settings,
    setSettings,
  } = useSettings()

  function handleBallVelocityIncreaseCheck(value: BallVelocityIncreaseModeKey) {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ballVelocityIncrease: value,
    }))
  }

  function handlePaddleSize(value: string) {
    setSettings((prevSettings) => ({
      ...prevSettings,
      paddleSize: parseFloat(value),
    }))
  }

  return (
    <div className='settings-form'>
      <Wrapper>
        
      <section>
          <h2>Paddle Size:</h2>

          <div>
            <Range
              min={1}
              max={70}
              name='paddleSize'
              defaultValue={String(settings.paddleSize)}
              handleChange={handlePaddleSize}
            />
          </div>
        </section>

        <section>
          <h2>Ball Velocity:</h2>

          <div className='radio-container'>
            <Radio
              label='Slow'
              group='ballVelocityIncrease'
              name={ballVelocityIncreaseModesKeys.SLOW}
              handleCheck={handleBallVelocityIncreaseCheck}
              checked={
                settings.ballVelocityIncrease ===
                ballVelocityIncreaseModesKeys.SLOW
              }
            />

            <Radio
              label='Medium'
              group='ballVelocityIncrease'
              name={ballVelocityIncreaseModesKeys.MEDIUM}
              handleCheck={handleBallVelocityIncreaseCheck}
              checked={
                settings.ballVelocityIncrease ===
                ballVelocityIncreaseModesKeys.MEDIUM
              }
            />

            <Radio
              label='Fast'
              group='ballVelocityIncrease'
              name={ballVelocityIncreaseModesKeys.FAST}
              handleCheck={handleBallVelocityIncreaseCheck}
              checked={
                settings.ballVelocityIncrease ===
                ballVelocityIncreaseModesKeys.FAST
              }
            />

          </div>
        </section>

      </Wrapper>
    </div>
  )
}
