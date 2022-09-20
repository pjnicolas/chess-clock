import React, { useState } from 'react';
import TimeSelector from './TimeSelector'
import Clock from './Clock'
import './App.css';
import TapToStart from './TapToStart';
import { noop } from './sounds';


noop()

const App: React.FC = () => {
  const [time, setTime] = useState(5)
  const [increment, setIncrement] = useState(3)
  const [playing, setPlaying] = useState(false)
  const [waitingFullscreen, setWaitingFullscreen] = useState(true)

  if (waitingFullscreen) {
    return (
      <TapToStart onStart={() => setWaitingFullscreen(false)} />
    )
  }

  return (
    <div>
      {
        !playing ? <TimeSelector onStart={(t, i) => {
          setTime(t * 60 * 1000)
          setIncrement(i * 1000)
          setPlaying(true)
        }} /> : <Clock time={time} increment={increment} onRestart={() => {
          setPlaying(false)
        }} />
      }
    </div>
  );
}

export default App;
