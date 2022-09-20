import React, { useEffect, useRef, useState } from 'react';
import { playBeep, playClank } from './sounds';

enum ETurn {
  BEGIN = 0,
  TOP = 1,
  BOTTOM = 2,
  END = 3,
}

const makeItDoubleDigits = (x: number) =>  x < 10 ? `0${x}` : String(x)

const timeToString = (millis: number) => {
  const seconds = Math.floor(millis / 1000);
  const s = seconds % 60;
  const m = Math.floor(seconds / 60);
  return `${makeItDoubleDigits(m)}:${makeItDoubleDigits(s)}`
}

const multipleBeep = () => {
  for (let i = 0; i < 20; i += 1) {
    setTimeout(() => {
      playBeep()
    }, i * 50)
  }
}

const UPDATE_FREQUENCY = 200
const DANGER_THRESHOLD = 30 * 1000

interface IClockProps {
  time: number;
  increment: number;
  onRestart: () => void;
}

const Clock: React.FC<IClockProps> = ({ time, increment, onRestart }) => {
  const [turn, setTurn] = useState<ETurn>(ETurn.BEGIN);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeftTop, setTimeLeftTop] = useState(time + 999);
  const [timeLeftBottom, setTimeLeftBottom] = useState(time  + 999);
  const lastTimeMark = useRef(Date.now());

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now()
      const diffTime = now - lastTimeMark.current
      lastTimeMark.current = now
      // TODO: Sonido de alerta cuando quedan menos de 5 segundos (cada segundo) y cuando pasas el umbral de 30s
      if (turn === ETurn.TOP) {
        setTimeLeftTop((oldTimeLeftTop) => {
          const newTimeLeftTop = oldTimeLeftTop - diffTime
          const oldSeconds = Math.floor(oldTimeLeftTop / 1000)
          const newSeconds = Math.floor(newTimeLeftTop / 1000)
          if (oldSeconds !== newSeconds && newSeconds < 6) {
            playBeep()
          }
          if (oldTimeLeftTop > DANGER_THRESHOLD && newTimeLeftTop < DANGER_THRESHOLD) {
            playBeep()
          }
          if (newTimeLeftTop < 0) {
            multipleBeep()
            setTurn(ETurn.END)
            return 0
          }

          return newTimeLeftTop
        })
      } else if (turn === ETurn.BOTTOM) {
        setTimeLeftBottom((oldTimeLeftBottom) => {
          const newTimeLeftBottom = oldTimeLeftBottom - diffTime
          const oldSeconds = Math.floor(oldTimeLeftBottom / 1000)
          const newSeconds = Math.floor(newTimeLeftBottom / 1000)
          if (oldSeconds !== newSeconds && newSeconds < 6) {
            playBeep()
          }
          if (oldTimeLeftBottom > DANGER_THRESHOLD && newTimeLeftBottom < DANGER_THRESHOLD) {
            playBeep()
          }
          if (newTimeLeftBottom < 0) {
            multipleBeep()
            setTurn(ETurn.END)
            return 0
          }

          return newTimeLeftBottom
        })
      }
    }

    let interval: null | NodeJS.Timer = null
    if (turn !== ETurn.BEGIN && !isPaused) {
      lastTimeMark.current = Date.now()
      interval = setInterval(updateTime, UPDATE_FREQUENCY)
    }

      return () => {
        interval && clearInterval(interval)
    }
  }, [turn, isPaused])

  return (
    <div className="flex flex-col h-screen w-screen items-stretch text-6xl font-bold">
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          backgroundColor: (turn === ETurn.TOP) ? (isPaused ? '#888' : (timeLeftTop < DANGER_THRESHOLD ? 'red' : 'black')) : 'white',
          color: (turn === ETurn.TOP) ? 'white' : 'black',
        }}
        onTouchStart={() => {
          if (turn !== ETurn.BOTTOM && turn !== ETurn.END && !isPaused) {
            playClank()
            if (turn !== ETurn.BEGIN && increment && timeLeftTop > 0) {
              setTimeLeftTop((t) => t + increment)
            }
            setTurn(ETurn.BOTTOM)
          }
        }}
      >
        <div className="inline-block rotate-90">
          { timeToString(timeLeftTop) }
        </div>
      </div>
      <div className="bg-gray-500 text-white text-xl flex flex-row justify-center align-center">
        <div
          className="p-4 flex-1 flex flex-row align-center justify-center"
          onTouchStart={() => {
            if (turn !== ETurn.BEGIN && turn !== ETurn.END) {
              setIsPaused(p => !p)
            }
          }}
        >
          { isPaused
            ? <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><title>ionicons-v5-c</title><polygon points="96 448 416 256 96 64 96 448"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><title>ionicons-v5-c</title><path d="M224,432H144V80h80Z"/><path d="M368,432H288V80h80Z"/></svg>
           }
        </div>
        <div
          className="p-4 bg-red-400 flex flex-row items-center justify-center"
          style={{
            // backgroundColor: '#666',
            width: 72,
          }}
        >
          <div
            onTouchStart={() => {
              if (isPaused || turn === ETurn.BEGIN || turn === ETurn.END) {
                onRestart()
              } else {
                alert('Pause the game first')
              }
            }}
          >
            R
          </div>
        </div>

      </div>
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          backgroundColor: (turn === ETurn.BOTTOM) ? (isPaused ? '#888' : (timeLeftBottom < DANGER_THRESHOLD ? 'red' : 'black')) : 'white',
          color: (turn === ETurn.BOTTOM) ? 'white' : 'black',
        }}
        onTouchStart={() => {
          if (turn !== ETurn.TOP && turn !== ETurn.END && !isPaused) {
            playClank()
            if (turn !== ETurn.BEGIN && increment && timeLeftBottom > 0) {
              setTimeLeftBottom((t) => t + increment)
            }
            setTurn(ETurn.TOP)
          }
        }}
      >
        <div className="inline-block rotate-90">
          { timeToString(timeLeftBottom) }
        </div>
      </div>
    </div>
  );
}

export default Clock;
