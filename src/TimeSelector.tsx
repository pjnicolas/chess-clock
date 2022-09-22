import React, { useState } from 'react'

const TIMES = [1, 2, 3, 5, 10, 15, 30]
const INCREMENTS = [0, 1, 2, 3, 5, 10, 15]

interface ITimeSelectorProps {
  onStart: (time: number, increment: number) => void;
}

const TimeSelector: React.FC<ITimeSelectorProps> = ({ onStart }) => {
  const [time, setTime] = useState(5)
  const [increment, setIncrement] = useState(3)

  return (
    <div>
      <div className="flex flex-row">
        <div className="flex-1 flex flex-col items-stretch">
          <div className="text-3xl font-bold text-center m-4">
            Time
          </div>

          { TIMES.map((t) => (
            <div
              key={t}
              className="border text-center p-5 text-3xl"
              style={{
                backgroundColor: time === t ? 'black' : 'white',
                color: time === t ? 'white' : 'black',
              }}
              onClick={() => {
                setTime(t)
              }}
            >
              { t }
            </div>
          )) }
        </div>

        <div className="flex-1 flex flex-col items-stretch">
          <div className="text-3xl font-bold text-center m-4">
            Increment
          </div>

          { INCREMENTS.map((t) => (
            <div
              key={t}
              className="border text-center p-5 text-3xl"
              style={{
                backgroundColor: increment === t ? 'black' : 'white',
                color: increment === t ? 'white' : 'black',
              }}
              onClick={() => {
                setIncrement(t)
              }}
            >
              { t }
            </div>
          )) }
        </div>
      </div>
      <div
        className="border text-3xl font-bold p-5 text-center m-4 text-white"
        style={{ backgroundColor: '#aaa' }}
        onClick={() => {
          onStart(time, increment)
        }}
      >
        START
      </div>
    </div>

  )
}

export default TimeSelector;
