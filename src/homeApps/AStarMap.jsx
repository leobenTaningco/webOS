import React, { useState, useEffect, useRef } from "react";
import "./AStarMap.css";

const GRID_SIZE = 25;

const createGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const value = presetLayout[y]?.[x] ?? 0;
      row.push({
        x,
        y,
        isWall: value === 1,
        isStart: value === "S",
        isEnd: value === "E",
        isVisited: false,
        inOpenSet: false,
        isPath: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const presetLayout = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,"S",1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"E",1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const AStarMap = ({ onClose }) => {
  const [grid, setGrid] = useState(createGrid());
  const [mode, setMode] = useState("start");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const appOpenRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleCellClick = (cell) => {
    if (isRunning) return;
    const newGrid = grid.map((row) =>
      row.map((c) => {
        if (mode === "start" && c.isStart) c.isStart = false;
        if (mode === "end" && c.isEnd) c.isEnd = false;
        return { ...c };
      })
    );

    const clickedCell = newGrid[cell.y][cell.x];
    if (mode === "start") {
      clickedCell.isStart = true;
      setStart(clickedCell);
    } else if (mode === "end") {
      clickedCell.isEnd = true;
      setEnd(clickedCell);
    }
    setGrid(newGrid);
  };

  const clearGrid = () => {
    if (isRunning) return;
    setGrid(createGrid());
    setStart(null);
    setEnd(null);
  };


  const runAStar = async () => {
    if (!start || !end || isRunning) return;
    setIsRunning(true);
    const openSet = [start];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    gScore.set(start, 0);
    fScore.set(start, heuristic(start, end));
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const getCell = (x, y) => newGrid[y] && newGrid[y][x];
    while (openSet.length) {
      openSet.sort((a, b) => fScore.get(a) - fScore.get(b));
      const current = openSet.shift();
      if (current.x === end.x && current.y === end.y) {
        let temp = current;
        while (cameFrom.has(temp)) {
          temp.isPath = true;
          temp = cameFrom.get(temp);
        }
        setGrid(newGrid);
        setIsRunning(false);
        return;
      }
      current.isVisited = true;
      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];
      for (const [dx, dy] of directions) {
        const neighbor = getCell(current.x + dx, current.y + dy);
        if (neighbor && !neighbor.isWall && !neighbor.isVisited) {
          const tentativeG = (gScore.get(current) || 0) + 1;
          if (tentativeG < (gScore.get(neighbor) || Infinity)) {
            cameFrom.set(neighbor, current);
            gScore.set(neighbor, tentativeG);
            fScore.set(neighbor, tentativeG + heuristic(neighbor, end));
            if (!openSet.includes(neighbor)) {
              openSet.push(neighbor);
              neighbor.inOpenSet = true;
            }
          }
        }
      }
      setGrid(newGrid.map((row) => row.slice()));
      await sleep(20);
    }
    setIsRunning(false);
  };

  // Window dragging handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - appOpenRef.current.getBoundingClientRect().left,
      y: e.clientY - appOpenRef.current.getBoundingClientRect().top,
    };
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    appOpenRef.current.style.left = `${e.clientX - offset.current.x}px`;
    appOpenRef.current.style.top = `${e.clientY - offset.current.y}px`;
  };
  const handleMouseUp = () => (isDragging.current = false);

 // Button Controls
    const moveStart = (direction) => {
    if (isRunning || !start) return;  // Don't move if running or no start set

    let newX = start.x;
    let newY = start.y;

    if (direction === "up") newY -= 1;
    else if (direction === "down") newY += 1;
    else if (direction === "left") newX -= 1;
    else if (direction === "right") newX += 1;

    // Boundary check to stay inside grid
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return;

    // Prevent moving into a wall
    if (grid[newY][newX].isWall) return;

    // Update the grid to move start cell
        const newGrid = grid.map((row) =>
            row.map((cell) => {
            if (cell.isStart) return { ...cell, isStart: false }; // Clear old start
            if (cell.x === newX && cell.y === newY) return { ...cell, isStart: true }; // Set new start
            return { ...cell };
            })
        );

        setGrid(newGrid);
        setStart(newGrid[newY][newX]);
    };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
}, []);

  useEffect(() => {
    const startCell = grid.flat().find(cell => cell.isStart);
    const endCell = grid.flat().find(cell => cell.isEnd);
    setStart(startCell);
    setEnd(endCell);
  }, [grid]);

  useEffect(() => {
    const handleKeyDown = (e) => {
        if (isRunning || !start) return;

        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
        let { x, y } = start;
        let newX = x;
        let newY = y;

        switch (e.key) {
        case "ArrowUp":
            newY = y - 1;
            break;
        case "ArrowDown":
            newY = y + 1;
            break;
        case "ArrowLeft":
            newX = x - 1;
            break;
        case "ArrowRight":
            newX = x + 1;
            break;
        default:
            return;
        }

        if (
        newX >= 0 &&
        newY >= 0 &&
        newX < GRID_SIZE &&
        newY < GRID_SIZE &&
        !newGrid[newY][newX].isWall
        ) {
        newGrid[y][x].isStart = false;
        newGrid[newY][newX].isStart = true;
        setStart(newGrid[newY][newX]);
        setGrid(newGrid);
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, start, isRunning]);

  return (
    <div ref={appOpenRef} className="app-open">
        <div className="app-move" onMouseDown={handleMouseDown}>
            <p style={{ color: "white", margin: "5px" }}>A* Searching in Maps</p>
        </div>
        <div className="app-open-close" onClick={onClose}></div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="astar-body" style={{ display: "flex", gap: "20px" }}>
            
            {/* Controls and Instructions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "150px" }}>
                <div className="controls">
                <button
                    onClick={() => setMode("start")}
                    disabled={isRunning}
                    className={`button button-start ${mode === "start" ? "active" : ""}`}
                >
                    Set Start
                </button>
                <button
                    onClick={() => setMode("end")}
                    disabled={isRunning}
                    className={`button button-end ${mode === "end" ? "active" : ""}`}
                >
                    Set End
                </button>
                <button
                    onClick={runAStar}
                    disabled={isRunning}
                    className="button button-run"
                >
                    Run Algorithm
                </button>
                </div>

                <div className="instructions" style={{ textAlign: "left", color: "white" }}>
                <p style={{ margin: "5px 0" }}>Instructions:</p>
                <ul style={{ margin: "5px 0 10px 20px" }}>
                    <li>Use the arrow buttons or arrow keys to move</li>
                    <li>The algorithm will always show the most efficient path</li>
                </ul>
                </div>

                <div className="controls">
                <button onClick={() => moveStart("up")} className="button button-run">↑</button>
                </div>
                <div className="controls">
                <button onClick={() => moveStart("left")} className="button button-run">←</button>
                <button onClick={() => moveStart("down")} className="button button-run">↓</button>
                <button onClick={() => moveStart("right")} className="button button-run">→</button>
                </div>
            </div>

            {/* Grid */}
            <div
                style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
                justifyContent: "center",
                display: "grid",
                gap: "0px",
                }}
            >
                {grid.flat().map((cell, idx) => {
                let cellClass = "cells";
                if (cell.isStart) cellClass += " cells-start";
                else if (cell.isEnd) cellClass += " cells-end";
                else if (cell.isWall) cellClass += " cells-wall";
                else if (cell.isPath) cellClass += " cells-path";
                else if (cell.isVisited) cellClass += " cell-visited";
                else cellClass += " cells-empty";

                return (
                    <div
                    key={idx}
                    onClick={() => handleCellClick(cell)}
                    className={cellClass}
                    ></div>
                );
                })}
            </div>

            </div>
        </div>
        </div>
    );
};

export default AStarMap;
