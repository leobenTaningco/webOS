import React, { useState, useEffect, useRef } from "react";
import "./AStarMap.css";

const GRID_SIZE = 25;

const createGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        x,
        y,
        isWall: false,
        isStart: false,
        isEnd: false,
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
    } else if (mode === "wall") {
      clickedCell.isWall = !clickedCell.isWall;
    }
    setGrid(newGrid);
  };

  const clearGrid = () => {
    if (isRunning) return;
    setGrid(createGrid());
    setStart(null);
    setEnd(null);
  };

  const generateMaze = () => {
    if (isRunning) return;
    const newGrid = createGrid();
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        newGrid[y][x].isWall = true;
      }
    }
    const directions = [
      [-2, 0],
      [0, 2],
      [2, 0],
      [0, -2],
    ];
    const isValid = (y, x) => y >= 0 && y < GRID_SIZE && x >= 0 && x < GRID_SIZE;

    const carvePath = (y, x) => {
      newGrid[y][x].isWall = false;
      const shuffledDirs = directions.sort(() => Math.random() - 0.5);
      for (const [dy, dx] of shuffledDirs) {
        const newY = y + dy;
        const newX = x + dx;
        if (isValid(newY, newX) && newGrid[newY][newX].isWall) {
          newGrid[y + dy / 2][x + dx / 2].isWall = false;
          carvePath(newY, newX);
        }
      }
    };

    carvePath(0, 0);
    newGrid[0][0].isStart = true;
    setStart(newGrid[0][0]);
    newGrid[GRID_SIZE - 1][GRID_SIZE - 1].isEnd = true;
    setEnd(newGrid[GRID_SIZE - 1][GRID_SIZE - 1]);
    setGrid(newGrid);
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

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div ref={appOpenRef} className="app-open">
    <div className="app-move" onMouseDown={handleMouseDown}>
        <p style={{ color: "white", margin: "5px" }}>A* Searching in Maps</p>
    </div>
    <div className="app-open-close" onClick={onClose}></div>
    <div className="astar-body">
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
                onClick={() => setMode("wall")}
                disabled={isRunning}
                className={`button button-wall ${mode === "wall" ? "active" : ""}`}
            >
                Toggle Walls
            </button>
            <button
                onClick={runAStar}
                disabled={isRunning}
                className="button button-run"
            >
                Run A*
            </button>
            <button
                onClick={clearGrid}
                disabled={isRunning}
                className="button button-clear"
            >
                Clear
            </button>
            <button
                onClick={generateMaze}
                disabled={isRunning}
                className="button button-maze"
            >
                Maze
            </button>
        </div>

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
  );
};

export default AStarMap;
