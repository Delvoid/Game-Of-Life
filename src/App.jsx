import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import oscillators from './utils/oscillators'
import { FaPlay, FaStop, FaUndo } from 'react-icons/fa'
import RangeSlider from './components/rangeSlider'

import './App.css'

const numRows = 30
const numCols = 50
const positions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const grid = []
  for (let i = 0; i < numRows; i++) {
    grid.push(Array.from(Array(numCols), () => 0))
  }
  return grid
}

const generateRandomGrid = () => {
  const grid = []
  for (let i = 0; i < numRows; i++) {
    grid.push(Array.from(Array(numCols), () => Math.floor(Math.random() * 2)))
  }
  return grid
}

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateRandomGrid()
  })
  const [speed, setSpeed] = useState(300)
  const [currentlyAlive, setCurrentlyAlive] = useState(0)
  const [type, setType] = useState('random')
  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  useEffect(() => {
    setCurrentlyAlive(countAlive())
  }, [grid])

  const sliderValueChanged = useCallback((val) => {
    setSpeed(val)
  })

  const sliderProps = useMemo(
    () => ({
      min: 10,
      max: 1000,
      value: speed,
      step: 10,
      onChange: (e) => sliderValueChanged(e),
    }),
    [speed]
  )

  useEffect(() => {
    const runSimulation = () => {
      if (!runningRef.current) {
        return
      }
      setGrid((g) => {
        const next = g.map((row, i) => {
          return row.map((col, j) => {
            let neighbours = 0
            positions.forEach((position) => {
              const x = i + position[0]
              const y = j + position[1]
              if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
                neighbours += g[x][y]
              }
            })
            if (neighbours < 2 || neighbours > 3) return 0
            if (neighbours === 3) return 1
            return g[i][j]
          })
        })
        return next
      })
    }
    const loop = setInterval(runSimulation, speed)

    return () => {
      clearInterval(loop)
    }
  }, [running, speed])

  const countNeighbours = (i, j) => {
    let neighbours = 0
    positions.forEach((position) => {
      const x = i + position[0]
      const y = j + position[1]
      if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
        neighbours += grid[x][y]
      }
    })
    return neighbours
  }

  const handleClick = (x, y) => {
    const newGrid = [...grid]
    newGrid[x][y] = grid[x][y] ? 0 : 1
    setGrid(newGrid)
  }
  const reset = () => {
    if (type === 'empty') {
      setGrid(generateEmptyGrid)
      return
    }
    if (type === 'random') {
      setGrid(generateRandomGrid)
      return
    }
    if (type === 'oscillators') {
      setGrid(oscillators)
      return
    }
  }
  const countAlive = () => {
    let alive = 0
    grid.forEach((row, i) => {
      row.forEach((col, j) => {
        if (grid[i][j] === 1) alive++
      })
    })
    return alive
  }
  return (
    <>
      <header>Game Of Life</header>
      <nav>
        <div className="buttons">
          <button
            className="playButton"
            onClick={() => {
              setRunning(!running)
              if (!running) {
                runningRef.current = true
              }
            }}
          >
            {running ? (
              <FaStop className="icon" />
            ) : (
              <FaPlay className="icon" />
            )}
          </button>
          <button
            className="playButton"
            onClick={() => {
              reset()
            }}
          >
            <FaUndo className="icon" />
          </button>
          <div className="formGroup">
            <select
              name="type"
              id="type"
              defaultValue={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="random">Random</option>
              <option value="empty">Empty</option>
              <option value="oscillators">Oscillators</option>
            </select>
          </div>
          <RangeSlider {...sliderProps} classes="" />
        </div>
        <div className="alive">{currentlyAlive}</div>
      </nav>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j]
                  ? countNeighbours(i, j) > 4
                    ? '#52DEE5'
                    : '#664aff'
                  : undefined,
                border: 'solid 1px black',
              }}
            ></div>
          ))
        )}
      </div>
    </>
  )
}

export default App
