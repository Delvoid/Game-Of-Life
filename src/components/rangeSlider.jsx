import { useState, useEffect, memo } from 'react'
const rangeSlider = memo(
  ({ classes, label, onChange, value, ...sliderProps }) => {
    const [sliderVal, setSliderVal] = useState(0)
    const [mouseState, setMouseState] = useState(null)
    const [rangeChange, setRangeChange] = useState(false)
    const [percent, setPercent] = useState(null)

    useEffect(() => {
      setSliderVal(value)
      getPercent(value)
    }, [value])

    const changeCallback = (e) => {
      setSliderVal(e.target.value)
      getPercent(sliderVal)
    }

    useEffect(() => {
      if (mouseState === 'up') {
        onChange(sliderVal)
        setRangeChange(false)
      }
      if (mouseState === 'down') {
        setRangeChange(true)
      }
    }, [mouseState])

    const getPercent = (sliderVal) => {
      let percent = (sliderVal / sliderProps.max) * 100

      if (percent <= 10) {
        percent = 30
      } else if (percent < 25) {
        percent = 40
      } else if (percent < 50) {
        percent = 50
      } else if (percent < 75) {
        percent = 60
      } else {
        percent = 70
      }

      setPercent(percent)
    }
    return (
      <div className="range">
        {label && <p>{label}</p>}
        <div className="sliderValue">
          <span
            className={`${rangeChange && 'show'}`}
            style={{
              left: `${(sliderVal / sliderProps.max) * 100}%`,
              transform: rangeChange && `translateX(-${percent}%)`,
            }}
          >
            {sliderVal}
          </span>
        </div>
        <div className="field">
          <div className="value left">{sliderProps.min}</div>
          <input
            type="range"
            value={sliderVal}
            {...sliderProps}
            className={`slider ${classes}`}
            id="myRange"
            onChange={changeCallback}
            onMouseDown={() => setMouseState('down')}
            onMouseUp={() => setMouseState('up')}
          />
          <div className="value right">{sliderProps.max}</div>
        </div>
      </div>
    )
  }
)
export default rangeSlider
