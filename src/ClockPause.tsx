import React from 'react'

interface IClockPause {
  isPaused: boolean;
  onPause: (newPauseState: boolean) => void;
  onRestart: () => void;
}

const ClockPause: React.FC<IClockPause> = ({ isPaused, onPause, onRestart }) => {
  return (
    <div className="bg-gray-500 text-white text-xl flex flex-row justify-center align-center">
      <div
        className="p-4 flex-1 flex flex-row align-center justify-center"
        onTouchStart={() => {
            onPause(!isPaused)
        }}
      >
        { isPaused
          ? <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><title>ionicons-v5-c</title><polygon points="96 448 416 256 96 64 96 448"/></svg>
          : <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><title>ionicons-v5-c</title><path d="M224,432H144V80h80Z"/><path d="M368,432H288V80h80Z"/></svg>
        }
      </div>
      <div
        className="p-4 bg-red-400 flex flex-row items-center justify-center"
        style={{ width: 72 }}
        onTouchStart={onRestart}
      >
        <div>
          R
        </div>
      </div>
    </div>
  )
}


export default React.memo(ClockPause);
