import React, { useCallback, useEffect, useRef, useState } from 'react';
import ClockPause from './ClockPause';
import ClockPlayer from './ClockPlayer';
import { playBeep, playClank, playLongBeep } from './sounds';

enum ETurn {
  BEGIN = 'begin',
  TOP = 'top',
  BOTTOM = 'bottom',
  END = 'end',
}

interface IClockProps {
  time: number;
  increment: number;
  onRestart: () => void;
}


const useTimeLeft = (time: number) => {
  const [timeLeft, setTimeLeft] = useState({ [ETurn.TOP]: time, [ETurn.BOTTOM]: time })

  const getTimeLeftByTurn = useCallback((turn: ETurn) => {
    return (turn === ETurn.TOP || turn === ETurn.BOTTOM) ? timeLeft[turn] : 0
  }, [timeLeft])

  const setTimeLeftByTurn = useCallback((turn: ETurn.TOP | ETurn.BOTTOM) => (updateTimeLeft: (oldTimeLeftByTurn: number) => number) => {
    setTimeLeft(({ top, bottom }) => {
      const target = turn === ETurn.TOP ? top : bottom
      const newTimeLeft = updateTimeLeft(target)
      return {
        top,
        bottom,
        [turn]: newTimeLeft,
      }
    })
  }, [])

  return {
    timeLeft,
    setTimeLeft,
    getTimeLeftByTurn,
    setTimeLeftByTurn,
  }
}

const UPDATE_INTERVAL_PRECISION = 32
const DANGER_THRESHOLD = 30 * 1000

const Clock: React.FC<IClockProps> = ({ time, increment, onRestart }) => {
  const [turn, setTurn] = useState<ETurn>(ETurn.BEGIN);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { getTimeLeftByTurn, setTimeLeftByTurn } = useTimeLeft(time);
  const lastTimeMark = useRef(Date.now());


  // ===================================
  // EFFECTS
  // ===================================

  useEffect(() => {
    if (turn === ETurn.BEGIN || turn === ETurn.END || isPaused) {
      return () => {}
    }

    let interval: any = null
    lastTimeMark.current = Date.now()
    interval = setInterval(() => {
      const now = Date.now()
      const diffTime = now - lastTimeMark.current
      lastTimeMark.current = now

      setTimeLeftByTurn(turn as ETurn.TOP | ETurn.BOTTOM)((oldTimeLeft) => {
        let newTimeLeft = Math.max(oldTimeLeft - diffTime, 0)

        const oldSeconds = Math.floor(oldTimeLeft / 1000)
        const newSeconds = Math.floor(newTimeLeft / 1000)
        if ((oldTimeLeft > DANGER_THRESHOLD && newTimeLeft < DANGER_THRESHOLD) || (oldSeconds !== newSeconds && newSeconds < 6)) {
          playBeep()
        }

        if (newTimeLeft <= 0) {
          playLongBeep()
          setTurn(ETurn.END)
        }

        return newTimeLeft
      })
    }, UPDATE_INTERVAL_PRECISION)

    return () => {
        interval && clearInterval(interval)
    }
  }, [turn, isPaused, setTimeLeftByTurn])


  // ===================================
  // AUX FUNCTIONS
  // ===================================

  const onPause = useCallback((newPauseState: boolean) => {
    if (turn !== ETurn.BEGIN && turn !== ETurn.END) {
      setIsPaused(newPauseState)
    }
  }, [turn])

  const onFinishTurnTop = useCallback(() => {
    playClank()
    if (turn !== ETurn.BEGIN && increment) {
      setTimeLeftByTurn(turn as ETurn.TOP | ETurn.BOTTOM)((oldTimeLeft) => oldTimeLeft + increment)
    }
    setTurn(ETurn.BOTTOM)
  }, [turn, increment, setTimeLeftByTurn])

  const onFinishTurnBottom = useCallback(() => {
    playClank()
    if (turn !== ETurn.BEGIN && increment) {
      setTimeLeftByTurn(turn as ETurn.TOP | ETurn.BOTTOM)((oldTimeLeft) => oldTimeLeft + increment)
    }
    setTurn(ETurn.TOP)
  }, [turn, increment, setTimeLeftByTurn])

  const handleRestart = useCallback(() => {
    if (isPaused || turn === ETurn.END || turn === ETurn.BEGIN) {
      onRestart()
    } else {
      setIsPaused(true)
    }
  }, [isPaused, turn, onRestart])


  // ===================================
  // RENDER
  // ===================================

  return (
    <div className="flex flex-col h-screen w-screen items-stretch text-6xl font-bold">
      <ClockPlayer
        isPaused={isPaused}
        isTurn={turn === ETurn.BEGIN || turn === ETurn.TOP}
        timeLeft={getTimeLeftByTurn(ETurn.TOP)}
        onFinishTurn={onFinishTurnTop}
      />

      <ClockPause
        isPaused={isPaused}
        onPause={onPause}
        onRestart={handleRestart}
      />

      <ClockPlayer
        isPaused={isPaused}
        isTurn={turn === ETurn.BEGIN || turn === ETurn.BOTTOM}
        timeLeft={getTimeLeftByTurn(ETurn.BOTTOM)}
        onFinishTurn={onFinishTurnBottom}
      />
    </div>
  );
}

export default Clock;
