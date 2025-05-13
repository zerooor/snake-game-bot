'use client'; // если используешь App Router

import { useEffect, useState } from 'react';

const gridSize = 10;
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const moveSnake = () => {
    if (gameOver) return;

    const newHead = {
      x: (snake[0].x + direction.x + gridSize) % gridSize,
      y: (snake[0].y + direction.y + gridSize) % gridSize,
    };

    // Проверка на самопересечение
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Змейка</h1>
      {gameOver && <h2>Игра окончена</h2>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gridTemplateRows: `repeat(${gridSize}, 20px)`,
          gap: '1px',
          margin: 'auto',
          width: 'fit-content',
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isSnake = snake.some(seg => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'lightgray',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}