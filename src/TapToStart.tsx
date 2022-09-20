import React from 'react'

interface ITapToStartProps {
  onStart: () => void;
}

const TapToStart: React.FC<ITapToStartProps> = ({ onStart }) => {

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center"
      onClick={() => {
        if (document && document.documentElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
            .finally(() => {
              onStart()
            })
        }
      }}
    >
      <div>
        Tap to start
      </div>
    </div>
  )
}

export default TapToStart
