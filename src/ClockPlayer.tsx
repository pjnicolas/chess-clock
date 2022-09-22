import React from 'react'

const DANGER_THRESHOLD = 30 * 1000

const makeItDoubleDigits = (x: number) =>  x < 10 ? `0${x}` : String(x)

const timeToString = (millis: number) => {
  const seconds = Math.floor(millis / 1000);
  const mi = Math.floor(millis / 10) % 100;
  const s = seconds % 60;
  const m = Math.floor(seconds / 60);
  let output = `${makeItDoubleDigits(m)}:${makeItDoubleDigits(s)}`
  if (m <= 0 && s < 10) {
    output += `.${makeItDoubleDigits(mi)}`
  }
  return output
}

interface IClockPlayer {
  isPaused: boolean;
  isTurn: boolean;
  timeLeft: number;
  onFinishTurn: () => void;
}

const ClockPlayer: React.FC<IClockPlayer> = ({ isPaused, timeLeft, isTurn, onFinishTurn }) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center"
      style={{
        backgroundColor: isTurn ? (isPaused ? '#888' : (timeLeft < DANGER_THRESHOLD ? 'red' : 'black')) : 'white',
        color: isTurn ? 'white' : 'black',
      }}
      onTouchStart={() => {
        if (isTurn && !isPaused) {
          onFinishTurn()
        }
      }}
    >
      <div className="inline-block rotate-90 select-none">
        { timeToString(timeLeft) }
      </div>
    </div>
  )
}

export default React.memo(ClockPlayer)
