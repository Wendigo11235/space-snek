import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Game.module.css'

const CELL = 20
const COLS = 20
const ROWS = 20

function Game() {
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const snake = useRef([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
  const dir = useRef({ x: 1, y: 0 })
  const nextDir = useRef({ x: 1, y: 0 })
  const apple = useRef({ x: 15, y: 10 })
  const scoreRef = useRef(0)

  function randomCell() {
    return {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    }
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#0a0f10'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#00ff88'
    snake.current.forEach(seg => {
      ctx.fillRect(seg.x * CELL, seg.y * CELL, CELL - 1, CELL - 1)
    })

    ctx.fillStyle = '#ff4444'
    ctx.fillRect(apple.current.x * CELL, apple.current.y * CELL, CELL - 1, CELL - 1)
  }

  const tick = useCallback(() => {
    dir.current = nextDir.current
    const head = {
      x: snake.current[0].x + dir.current.x,
      y: snake.current[0].y + dir.current.y
    }

    if (
      head.x < 0 || head.x >= COLS ||
      head.y < 0 || head.y >= ROWS ||
      snake.current.some(s => s.x === head.x && s.y === head.y)
    ) {
      setRunning(false)
      setGameOver(true)
      return
    }

    snake.current = [head, ...snake.current]

    if (head.x === apple.current.x && head.y === apple.current.y) {
      scoreRef.current += 1
      setScore(scoreRef.current)
      apple.current = randomCell()
    } else {
      snake.current = snake.current.slice(0, -1)
    }

    draw()
  }, [])

  useEffect(() => {
    if (!running) return
    const loop = setInterval(tick, 150)
    return () => clearInterval(loop)
  }, [running, tick])

  useEffect(() => {
    const handleKey = (e) => {
      const map = {
        w: { x: 0, y: -1 }, W: { x: 0, y: -1 }, ArrowUp: { x: 0, y: -1 },
        s: { x: 0, y: 1 },  S: { x: 0, y: 1 },  ArrowDown: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, A: { x: -1, y: 0 }, ArrowLeft: { x: -1, y: 0 },
        d: { x: 1, y: 0 },  D: { x: 1, y: 0 },  ArrowRight: { x: 1, y: 0 },
      }
      const newDir = map[e.key]
      if (!newDir) return
      const cur = dir.current
      if (newDir.x === -cur.x || newDir.y === -cur.y) return
      nextDir.current = newDir
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  function startGame() {
    snake.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
    dir.current = { x: 1, y: 0 }
    nextDir.current = { x: 1, y: 0 }
    apple.current = randomCell()
    scoreRef.current = 0
    setScore(0)
    setGameOver(false)
    setRunning(true)
  }

  useEffect(() => {
    draw()
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
	  <div className={styles.headerTop}>
	    <h1 className={styles.title}>SPACE SNEK</h1>
	    <div className={styles.status}>
	      <span className={styles.statusDot}></span>
	      ONLINE
	    </div>
	  </div>
	  <div className={styles.headerBottom}>
	    <span className={styles.scoreLabel}>CURRENT SCORE</span>
	    <span className={styles.scoreValue}>{String(score).padStart(6, '0')}</span>
	  </div>
	</header>
      <main className={styles.main}>
        <div className={styles.canvasWrapper}>
          {gameOver && <div className={styles.gameOver}>SIGNAL LOST</div>}
          <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            className={styles.canvas}
          />
        </div>
        <button className={styles.button} onClick={startGame}>
          {gameOver ? 'RECONNECT' : 'INITIALIZE'}
        </button>
      </main>
    </div>
  )
}

export default Game
